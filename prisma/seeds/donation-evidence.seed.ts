import type { program_donation } from "@/generated/prisma"
import { prisma } from "@/lib/client"

export async function seedDonationEvidence(programs: program_donation[]) {
  const donationsData = [
    {
      full_name: "Ahmad Santoso",
      email: "ahmad@example.com",
      phone_number: "081234567890",
      amount: 500000,
      payment_method: "transfer",
      evidence_url: "https://example.com/bukti1.jpg",
      description: "Donasi untuk beasiswa",
      program_id: programs[0]!.id,
    },
    {
      full_name: "Siti Rahayu",
      email: "siti@example.com",
      phone_number: "081234567891",
      amount: 250000,
      payment_method: "e-wallet",
      evidence_url: "https://example.com/bukti2.jpg",
      description: "Donasi untuk buku sekolah",
      program_id: programs[1]!.id,
    },
    {
      full_name: "Budi Wijaya",
      email: "budi@example.com",
      phone_number: "081234567892",
      amount: 1000000,
      payment_method: "transfer",
      evidence_url: "https://example.com/bukti3.jpg",
      description: "Donasi untuk rumah baca",
      program_id: programs[2]!.id,
    },
  ]

  for (const d of donationsData) {
    const donation = await prisma.donation_evidences.create({ data: d })
    console.log("Created donation_evidence ->", donation.id, d.full_name)
  }
}
