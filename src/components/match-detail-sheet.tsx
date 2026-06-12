import type { Match, Team } from "../types"
import { Badge } from "./ui/badge"
import { cn } from "@/lib/utils"
import { X, MapPin, Clock } from "lucide-react"

interface MatchDetailSheetProps {
  match: Match | null
  teams: Team[]
  onClose: () => void
}

function getTeamFlag(teamName: string, teams: Team[]): string {
  const team = teams.find(
    (t) => t.name === teamName || t.fifa_code === teamName
  )
  return team?.flag_icon ?? ""
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function MatchDetailSheet({
  match,
  teams,
  onClose,
}: MatchDetailSheetProps) {
  if (!match) return null

  const flag1 = getTeamFlag(match.team1, teams)
  const flag2 = getTeamFlag(match.team2, teams)
  const isFinished = !!match.score

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-6">
        <div className="mx-auto mb-4 flex w-12 justify-center">
          <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            {match.group ?? match.round}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex w-full items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl">{flag1}</span>
              <span className="text-sm font-medium">{match.team1}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              {match.score ? (
                <span className="text-4xl font-bold tabular-nums">
                  {match.score.ft[0]} : {match.score.ft[1]}
                </span>
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  vs
                </span>
              )}
              {isFinished && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                  Full Time
                </Badge>
              )}
              {match.score?.ht && (
                <span className="text-xs text-muted-foreground">
                  HT: {match.score.ht[0]} - {match.score.ht[1]}
                </span>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl">{flag2}</span>
              <span className="text-sm font-medium">{match.team2}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>{formatDate(match.date)}</span>
            <span className="text-foreground">{match.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            <span>{match.ground}</span>
          </div>
        </div>

        {match.goals1 && match.goals1.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground">
              Goals
            </h4>
            <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3">
              {match.goals1.map((g, i) => (
                <div
                  key={`g1-${i}`}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {flag1} {g.name}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {g.minute}'
                  </span>
                </div>
              ))}
              {match.goals2?.map((g, i) => (
                <div
                  key={`g2-${i}`}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {flag2} {g.name}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {g.minute}'
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
