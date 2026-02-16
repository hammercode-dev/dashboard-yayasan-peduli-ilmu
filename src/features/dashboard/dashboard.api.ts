import { ApiResponse } from "@/lib/response"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ProgramDonationStatsDataResponse } from "./dashboard.types"

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
  }),
})

export const { useGetProgramDonationStatsQuery } = dashboardApi
