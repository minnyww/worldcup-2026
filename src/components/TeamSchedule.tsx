import { MatchCard } from './MatchCard'
import { getMatchesByTeam, getGroupTeams, getGroupsList, getFlagEmoji } from '@/data'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { Match } from '@/data/types'

interface TeamScheduleProps {
  selectedGroup: string | null
  onGroupSelect: (group: string | null) => void
  onMatchClick?: (match: Match) => void
}

export function TeamSchedule({ selectedGroup, onGroupSelect, onMatchClick }: TeamScheduleProps) {
  const groupNames = getGroupsList()

  return (
    <div className="flex flex-col gap-4">
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-3">
          <button
            onClick={() => onGroupSelect(null)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              selectedGroup === null
                ? 'bg-green-500 text-white'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            }`}
          >
            All Groups
          </button>
          {groupNames.map(group => (
            <button
              key={group}
              onClick={() => onGroupSelect(group === selectedGroup ? null : group)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                selectedGroup === group
                  ? 'bg-green-500 text-white'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {selectedGroup ? (
        <div className="flex flex-col gap-4">
          {getGroupTeams(selectedGroup).map(teamName => {
            const teamMatches = getMatchesByTeam(teamName).filter(m => m.group === selectedGroup)
            return (
              <div key={teamName} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getFlagEmoji(teamName)}</span>
                  <span className="text-sm font-bold text-white">{teamName}</span>
                </div>
                {teamMatches.map((match, i) => (
                  <MatchCard key={i} match={match} onClick={() => onMatchClick?.(match)} />
                ))}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {groupNames.map(groupName => {
            const teamNames = getGroupTeams(groupName)
            return (
              <div key={groupName} className="flex flex-col gap-2">
                <h3 className="text-sm font-bold text-green-400">{groupName}</h3>
                {teamNames.map(teamName => {
                  const teamMatches = getMatchesByTeam(teamName).filter(m => m.group === groupName)
                  return (
                    <div key={teamName} className="flex flex-col gap-2">
                      {teamMatches.map((match, i) => (
                        <MatchCard key={i} match={match} onClick={() => onMatchClick?.(match)} />
                      ))}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
