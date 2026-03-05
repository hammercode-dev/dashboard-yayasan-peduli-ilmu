import { flattenError } from "zod"
import { NextResponse } from "next/server"
import Papa from "papaparse"

import { bulkCreateDonationEvidence } from "@/features/donation/donation.dal"
import { donationEvidenceSchema } from "@/features/donation/donation.schemas"
import { ApiResponse } from "@/lib/response"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "File tidak ditemukan",
        },
        { status: 400 }
      )
    }

    const csvText = await file.text()

    const { data: rawRows } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transformHeader: header => header.trim(),
    })

    // validation with zod
    const parsed = donationEvidenceSchema.array().safeParse(rawRows)

    if (!parsed.success) {
      const resBody: ApiResponse<never> = {
        success: false,
        message: "Validasi data CSV gagal",
        error: {
          code: "VALIDATION_ERROR",
          details: flattenError(parsed.error),
        },
      }
      return NextResponse.json(resBody, { status: 400 })
    }

    const result = await bulkCreateDonationEvidence(parsed.data)

    const resBody: ApiResponse<typeof result> = {
      success: true,
      message: `Berhasil mengimpor ${result.inserted} data donasi`,
      data: result,
    }

    return NextResponse.json(resBody, { status: 201 })
  } catch (error: any) {
    console.error("[POST /api/donation/donation-evidence/bulk]", error)

    const resBody: ApiResponse<never> = {
      success: false,
      message: "Gagal mengimpor data donasi",
      error: {
        code: "SERVER_ERROR",
        details: error instanceof Error ? error.message : String(error),
      },
    }

    return NextResponse.json(resBody, { status: 500 })
  }
}
