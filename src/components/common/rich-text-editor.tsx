"use client"

import { useEditor, EditorContent, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import {
  useEffect,
  useRef,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react"
import TurndownService from "turndown"
import { marked } from "marked"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Undo,
  Redo,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  validateProgramImageFile,
  uploadProgramImage,
  removeProgramImagesByPaths,
  PROGRAM_IMAGE_UPLOAD_PREFIX,
} from "@/lib/storage/program-images"

export interface RichTextEditorRef {
  uploadPendingFiles: () => Promise<{ markdown: string; success: boolean }>
}

interface RichTextEditorProps {
  value?: string
  onChange?: (markdown: string) => void
  placeholder?: string
  "aria-invalid"?: boolean
  textAlign?: "left" | "center" | "right" | "justify"
}

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
})

turndownService.addRule("image", {
  filter: "img",
  replacement: (_, node) => {
    const el = node as HTMLImageElement
    const alt = el.getAttribute("alt") ?? ""
    const src = el.getAttribute("src") ?? ""
    const storagePath = el.getAttribute("data-storage-path")

    if (storagePath && storagePath !== "pending") {
      return `![${alt}](${src} "storage:${storagePath}")`
    }
    return `![${alt}](${src})`
  },
})

function collectBucketPathsFromHtml(html: string): Set<string> {
  const doc = new DOMParser().parseFromString(html, "text/html")
  const paths = new Set<string>()
  doc.querySelectorAll("img").forEach(img => {
    let p = img.getAttribute("data-storage-path")
    if (!p || p === "pending") {
      const title = img.getAttribute("title")
      if (title?.startsWith("storage:")) {
        p = title.slice("storage:".length)
      }
    }
    if (p && p !== "pending" && p.startsWith(PROGRAM_IMAGE_UPLOAD_PREFIX)) {
      paths.add(p)
    }
  })
  return paths
}

const ToolbarButton = ({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
  title: string
}) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed",
      active && "bg-primary text-primary-foreground"
    )}
  >
    {children}
  </Button>
)

const ToolbarGroupPopover = ({
  triggerIcon: TriggerIcon,
  label,
  children,
}: {
  triggerIcon: React.ElementType
  label: string
  children: React.ReactNode
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title={label}
        className="p-2 rounded md:hidden"
      >
        <TriggerIcon size={18} />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-2" align="start">
      <div className="flex flex-wrap gap-1">{children}</div>
    </PopoverContent>
  </Popover>
)

const Toolbar = ({
  editor,
  setPendingImages,
}: {
  editor: Editor | null
  setPendingImages: React.Dispatch<
    React.SetStateAction<Map<string, { file: File; blobUrl: string }>>
  >
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")

  const handleLinkOpen = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes("link").href || ""
    setLinkUrl(previousUrl)
    setLinkPopoverOpen(true)
  }, [editor])

  const handleLinkSubmit = useCallback(() => {
    if (!editor) return
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    } else {
      const url =
        linkUrl.startsWith("http://") || linkUrl.startsWith("https://")
          ? linkUrl
          : `https://${linkUrl}`

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run()
    }
    setLinkPopoverOpen(false)
    setLinkUrl("")
  }, [editor, linkUrl])

  const handleLinkRemove = useCallback(() => {
    if (!editor) return
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    setLinkPopoverOpen(false)
    setLinkUrl("")
  }, [editor])

  if (!editor) return null

  const isTextAlignActive = (alignment: string) => {
    const { textAlign } = editor.getAttributes("textAlign")
    return textAlign === alignment
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateProgramImageFile(file)
    if (!validation.ok) {
      toast.error(validation.message)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    const blobUrl = URL.createObjectURL(file)

    editor
      .chain()
      .focus()
      .setImage({
        src: blobUrl,
        "data-storage-path": "pending",
        "data-pending-id": blobUrl,
      } as { src: string; "data-storage-path": string; "data-pending-id": string })
      .run()

    setPendingImages(prev => new Map(prev).set(blobUrl, { file, blobUrl }))

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatButtons = (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <Bold size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <Italic size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </ToolbarButton>
    </>
  )

  const headingButtons = (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </ToolbarButton>
    </>
  )

  const listButtons = (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </ToolbarButton>
    </>
  )

  const alignButtons = (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={isTextAlignActive("left")}
        title="Align Left"
      >
        <AlignLeft size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={isTextAlignActive("center")}
        title="Align Center"
      >
        <AlignCenter size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={isTextAlignActive("right")}
        title="Align Right"
      >
        <AlignRight size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        active={isTextAlignActive("justify")}
        title="Justify"
      >
        <AlignJustify size={18} />
      </ToolbarButton>
    </>
  )

  const insertLinkButton = (
    <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={handleLinkOpen}
          className={cn(
            "p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("link")
              ? "bg-primary text-primary-foreground"
              : "hover:bg-gray-100"
          )}
          title="Add Link"
        >
          <LinkIcon size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleLinkSubmit()
                }
                if (e.key === "Escape") {
                  setLinkPopoverOpen(false)
                }
              }}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleLinkSubmit}
              className="flex-1"
            >
              {editor.isActive("link") ? "Update" : "Add"} Link
            </Button>
            {editor.isActive("link") && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleLinkRemove}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )

  const insertImageButton = (
    <>
      {insertLinkButton}
      <ToolbarButton
        onClick={() => fileInputRef.current?.click()}
        title="Insert Image"
      >
        <ImageIcon size={18} />
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </>
  )

  const historyButtons = (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo size={18} />
      </ToolbarButton>
    </>
  )

  const separator = <div className="w-px bg-gray-300 mx-1 shrink-0" />

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">
      {/* Desktop: full inline toolbar */}
      <div className="hidden md:flex flex-wrap gap-1">
        {formatButtons}
        {separator}
        {headingButtons}
        {separator}
        {listButtons}
        {separator}
        {alignButtons}
        {separator}
        {insertImageButton}
        {separator}
        {historyButtons}
      </div>

      {/* Mobile: group popovers */}
      <div className="flex md:hidden flex-wrap gap-1">
        <ToolbarGroupPopover triggerIcon={Bold} label="Format">
          {formatButtons}
        </ToolbarGroupPopover>
        <ToolbarGroupPopover triggerIcon={Heading1} label="Heading">
          {headingButtons}
        </ToolbarGroupPopover>
        <ToolbarGroupPopover triggerIcon={List} label="Daftar">
          {listButtons}
        </ToolbarGroupPopover>
        <ToolbarGroupPopover triggerIcon={AlignLeft} label="Rata">
          {alignButtons}
        </ToolbarGroupPopover>
        <ToolbarGroupPopover triggerIcon={LinkIcon} label="Sisipkan">
          {insertImageButton}
        </ToolbarGroupPopover>
        <ToolbarGroupPopover triggerIcon={Undo} label="Riwayat">
          {historyButtons}
        </ToolbarGroupPopover>
      </div>
    </div>
  )
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  (
    {
      value = "",
      onChange,
      placeholder = "Start typing...",
      "aria-invalid": ariaInvalid,
      textAlign = "left",
    },
    ref
  ) => {
    const [pendingImages, setPendingImages] = useState<
      Map<string, { file: File; blobUrl: string }>
    >(new Map())
    const pendingImagesRef = useRef(pendingImages)
    const previousBucketPathsRef = useRef<Set<string>>(new Set())

    useEffect(() => {
      pendingImagesRef.current = pendingImages
    }, [pendingImages])

    useEffect(() => {
      return () => {
        pendingImagesRef.current.forEach(({ blobUrl }) =>
          URL.revokeObjectURL(blobUrl)
        )
      }
    }, [])

    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        Image.extend({
          addAttributes() {
            return {
              ...this.parent?.(),
              "data-storage-path": {
                default: null,
                parseHTML: element => {
                  const fromAttr = element.getAttribute("data-storage-path")
                  if (fromAttr) return fromAttr
                  const title = element.getAttribute("title")
                  if (title?.startsWith("storage:")) {
                    return title.slice("storage:".length)
                  }
                  return null
                },
                renderHTML: attributes => {
                  if (!attributes["data-storage-path"]) return {}
                  return {
                    "data-storage-path": attributes["data-storage-path"],
                  }
                },
              },
              "data-pending-id": {
                default: null,
                parseHTML: element => element.getAttribute("data-pending-id"),
                renderHTML: attributes => {
                  if (!attributes["data-pending-id"]) return {}
                  return { "data-pending-id": attributes["data-pending-id"] }
                },
              },
            }
          },
        }).configure({
          inline: true,
          allowBase64: true,
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-500 underline cursor-pointer",
          },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
          defaultAlignment: textAlign || "left",
        }),
        Placeholder.configure({
          placeholder,
          emptyEditorClass: "is-editor-empty",
        }),
      ],
      content: "",
      // Don't render immediately on the server to avoid SSR issues
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        const markdown = turndownService.turndown(html)
        onChange?.(markdown)

        const currentBucketPaths = collectBucketPathsFromHtml(html)
        const prevBucketPaths = previousBucketPathsRef.current
        const removedFromBucket = [...prevBucketPaths].filter(
          p => !currentBucketPaths.has(p)
        )
        if (removedFromBucket.length > 0) {
          void removeProgramImagesByPaths(removedFromBucket)
        }
        previousBucketPathsRef.current = new Set(currentBucketPaths)

        const currentBlobSrcs = new Set<string>()
        const doc = new DOMParser().parseFromString(html, "text/html")
        doc.querySelectorAll("img").forEach(img => {
          const s = img.getAttribute("src") ?? ""
          if (s.startsWith("blob:")) currentBlobSrcs.add(s)
        })

        setPendingImages(prev => {
          let next = prev
          let changed = false
          for (const [blobUrl, entry] of prev) {
            if (!currentBlobSrcs.has(blobUrl)) {
              if (!changed) {
                next = new Map(prev)
                changed = true
              }
              URL.revokeObjectURL(entry.blobUrl)
              next.delete(blobUrl)
            }
          }
          return changed ? next : prev
        })
      },
    })

    useEffect(() => {
      if (editor && value !== undefined) {
        const currentMarkdown = turndownService.turndown(editor.getHTML())

        if (currentMarkdown !== value) {
          const html = marked.parse(value, { async: false }) as string
          editor.commands.setContent(html, { emitUpdate: false })
          previousBucketPathsRef.current = collectBucketPathsFromHtml(
            editor.getHTML()
          )
        }
      }
    }, [editor, value])

    useImperativeHandle(
      ref,
      () => ({
        uploadPendingFiles: async () => {
          if (!editor) {
            return { markdown: "", success: true }
          }

          const snapshot = new Map(pendingImagesRef.current)
          const rawHtml = editor.getHTML()
          const doc = new DOMParser().parseFromString(rawHtml, "text/html")

          try {
            for (const img of doc.querySelectorAll("img")) {
              const src = img.getAttribute("src") ?? ""
              if (!src.startsWith("blob:")) continue
              const pending = snapshot.get(src)
              if (!pending) continue

              const result = await uploadProgramImage(pending.file)
              if (!result.ok) {
                toast.error(result.message)
                return { markdown: "", success: false }
              }
              img.setAttribute("src", result.publicUrl)
              img.setAttribute("data-storage-path", result.path)
              img.removeAttribute("data-pending-id")
              URL.revokeObjectURL(pending.blobUrl)
              snapshot.delete(src)
            }

            snapshot.forEach(({ blobUrl }) => URL.revokeObjectURL(blobUrl))
            setPendingImages(new Map())

            const finalHtml = doc.body.innerHTML
            const markdown = turndownService.turndown(finalHtml)

            editor.commands.setContent(finalHtml, { emitUpdate: false })
            onChange?.(markdown)
            previousBucketPathsRef.current = collectBucketPathsFromHtml(
              editor.getHTML()
            )

            return { markdown, success: true }
          } catch {
            return { markdown: "", success: false }
          }
        },
      }),
      [editor, onChange]
    )
    if (!editor) {
      return (
        <div className="border border-gray-200 rounded-md p-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      )
    }

    return (
      <div
        role="textbox"
        aria-invalid={ariaInvalid}
        className={cn(
          "border rounded-md overflow-hidden transition-[border-color] outline-none",
          "border-input focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
        )}
      >
        <Toolbar editor={editor} setPendingImages={setPendingImages} />
        <div className="overflow-y-auto h-[300px] px-4">
          <div className="prose prose-sm max-w-none min-h-[200px] prose-p:my-2 prose-headings:font-semibold prose-headings:mt-2 prose-headings:mb-2 prose-h1:text-2xl prose-h2:text-xl prose-ul:list-disc prose-li:my-1 prose-a:text-blue-500 hover:prose-a:underline **:focus:outline-none">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    )
  }
)

RichTextEditor.displayName = "RichTextEditor"

export default RichTextEditor
