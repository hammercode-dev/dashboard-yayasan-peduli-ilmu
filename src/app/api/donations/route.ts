import { NextResponse } from "next/server"
import { prisma } from "@/lib/client"
import { TOTAL_DONATIONS_PER_PAGE } from "@/constants/data"
import { DonationStatus } from "@/features/program/types/programDonation"

function serializeBigInt<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  )
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const query = searchParams.get("query") ?? ""
    const page = Math.max(1, Number(searchParams.get("page")) || 1)
    const status = searchParams.get("status") ?? "all"

    const offset = (page - 1) * TOTAL_DONATIONS_PER_PAGE

    const donations = await prisma.program_donation.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        ...(status !== "all" ? { status: status as DonationStatus } : {}),
      },
      take: TOTAL_DONATIONS_PER_PAGE,
      skip: offset,
      orderBy: { created_at: "desc" },
    })

    return NextResponse.json({
      data: serializeBigInt(donations),
    })
  } catch (error) {
    console.error("[GET /api/donations]", error)
    return NextResponse.json(
      { message: "error fetching data", error: String(error) },
      { status: 500 }
    )
  }
}
