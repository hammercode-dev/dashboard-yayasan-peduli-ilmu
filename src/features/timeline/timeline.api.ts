import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { createApi } from "@reduxjs/toolkit/query/react"
import type {
  CreateTimelineItemInput,
  UpdateTimelineItemInput,
} from "./timeline.schemas"

export const timelineApi = createApi({
  reducerPath: "timelineApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Timeline"],
  endpoints: builder => ({
    getTimelineByProgramId: builder.query({
      query: (programId: number) => `/timeline/${programId}`,
      providesTags: (_result, _error, programId) => [
        { type: "Timeline", id: programId },
      ],
    }),
    createTimelineItem: builder.mutation({
      query: (body: CreateTimelineItemInput) => ({
        url: "/timeline",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { program_id }) => [
        { type: "Timeline", id: program_id },
      ],
    }),
    updateTimelineItem: builder.mutation({
      query: ({
        id,
        programId,
        ...body
      }: UpdateTimelineItemInput & { id: string; programId: number }) => ({
        url: `/timeline/item/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { programId }) => [
        { type: "Timeline", id: programId },
      ],
    }),
    deleteTimelineItem: builder.mutation({
      query: ({
        id,
        programId,
      }: {
        id: string
        programId: number
      }) => ({
        url: `/timeline/item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { programId }) => [
        { type: "Timeline", id: programId },
      ],
    }),
  }),
})

export const {
  useGetTimelineByProgramIdQuery,
  useCreateTimelineItemMutation,
  useUpdateTimelineItemMutation,
  useDeleteTimelineItemMutation,
} = timelineApi
