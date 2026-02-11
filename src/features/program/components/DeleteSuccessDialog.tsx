import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteSuccessDialogProps {
  open: boolean
  title: string | null
  onClose: () => void
}

export function DeleteSuccessDialog({
  open,
  title,
  onClose,
}: DeleteSuccessDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Data Terhapus</AlertDialogTitle>
          <AlertDialogDescription>
            Data donasi dari <span className="font-semibold">{title}</span>{" "}
            telah berhasil dihapus.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
