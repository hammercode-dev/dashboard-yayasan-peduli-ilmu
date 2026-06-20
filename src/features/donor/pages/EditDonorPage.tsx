import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

import { DonorForm } from "../components/DonorForm"

export default function EditDonorPage({ id }: { id: string }) {
  return (
    <section className="space-y-4">
      <Link href="/dashboard/donor">
        <Button variant="link" className="p-0! mb-2 cursor-pointer">
          <ArrowLeft className="size-4" />
          Kembali
        </Button>
      </Link>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Ubah Donatur</h1>
        <p>Perbarui nama, nomor HP, atau email donatur.</p>
      </div>
      <DonorForm type="edit" id={id} />
    </section>
  )
}
