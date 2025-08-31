import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { cn } from "~/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void> | void;
  disabled?: boolean;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Delete item?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  disabled,
}: ConfirmDialogProps) {
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-0 shadow-2xl dark:border-gray-800 dark:bg-gray-950",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
        >
          <div className="relative rounded-t-xl border-b p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30">
            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:ring-offset-gray-950 dark:focus:ring-blue-400">
              <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="sr-only">Close</span>
            </Dialog.Close>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-red-900 dark:text-red-100">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="text-sm text-red-700 dark:text-red-300">
                  {description}
                </Dialog.Description>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 p-4">
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800"
                disabled={loading}
              >
                {cancelLabel}
              </button>
            </Dialog.Close>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={disabled || loading}
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-600/90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-red-400",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
