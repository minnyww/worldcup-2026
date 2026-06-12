import { getFlagEmoji, getMatchesByTeam, getTeamByName, formatDate, getStadiumForCity } from '@/data'
import { ChevronLeft } from 'lucide-react'
import type { Match } from '@/data/types'

interface TeamDetailProps {
  teamName: string
  onBack: () => void
  onMatchClick?: (match: Match) => void
}

export function TeamDetail({ teamName, onBack, onMatchClick }: TeamDetailProps) {
  const team = getTeamByName(teamName)
  const teamMatches = getMatchesByTeam(teamName)

  if (!team) return null

  const finished = teamMatches.filter(m => m.score)
  const upcoming = teamMatches.filter(m => !m.score)

  const wins = finished.filter(m => {
    const idx = m.team1 === teamName ? 0 : 1
    return m.score!.ft[idx] > m.score!.ft[1 - idx]
  }).length
  const draws = finished.filter(m => m.score!.ft[0] === m.score!.ft[1]).length
  const losses = finished.length - wins - draws
  const goalsFor = finished.reduce((sum, m) => {
    const idx = m.team1 === teamName ? 0 : 1
    return sum + m.score!.ft[idx]
  }, 0)
  const goalsAgainst = finished.reduce((sum, m) => {
    const idx = m.team1 === teamName ? 0 : 1
    return sum + m.score!.ft[1 - idx]
  }, 0)

  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300">
        <ChevronLeft className="size-4" />
        Back
      </button>

      <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
        <span className="text-5xl">{getFlagEmoji(teamName)}</span>
        <div>
          <h2 className="text-xl font-bold text-white">{teamName}</h2>
          <p className="text-xs text-muted-foreground">{team.group} • {team.confed}</p>
        </div>
      </div>

      {finished.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: 'P', value: finished.length },
            { label: 'W', value: wins },
            { label: 'D', value: draws },
            { label: 'L', value: losses },
            { label: 'GD', value: goalsFor - goalsAgainst },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center gap-1 rounded-xl bg-white/5 p-3">
              <span className="text-lg font-bold text-white">{stat.value > 0 && stat.label !== 'GD' ? stat.value : stat.value}</span>
              <span className="text-[10px] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-bold text-green-400">Upcoming</h3>
          {upcoming.map((match, i) => {
            const isHome = match.team1 === teamName
            const opponent = isHome ? match.team2 : match.team1
            const stadium = getStadiumForCity(match.ground)
            return (
              <button
                key={i}
                onClick={() => onMatchClick?.(match)}
                className="w-full text-left rounded-xl bg-white/5 p-3 transition-all hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getFlagEmoji(opponent)}</span>
                    <div>
                      <p className="text-xs font-medium">{isHome ? 'vs' : '@'} {opponent}</p>
                      <p className="text-[10px] text-muted-foreground">{formatDate(match.date)} • {match.time}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">
                      {match.group}
                    </span>
                    {stadium && (
                      <span className="text-[9px] text-muted-foreground mt-0.5">{stadium.name}</span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {finished.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-bold text-green-400">Results</h3>
          {finished.map((match, i) => {
            const isHome = match.team1 === teamName
            const opponent = isHome ? match.team2 : match.team1
            const idx = isHome ? 0 : 1
            const won = match.score!.ft[idx] > match.score!.ft[1 - idx]
            const drawn = match.score!.ft[0] === match.score!.ft[1]
            return (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getFlagEmoji(opponent)}</span>
                  <div>
                    <p className="text-xs font-medium">vs {opponent}</p>
                    <p className="text-[10px] text-muted-foreground">{formatDate(match.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${won ? 'text-green-400' : drawn ? 'text-yellow-400' : 'text-red-400'}`}>
                    {match.score!.ft[idx]}:{match.score!.ft[1 - idx]}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    won ? 'bg-green-500/20 text-green-400' : drawn ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {won ? 'W' : drawn ? 'D' : 'L'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
