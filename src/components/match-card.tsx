import type { Match, Team } from "../types"
import { cn, getTodayThai } from "@/lib/utils"

interface MatchCardProps {
  match: Match
  teams: Team[]
  onClick?: () => void
  delay?: number
}

function getTeamFlag(teamName: string, teams: Team[]): string {
  const team = teams.find(
    (t) => t.name === teamName || t.fifa_code === teamName
  )
  return team?.flag_icon ?? "🏳️"
}

function getMatchStatus(match: Match): "live" | "ended" | "upcoming" {
  if (match.score) return "ended"
  const todayThai = getTodayThai()
  if (match.date === todayThai) return "live"
  return "upcoming"
}

export function MatchCard({ match, teams, onClick, delay = 0 }: MatchCardProps) {
  const status = getMatchStatus(match)
  const flag1 = getTeamFlag(match.team1, teams)
  const flag2 = getTeamFlag(match.team2, teams)

  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "animate-fade-in-up group relative w-full glass-card rounded-xl p-card-padding text-left transition-transform active:scale-95 duration-150",
        status === "live" && "border-error/30"
      )}
    >
      {status === "live" && (
        <div className="absolute top-0 right-0 p-2">
          <span className="px-2 py-0.5 rounded-full bg-error/20 text-error text-[10px] font-bold uppercase tracking-wider">
            LIVE
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Team 1 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-lg overflow-hidden">
              {flag1}
            </div>
            <span className="text-body-base font-body-base font-bold text-lg">{match.team1}</span>
          </div>
          {match.score && (
            <span className="text-display-xl font-display-xl text-primary tracking-widest">
              {match.score.ft[0]}
            </span>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-lg overflow-hidden">
              {flag2}
            </div>
            <span className="text-body-base font-body-base font-bold text-lg">{match.team2}</span>
          </div>
          {match.score && (
            <span className="text-display-xl font-display-xl text-primary tracking-widest">
              {match.score.ft[1]}
            </span>
          )}
        </div>
      </div>

      {/* Bottom info */}
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-label-caps font-label-caps text-on-surface-variant uppercase opacity-60">
          {match.ground}
        </span>
        {!match.score && (
          <span className="text-data-tabular font-data-tabular text-on-tertiary-container font-bold italic">
            {match.time}
          </span>
        )}
        {match.score && match.goals1 && match.goals1.length > 0 && (
          <span className="text-xs text-on-tertiary-container font-bold italic">
            {match.goals1[0].name} {match.goals1[0].minute}'
          </span>
        )}
      </div>
    </button>
  )
}
