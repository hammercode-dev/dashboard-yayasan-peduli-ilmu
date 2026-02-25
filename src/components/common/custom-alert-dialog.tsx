import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CustomAlertDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

export function CustomAlertDialog({
  open,
  onClose,
  title,
  description,
  actionLabel = "OK",
  onAction,
}: CustomAlertDialogProps) {
  const handleAction = () => {
    if (onAction) onAction()
    onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction onClick={handleAction}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
