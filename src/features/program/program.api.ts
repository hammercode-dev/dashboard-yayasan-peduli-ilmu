import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ProgramDonationFormData } from "./program.schemas"

const getAllParams = (params: {
  query?: string
  page?: number
  status?: string
}) => {
  const searchParams = new URLSearchParams()
  if (params.query != null) searchParams.set("query", params.query)
  if (params.page != null) searchParams.set("page", String(params.page))
  if (params.status != null) searchParams.set("status", params.status)
  return searchParams.toString()
}

export const programApi = createApi({
  reducerPath: "programApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["ProgramDonation"],
  endpoints: builder => ({
    getProgramDonations: builder.query({
      query: (params: { query?: string; page?: number; status?: string }) => {
        return { url: `/program/program-donation?${getAllParams(params)}` }
      },
      providesTags: result => {
        console.log("result", result)
        return result?.data
          ? [
              ...result.data.donations.map((item: { id: string }) => ({
                type: "ProgramDonation" as const,
                id: item.id,
              })),
              { type: "ProgramDonation", id: "LIST" },
            ]
          : [{ type: "ProgramDonation", id: "LIST" }]
      },
    }),
    createProgramDonation: builder.mutation({
      query: (body: ProgramDonationFormData) => ({
        url: "/program/program-donation",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ProgramDonation", id: "LIST" }],
    }),
    deleteProgramDonation: builder.mutation({
      query: (id: string) => ({
        url: `/program/program-donation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ProgramDonation", id: "LIST" }],
    }),
  }),
})

export const {
  useCreateProgramDonationMutation,
  useGetProgramDonationsQuery,
  useDeleteProgramDonationMutation,
} = programApi
