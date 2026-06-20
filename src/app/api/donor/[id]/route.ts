import { NextResponse } from "next/server"
import { flattenError } from "zod"

import {
  deleteDonor,
  getDonorById,
  updateDonor,
} from "@/features/donor/donor.dal"
import { updateDonorSchema } from "@/features/donor/donor.schemas"

import { ApiResponse } from "@/lib/response"
import { serializeBigInt } from "@/lib/serialize"
import { ForbiddenError } from "@/lib/authorization"
import { Prisma } from "@/generated/prisma"

function parseDonorId(raw: string): bigint | null {
  if (!/^\d+$/.test(raw)) return null
  try {
    return BigInt(raw)
  } catch {
    return null
  }
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const donorId = parseDonorId(id)
    if (donorId === null) {
      const body: ApiResponse<void> = {
        success: false,
        message: "ID donatur tidak valid",
        error: { code: "VALIDATION_ERROR", details: id },
      }
      return NextResponse.json(body, { status: 400 })
    }

    const donor = await getDonorById(donorId)
    const body: ApiResponse<Awaited<ReturnType<typeof getDonorById>>> = {
      success: true,
      message: "Donor fetched successfully",
      data: serializeBigInt(donor),
    }
    return NextResponse.json(body, { status: 200 })
  } catch (err) {
    console.error("[GET /api/donor/:id]", err)
    const isNotFound =
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    const body: ApiResponse<void> = {
      success: false,
      message: isNotFound
        ? "Donatur tidak ditemukan"
        : "Failed to fetch donor",
      error: { code: "SERVER_ERROR", details: String(err) },
    }
    return NextResponse.json(body, { status: isNotFound ? 404 : 500 })
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const donorId = parseDonorId(id)
    if (donorId === null) {
      const body: ApiResponse<void> = {
        success: false,
        message: "ID donatur tidak valid",
        error: { code: "VALIDATION_ERROR", details: id },
      }
      return NextResponse.json(body, { status: 400 })
    }

    await deleteDonor(donorId)
    const body: ApiResponse<void> = {
      success: true,
      message: "Donor deleted successfully",
    }
    return NextResponse.json(body, { status: 200 })
  } catch (err) {
    console.error("[DELETE /api/donor/:id]", err)
    const isForbiddenError = err instanceof ForbiddenError
    const isConflictError =
      err instanceof Error &&
      err.message === "Donor has donation history and cannot be deleted"

    const body: ApiResponse<void> = {
      success: false,
      message: isForbiddenError
        ? "Anda tidak memiliki izin untuk melakukan aksi ini"
        : isConflictError
          ? "Donatur tidak dapat dihapus karena masih memiliki riwayat donasi"
          : "Failed to delete donor",
      error: {
        code: isForbiddenError
          ? "FORBIDDEN_ERROR"
          : isConflictError
            ? "CONFLICT_ERROR"
            : "SERVER_ERROR",
        details: String(err),
      },
    }
    const status = isForbiddenError ? 403 : isConflictError ? 409 : 500
    return NextResponse.json(body, { status })
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const donorId = parseDonorId(id)
    if (donorId === null) {
      const body: ApiResponse<void> = {
        success: false,
        message: "ID donatur tidak valid",
        error: { code: "VALIDATION_ERROR", details: id },
      }
      return NextResponse.json(body, { status: 400 })
    }

    const requestBody = await req.json()
    const parsed = updateDonorSchema.safeParse(requestBody)

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

    const updated = await updateDonor({ id: donorId, ...parsed.data })
    const body: ApiResponse<unknown> = {
      success: true,
      message: "Donor updated successfully",
      data: serializeBigInt(updated),
    }
    return NextResponse.json(body, { status: 200 })
  } catch (err) {
    console.error("[PATCH /api/donor/:id]", err)
    const isForbiddenError = err instanceof ForbiddenError
    const isDuplicateError =
      err instanceof Error &&
      err.message === "Donor with this phone number already exists"
    const isNotFound =
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"

    const body: ApiResponse<void> = {
      success: false,
      message: isForbiddenError
        ? "Anda tidak memiliki izin untuk melakukan aksi ini"
        : isDuplicateError
          ? "Donatur dengan nomor HP ini sudah terdaftar"
          : isNotFound
            ? "Donatur tidak ditemukan"
            : "Failed to update donor",
      error: {
        code: isForbiddenError
          ? "FORBIDDEN_ERROR"
          : isDuplicateError
            ? "CONFLICT_ERROR"
            : isNotFound
              ? "NOT_FOUND"
              : "SERVER_ERROR",
        details: String(err),
      },
    }
    const statusCode = isForbiddenError
      ? 403
      : isDuplicateError
        ? 409
        : isNotFound
          ? 404
          : 500
    return NextResponse.json(body, { status: statusCode })
  }
}
