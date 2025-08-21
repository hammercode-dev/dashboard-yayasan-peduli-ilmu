import * as React from "react";
import type { Editor } from "@tiptap/react";
import { EditorContext } from "@tiptap/react";

// --- Hooks ---
import { useIsMobile } from "~/hooks/use-mobile";

// --- UI Primitives (same as LinkPopover) ---
import type { ButtonProps } from "~/components/tiptap-ui-primitive/button";
import { Button, ButtonGroup } from "~/components/tiptap-ui-primitive/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/tiptap-ui-primitive/popover";
import { Card, CardBody, CardItemGroup } from "~/components/tiptap-ui-primitive/card";
import { Input, InputGroup } from "~/components/tiptap-ui-primitive/input";

// --- Icons (reuse your existing set) ---
import { LinkIcon } from "~/components/tiptap-icons/link-icon";
import { CornerDownLeftIcon } from "~/components/tiptap-icons/corner-down-left-icon";

export interface UseImageFromUrlConfig {
  editor?: Editor | null;
  /**
   * Hide the button if the editor isn't available/can't insert image.
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * Callback after a successful insert.
   */
  onInserted?: (payload: { src: string }) => void;
}

/** Minimal capability check: the schema has an image node */
function canInsertImage(editor?: Editor | null) {
  return !!editor?.schema?.nodes?.image;
}

function useImageFromUrl({ editor, hideWhenUnavailable = false, onInserted }: UseImageFromUrlConfig) {
  const isVisible = !!editor;
  const canInsert = canInsertImage(editor);
  const label = "Insert image from URL";
  const isActive = false; // no toggle state for images like marks
  const Icon = LinkIcon;

  const insert = React.useCallback(
    (src: string) => {
      if (!src.trim() || !editor) return false;
      const ok = editor.chain().focus().setImage({ src: src.trim() }).run();
      if (ok) onInserted?.({ src: src.trim() });
      return ok;
    },
    [editor, onInserted]
  );

  return { isVisible, canInsert, insert, label, isActive, Icon, hideWhenUnavailable };
}

export interface ImageFromUrlButtonProps extends Omit<ButtonProps, "type">, UseImageFromUrlConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string;
}

const UrlForm: React.FC<{
  onSubmit: (url: string) => void;
}> = ({ onSubmit }) => {
  const isMobile = useIsMobile();
  const [url, setUrl] = React.useState("");

  const handleInsert = React.useCallback(() => {
    if (!url.trim()) return;
    onSubmit(url.trim());
    setUrl("");
  }, [url, onSubmit]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInsert(); // ENTER inserts
    }
  };

  return (
    <Card style={{ ...(isMobile ? { boxShadow: "none", border: 0 } : {}) }}>
      <CardBody style={{ ...(isMobile ? { padding: 0 } : {}) }}>
        <CardItemGroup orientation="horizontal">
          <InputGroup>
            <Input
              type="url"
              placeholder="Paste an image URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </InputGroup>

          <ButtonGroup orientation="horizontal">
            <Button type="button" title="Insert image" onClick={handleInsert} disabled={!url} data-style="ghost">
              <CornerDownLeftIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
};

/**
 * Button component that opens a popover with a URL input.
 * On Enter (or clicking the arrow), it inserts the image via:
 *   editor?.chain().focus().setImage({ src: url }).run();
 */
export const ImageFromUrlButton = React.forwardRef<HTMLButtonElement, ImageFromUrlButtonProps>(
  (
    { editor: providedEditor, hideWhenUnavailable = false, onInserted, text, onClick, children, ...buttonProps },
    ref
  ) => {
    // Resolve the editor: explicit prop -> TipTap EditorContext (supports both {editor} and direct Editor)
    const ctx = React.useContext(EditorContext) as { editor?: Editor | null } | Editor | null;
    const editorFromCtx = (ctx && "editor" in (ctx as any) ? (ctx as any).editor : ctx) as Editor | null;
    const editor = providedEditor ?? editorFromCtx ?? null;

    const { isVisible, canInsert, insert, label, isActive, Icon } = useImageFromUrl({
      editor,
      hideWhenUnavailable,
      onInserted,
    });

    const [open, setOpen] = React.useState(false);

    const handleTriggerClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        setOpen((v) => !v);
      },
      [onClick]
    );

    if (!isVisible) return null;
    if (hideWhenUnavailable && !canInsert) return null;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {/* Do NOT disable the trigger; disabled trigger cannot open Popover */}
          <Button
            type="button"
            data-style="ghost"
            data-active-state={isActive ? "on" : "off"}
            role="button"
            tabIndex={0}
            aria-label={label}
            aria-pressed={isActive}
            tooltip={label}
            onClick={handleTriggerClick}
            data-disabled={!canInsert}
            {...buttonProps}
            ref={ref}
          >
            {children ?? (
              <>
                <Icon className="tiptap-button-icon" />
                {text && <span className="tiptap-button-text">{text}</span>}
              </>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <UrlForm
            onSubmit={(url) => {
              const ok = insert(url);
              if (ok) setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

ImageFromUrlButton.displayName = "ImageFromUrlButton";

export default ImageFromUrlButton;
