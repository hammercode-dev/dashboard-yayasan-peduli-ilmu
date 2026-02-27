import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

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
  }),
})

export const {
  useGetDonationEvidencesQuery,
  useDeleteDonationEvidenceMutation,
  useCreateDonationMutation,
} = donationApi
