import { deleteProgramDonation } from "@/features/program/program.dal"
import { ApiResponse } from "@/lib/response"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await deleteProgramDonation(BigInt(id))
    const body: ApiResponse<never> = {
      success: true,
      message: "Program donation deleted successfully",
    }
    return NextResponse.json(body, { status: 200 })
  } catch (err) {
    console.error("[DELETE /api/program/program-donation]", err)
    const body: ApiResponse<never> = {
      success: false,
      message: "Failed to delete program donation",
      error: { code: "SERVER_ERROR", details: String(err) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
