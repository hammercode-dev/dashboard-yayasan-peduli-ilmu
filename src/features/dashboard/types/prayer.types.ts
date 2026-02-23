export interface PrayerTimings {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Sunset: string
  Maghrib: string
  Isha: string
  Imsak: string
  Midnight: string
  Firstthird: string
  Lastthird: string
}

export interface PrayerDateHijri {
  date: string
  format: string
  day: string
  weekday: { en: string; ar: string }
  month: {
    number: number
    en: string
    ar: string
    days: number
  }
  year: string
  designation: { abbreviated: string; expanded: string }
  holidays: string[]
  adjustedHolidays: unknown[]
  method: string
}

export interface PrayerDateGregorian {
  date: string
  format: string
  day: string
  weekday: { en: string }
  month: { number: number; en: string }
  year: string
  designation: { abbreviated: string; expanded: string }
  lunarSighting: boolean
}

export interface PrayerDate {
  readable: string
  timestamp: string
  hijri: PrayerDateHijri
  gregorian: PrayerDateGregorian
}

export interface PrayerMetaMethod {
  id: number
  name: string
  params: { Fajr: number; Isha: number }
  location: { latitude: number; longitude: number }
}

export interface PrayerMeta {
  latitude: number
  longitude: number
  timezone: string
  method: PrayerMetaMethod
  latitudeAdjustmentMethod: string
  midnightMode: string
  school: string
  offset: Record<string, number>
}

export interface AladhanTimingsData {
  timings: PrayerTimings
  date: PrayerDate
  meta: PrayerMeta
}

export interface AladhanTimingsResponse {
  code: number
  status: string
  data: AladhanTimingsData
}
