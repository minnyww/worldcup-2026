import { MatchCard } from './MatchCard'
import { matches } from '@/data'
import type { Match } from '@/data/types'

interface KnockoutScheduleProps {
  onMatchClick?: (match: Match) => void
}

export function KnockoutSchedule({ onMatchClick }: KnockoutScheduleProps) {
  const rounds = [
    'Round of 32',
    'Round of 16',
    'Quarter-final',
    'Semi-final',
    'Match for third place',
    'Final'
  ]

  const knockoutMatches = matches.filter(m =>
    rounds.includes(m.round)
  )

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-white">Knockout Stage</h3>
      {rounds.map(round => {
        const roundMatches = knockoutMatches.filter(m => m.round === round)
        if (roundMatches.length === 0) return null
        return (
          <div key={round} className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-green-400">{round}</h4>
            {roundMatches.map((match, i) => (
              <MatchCard key={i} match={match} onClick={() => onMatchClick?.(match)} />
            ))}
          </div>
        )
      })}
    </div>
  )
}
