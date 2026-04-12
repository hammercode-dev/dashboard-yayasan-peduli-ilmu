import { NextResponse } from "next/server"

import { serializeBigInt } from "@/lib/serialize"

import { TOTAL_USERS_PER_PAGE } from "@/constants/data"

import { getUsers, countUsers } from "@/features/user/user.dal"

import { ApiMeta, ApiResponse } from "@/lib/response"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") ?? ""
    const page = Math.max(1, Number(searchParams.get("page")) || 1)

    const [users, total] = await Promise.all([
      getUsers(query, page),
      countUsers(query),
    ])

    const totalPages = Math.ceil(total / TOTAL_USERS_PER_PAGE)
    const meta: ApiMeta = {
      page,
      limit: TOTAL_USERS_PER_PAGE,
      total,
      totalPages,
    }

    const body: ApiResponse<{ users: unknown[] }> = {
      success: true,
      message: "Success get all users",
      data: { users: serializeBigInt(users) },
      meta,
    }
    return NextResponse.json(body)
  } catch (error) {
    console.error("[GET /api/user/users]", error)
    const body: ApiResponse<never> = {
      success: false,
      message: "Error fetching data",
      error: { code: "FETCH_ERROR", details: String(error) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
