import axios from "axios"

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  message: string
  user: {
    id: string
    email: string
    roleCode: string | null
    fullName: string
    roleName: string | null
    created_at: string
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axios.post("/api/auth/login", credentials, {
      withCredentials: true,
    })

    return response.data
  },

  async logout(): Promise<void> {
    const response = await axios.post("/api/auth/logout", {
      withCredentials: true,
    })

    return response.data
  },
}
