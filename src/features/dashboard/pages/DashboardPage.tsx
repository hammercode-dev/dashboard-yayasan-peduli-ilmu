"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import StatsCards from "../components/StatsCards"
import PrayerTimings from "../components/PrayerTimings"
import { ProgramTrendingTable } from "../components/ProgramTrendingTable"

const DashboardPage = () => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Ikhtisar Performa Yayasan
          </h2>
          <p className="text-muted-foreground">
            Mari lihat seberapa besar dampak yang telah kita buat bersama hari
            ini.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard/program/create">
            <Button className="gap-2 bg-green-700 text-white font-semibold hover:bg-green-800 hover:cursor-pointer">
              <Plus className="h-4 w-4" />
              Tambah Program
            </Button>
          </Link>
          <Link href="/dashboard/donation/create">
            <Button className="gap-2 bg-blue-500 text-white font-semibold hover:bg-blue-600 hover:cursor-pointer">
              <Plus className="h-4 w-4" />
              Tambah Donasi
            </Button>
          </Link>
        </div>
      </div>

      <PrayerTimings />

      <StatsCards />

      <ProgramTrendingTable />
    </section>
  )
}

export default DashboardPage
