import { NextResponse } from "next/server"

import type { ApiResponse } from "@/lib/response"
import { getProgramTrendings } from "@/features/dashboard/dashboard.dal"
import { ProgramTrendingsDataResponse } from "@/features/dashboard/types/dashboard.types"
import { serializeBigInt } from "@/lib/serialize"

export async function GET() {
  try {
    const trendings = await getProgramTrendings()

    const body: ApiResponse<ProgramTrendingsDataResponse> = {
      success: true,
      message: "Success get program trendings",
      data: serializeBigInt(trendings),
    }

    return NextResponse.json(body)
  } catch (error) {
    console.error("[GET /api/program/program-trendings]", error)
    const body: ApiResponse<never> = {
      success: false,
      message: "Error fetching data",
      error: { code: "FETCH_ERROR", details: String(error) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
