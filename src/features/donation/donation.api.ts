import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { ApiResponse } from "@/lib/response"
import { getDonationById, UpdateDonationEvidenceInput } from "./donation.dal"

const getAllParams = (params: { query?: string; page?: number }) => {
  const searchParams = new URLSearchParams()
  if (params.query != null) searchParams.set("query", params.query)
  if (params.page != null) searchParams.set("page", String(params.page))
  return searchParams.toString()
}

export const donationApi = createApi({
  reducerPath: "donationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["DonationEvidence"],
  endpoints: builder => ({
    getDonationEvidences: builder.query({
      query: (params: { query?: string; page?: number }) => {
        return { url: `/donation/donation-evidence?${getAllParams(params)}` }
      },
      providesTags: result => {
        console.log("result", result)
        return result?.data
          ? [
              ...result.data.donations.map((item: { id: string }) => ({
                type: "DonationEvidence" as const,
                id: item.id,
              })),
              { type: "DonationEvidence", id: "LIST" },
            ]
          : [{ type: "DonationEvidence", id: "LIST" }]
      },
    }),
    deleteDonationEvidence: builder.mutation({
      query: (id: string) => ({
        url: `/donation/donation-evidence/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "DonationEvidence", id: "LIST" }],
    }),
    createDonation: builder.mutation({
      query: (body: ProgramDonationFormData) => ({
        url: "/donation/donation-evidence",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "DonationEvidence", id: "LIST" }],
    }),
    getDonationById: builder.query({
      query: (id: string) => ({
        url: `/donation/donation-evidence/${id}`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<Prisma.PromiseReturnType<typeof getDonationById>>
      ) => {
        return response.data
      },
    }),
    updateDonation: builder.mutation({
      query: (body: UpdateDonationEvidenceInput) => ({
        url: `/donation/donation-evidence/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "DonationEvidence", id: "LIST" }],
    }),
  }),
})

export const {
  useGetDonationEvidencesQuery,
  useDeleteDonationEvidenceMutation,
  useCreateDonationMutation,
  useGetDonationByIdQuery,
  useUpdateDonationMutation,
} = donationApi
