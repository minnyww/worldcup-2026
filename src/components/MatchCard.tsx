import { getFlagEmoji, getRoundLabel, getStadiumForCity } from '@/data'
import type { Match } from '@/data/types'

interface MatchCardProps {
  match: Match
  onClick?: () => void
}

export function MatchCard({ match, onClick }: MatchCardProps) {
  const isFinished = !!match.score
  const isKnockout = match.round.startsWith('Round of') || match.round.startsWith('Quarter') || match.round.startsWith('Semi') || match.round === 'Final' || match.round === 'Match for third place'
  const stadium = getStadiumForCity(match.ground)

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10 active:scale-[0.98]"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-green-400/80">
          {getRoundLabel(match.round, match.group)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {match.time}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2">
          <span className="text-2xl">{getFlagEmoji(match.team1)}</span>
          <span className="text-sm font-semibold truncate">{match.team1}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          {isFinished ? (
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-green-400">{match.score!.ft[0]}</span>
              <span className="text-xs text-muted-foreground">:</span>
              <span className="text-lg font-bold text-green-400">{match.score!.ft[1]}</span>
            </div>
          ) : (
            <span className="rounded-full bg-green-500/20 px-3 py-0.5 text-[10px] font-bold text-green-400">
              VS
            </span>
          )}
          {isFinished && match.score?.ht && (
            <span className="text-[10px] text-muted-foreground">
              HT: {match.score.ht[0]}:{match.score.ht[1]}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate">{match.team2}</span>
            <span className="text-2xl">{getFlagEmoji(match.team2)}</span>
          </div>
        </div>
      </div>
      {stadium && (
        <div className="mt-2 text-center">
          <span className="text-[10px] text-muted-foreground">
            {stadium.name}
          </span>
        </div>
      )}
      {match.goals1 && match.goals1.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {match.goals1.map((g, i) => (
            <span key={i} className="rounded-full bg-green-500/10 px-2 py-0.5 text-[9px] text-green-300">
              {g.name} {g.minute}&apos;
            </span>
          ))}
          {match.goals2 && match.goals2.map((g, i) => (
            <span key={i} className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-muted-foreground">
              {g.name} {g.minute}&apos;
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
