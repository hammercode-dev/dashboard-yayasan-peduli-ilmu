import { ApiResponse } from "@/lib/response"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ProgramDonationStatsDataResponse } from "./types/dashboard.types"
import type {
  AladhanTimingsData,
  AladhanTimingsResponse,
} from "./types/prayer.types"
import { formatDateForAladhan } from "@/lib/date"
import { ALADHAN_BASE } from "./dashboard.constants"

export type PrayerTimingsParams = {
  date?: string
  latitude: number
  longitude: number
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: builder => ({
    getProgramDonationStats: builder.query({
      query: () => "/program/program-donation-stats",
      transformResponse: (
        response: ApiResponse<ProgramDonationStatsDataResponse>
      ) => {
        return response.data
      },
    }),
    getPrayerTimings: builder.query<AladhanTimingsData, PrayerTimingsParams>({
      query: ({ date, latitude, longitude }) => {
        const dateParam = date ?? formatDateForAladhan()
        const url = `${ALADHAN_BASE}/timings/${dateParam}?latitude=${latitude}&longitude=${longitude}`
        return { url }
      },
      transformResponse: (response: AladhanTimingsResponse) => {
        if (response.code !== 200 || !response.data) throw new Error("No data")
        return response.data
      },
    }),
  }),
})

export const { useGetProgramDonationStatsQuery, useGetPrayerTimingsQuery } =
  dashboardApi
