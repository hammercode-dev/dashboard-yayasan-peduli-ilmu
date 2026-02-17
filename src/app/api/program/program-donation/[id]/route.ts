import {
  deleteProgramDonation,
  getProgramDonationById,
} from "@/features/program/program.dal"
import { Prisma } from "@/generated/prisma"
import { ApiResponse } from "@/lib/response"
import { serializeBigInt } from "@/lib/serialize"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const programDonation = await getProgramDonationById(BigInt(id))
    const body: ApiResponse<
      Prisma.PromiseReturnType<typeof getProgramDonationById>
    > = {
      success: true,
      message: "Program donation fetched successfully",
      data: serializeBigInt(programDonation),
    }
    return NextResponse.json(body, { status: 200 })
  } catch (err) {
    console.error("[GET /api/program/program-donation]", err)
    const body: ApiResponse<void> = {
      success: false,
      message: "Failed to fetch program donation",
      error: { code: "SERVER_ERROR", details: String(err) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await deleteProgramDonation(BigInt(id))
    const body: ApiResponse<void> = {
      success: true,
      message: "Program donation deleted successfully",
    }
    return NextResponse.json(body, { status: 200 })
  } catch (err) {
    console.error("[DELETE /api/program/program-donation]", err)
    const body: ApiResponse<void> = {
      success: false,
      message: "Failed to delete program donation",
      error: { code: "SERVER_ERROR", details: String(err) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
