import { Metadata } from "next"

import DonationPage from "@/features/donation/pages/DonationPage"

export const metadata: Metadata = {
  title: "Donasi",
  description:
    "Kelola donasi yang masuk, lihat statistik, dan impor data donasi dengan mudah di dashboard Peduli Ilmu",
}

export default function Donation() {
  return (
    <div>
      <DonationPage />
    </div>
  )
}
