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
  const d = new Date(dateStr + "T00:00:00Z")
  return d.toLocaleDateString("th-TH", {
    timeZone: THAI_TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

/** Format a time string ("HH:MM") for display in Thai timezone */
export function formatThaiTime(timeStr: string): string {
  // The API time is in UTC, convert to Thai time (+7)
  const [h, m] = timeStr.split(":").map(Number)
  const d = new Date(Date.UTC(2026, 5, 11, h, m))
  return d.toLocaleTimeString("th-TH", {
    timeZone: THAI_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}
