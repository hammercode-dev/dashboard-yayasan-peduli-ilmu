import { NextResponse } from "next/server"
import { flattenError } from "zod"

import { serializeBigInt } from "@/lib/serialize"

import { TOTAL_USERS_PER_PAGE } from "@/constants/data"

import { createUser, getUsers, countUsers } from "@/features/user/user.dal"
import { createUserSchema } from "@/features/user/user.schemas"

import { ApiMeta, ApiResponse } from "@/lib/response"
import { ForbiddenError } from "@/lib/authorization"

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

export async function POST(req: Request) {
  try {
    const reqBody = await req.json()
    const parsed = createUserSchema.safeParse(reqBody)

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

    const created = await createUser(parsed.data)
    const body: ApiResponse<unknown> = {
      success: true,
      message: "User created successfully",
      data: serializeBigInt(created),
    }
    return NextResponse.json(body, { status: 201 })
  } catch (error) {
    console.error("[POST /api/user/users]", error)
    const isForbiddenError = error instanceof ForbiddenError
    const isDuplicateError =
      error instanceof Error &&
      error.message === "User with this email already exists"

    const body: ApiResponse<never> = {
      success: false,
      message: isForbiddenError
        ? "Anda tidak memiliki izin untuk melakukan aksi ini"
        : isDuplicateError
        ? "User dengan email ini sudah terdaftar"
        : "Failed to create user",
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
