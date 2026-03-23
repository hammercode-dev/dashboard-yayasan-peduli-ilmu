import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { createApi } from "@reduxjs/toolkit/query/react"

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
  }),
})

export const { useGetTimelineByProgramIdQuery } = timelineApi
