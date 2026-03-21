import "dotenv/config"
import { prisma } from "@/lib/client"
import { seedUsers } from "./seeds/users.seed"
import { seedProgramDonation } from "./seeds/program-donation.seed"
import { seedDonationEvidence } from "./seeds/donation-evidence.seed"
import { seedProgramTimeline } from "./seeds/program-timeline.seed"

async function main() {
  await seedUsers()

  const programs = await seedProgramDonation()

  await seedDonationEvidence(programs)
  await seedProgramTimeline(programs)

  console.log("\nSeed completed successfully")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
