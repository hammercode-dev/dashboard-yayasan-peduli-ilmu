import {
  deleteDonationEvidence,
  getDonationById,
} from "@/features/donation/donation.dal"
import { Prisma } from "@/generated/prisma/edge"

import { ApiResponse } from "@/lib/response"
import { serializeBigInt } from "@/lib/serialize"

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

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const programDonation = await getDonationById(BigInt(id))
    const body: ApiResponse<Prisma.PromiseReturnType<typeof getDonationById>> =
      {
        success: true,
        message: "Detail donation evidence fetched successfully",
        data: serializeBigInt(programDonation),
      }
    return NextResponse.json(body, { status: 200 })
  } catch (err) {
    console.error("[GET /api/donation/donation-evidence]", err)
    const body: ApiResponse<void> = {
      success: false,
      message: "Failed to fetch program donation",
      error: { code: "SERVER_ERROR", details: String(err) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
