import { NextResponse } from "next/server"
import { flattenError } from "zod"
import { createProgramDonation } from "@/features/program/program.dal"
import { programDonationSchema } from "@/features/program/program.schemas"

function serializeBigInt<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = programDonationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: flattenError(parsed.error) },
        { status: 400 }
      )
    }

    const result = await createProgramDonation(parsed.data)
    return NextResponse.json(
      { data: serializeBigInt(result), message: "Program donation created" },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /api/program/program-donation]", error)
    return NextResponse.json(
      { message: "Failed to create program donation", error: String(error) },
      { status: 500 }
    )
  }
}
