import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Prisma } from "@/generated/prisma"
import { ApiResponse } from "@/lib/response"
import { getUserById } from "./user.dal"
import type { CreateUserFormData, UpdateUserFormData } from "./user.schemas"

const getAllParams = (params: { query?: string; page?: number }) => {
  const searchParams = new URLSearchParams()
  if (params.query != null) searchParams.set("query", params.query)
  if (params.page != null) searchParams.set("page", String(params.page))
  return searchParams.toString()
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["User", "Role"],
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
    createUser: builder.mutation({
      query: (body: CreateUserFormData) => ({
        url: "/user/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    getRoles: builder.query({
      query: () => ({
        url: "/user/roles",
        method: "GET",
      }),
      providesTags: [{ type: "Role", id: "LIST" }],
    }),
    getUserById: builder.query({
      query: (id: string) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<Prisma.PromiseReturnType<typeof getUserById>>
      ) => response.data,
    }),
    updateUser: builder.mutation({
      query: (body: UpdateUserFormData & { id: string }) => ({
        url: `/user/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, body) => [
        { type: "User", id: body.id },
        { type: "User", id: "LIST" },
      ],
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

export const {
  useGetUsersQuery,
  useGetRolesQuery,
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi
