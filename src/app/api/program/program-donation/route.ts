import { NextResponse } from "next/server"
import { flattenError } from "zod"
import {
  countProgramDonations,
  createProgramDonation,
  getProgramDonations,
} from "@/features/program/program.dal"
import { programDonationSchema } from "@/features/program/program.schemas"
import { TOTAL_DONATIONS_PER_PAGE } from "@/constants/data"
import type { ApiResponse, ApiMeta } from "@/lib/response"

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

    const [donations, total] = await Promise.all([
      getProgramDonations(query, page, status),
      countProgramDonations(query, status),
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
      message: "Success get all program donations",
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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = programDonationSchema.safeParse(body)

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

    const result = await createProgramDonation(parsed.data)
    const resBody: ApiResponse<unknown> = {
      success: true,
      message: "Program donation created",
      data: serializeBigInt(result),
    }
    return NextResponse.json(resBody, { status: 201 })
  } catch (error) {
    console.error("[POST /api/program/program-donation]", error)
    const body: ApiResponse<never> = {
      success: false,
      message: "Failed to create program donation",
      error: { code: "SERVER_ERROR", details: String(error) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
