'use client'

import { useLogout } from '../auth/auth.hooks'

const DashboardPage = () => {
  const { logout } = useLogout()
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to dashboard yayasan!</p>

      <button
        type="submit"
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  )
}

export default DashboardPage
