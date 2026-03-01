import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import DonationForm from "../components/DonationForm"

export default function EditDonationPage({ id }: { id: string }) {
  return (
    <section className="space-y-4">
      <Link href="/dashboard/donation">
        <Button variant="link" className="p-0! mb-2 cursor-pointer">
          <ArrowLeft className="size-4" />
          Kembali
        </Button>
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Ubah Bukti Donasi
        </h1>
        <p className="text-sm text-gray-500">
          Kelola detail data bukti donasi yang telah terdaftar dalam sistem.
        </p>
      </div>

      <DonationForm id={id} type="edit" />
    </section>
  )
}
