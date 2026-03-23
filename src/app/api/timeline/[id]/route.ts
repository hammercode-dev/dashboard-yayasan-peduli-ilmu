import { getTimelineByProgramId } from "@/features/timeline/timeline.dal"
import { Prisma } from "@/generated/prisma"
import { ApiResponse } from "@/lib/response"
import { serializeBigInt } from "@/lib/serialize"
import { NextResponse } from "next/server"

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
