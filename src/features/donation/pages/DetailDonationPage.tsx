import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

import DonationDetail from "../components/DonationDetail"

export default function DetailDonationPage({ id }: { id: string }) {
  return (
    <div>
      <section className="space-y-4">
        <div className="flex justify-between items-center gap-2">
          <Link href="/dashboard/donation">
            <Button variant="link" className="p-0! mb-2 cursor-pointer">
              <ArrowLeft className="size-4" />
              Kembali
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Detail Donasi
          </h1>
          <p className="text-sm text-gray-500">
            Berikut adalah detail donasi yang telah dibuat
          </p>
        </div>

        <DonationDetail id={id} />
      </section>
    </div>
  )
}
