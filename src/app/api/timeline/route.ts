import { createTimelineItem } from "@/features/timeline/timeline.dal"
import { createTimelineItemSchema } from "@/features/timeline/timeline.schemas"
import { Prisma } from "@/generated/prisma"
import { ApiResponse } from "@/lib/response"
import { serializeBigInt } from "@/lib/serialize"
import { NextResponse } from "next/server"
import { flattenError } from "zod"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = createTimelineItemSchema.safeParse(body)

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

    const result = await createTimelineItem(parsed.data)
    const resBody: ApiResponse<
      Prisma.PromiseReturnType<typeof createTimelineItem>
    > = {
      success: true,
      message: "Timeline item created",
      data: serializeBigInt(result),
    }
    return NextResponse.json(resBody, { status: 201 })
  } catch (error) {
    console.error("[POST /api/timeline]", error)
    const resBody: ApiResponse<never> = {
      success: false,
      message: "Failed to create timeline item",
      error: { code: "SERVER_ERROR", details: String(error) },
    }
    return NextResponse.json(resBody, { status: 500 })
  }
}
