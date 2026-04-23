import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const getAllParams = (params: { query?: string; page?: number }) => {
  const searchParams = new URLSearchParams()
  if (params.query != null) searchParams.set("query", params.query)
  if (params.page != null) searchParams.set("page", String(params.page))
  return searchParams.toString()
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["User"],
  endpoints: builder => ({
    getUsers: builder.query({
      query: (params: { query?: string; page?: number }) => {
        return { url: `/user/users?${getAllParams(params)}` }
      },
      providesTags: result => {
        return result?.data
          ? [
              ...result.data.users.map((item: { id: string }) => ({
                type: "User" as const,
                id: item.id,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }]
      },
    }),
    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
})

export const { useGetUsersQuery, useDeleteUserMutation } = userApi
