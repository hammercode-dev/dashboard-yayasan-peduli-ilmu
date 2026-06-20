import { NextResponse } from "next/server"
import { flattenError } from "zod"

import { serializeBigInt } from "@/lib/serialize"

import { TOTAL_DONORS_PER_PAGE } from "@/constants/data"

import { countDonors, createDonor, getDonors } from "@/features/donor/donor.dal"
import { createDonorSchema } from "@/features/donor/donor.schemas"

import { ApiMeta, ApiResponse } from "@/lib/response"
import { ForbiddenError } from "@/lib/authorization"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") ?? ""
    const page = Math.max(1, Number(searchParams.get("page")) || 1)
    const limit = Math.max(
      1,
      Number(searchParams.get("limit")) || TOTAL_DONORS_PER_PAGE
    )
    const [donors, total] = await Promise.all([
      getDonors(query, page, limit),
      countDonors(query),
    ])

    const totalPages = Math.ceil(total / limit)
    const meta: ApiMeta = {
      page,
      limit,
      total,
      totalPages,
    }

    const body: ApiResponse<{ donors: unknown[] }> = {
      success: true,
      message: "Success get all donors",
      data: { donors: serializeBigInt(donors) },
      meta,
    }
    return NextResponse.json(body)
  } catch (error) {
    console.error("[GET /api/donor/donors]", error)
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
    const reqBody = await req.json()
    const parsed = createDonorSchema.safeParse(reqBody)

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

    const created = await createDonor(parsed.data)
    const body: ApiResponse<unknown> = {
      success: true,
      message: "Donor created successfully",
      data: serializeBigInt(created),
    }
    return NextResponse.json(body, { status: 201 })
  } catch (error) {
    console.error("[POST /api/donor/donors]", error)
    const isForbiddenError = error instanceof ForbiddenError
    const isDuplicateError =
      error instanceof Error &&
      error.message === "Donor with this phone number already exists"

    const body: ApiResponse<never> = {
      success: false,
      message: isForbiddenError
        ? "Anda tidak memiliki izin untuk melakukan aksi ini"
        : isDuplicateError
          ? "Donatur dengan nomor HP ini sudah terdaftar"
          : "Failed to create donor",
      error: {
        code: isForbiddenError
          ? "FORBIDDEN_ERROR"
          : isDuplicateError
            ? "CONFLICT_ERROR"
            : "SERVER_ERROR",
        details: String(error),
      },
    }

    const statusCode = isForbiddenError ? 403 : isDuplicateError ? 409 : 500
    return NextResponse.json(body, { status: statusCode })
  }
}
