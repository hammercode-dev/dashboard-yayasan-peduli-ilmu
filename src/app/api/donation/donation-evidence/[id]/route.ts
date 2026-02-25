import { deleteDonationEvidence } from "@/features/donation/donation.dal"

import { ApiResponse } from "@/lib/response"

import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await deleteDonationEvidence(BigInt(id))
    const body: ApiResponse<void> = {
      success: true,
      message: "Donation evidence deleted successfully",
    }
    return NextResponse.json(body, { status: 200 })
  } catch (err) {
    console.error("[DELETE /api/donation/donation-evidence]", err)
    const body: ApiResponse<void> = {
      success: false,
      message: "Failed to delete donation evidence",
      error: { code: "SERVER_ERROR", details: String(err) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
