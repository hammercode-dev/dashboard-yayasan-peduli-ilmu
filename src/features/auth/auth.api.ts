import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { LoginSchema } from "./auth.schemas"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: builder => ({
    login: builder.mutation({
      query: (credentials: LoginSchema) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
})

export const { useLoginMutation } = authApi
