import { getProgramCollectedAmount } from "@/features/program/program.dal"
import { ApiResponse } from "@/lib/response"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const total = await getProgramCollectedAmount(BigInt(id))

    const body: ApiResponse<{ total: number }> = {
      success: true,
      message: "Collected amount calculated successfully",
      data: { total: Number(total) },
    }
    return NextResponse.json(body, { status: 200 })
  } catch (err) {
    console.error("[GET /api/program/program-donation/collected-amount]", err)
    const body: ApiResponse<void> = {
      success: false,
      message: "Failed to calculate collected amount",
      error: { code: "SERVER_ERROR", details: String(err) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
