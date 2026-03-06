import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { ReactNode } from "react"

interface ConfirmDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void

  title?: string
  description?: ReactNode

  confirmText?: string
  cancelText?: string

  isLoading?: boolean
  variant?: "default" | "destructive"
}

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title = "Konfirmasi",
  description,
  confirmText = "Lanjutkan",
  cancelText = "Batal",
  isLoading = false,
  variant = "default",
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive"

  return (
    <AlertDialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen && !isLoading) onCancel()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isLoading}
            onClick={e => {
              e.preventDefault()
              onConfirm()
            }}
            className={
              isDestructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
