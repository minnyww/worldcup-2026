import type { Match, Team } from "../types"
import { cn, formatThaiDate, formatThaiTime } from "@/lib/utils"

interface MatchDetailSheetProps {
  match: Match | null
  teams: Team[]
  onClose: () => void
  closing?: boolean
}

function getTeamFlag(teamName: string, teams: Team[]): string {
  const team = teams.find(
    (t) => t.name === teamName || t.fifa_code === teamName
  )
  return team?.flag_icon ?? "🏳️"
}



export function MatchDetailSheet({
  match,
  teams,
  onClose,
  closing,
}: MatchDetailSheetProps) {
  if (!match) return null

  const flag1 = getTeamFlag(match.team1, teams)
  const flag2 = getTeamFlag(match.team2, teams)
  const isFinished = !!match.score

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50",
          closing ? "opacity-0" : "animate-backdrop-in"
        )}
        onClick={onClose}
        style={{ backdropFilter: closing ? undefined : "blur(8px)" }}
      />
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-background border-t border-white/10",
          closing ? "animate-slide-down-out" : "animate-slide-up-sheet"
        )}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-on-surface-variant/15" />
        </div>

        {/* Close button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full glass-card transition-all active:scale-90 hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-sm text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Round badge */}
        <div className="flex justify-center px-6 pb-4">
          <span className="rounded-full bg-tertiary-container px-4 py-1.5 text-label-caps font-label-caps text-tertiary border border-tertiary/20">
            {match.group ?? match.round}
          </span>
        </div>

        {/* Teams display */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-4">
            <div className="animate-slide-in-right flex flex-1 flex-col items-center gap-3" style={{ animationDelay: "100ms" }}>
              <div className="flex size-20 items-center justify-center rounded-2xl bg-surface-container border-2 border-white/20 shadow-lg text-5xl overflow-hidden">
                {flag1}
              </div>
              <p className="text-label-caps font-label-caps text-on-surface uppercase text-center leading-tight max-w-[100px]">{match.team1}</p>
            </div>

            <div className="animate-fade-in-scale flex flex-col items-center gap-2" style={{ animationDelay: "150ms" }}>
              {match.score ? (
                <div className="flex items-center gap-4">
                  <span className="text-display-xl font-display-xl text-white">{match.score.ft[0]}</span>
                  <span className="text-display-xl font-display-xl text-outline-variant">:</span>
                  <span className="text-display-xl font-display-xl text-white">{match.score.ft[1]}</span>
                </div>
              ) : (
                <span className="text-display-xl font-display-xl text-on-surface-variant/40">VS</span>
              )}
              {isFinished && (
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-label-caps font-label-caps font-bold uppercase tracking-wider text-secondary">
                  Full Time
                </span>
              )}
              {match.score?.ht && (
                <span className="text-data-tabular font-data-tabular text-on-surface-variant tabular-nums">
                  HT {match.score.ht[0]} - {match.score.ht[1]}
                </span>
              )}
            </div>

            <div className="animate-slide-in-right flex flex-1 flex-col items-center gap-3" style={{ animationDelay: "200ms" }}>
              <div className="flex size-20 items-center justify-center rounded-2xl bg-surface-container border-2 border-white/20 shadow-lg text-5xl overflow-hidden">
                {flag2}
              </div>
              <p className="text-label-caps font-label-caps text-on-surface uppercase text-center leading-tight max-w-[100px]">{match.team2}</p>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="mx-6 mb-5 flex flex-col gap-2">
          <div className="animate-fade-in-up flex items-center gap-3 glass-card rounded-xl p-card-padding" style={{ animationDelay: "250ms" }}>
            <span className="material-symbols-outlined text-on-tertiary-container">schedule</span>
            <div className="flex flex-col">
              <span className="text-label-caps font-label-caps text-on-surface-variant uppercase">Date & Time</span>
              <span className="text-body-base font-body-base font-semibold mt-0.5 text-on-surface">{formatThaiDate(match.date)} · {formatThaiTime(match.time)}</span>
            </div>
          </div>
          <div className="animate-fade-in-up flex items-center gap-3 glass-card rounded-xl p-card-padding" style={{ animationDelay: "300ms" }}>
            <span className="material-symbols-outlined text-on-tertiary-container">stadium</span>
            <div className="flex flex-col">
              <span className="text-label-caps font-label-caps text-on-surface-variant uppercase">Venue</span>
              <span className="text-body-base font-body-base font-semibold mt-0.5 text-on-surface">{match.ground}</span>
            </div>
          </div>
        </div>

        {/* Goals */}
        {match.goals1 && match.goals1.length > 0 && (
          <div className="mx-6 mb-8">
            <h4 className="mb-3 text-label-caps font-label-caps text-on-surface-variant uppercase px-1">
              Goals
            </h4>
            <div className="animate-fade-in-up glass-card rounded-xl p-card-padding" style={{ animationDelay: "350ms" }}>
              <div className="flex flex-col gap-2.5">
                {match.goals1.map((g, i) => (
                  <div
                    key={`g1-${i}`}
                    className="animate-slide-in-right flex items-center justify-between"
                    style={{ animationDelay: `${400 + i * 60}ms` }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{flag1}</span>
                      <span className="text-body-base font-body-base font-semibold text-on-surface">{g.name}</span>
                    </div>
                    <span className="text-data-tabular font-data-tabular font-bold tabular-nums text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                      {g.minute}'
                    </span>
                  </div>
                ))}
                {match.goals2?.map((g, i) => (
                  <div
                    key={`g2-${i}`}
                    className="animate-slide-in-right flex items-center justify-between"
                    style={{ animationDelay: `${400 + ((match.goals1?.length ?? 0) + i) * 60}ms` }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{flag2}</span>
                      <span className="text-body-base font-body-base font-semibold text-on-surface">{g.name}</span>
                    </div>
                    <span className="text-data-tabular font-data-tabular font-bold tabular-nums text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                      {g.minute}'
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="h-8" />
      </div>
    </>
  )
}
