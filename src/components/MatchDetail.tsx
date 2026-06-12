import { getFlagEmoji, getRoundLabel, getStadiumForCity } from '@/data'
import type { Match } from '@/data/types'
import { X, MapPin, Clock } from 'lucide-react'

interface MatchDetailProps {
  match: Match
  onClose: () => void
}

export function MatchDetail({ match, onClose }: MatchDetailProps) {
  const isFinished = !!match.score
  const stadium = getStadiumForCity(match.ground)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-3xl bg-[#1a2a1a] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-medium text-green-400">
            {getRoundLabel(match.round, match.group)}
          </span>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-white/10">
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <div className="mb-6 flex items-center justify-around">
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl">{getFlagEmoji(match.team1)}</span>
            <span className="text-sm font-bold text-white text-center">{match.team1}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            {isFinished ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-green-400">{match.score!.ft[0]}</span>
                  <span className="text-xl text-muted-foreground">:</span>
                  <span className="text-3xl font-black text-green-400">{match.score!.ft[1]}</span>
                </div>
                {match.score?.ht && (
                  <span className="text-xs text-muted-foreground">
                    HT: {match.score.ht[0]}:{match.score.ht[1]}
                  </span>
                )}
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-bold text-green-400">
                  FT
                </span>
              </>
            ) : (
              <>
                <span className="text-lg font-bold text-muted-foreground">VS</span>
                <div className="flex items-center gap-1">
                  <Clock className="size-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{match.time}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl">{getFlagEmoji(match.team2)}</span>
            <span className="text-sm font-bold text-white text-center">{match.team2}</span>
          </div>
        </div>

        {match.goals1 && match.goals1.length > 0 && (
          <div className="mb-4 rounded-xl bg-white/5 p-3">
            <p className="mb-1 text-[10px] font-bold text-green-400">{match.team1}</p>
            <div className="flex flex-wrap gap-1">
              {match.goals1.map((g, i) => (
                <span key={i} className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] text-green-300">
                  {g.name} {g.minute}&apos;
                </span>
              ))}
            </div>
          </div>
        )}
        {match.goals2 && match.goals2.length > 0 && (
          <div className="mb-4 rounded-xl bg-white/5 p-3">
            <p className="mb-1 text-[10px] font-bold text-white">{match.team2}</p>
            <div className="flex flex-wrap gap-1">
              {match.goals2.map((g, i) => (
                <span key={i} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-muted-foreground">
                  {g.name} {g.minute}&apos;
                </span>
              ))}
            </div>
          </div>
        )}

        {stadium && (
          <div className="flex items-center gap-2 rounded-xl bg-white/5 p-3">
            <MapPin className="size-4 text-green-400" />
            <div>
              <p className="text-xs font-medium text-white">{stadium.name}</p>
              <p className="text-[10px] text-muted-foreground">{match.ground} • {stadium.capacity.toLocaleString()} seats</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
