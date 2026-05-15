import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Prisma } from "@/generated/prisma"
import { ApiResponse } from "@/lib/response"
import { getDonorById } from "./donor.dal"
import type { CreateDonorFormData, UpdateDonorFormData } from "./donor.schemas"

const getAllParams = (params: { query?: string; page?: number; limit?: number }) => {
  const searchParams = new URLSearchParams()
  if (params.query != null) searchParams.set("query", params.query)
  if (params.page != null) searchParams.set("page", String(params.page))
  if (params.limit != null) searchParams.set("limit", String(params.limit))
  return searchParams.toString()
}

export const donorApi = createApi({
  reducerPath: "donorApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Donor"],
  endpoints: builder => ({
    getDonors: builder.query({
      query: (params: { query?: string; page?: number; limit?: number }) => ({
        url: `/donor/donors?${getAllParams(params)}`,
      }),
      providesTags: result => {
        const donors = result?.data?.donors
        return donors
          ? [
              ...donors.map((item: { id: string }) => ({
                type: "Donor" as const,
                id: item.id,
              })),
              { type: "Donor", id: "LIST" },
            ]
          : [{ type: "Donor", id: "LIST" }]
      },
    }),
    createDonor: builder.mutation({
      query: (body: CreateDonorFormData) => ({
        url: "/donor/donors",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Donor", id: "LIST" }],
    }),
    getDonorById: builder.query({
      query: (id: string) => ({
        url: `/donor/${id}`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<Prisma.PromiseReturnType<typeof getDonorById>>
      ) => response.data,
    }),
    updateDonor: builder.mutation({
      query: ({ id, ...body }: UpdateDonorFormData & { id: string }) => ({
        url: `/donor/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, body) => [
        { type: "Donor", id: body.id },
        { type: "Donor", id: "LIST" },
      ],
    }),
    deleteDonor: builder.mutation({
      query: (id: string) => ({
        url: `/donor/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Donor", id: "LIST" }],
    }),
  }),
})

export const {
  useGetDonorsQuery,
  useCreateDonorMutation,
  useGetDonorByIdQuery,
  useUpdateDonorMutation,
  useDeleteDonorMutation,
} = donorApi
