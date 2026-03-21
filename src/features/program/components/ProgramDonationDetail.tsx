"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import remarkGfm from "remark-gfm"
import ReactMarkdown from "react-markdown"
import { differenceInDays, format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import {
  Languages,
  Calendar,
  MapPin,
  Clock,
  Target,
  UserPlus,
  TrendingUp,
  History,
  Users,
  Edit,
  Link as LinkIcon,
} from "lucide-react"

import { StatusBadge } from "./StatusBadge"
import SkeletonDetail from "./SkeletonDetail"
import { DonationStatus } from "../types/programDonation"

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/components/common/timeline"
import { formatRupiah } from "@/lib/format"
import { useGetProgramDonationByIdQuery } from "../program.api"

import LogoImage from "@/images/logo.png"

export default function ProgramDonationDetail({ id }: { id: string }) {
  const { data, isFetching } = useGetProgramDonationByIdQuery(id)
  const [animatedProgress, setAnimatedProgress] = useState(0)

  const target = Number(data?.target_amount || 0)
  const collected = Number(data?.collected_amount || 0)
  const progress = target > 0 ? Math.min((collected / target) * 100, 100) : 0

  const daysLeft = data?.ends_at
    ? differenceInDays(new Date(data.ends_at), new Date())
    : null

  useEffect(() => {
    const t = setTimeout(() => setAnimatedProgress(progress), 350)
    return () => clearTimeout(t)
  }, [progress])

  if (isFetching) return <SkeletonDetail />

  return (
    <section className="min-h-screen bg-zinc-50/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 border-b pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <StatusBadge status={data?.status as DonationStatus} />
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] text-zinc-500">
                ID : {data?.id}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold">{data?.title}</h1>

            <div className="flex flex-wrap items-center gap-4">
              <MetaChip
                icon={LinkIcon}
                label={data?.slug ? `Slug: ${data.slug}` : "-"}
              />
              <MetaChip icon={MapPin} label={data?.location || "Nasional"} />
              <MetaChip
                icon={Calendar}
                label={
                  data?.starts_at
                    ? format(new Date(data.starts_at), "dd MMM yyyy")
                    : "-"
                }
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-zinc-100 ">
              <Image
                src={data?.image_url || LogoImage}
                alt={data?.title || "Program Donation Image"}
                className={`object-contain bg-gray-300/20 p-2`}
                fill
              />
            </div>

            <div className="rounded-xl border bg-white">
              <Tabs defaultValue="id">
                <div className="flex items-center justify-between border-b px-5 py-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Languages className="size-4" />
                    Deskripsi
                  </div>

                  <TabsList>
                    <TabsTrigger value="id">ID</TabsTrigger>
                    <TabsTrigger value="en">EN</TabsTrigger>
                    <TabsTrigger value="ar">AR</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="id">
                  <ScrollArea className="h-[420px] px-6 py-6">
                    <ContentBody
                      title={data?.title || ""}
                      short={data?.short_description || ""}
                      desc={data?.description || ""}
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="en">
                  <ScrollArea className="h-[420px] px-6 py-6">
                    <ContentBody
                      title={data?.title_en || ""}
                      short={data?.short_description_en || ""}
                      desc={data?.description_en || ""}
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="ar">
                  <ScrollArea dir="rtl" className="h-[420px] px-6 py-6">
                    <ContentBody
                      title={data?.title_ar || ""}
                      short={data?.short_description_ar || ""}
                      desc={data?.description_ar || ""}
                    />
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>

            <div className="rounded-xl border bg-white">
              <Tabs defaultValue="timeline">
                <TabsList className=" px-auto w-max mx-4 mt-4">
                  <TabsTrigger value="timeline">
                    <History className="size-4 mr-1" />
                    Timeline
                  </TabsTrigger>

                  <TabsTrigger value="donatur">
                    <Users className="size-4 mr-1" />
                    Donatur
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="p-5">
                  {data?.program_timeline?.length ? (
                    <Tabs defaultValue="id" className="w-full">
                      <div className="flex items-center justify-between border-b pb-3 mb-4">
                        <span className="text-sm font-medium text-zinc-500">
                          Bahasa
                        </span>
                        <TabsList>
                          <TabsTrigger value="id">ID</TabsTrigger>
                          <TabsTrigger value="en">EN</TabsTrigger>
                          <TabsTrigger value="ar">AR</TabsTrigger>
                        </TabsList>
                      </div>
                      <TabsContent value="id">
                        <ProgramTimelineView
                          items={data.program_timeline}
                          activityKey="activity"
                        />
                      </TabsContent>
                      <TabsContent value="en">
                        <ProgramTimelineView
                          items={data.program_timeline}
                          activityKey="activity_en"
                        />
                      </TabsContent>
                      <TabsContent value="ar">
                        <ProgramTimelineView
                          items={data.program_timeline}
                          activityKey="activity_ar"
                          dir="rtl"
                        />
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <EmptyState label="Belum ada timeline" />
                  )}
                </TabsContent>

                <TabsContent value="donatur" className="p-5">
                  <EmptyState label="Belum ada donatur" />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <div className="sticky top-6 rounded-xl border bg-white p-5 space-y-4">
              <p className="text-xs font-bold uppercase text-zinc-400">
                Status Pendanaan
              </p>

              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-2xl font-bold">
                    {formatRupiah(collected)}
                  </p>

                  <span className="text-sm">
                    {animatedProgress.toFixed(1)}%
                  </span>
                </div>

                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 transition-all"
                    style={{ width: `${animatedProgress}%` }}
                  />
                </div>

                <p className="text-xs text-zinc-400 mt-1">
                  dari target {formatRupiah(target)}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <StatItem
                  icon={Target}
                  label="Target"
                  value={formatRupiah(target)}
                />

                <StatItem
                  icon={Clock}
                  label="Sisa Waktu"
                  value={`${daysLeft ?? 0} hari`}
                />

                <StatItem
                  icon={Users}
                  label="Donatur"
                  value={String(
                    (data as { donors?: unknown[] })?.donors?.length ?? 0
                  )}
                />

                <StatItem
                  icon={TrendingUp}
                  label="Progress"
                  value={`${animatedProgress.toFixed(1)}%`}
                />
              </div>

              <Separator />

              <div className="grid gap-3">
                <Link href={`/dashboard/donation/create`}>
                  <Button
                    variant="default"
                    className="w-full py-2.5 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white hover:cursor-pointer"
                    size="lg"
                  >
                    <UserPlus className="size-4" />
                    Tambah Donatur
                  </Button>
                </Link>

                <Link href={""}>
                  <Button
                    variant="default"
                    className="w-full py-2.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer"
                    size="lg"
                  >
                    <History className="size-4" />
                    Tambah Timeline
                  </Button>
                </Link>

                <Link href={`/dashboard/program/${id}/edit`}>
                  <Button
                    variant="outline"
                    className="w-full py-2.5 rounded-lg font-semibold border-amber-500 text-amber-600 hover:cursor-pointer"
                    size="lg"
                  >
                    <Edit className="size-4" />
                    Ubah Program Detail
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MetaChip({
  icon: Icon,
  label,
}: {
  icon: React.ElementType
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
      <Icon className="size-3.5 text-zinc-400" />
      {label}
    </span>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-zinc-200">
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  )
}

function StatItem({
  icon: Icon,
  label,
  value,
  valueClassName = "text-zinc-800",
}: {
  icon: React.ElementType
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="rounded-lg bg-zinc-50 border border-zinc-100 px-3 py-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="size-3 text-zinc-400" />
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
          {label}
        </p>
      </div>
      <p className={`text-sm font-bold tabular-nums ${valueClassName}`}>
        {value}
      </p>
    </div>
  )
}

type ProgramTimelineItemType = {
  date?: string | Date | null
  activity?: string | null
  activity_en?: string | null
  activity_ar?: string | null
  cost?: string | number | { toString: () => string } | null
  description?: string | null
}

function ProgramTimelineView({
  items,
  activityKey,
  dir,
}: {
  items: ProgramTimelineItemType[]
  activityKey: "activity" | "activity_en" | "activity_ar"
  dir?: "rtl"
}) {
  return (
    <div dir={dir}>
      <Timeline>
        {items.map((item, i) => (
          <TimelineItem key={i} last={i === items.length - 1} status="upcoming">
            <TimelineConnector status="upcoming">
              <span className="text-xs font-medium">{i + 1}</span>
            </TimelineConnector>
            <TimelineContent>
              <TimelineTime>
                {item.date ? format(new Date(item.date), "dd MMM yyyy") : "—"}
              </TimelineTime>
              <TimelineTitle>
                {item[activityKey] || "(Tidak ada judul)"}
              </TimelineTitle>
              {item.cost != null && Number(item.cost) > 0 && (
                <p className="text-xs text-zinc-500 mt-0.5">
                  Biaya: {formatRupiah(Number(item.cost))}
                </p>
              )}
              {item.description ? (
                <div className="mt-2">
                  <article className="prose prose-sm prose-zinc max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {item.description}
                    </ReactMarkdown>
                  </article>
                </div>
              ) : null}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}

function ContentBody({
  title,
  short,
  desc,
}: {
  title?: string
  short?: string
  desc?: string
}) {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-bold text-zinc-800">{title}</h2>}
      {short && (
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3">
          <p className="text-sm text-zinc-500 leading-relaxed">{short}</p>
        </div>
      )}

      <article className="prose prose-sm prose-zinc max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{desc || ""}</ReactMarkdown>
      </article>
    </div>
  )
}
