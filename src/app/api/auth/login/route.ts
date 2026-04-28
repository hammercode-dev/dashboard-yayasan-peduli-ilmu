import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/client"
import { createSession } from "@/lib/session"
import { mapRoleNameToCode } from "@/features/auth/roles"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await prisma.users.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        password: true,
        created_at: true,
        profiles: {
          select: {
            full_name: true,
            roles: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
    

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      )
    }

    const roleCode = mapRoleNameToCode(user.profiles?.roles?.name)
    const fullName = user.profiles?.full_name ?? "-"
    const roleName = user.profiles?.roles?.name ?? "-"
    await createSession(user.id, user.email, roleCode, fullName, roleName)

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          roleCode,
          fullName,
          roleName,
          created_at: user.created_at,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[POST /api/auth/login]", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to login",
        error: { code: "SERVER_ERROR", details: String(error) },
      },
      { status: 500 }
    )
  }
}
