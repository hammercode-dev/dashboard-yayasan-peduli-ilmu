"use client"

import { useEditor, EditorContent, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import { useEffect, useRef, useCallback, useState } from "react"
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

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")

  if (!editor) return null

  // Helper function to check text align active state
  const isTextAlignActive = (alignment: string) => {
    const { textAlign } = editor.getAttributes("textAlign")
    return textAlign === alignment
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      editor.chain().focus().setImage({ src: base64 }).run()
    }
    reader.readAsDataURL(file)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleLinkOpen = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href || ""
    setLinkUrl(previousUrl)
    setLinkPopoverOpen(true)
  }, [editor])

  const handleLinkSubmit = useCallback(() => {
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    } else {
      // Add https:// if no protocol is present
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
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    setLinkPopoverOpen(false)
    setLinkUrl("")
  }, [editor])

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

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Start typing...",
  "aria-invalid": ariaInvalid,
  textAlign = "left",
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
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
    },
  })

  useEffect(() => {
    if (editor && value !== undefined) {
      const currentMarkdown = turndownService.turndown(editor.getHTML())

      if (currentMarkdown !== value) {
        const html = marked.parse(value, { async: false }) as string
        editor.commands.setContent(html, { emitUpdate: false })
      }
    }
  }, [editor, value])

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
      <Toolbar editor={editor} />
      <div className="overflow-y-auto h-[300px] px-4">
        <div className="prose prose-sm max-w-none min-h-[200px] prose-p:my-2 prose-headings:font-semibold prose-headings:mt-2 prose-headings:mb-2 prose-h1:text-2xl prose-h2:text-xl prose-ul:list-disc prose-li:my-1 prose-a:text-blue-500 hover:prose-a:underline [&_*]:focus:outline-none">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}

export default RichTextEditor
