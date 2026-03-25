import type { program_donation } from "@/generated/prisma"
import { prisma } from "@/lib/client"

export async function seedProgramTimeline(programs: program_donation[]) {
  const timelinesData = [
    {
      activity: "Pengumuman program",
      activity_en: "Program announcement",
      cost: 0,
    },
    {
      activity: "Seleksi penerima",
      activity_en: "Recipient selection",
      cost: 2000000,
    },
    {
      activity: "Distribusi bantuan",
      activity_en: "Aid distribution",
      cost: 3000000,
    },
  ]

  for (let i = 0; i < timelinesData.length; i++) {
    const t = timelinesData[i]!
    const timeline = await prisma.program_timeline.create({
      data: {
        ...t,
        date: new Date(),
        program_id: programs[0]!.id,
      },
    })
    console.log("Created program_timeline ->", timeline.id, t.activity)
  }
}
