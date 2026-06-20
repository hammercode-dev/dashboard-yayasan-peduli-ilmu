"use client"

import {
  Wallet,
  Users,
  LayoutGrid,
  CheckCircle2,
  UserPlus,
  HandCoins,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { formatRupiah } from "@/lib/format"
import { useGetProgramDonationStatsQuery } from "../dashboard.api"
import SkeletonCards from "./SkeletonCards"

export default function StatsCards() {
  const { data, isFetching } = useGetProgramDonationStatsQuery({})

  const STATS_CARDS = [
    {
      Icon: Wallet,
      title: "Total Dana Terkumpul",
      value: formatRupiah(data?.totalRevenues ?? 0),
      iconColor: "bg-green-700",
    },
    {
      Icon: Users,
      title: "Total Donatur",
      value: data?.totalDonatur ? `${data.totalDonatur} Orang` : "0 Orang",
      iconColor: "bg-blue-600",
    },
    {
      Icon: LayoutGrid,
      title: "Total Program",
      value: `${data?.totalPrograms ?? 0} Program`,
      iconColor: "bg-purple-500",
    },
    {
      Icon: CheckCircle2,
      title: "Program Aktif",
      value: `${data?.activePrograms ?? 0} Berjalan`,
      iconColor: "bg-emerald-500",
    },
    {
      Icon: HandCoins,
      title: "Donasi Hari Ini",
      value: formatRupiah(data?.todayCollectedAmount ?? 0),
      iconColor: "bg-orange-500",
    },
    {
      Icon: UserPlus,
      title: "Donatur Hari Ini",
      value: data?.todayDonorsCount
        ? `${data.todayDonorsCount} Orang`
        : "0 Orang",
      iconColor: "bg-indigo-500",
    },
  ]

  return (
    <div className="w-full">
      {isFetching ? (
        <SkeletonCards />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATS_CARDS.map((stat, idx) => (
            <Card key={idx} className="">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div
                  className={`w-8 h-8 ${stat.iconColor} rounded-lg flex items-center justify-center`}
                >
                  <stat.Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className=" mt-[-20px]">
                <div className="text-2xl font-bold text-foreground">
                  {String(stat.value)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
