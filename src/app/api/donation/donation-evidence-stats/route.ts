import { NextResponse } from "next/server"

import type { ApiResponse } from "@/lib/response"

import { getDonationEvidenceStats } from "@/features/donation/donation.dal"

import { DonationStatsDataResponse } from "@/features/donation/donation.types"

export async function GET() {
  try {
    const stats = await getDonationEvidenceStats()

    const body: ApiResponse<DonationStatsDataResponse> = {
      success: true,
      message: "Success get stats donation evidences",
      data: stats,
    }
    return NextResponse.json(body)
  } catch (error) {
    console.error("[GET /api/donation/donation-evidence-stats]", error)
    const body: ApiResponse<never> = {
      success: false,
      message: "Error fetching data",
      error: { code: "FETCH_ERROR", details: String(error) },
    }
    return NextResponse.json(body, { status: 500 })
  }
}
