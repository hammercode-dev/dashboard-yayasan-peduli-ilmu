import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import { programApi } from "@/features/program/program.api"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [programApi.reducerPath]: programApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(programApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
