import { NextResponse } from "next/server"
import { getParentProgramsOnly } from "@/features/program/program.dal"
import type { ApiResponse } from "@/lib/response"
import { serializeBigInt } from "@/lib/serialize"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") ?? ""

    const parents = await getParentProgramsOnly(query)

    const body: ApiResponse<{ parents: unknown[] }> = {
      success: true,
      message: "Success get parent programs",
      data: { parents: serializeBigInt(parents) },
    }
    return NextResponse.json(body)
  } catch (error) {
    console.error("[GET /api/program/program-donation/parents]", error)
    const body: ApiResponse<never> = {
      success: false,
      message: "Error fetching parent programs",
      error: { code: "FETCH_ERROR", details: String(error) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
