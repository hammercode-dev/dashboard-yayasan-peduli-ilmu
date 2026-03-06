import { NextResponse } from "next/server"

import { serializeBigInt } from "@/lib/serialize"
import { ApiResponse } from "@/lib/response"

import { getAllProgramDonations } from "@/features/program/program.dal"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") ?? ""

    const programs = await getAllProgramDonations(query)

    const body: ApiResponse<{ donations: unknown[] }> = {
      success: true,
      message: "Success get all programs",
      data: { donations: serializeBigInt(programs) },
    }
    return NextResponse.json(body)
  } catch (error) {
    console.error("[GET /api/program/program-donation]", error)
    const body: ApiResponse<never> = {
      success: false,
      message: "Error fetching data",
      error: { code: "FETCH_ERROR", details: String(error) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
