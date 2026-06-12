import { useMemo } from "react"
import type { Match, Team } from "../types"
import { MatchCard } from "./match-card"
import { Badge } from "./ui/badge"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const filters = [
  { key: "all" as const, label: "All" },
  { key: "group" as const, label: "Group" },
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
  const weekDates = useMemo(() => {
    const selected = new Date(selectedDate)
    const day = selected.getDay()
    const start = new Date(selected)
    start.setDate(start.getDate() - day)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      return d.toISOString().split("T")[0]
    })
  }, [selectedDate])

  const weekIndex = useMemo(() => {
    return dateRange.findIndex((d) => weekDates.includes(d))
  }, [dateRange, weekDates])

  const navigateWeek = (dir: -1 | 1) => {
    const currentIndex = weekIndex >= 0 ? weekIndex : 0
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + dir * 7)
    const newDateStr = newDate.toISOString().split("T")[0]
    const closest = dateRange.reduce((prev, curr) =>
      Math.abs(
        new Date(curr).getTime() - new Date(newDateStr).getTime()
      ) < Math.abs(
        new Date(prev).getTime() - new Date(newDateStr).getTime()
      )
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

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">
          {MONTH_NAMES[new Date(selectedDate).getMonth()]}{" "}
          {new Date(selectedDate).getFullYear()}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateWeek(-1)}
            className="rounded-full p-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => navigateWeek(1)}
            className="rounded-full p-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto scrollbar-none">
        {weekDates.map((date) => {
          const d = new Date(date)
          const isSelected = date === selectedDate
          const hasMatches = matches.some((m) => m.date === date)
          return (
            <button
              key={date}
              onClick={() => onDateSelect(date)}
              className={cn(
                "flex flex-1 min-w-[48px] flex-col items-center gap-1 rounded-xl py-2 text-xs transition-all",
                isSelected
                  ? "bg-primary text-primary-foreground font-bold"
                  : hasMatches
                    ? "bg-secondary text-foreground hover:bg-secondary/80"
                    : "text-muted-foreground hover:bg-secondary/50"
              )}
            >
              <span className="font-medium">{DAY_NAMES[d.getDay()]}</span>
              <span className="text-lg font-bold">{d.getDate()}</span>
            </button>
          )
        })}
      </div>

      <div className="flex gap-2">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              matchFilter === key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {groupMatches.length > 0 && (
          <div className="flex flex-col gap-2">
            {matchFilter === "all" && (
              <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                Group Stage
              </h3>
            )}
            {groupMatches.map((match, i) => (
              <MatchCard
                key={`group-${i}`}
                match={match}
                teams={teams}
                onClick={() => onMatchSelect(match)}
              />
            ))}
          </div>
        )}

        {knockoutMatches.length > 0 && (
          <div className="flex flex-col gap-2">
            {matchFilter === "all" && (
              <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                Knockout Stage
              </h3>
            )}
            {knockoutMatches.map((match, i) => (
              <MatchCard
                key={`ko-${i}`}
                match={match}
                teams={teams}
                onClick={() => onMatchSelect(match)}
              />
            ))}
          </div>
        )}

        {dayMatches.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <p className="text-sm">No matches on this date</p>
          </div>
        )}
      </div>
    </div>
  )
}
