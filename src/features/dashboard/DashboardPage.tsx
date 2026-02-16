"use client"

import { useAppSelector } from "@/store/hooks"
import StatsCards from "./components/StatsCards"

const DashboardPage = () => {
  const auth = useAppSelector(state => state.auth)

  console.log("AUTH STATE:", auth)

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Selamat Datang!</h2>
        <p className="text-muted-foreground">Dashboard Yayasan Peduli Ilmu</p>
      </div>

      <StatsCards />    
    </section>
  )
}

export default DashboardPage
