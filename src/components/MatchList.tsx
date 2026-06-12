import { MatchCard } from './MatchCard'
import { formatDateFull, getMatchesByDate } from '@/data'
import type { Match } from '@/data/types'

interface MatchListProps {
  selectedDate: string
  onMatchClick?: (match: Match) => void
}

export function MatchList({ selectedDate, onMatchClick }: MatchListProps) {
  const dayMatches = getMatchesByDate(selectedDate)

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-white">{formatDateFull(selectedDate)}</h3>
      {dayMatches.length === 0 ? (
        <div className="rounded-2xl bg-white/5 p-8 text-center">
          <p className="text-sm text-muted-foreground">No matches on this date</p>
        </div>
      ) : (
        dayMatches.map((match, i) => (
          <MatchCard key={i} match={match} onClick={() => onMatchClick?.(match)} />
        ))
      )}
    </div>
  )
}
