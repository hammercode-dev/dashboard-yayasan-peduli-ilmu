import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { UserTable } from "../components/UserTable"

export default function UserPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Daftar User</h1>
        <p>Berikut adalah daftar user yang tersedia</p>
      </div>

      <Card>
        <CardContent className="">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 ">
              <Button variant="default" className="font-bold ml-auto">
                <Link href="/dashboard/user/create">Tambah User</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserTable />
    </section>
  )
}
