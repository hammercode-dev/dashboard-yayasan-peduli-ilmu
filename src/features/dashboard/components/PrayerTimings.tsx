"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  setLocation,
  setLocationError,
  setLocationLoading,
  clearLocation,
} from "../dashboard.slice"
import { useGetPrayerTimingsQuery } from "../dashboard.api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock } from "lucide-react"
import type { PrayerTimings as PrayerTimingsType } from "../types/prayer.types"
import SkeletonPrayingCard from "./SkeletonPrayingCard"
import { MAIN_PRAYERS, PRAYER_LABELS } from "../dashboard.constants"
import { parseTimeToDateToday } from "@/lib/date"

export default function PrayerTimings() {
  const dispatch = useAppDispatch()
  const [now, setNow] = useState(() => new Date())
  const {
    latitude,
    longitude,
    error: locationError,
    loading: locationLoading,
  } = useAppSelector(state => state.dashboard)

  const hasCoords = latitude != null && longitude != null

  const { data, isFetching, isError } = useGetPrayerTimingsQuery(
    { latitude: latitude!, longitude: longitude! },
    { skip: latitude == null || longitude == null }
  )

  const timings = data?.timings

  const nextPrayer = useMemo(() => {
    if (!timings) return null

    const candidates = MAIN_PRAYERS.map(name => ({
      name,
      at: parseTimeToDateToday(timings[name], now),
    }))
      .filter((x): x is { name: keyof PrayerTimingsType; at: Date } => !!x.at)
      .sort((a, b) => a.at.getTime() - b.at.getTime())

    const upcoming = candidates.find(x => x.at.getTime() > now.getTime())
    if (upcoming) {
      return { ...upcoming, inMs: upcoming.at.getTime() - now.getTime() }
    }

    const first = candidates[0]
    if (!first) return null
    const atTomorrow = new Date(first.at)
    atTomorrow.setDate(atTomorrow.getDate() + 1)
    return {
      name: first.name,
      at: atTomorrow,
      inMs: atTomorrow.getTime() - now.getTime(),
    }
  }, [now, timings])

  const locationRequestIdRef = useRef(0)

  useEffect(() => {
    if (latitude != null && longitude != null) return
    if (!navigator?.geolocation) {
      dispatch(setLocationError("Geolocation tidak didukung"))
      return
    }

    const requestId = ++locationRequestIdRef.current
    dispatch(setLocationLoading(true))

    navigator.geolocation.getCurrentPosition(
      pos => {
        if (locationRequestIdRef.current !== requestId) return
        dispatch(
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          })
        )
      },
      err => {
        if (locationRequestIdRef.current !== requestId) return
        const message =
          err.code === 1
            ? "Akses lokasi ditolak"
            : err.code === 2
              ? "Lokasi tidak tersedia"
              : err.code === 3
                ? "Waktu permintaan habis"
                : err.message || "Tidak dapat mengambil lokasi"
        dispatch(setLocationError(message))
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 }
    )
  }, [dispatch, latitude, longitude])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  if (locationLoading) {
    return <SkeletonPrayingCard />
  }

  if (!hasCoords) {
    return <SkeletonPrayingCard />
  }

  if (locationError) {
    return (
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20">
        <CardContent>
          <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            {locationError}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Izinkan akses lokasi di pengaturan browser untuk menampilkan jadwal
            sholat sesuai lokasi Anda.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => dispatch(clearLocation())}
          >
            Coba lagi
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isFetching && !data) {
    return <SkeletonPrayingCard />
  }

  if (isError || !data) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">
            Gagal memuat jadwal sholat.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!timings) return null

  if (!nextPrayer) return null

  const { meta } = data

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-12 sm:w-12">
              <Clock className="size-5 sm:size-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                Sholat berikutnya
              </p>
              <p className="text-base font-semibold tabular-nums sm:text-lg">
                {PRAYER_LABELS[nextPrayer.name] ?? nextPrayer.name}{" "}
                <span className="text-muted-foreground font-normal">
                  {timings[nextPrayer.name]}
                </span>
              </p>
            </div>
          </div>
          {meta?.timezone && (
            <div className="flex shrink-0 items-center gap-1.5 text-muted-foreground sm:ml-auto">
              <MapPin className="size-4 shrink-0" />
              <span className="truncate text-xs sm:text-sm">
                {meta.timezone}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 border-t pt-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {MAIN_PRAYERS.map(name => {
              const isNext = nextPrayer.name === name
              return (
                <div
                  key={name}
                  className={[
                    "rounded-lg border px-3 py-2",
                    isNext ? "border-primary/40 bg-primary/5" : "bg-muted/30",
                  ].join(" ")}
                >
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {PRAYER_LABELS[name] ?? name}
                  </p>
                  <p
                    className={[
                      "text-sm font-semibold tabular-nums",
                      isNext ? "text-primary" : "",
                    ].join(" ")}
                  >
                    {timings[name]}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
