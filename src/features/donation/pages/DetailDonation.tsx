import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import DonationForm from "../components/DonationForm"

export default function DetailDonationPage({ id }: { id: string }) {
  return (
    <section className="space-y-4">
      <Link href="/dashboard/donation">
        <Button variant="link" className="p-0! mb-2 cursor-pointer">
          <ArrowLeft className="size-4" />
          Kembali
        </Button>
      </Link>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">
          Detail Bukti Donasi
        </h1>
        <p>Berikut adalah detail bukti donasi yang telah dibuat</p>
      </div>
      <DonationForm id={id} type="edit" />
    </section>
  )
}
