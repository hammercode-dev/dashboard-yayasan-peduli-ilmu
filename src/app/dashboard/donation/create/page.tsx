import { Metadata } from "next"

import CreateDonationPage from "@/features/donation/pages/CreateDonationPage"

export const metadata: Metadata = {
  title: "Tambah Donasi",
  description:
    "Tambahkan donasi baru dengan mudah menggunakan form yang disediakan di dashboard Peduli Ilmu",
}

export default function CreateDonationEvidencePage() {
  return <CreateDonationPage />
}
