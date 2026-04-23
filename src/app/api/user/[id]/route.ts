import { deleteUser } from "@/features/user/user.dal"

import { ApiResponse } from "@/lib/response"

import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await deleteUser(id)
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
