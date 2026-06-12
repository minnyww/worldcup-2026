import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const THAI_TZ = "Asia/Bangkok"

/** Get today's date string in Thai timezone as "YYYY-MM-DD" */
export function getTodayThai(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: THAI_TZ })
}

/** Format a Date to "YYYY-MM-DD" in Thai timezone */
export function toThaiDateStr(d: Date): string {
  return d.toLocaleDateString("en-CA", { timeZone: THAI_TZ })
}

/** Format a date string ("YYYY-MM-DD") for display in Thai locale + timezone */
export function formatThaiDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z")
  return d.toLocaleDateString("th-TH", {
    timeZone: THAI_TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

/**
 * Format a time string from the API (e.g. "13:00 UTC-6") to Thai time display.
 * Parses the source offset, converts to UTC, then displays in Thai timezone.
 */
export function formatThaiTime(timeStr: string): string {
  // Parse "HH:MM UTC±N" format
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*UTC([+-]\d+)/)
  if (!match) {
    // Fallback: try plain "HH:MM"
    const [h, m] = timeStr.split(":").map(Number)
    if (isNaN(h) || isNaN(m)) return timeStr
    const d = new Date(Date.UTC(2026, 5, 11, h, m))
    return d.toLocaleTimeString("th-TH", { timeZone: THAI_TZ, hour: "2-digit", minute: "2-digit", hour12: false })
  }
  const [, h, m, offset] = match
  // Convert source time to UTC: utcHour = sourceHour - offset
  const utcHour = Number(h) - Number(offset)
  const d = new Date(Date.UTC(2026, 5, 11, utcHour, Number(m)))
  return d.toLocaleTimeString("th-TH", {
    timeZone: THAI_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

/** Format a time string from the API to show the source local time (no conversion) */
export function formatMatchTimeRaw(timeStr: string): string {
  const match = timeStr.match(/(\d{1,2}:\d{2})/)
  return match ? match[1] : timeStr
}
