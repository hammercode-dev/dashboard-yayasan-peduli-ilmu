import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

import ProgramDonationDetail from "../components/ProgramDonationDetail"

export default function DetailProgramPage({ id }: { id: string }) {
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
          Detail Program Donasi
        </h1>
        <p>Berikut adalah detail program donasi yang telah dibuat</p>
      </div>

      <ProgramDonationDetail id={id} />
    </section>
  )
}
