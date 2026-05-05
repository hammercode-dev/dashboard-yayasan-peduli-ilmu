import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  email: string
  roleCode: string | null
  fullName: string | null
  roleName: string | null

}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error?: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true
      state.error = null
    },
    authSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
    },
    setSessionUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    authFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { authStart, authSuccess, setSessionUser, authFailure, logout } =
  authSlice.actions

export default authSlice.reducer
