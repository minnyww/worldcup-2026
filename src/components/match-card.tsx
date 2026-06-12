import type { Match, Team } from "../types"
import { Badge } from "./ui/badge"
import { cn } from "@/lib/utils"

interface MatchCardProps {
  match: Match
  teams: Team[]
  onClick?: () => void
}

function getTeamFlag(teamName: string, teams: Team[]): string {
  const team = teams.find(
    (t) => t.name === teamName || t.fifa_code === teamName
  )
  return team?.flag_icon ?? ""
}

function getMatchStatus(match: Match): "live" | "ended" | "upcoming" {
  if (match.score) return "ended"
  const now = new Date()
  const matchDate = new Date(match.date)
  const diffDays = Math.floor(
    (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diffDays === 0) return "live"
  return "upcoming"
}

const statusConfig = {
  live: { label: "LIVE", className: "bg-[var(--live)] text-white" },
  ended: { label: "ENDED", className: "bg-primary text-primary-foreground" },
  upcoming: { label: "UPCOMING", className: "bg-[var(--upcoming)] text-white" },
}

export function MatchCard({ match, teams, onClick }: MatchCardProps) {
  const status = getMatchStatus(match)
  const flag1 = getTeamFlag(match.team1, teams)
  const flag2 = getTeamFlag(match.team2, teams)

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:bg-accent/10 active:scale-[0.98]"
    >
      <div className="flex flex-1 items-center gap-3">
        <div className="flex flex-1 items-center justify-end gap-2">
          <span className="truncate text-sm font-medium">{match.team1}</span>
          <span className="text-2xl">{flag1}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          {match.score ? (
            <span className="text-xl font-bold tabular-nums">
              {match.score.ft[0]} : {match.score.ft[1]}
            </span>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              vs
            </span>
          )}
          <Badge
            variant="secondary"
            className={cn(
              "px-2 py-0 text-[10px] font-bold uppercase",
              statusConfig[status].className
            )}
          >
            {statusConfig[status].label}
          </Badge>
        </div>

        <div className="flex flex-1 items-center gap-2">
          <span className="text-2xl">{flag2}</span>
          <span className="truncate text-sm font-medium">{match.team2}</span>
        </div>
      </div>
    </button>
  )
}
