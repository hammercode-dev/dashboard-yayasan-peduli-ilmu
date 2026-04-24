import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

import { CreateUserForm } from "../components/CreateUserForm"

export default function EditUserPage({ id }: { id: string }) {
  return (
    <section className="space-y-4">
      <Link href="/dashboard/user">
        <Button variant="link" className="p-0! mb-2 cursor-pointer">
          <ArrowLeft className="size-4" />
          Kembali
        </Button>
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Ubah User</h1>
        <p className="text-sm text-gray-500">
          Kelola informasi user yang telah terdaftar dalam sistem.
        </p>
      </div>
      <CreateUserForm id={id} type="edit" />
    </section>
  )
}
