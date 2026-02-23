import { PrayerTimings } from "./types/prayer.types"

export const ALADHAN_BASE = "https://api.aladhan.com/v1"

export const MAIN_PRAYERS: (keyof PrayerTimings)[] = [
  "Fajr",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
]

export const PRAYER_LABELS: Record<string, string> = {
  Imsak: "Imsak",
  Fajr: "Subuh",
  Sunrise: "Terbit",
  Dhuhr: "Zuhur",
  Asr: "Ashar",
  Maghrib: "Maghrib",
  Isha: "Isya",
}
