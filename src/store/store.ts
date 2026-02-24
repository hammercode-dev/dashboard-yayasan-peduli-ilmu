import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import dashboardReducer from "@/features/dashboard/dashboard.slice"
import { programApi } from "@/features/program/program.api"
import { dashboardApi } from "@/features/dashboard/dashboard.api"
import { donationApi } from "@/features/donation/donation.api"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    [programApi.reducerPath]: programApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [donationApi.reducerPath]: donationApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      programApi.middleware,
      dashboardApi.middleware,
      donationApi.middleware
    ),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
