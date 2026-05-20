import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ProgramDonationFormData } from "./program.schemas"
import { ApiResponse } from "@/lib/response"
import {
  getProgramDonationById,
  UpdateProgramDonationInput,
} from "./program.dal"
import { Prisma } from "@/generated/prisma"
import type { ProgramDonationListItem } from "./types/programDonation"

const getAllParams = (params: {
  query?: string
  page?: number
  limit?: number
  status?: string
}) => {
  const searchParams = new URLSearchParams()
  if (params.query != null) searchParams.set("query", params.query)
  if (params.page != null) searchParams.set("page", String(params.page))
  if (params.limit != null) searchParams.set("limit", String(params.limit))
  if (params.status != null) searchParams.set("status", params.status)
  return searchParams.toString()
}

export const programApi = createApi({
  reducerPath: "programApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["ProgramDonation"],
  endpoints: builder => ({
    getProgramDonations: builder.query({
      query: (params: {
        query?: string
        page?: number
        limit?: number
        status?: string
      }) => {
        return { url: `/program/program-donation?${getAllParams(params)}` }
      },
      providesTags: result => {
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
    getParentPrograms: builder.query({
      query: (params?: { query?: string }) => {
        const searchParams = new URLSearchParams()
        if (params?.query) searchParams.set("query", params.query)
        const qs = searchParams.toString()
        return {
          url: `/program/program-donation/parents${qs ? `?${qs}` : ""}`,
        }
      },
      providesTags: [{ type: "ProgramDonation", id: "PARENTS" }],
    }),
    createProgramDonation: builder.mutation({
      query: (body: ProgramDonationFormData) => ({
        url: "/program/program-donation",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "ProgramDonation", id: "LIST" },
        { type: "ProgramDonation", id: "PARENTS" },
      ],
    }),
    deleteProgramDonation: builder.mutation({
      query: (id: string) => ({
        url: `/program/program-donation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "ProgramDonation", id: "LIST" },
        { type: "ProgramDonation", id: "PARENTS" },
      ],
    }),
    getProgramDonationById: builder.query({
      query: (id: string) => ({
        url: `/program/program-donation/${id}`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<
          Prisma.PromiseReturnType<typeof getProgramDonationById>
        >
      ) => {
        return response.data
      },
    }),
    updateProgramDonation: builder.mutation({
      query: (body: UpdateProgramDonationInput) => ({
        url: `/program/program-donation/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "ProgramDonation", id: "LIST" },
        { type: "ProgramDonation", id: "PARENTS" },
      ],
    }),

    getAllProgramDonations: builder.query({
      query: (params: { query?: string }) => {
        return {
          url: `/program/program-donation-all?${getAllParams(params)}`,
        }
      },
      providesTags: result => {
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
  }),
})

export const {
  useCreateProgramDonationMutation,
  useGetProgramDonationsQuery,
  useGetParentProgramsQuery,
  useDeleteProgramDonationMutation,
  useGetProgramDonationByIdQuery,
  useUpdateProgramDonationMutation,
  useGetAllProgramDonationsQuery,
} = programApi

export type { ProgramDonationListItem }
