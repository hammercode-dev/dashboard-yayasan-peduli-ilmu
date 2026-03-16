import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProgramDonationForm from "../components/ProgramDonationForm"

export default function EditProgramPage({ id }: { id: string }) {
  return (
    <section className="space-y-4">
      <Link href="/dashboard/program">
        <Button variant="link" className="p-0! mb-2 cursor-pointer">
          <ArrowLeft className="size-4" />
          Kembali
        </Button>
      </Link>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">
          Ubah Program Donasi
        </h1>
        <p>Silakan ubah form di bawah ini untuk mengubah program donasi</p>
      </div>
      <ProgramDonationForm id={id} type="edit" />
    </section>
  )
}
