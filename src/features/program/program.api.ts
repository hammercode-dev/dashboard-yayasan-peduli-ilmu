import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ProgramDonationFormData } from "./program.schemas"

export const programApi = createApi({
  reducerPath: "programApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["ProgramDonation"],
  endpoints: builder => ({
    createProgramDonation: builder.mutation({
      query: (body: ProgramDonationFormData) => ({
        url: "/program/program-donation",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ProgramDonation", id: "LIST" }],
    }),
  }),
})

export const { useCreateProgramDonationMutation } = programApi
