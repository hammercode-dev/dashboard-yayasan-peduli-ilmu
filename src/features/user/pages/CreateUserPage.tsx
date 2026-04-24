import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

import { CreateUserForm } from "../components/CreateUserForm"

export default function CreateUserPage() {
  return (
    <section className="space-y-4">
      <Link href="/dashboard/user">
        <Button variant="link" className="p-0! mb-2 cursor-pointer">
          <ArrowLeft className="size-4" />
          Kembali
        </Button>
      </Link>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Tambah User</h1>
        <p>Silakan isi form di bawah ini untuk menambahkan user baru</p>
      </div>
      <CreateUserForm type="create" />
    </section>
  )
}
