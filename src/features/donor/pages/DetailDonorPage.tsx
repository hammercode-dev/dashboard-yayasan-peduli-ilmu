import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

import { DetailDonorCard } from "../components/DetailDonorCard"

export default function DetailDonorPage({ id }: { id: string }) {
  return (
    <section className="space-y-4">
      <Link href="/dashboard/donor">
        <Button variant="link" className="p-0! mb-2 cursor-pointer">
          <ArrowLeft className="size-4" />
          Kembali
        </Button>
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Detail Donatur</h1>
        <p className="text-sm text-gray-500">Informasi donatur terdaftar.</p>
      </div>

      <DetailDonorCard id={id} />
    </section>
  )
}
