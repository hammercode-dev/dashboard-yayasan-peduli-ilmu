"use client"

import { Banknote, PlayCircle, Files, PersonStandingIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { formatRupiah } from "@/lib/format"
import { useGetProgramDonationStatsQuery } from "../dashboard.api"
import SkeletonCards from "./SkeletonCards"

export default function StatsCards() {
  const { data, isFetching } = useGetProgramDonationStatsQuery({})

  const STATS_CARDS = [
    {
      Icon: Banknote,
      title: "Total Dana Terkumpul",
      value: formatRupiah(
        Number(data?.totalRevenues._sum.collected_amount || 0)
      ),
      iconColor: "bg-green-700",
    },
    {
      Icon: PersonStandingIcon,
      title: "Total Donatur",
      value: data?.totalDonatur,
      iconColor: "bg-blue-500",
    },
    {
      Icon: Files,
      title: "Total Program",
      value: data?.totalPrograms,
      iconColor: "bg-purple-500",
    },
    {
      Icon: PlayCircle,
      title: "Aktif Program",
      value: data?.activePrograms,
      iconColor: "bg-emerald-500",
    },
  ]

  return (
    <div className="w-full">
      {isFetching ? (
        <SkeletonCards />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
