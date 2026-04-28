import { NextResponse } from "next/server"

import { getRoles } from "@/features/user/user.dal"
import { serializeBigInt } from "@/lib/serialize"
import { ApiResponse } from "@/lib/response"

export async function GET() {
  try {
    const roles = await getRoles()
    const body: ApiResponse<unknown> = {
      success: true,
      message: "Success get roles",
      data: { roles: serializeBigInt(roles) },
    }

    return NextResponse.json(body)
  } catch (error) {
    console.error("[GET /api/user/roles]", error)
    const body: ApiResponse<never> = {
      success: false,
      message: "Error fetching roles",
      error: { code: "FETCH_ERROR", details: String(error) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
