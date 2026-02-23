import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface LocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

const initialState: LocationState = {
  latitude: null,
  longitude: null,
  error: null,
  loading: false,
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setLocationLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
      if (action.payload) state.error = null
    },
    setLocation(
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>
    ) {
      state.latitude = action.payload.latitude
      state.longitude = action.payload.longitude
      state.error = null
      state.loading = false
    },
    setLocationError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
    clearLocation(state) {
      state.latitude = null
      state.longitude = null
      state.error = null
      state.loading = false
    },
  },
})

export const {
  setLocation,
  setLocationError,
  setLocationLoading,
  clearLocation,
} = dashboardSlice.actions

export default dashboardSlice.reducer
