import { Metadata } from "next"
import UserPage from "@/features/user/pages/UserPage"

export const metadata: Metadata = {
  title: "User",
  description:
    "Kelola user yang terdaftar, lihat detail, dan ubah informasi dengan mudah di dashboard Peduli Ilmu",
}

export default async function User() {
  return <UserPage />
}
