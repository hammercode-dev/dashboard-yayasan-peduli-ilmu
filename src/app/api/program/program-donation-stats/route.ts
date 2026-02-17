import { NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/response"
import { getProgramDonationStats } from "@/features/dashboard/dashboard.dal"
import { Prisma } from "@/generated/prisma"
import { ProgramDonationStatsDataResponse } from "@/features/dashboard/dashboard.types"

export async function GET() {
  try {
    const stats = await getProgramDonationStats()

    const body: ApiResponse<ProgramDonationStatsDataResponse> = {
      success: true,
      message: "Success get stats program donations",
      data: stats,
    }
    return NextResponse.json(body)
  } catch (error) {
    console.error("[GET /api/program/program-donation-stats]", error)
    const body: ApiResponse<never> = {
      success: false,
      message: "Error fetching data",
      error: { code: "FETCH_ERROR", details: String(error) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
