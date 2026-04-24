import { Prisma } from "@/generated/prisma"
import {
  deleteUser,
  getUserById,
  updateUser,
} from "@/features/user/user.dal"
import { updateUserSchema } from "@/features/user/user.schemas"

import { ApiResponse } from "@/lib/response"
import { serializeBigInt } from "@/lib/serialize"
import { flattenError } from "zod"

import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const user = await getUserById(id)
    const body: ApiResponse<Prisma.PromiseReturnType<typeof getUserById>> = {
      success: true,
      message: "User fetched successfully",
      data: serializeBigInt(user),
    }
    return NextResponse.json(body, { status: 200 })
  } catch (err) {
    console.error("[GET /api/user/:id]", err)
    const body: ApiResponse<void> = {
      success: false,
      message: "Failed to fetch user",
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
    await deleteUser(id)
    const body: ApiResponse<void> = {
      success: true,
      message: "User deleted successfully",
    }
    return NextResponse.json(body, { status: 200 })
  } catch (err) {
    console.error("[DELETE /api/user/:id]", err)
    const body: ApiResponse<void> = {
      success: false,
      message: "Failed to delete user",
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
    const requestBody = await req.json()
    const parsed = updateUserSchema.safeParse(requestBody)

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

    const updated = await updateUser({ id, ...parsed.data })
    const body: ApiResponse<unknown> = {
      success: true,
      message: "User updated successfully",
      data: serializeBigInt(updated),
    }
    return NextResponse.json(body, { status: 200 })
  } catch (err) {
    console.error("[PATCH /api/user/:id]", err)
    const isDuplicateError =
      err instanceof Error && err.message === "User with this email already exists"
    const body: ApiResponse<void> = {
      success: false,
      message: isDuplicateError
        ? "User dengan email ini sudah terdaftar"
        : "Failed to update user",
      error: {
        code: isDuplicateError ? "CONFLICT_ERROR" : "SERVER_ERROR",
        details: String(err),
      },
    }
    return NextResponse.json(body, { status: isDuplicateError ? 409 : 500 })
  }
}
