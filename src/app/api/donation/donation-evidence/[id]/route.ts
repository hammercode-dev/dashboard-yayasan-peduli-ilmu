import { NextResponse } from "next/server"
import { flattenError } from "zod/v4/core"

import {
  deleteDonationEvidence,
  getDonationById,
  updateDonationEvidence,
} from "@/features/donation/donation.dal"
import { updateDonationSchema } from "@/features/donation/donation.schemas"

import { Prisma } from "@/generated/prisma/edge"

import { ApiResponse } from "@/lib/response"
import { serializeBigInt } from "@/lib/serialize"

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

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await req.json()
    const parsed = updateDonationSchema.safeParse(body)
    if (!parsed.success) {
      const body: ApiResponse<never> = {
        success: false,
        message: "Validation failed",
        error: {
          code: "VALIDATION_ERROR",
          details: flattenError(parsed.error),
        },
      }
      return NextResponse.json(body, { status: 400 })
    }

    const result = await updateDonationEvidence({
      id: id,
      ...parsed.data,
    })
    const resBody: ApiResponse<unknown> = {
      success: true,
      message: "Donation evidence updated",
      data: serializeBigInt(result),
    }
    return NextResponse.json(resBody, { status: 200 })
  } catch (err) {
    console.error("[PATCH /api/donation/donation-evidence]", err)
    const body: ApiResponse<void> = {
      success: false,
      message: "Failed to update donation evidence",
      error: { code: "SERVER_ERROR", details: String(err) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
