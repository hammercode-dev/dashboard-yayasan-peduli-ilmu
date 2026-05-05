import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

import { DetailUserCard } from "../components/DetailUserCard"

export default function DetailUserPage({ id }: { id: string }) {
  return (
    <section className="space-y-4">
      <Link href="/dashboard/user">
        <Button variant="link" className="p-0! mb-2 cursor-pointer">
          <ArrowLeft className="size-4" />
          Kembali
        </Button>
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Detail User</h1>
        <p className="text-sm text-gray-500">
          Informasi lengkap user yang terdaftar dalam sistem.
        </p>
      </div>

      <DetailUserCard id={id} />
    </section>
  )
}
