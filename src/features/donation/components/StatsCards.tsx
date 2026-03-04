"use client"

import { Banknote, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { formatRupiah } from "@/lib/format"

import { useGetDonationStatsQuery } from "../donation.api"

export default function StatsCards() {
  const { data, isFetching } = useGetDonationStatsQuery({})

  const STATS_CARDS = [
    {
      Icon: Banknote,
      title: "Donasi Masuk Hari Ini",
      value: formatRupiah(Number(data?.todayCollectedAmount ?? 0)),
      iconColor: "bg-emerald-500",
    },
    {
      Icon: Users,
      title: "Donatur Hari Ini",

      value: data?.todayDonorsCount
        ? `${data.todayDonorsCount} Orang`
        : "0 Orang",
      iconColor: "bg-indigo-500",
    },
  ]

  if (isFetching) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATS_CARDS.map((stat, idx) => (
            <Card key={idx} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium bg-gray-300 rounded-md w-1/2 h-4" />
                <div
                  className={`w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center`}
                ></div>
              </CardHeader>
              <CardContent className=" mt-[-20px]">
                <div className="text-2xl font-bold text-foreground bg-gray-300 rounded-md w-1/3 h-6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="w-full">
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
    </div>
  )
}
