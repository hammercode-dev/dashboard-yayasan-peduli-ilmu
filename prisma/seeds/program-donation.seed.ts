import { prisma } from "@/lib/client"

export async function seedProgramDonation() {
  const programsData = [
    {
      title: "Beasiswa Pendidikan",
      slug: "beasiswa-pendidikan",
      short_description: "Program beasiswa untuk pelajar berprestasi",
      description: "Membantu pelajar yang membutuhkan biaya pendidikan",
      target_amount: 50000000,
      collected_amount: 15000000,
      status: "active",
      location: "Jakarta",
      title_en: "Education Scholarship",
      short_description_en: "Scholarship for outstanding students",
    },
    {
      title: "Bantuan Buku Sekolah",
      slug: "bantuan-buku-sekolah",
      short_description: "Penyediaan buku pelajaran gratis",
      description: "Memberikan buku pelajaran untuk siswa kurang mampu",
      target_amount: 30000000,
      collected_amount: 10000000,
      status: "active",
      location: "Bandung",
      title_en: "School Book Aid",
      short_description_en: "Free textbooks for underprivileged students",
    },
    {
      title: "Rumah Baca",
      slug: "rumah-baca",
      short_description: "Pembangunan perpustakaan mini di daerah terpencil",
      description: "Mendirikan rumah baca untuk masyarakat pedesaan",
      target_amount: 75000000,
      collected_amount: 25000000,
      status: "active",
      location: "Yogyakarta",
      title_en: "Reading House",
      short_description_en: "Mini library in remote areas",
    },
  ]

  const programs = []
  for (const p of programsData) {
    const program = await prisma.program_donation.upsert({
      where: { title: p.title },
      update: {},
      create: p,
    })
    programs.push(program)
    console.log("Created program ->", program.title)
  }
  return programs
}
