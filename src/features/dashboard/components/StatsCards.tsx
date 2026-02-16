"use client"
import {
  Banknote,
  PlayCircle,
  FileEdit,
  Archive,
  CheckCircle,
  Files,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { formatRupiah } from "@/lib/format"
import { useGetProgramDonationStatsQuery } from "../dashboard.api"
import SkeletonCards from "./SkeletonCards"

export default function StatsCards() {
  const { data, isFetching } = useGetProgramDonationStatsQuery({})

  const STATS_CARDS = [
    {
      Icon: Files,
      title: "Total Programs",
      value: data?.totalPrograms,
      iconColor: "bg-purple-500",
    },
    {
      Icon: Banknote,
      title: "Dana Terkumpul",
      value: formatRupiah(
        Number(data?.fundsCollected._sum.collected_amount || 0)
      ),
      iconColor: "bg-green-500",
    },
    {
      Icon: PlayCircle,
      title: "Active Programs",
      value: data?.active,
      iconColor: "bg-emerald-500",
    },
    {
      Icon: FileEdit,
      title: "Draft Programs",

      value: data?.draft,
      iconColor: "bg-gray-400",
    },
    {
      Icon: Archive,
      title: "Archived Programs",
      value: data?.archived,
      iconColor: "bg-orange-500",
    },
    {
      Icon: CheckCircle,
      title: "Completed Programs",
      value: data?.closed,
      iconColor: "bg-blue-500",
    },
  ]

  return (
    <div className="w-full">
      {isFetching ? (
        <SkeletonCards />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATS_CARDS.map((stat, idx) => (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div
                  className={`w-8 h-8 ${stat.iconColor} rounded-lg flex items-center justify-center`}
                >
                  <stat.Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
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
