"use client"

import StatsCards from "../components/StatsCards"
import PrayerTimings from "../components/PrayerTimings"

const DashboardPage = () => {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Selamat Datang!</h2>
        <p className="text-muted-foreground">Dashboard Yayasan Peduli Ilmu</p>
      </div>

      <PrayerTimings />

      <StatsCards />
    </section>
  )
}

export default DashboardPage
