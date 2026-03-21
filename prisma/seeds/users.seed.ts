import bcrypt from "bcryptjs"
import { prisma } from "@/lib/client"

export async function seedUsers() {
  const defaultPassword = await bcrypt.hash("admin123", 10)

  const usersData = [
    {
      email: "admin@yayasanpeduliilmu.com",
      username: "admin",
      full_name: "Admin Dashboard",
    },
  ]

  for (const u of usersData) {
    const user = await prisma.users.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        password: defaultPassword,
        profiles: { create: { full_name: u.full_name, username: u.username } },
      },
      include: { profiles: true },
    })
    console.log("Created user ->", user.email)
  }
}
