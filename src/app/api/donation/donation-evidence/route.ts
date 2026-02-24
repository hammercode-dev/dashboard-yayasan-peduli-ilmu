import { NextResponse } from "next/server"

import { serializeBigInt } from "@/lib/serialize"
import { TOTAL_DONATIONS_PER_PAGE } from "@/constants/data"
import {
  getDonationEvidences,
  countDonationEvidences,
} from "@/features/donation/donation.dal"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") ?? ""
    const page = Math.max(1, Number(searchParams.get("page")) || 1)

    const [donations, total] = await Promise.all([
      getDonationEvidences(query, page),
      countDonationEvidences(query),
    ])

    const totalPages = Math.ceil(total / TOTAL_DONATIONS_PER_PAGE)
    const meta: ApiMeta = {
      page,
      limit: TOTAL_DONATIONS_PER_PAGE,
      total,
      totalPages,
    }

    const body: ApiResponse<{ donations: unknown[] }> = {
      success: true,
      message: "Success get all donations",
      data: { donations: serializeBigInt(donations) },
      meta,
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
