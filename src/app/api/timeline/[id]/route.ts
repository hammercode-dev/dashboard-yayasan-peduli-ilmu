import { flattenError } from "zod"
import { NextResponse } from "next/server"
import {
  deleteTimelineItem,
  getTimelineByProgramId,
  updateTimelineItem,
} from "@/features/timeline/timeline.dal"
import { updateTimelineItemSchema } from "@/features/timeline/timeline.schemas"
import { Prisma } from "@/generated/prisma"
import { ApiResponse } from "@/lib/response"
import { serializeBigInt } from "@/lib/serialize"

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const timeline = await getTimelineByProgramId(Number(id))
    const body: ApiResponse<
      Prisma.PromiseReturnType<typeof getTimelineByProgramId>
    > = {
      success: true,
      message: "Timeline fetched successfully",
      data: serializeBigInt(timeline),
    }
    return NextResponse.json(body, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get timeline" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await req.json()
    const parsed = updateTimelineItemSchema.safeParse(body)

    if (!parsed.success) {
      const resBody: ApiResponse<never> = {
        success: false,
        message: "Validation failed",
        error: {
          code: "VALIDATION_ERROR",
          details: flattenError(parsed.error),
        },
      }
      return NextResponse.json(resBody, { status: 400 })
    }

    const result = await updateTimelineItem(BigInt(id), parsed.data)
    const resBody: ApiResponse<
      Prisma.PromiseReturnType<typeof updateTimelineItem>
    > = {
      success: true,
      message: "Timeline item updated",
      data: serializeBigInt(result),
    }
    return NextResponse.json(resBody, { status: 200 })
  } catch (error) {
    console.error("[PATCH /api/timeline/item/[id]]", error)
    const resBody: ApiResponse<never> = {
      success: false,
      message: "Failed to update timeline item",
      error: { code: "SERVER_ERROR", details: String(error) },
    }
    return NextResponse.json(resBody, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await deleteTimelineItem(BigInt(id))
    const resBody: ApiResponse<void> = {
      success: true,
      message: "Timeline item deleted",
    }
    return NextResponse.json(resBody, { status: 200 })
  } catch (error) {
    console.error("[DELETE /api/timeline/item/[id]]", error)
    const resBody: ApiResponse<never> = {
      success: false,
      message: "Failed to delete timeline item",
      error: { code: "SERVER_ERROR", details: String(error) },
    }
    return NextResponse.json(resBody, { status: 500 })
  }
}
