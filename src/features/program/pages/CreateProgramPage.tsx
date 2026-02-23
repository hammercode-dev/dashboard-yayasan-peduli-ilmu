import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProgramDonationForm from "../components/ProgramDonationForm"

export default function CreateProgramPage() {
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
          Tambah Program Donasi
        </h1>
        <p>
          Silakan isi form di bawah ini untuk menambahkan program donasi baru
        </p>
      </div>
      <ProgramDonationForm type="create" />
    </section>
  )
}
