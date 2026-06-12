import { useMemo, useRef, useEffect } from "react"
import type { Match, Team } from "../types"
import { MatchCard } from "./match-card"
import { cn, toThaiDateStr } from "@/lib/utils"

interface CalendarViewProps {
  matches: Match[]
  teams: Team[]
  selectedDate: string
  onDateSelect: (date: string) => void
  matchFilter: "all" | "group" | "knockout"
  onFilterChange: (filter: "all" | "group" | "knockout") => void
  dateRange: string[]
  onMatchSelect: (match: Match) => void
}

const MONTH_ABBR = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const filters = [
  { key: "all" as const, label: "All" },
  { key: "group" as const, label: "Groups" },
  { key: "knockout" as const, label: "Knockout" },
]

export function CalendarView({
  matches,
  teams,
  selectedDate,
  onDateSelect,
  matchFilter,
  onFilterChange,
  dateRange,
  onMatchSelect,
}: CalendarViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const weekDates = useMemo(() => {
    const selected = new Date(selectedDate + "T12:00:00Z")
    const day = selected.getUTCDay()
    const start = new Date(selected)
    start.setUTCDate(start.getUTCDate() - day - 7)
    return Array.from({ length: 21 }, (_, i) => {
      const d = new Date(start)
      d.setUTCDate(d.getUTCDate() + i)
      return toThaiDateStr(d)
    })
  }, [selectedDate])

  useEffect(() => {
    if (scrollRef.current) {
      const selectedEl = scrollRef.current.querySelector("[data-selected]")
      if (selectedEl) {
        selectedEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [selectedDate])

  const navigateWeek = (dir: -1 | 1) => {
    const newDate = new Date(selectedDate + "T12:00:00Z")
    newDate.setUTCDate(newDate.getUTCDate() + dir * 7)
    const newDateStr = toThaiDateStr(newDate)
    const closest = dateRange.reduce((prev, curr) =>
      Math.abs(new Date(curr).getTime() - new Date(newDateStr).getTime()) <
      Math.abs(new Date(prev).getTime() - new Date(newDateStr).getTime())
        ? curr
        : prev
    )
    onDateSelect(closest)
  }

  const dayMatches = useMemo(() => {
    return matches.filter((m) => {
      if (m.date !== selectedDate) return false
      if (matchFilter === "group" && !m.group) return false
      if (matchFilter === "knockout" && m.group) return false
      return true
    })
  }, [matches, selectedDate, matchFilter])

  const groupMatches = dayMatches.filter((m) => m.group)
  const knockoutMatches = dayMatches.filter((m) => !m.group)

  const d = new Date(selectedDate)

  return (
    <div className="space-y-8">
      {/* Month header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-lg-mobile font-headline-lg-mobile uppercase tracking-tight text-on-surface">
            {MONTH_NAMES[d.getMonth()]}
          </h2>
          <p className="text-body-base font-body-base text-on-surface-variant mt-0.5">{d.getFullYear()}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigateWeek(-1)}
            className="flex size-9 items-center justify-center rounded-xl glass-card text-on-surface-variant transition-all active:scale-90 hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            onClick={() => navigateWeek(1)}
            className="flex size-9 items-center justify-center rounded-xl glass-card text-on-surface-variant transition-all active:scale-90 hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Horizontal date scroller */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto hide-scrollbar -mx-container-margin px-container-margin py-2 snap-x snap-mandatory"
      >
        {weekDates.map((date) => {
          const dateObj = new Date(date)
          const isSelected = date === selectedDate
          const hasMatches = matches.some((m) => m.date === date)
          return (
            <button
              key={date}
              data-selected={isSelected ? "" : undefined}
              onClick={() => onDateSelect(date)}
              className={cn(
                "animate-fade-in-up snap-center flex-shrink-0 flex flex-col items-center justify-center transition-all duration-300 active:scale-95",
                isSelected
                  ? "w-20 h-24 rounded-2xl electric-gradient text-on-tertiary shadow-[0_0_24px_rgba(53,125,241,0.3)] ring-4 ring-tertiary/20"
                  : "w-16 h-20 rounded-xl glass-card border-white/5 text-on-surface-variant opacity-60 hover:opacity-100"
              )}
            >
              <span className={cn(
                "text-label-caps font-label-caps",
                isSelected ? "font-extrabold" : ""
              )}>
                {MONTH_ABBR[dateObj.getMonth()]}
              </span>
              <span className={cn(
                "text-headline-lg-mobile font-headline-lg-mobile leading-none",
                isSelected ? "text-3xl" : "text-2xl"
              )}>
                {dateObj.getDate()}
              </span>
              {isSelected && (
                <div className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
              )}
              {!isSelected && hasMatches && (
                <div className="flex gap-0.5 mt-1.5">
                  <div className="size-1 rounded-full bg-tertiary" />
                  {matches.filter(m => m.date === date).length > 1 && (
                    <div className="size-1 rounded-full bg-tertiary/50" />
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={cn(
              "rounded-full px-5 py-2 text-label-caps font-label-caps transition-all duration-300 active:scale-95",
              matchFilter === key
                ? "bg-tertiary-container text-tertiary border border-tertiary/20 shadow-[0_0_15px_rgba(173,198,255,0.2)]"
                : "glass-card text-on-surface-variant hover:bg-white/10"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Match list */}
      <div className="flex flex-col gap-6">
        {groupMatches.length > 0 && (
          <div className="flex flex-col gap-4">
            {matchFilter === "all" && (
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                <span className="text-label-caps font-label-caps text-tertiary tracking-widest bg-tertiary/10 px-3 py-1 rounded-full border border-tertiary/20">Group Stage</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
              </div>
            )}
            {groupMatches.map((match, i) => (
              <MatchCard
                key={`group-${i}`}
                match={match}
                teams={teams}
                onClick={() => onMatchSelect(match)}
                delay={i * 60}
              />
            ))}
          </div>
        )}

        {knockoutMatches.length > 0 && (
          <div className="flex flex-col gap-4">
            {matchFilter === "all" && (
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                <span className="text-label-caps font-label-caps text-tertiary tracking-widest bg-tertiary/10 px-3 py-1 rounded-full border border-tertiary/20">Knockout</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
              </div>
            )}
            {knockoutMatches.map((match, i) => (
              <MatchCard
                key={`ko-${i}`}
                match={match}
                teams={teams}
                onClick={() => onMatchSelect(match)}
                delay={(groupMatches.length + i) * 60}
              />
            ))}
          </div>
        )}

        {dayMatches.length === 0 && (
          <div className="animate-fade-in-scale flex flex-col items-center gap-4 py-20">
            <div className="flex size-16 items-center justify-center rounded-2xl glass-card">
              <span className="material-symbols-outlined text-2xl text-on-surface-variant/50">sports_soccer</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-body-base font-body-base font-semibold text-on-surface-variant">No matches</p>
              <p className="text-body-base font-body-base text-on-surface-variant/60">Try another date</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
