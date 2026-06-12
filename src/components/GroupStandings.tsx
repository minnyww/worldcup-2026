import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getFlagEmoji, getGroupTeams, getGroupsList } from '@/data'
import { groups } from '@/data'

interface GroupStandingsProps {
  selectedGroup: string | null
  onGroupSelect: (group: string) => void
}

export function GroupStandings({ selectedGroup, onGroupSelect }: GroupStandingsProps) {
  const groupNames = getGroupsList()
  const displayGroups = selectedGroup
    ? groupNames.filter(g => g === selectedGroup)
    : groupNames

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {groupNames.map(group => (
          <button
            key={group}
            onClick={() => onGroupSelect(group === selectedGroup ? null : group)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              selectedGroup === group
                ? 'bg-green-500 text-white'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            }`}
          >
            {group.replace('Group ', '')}
          </button>
        ))}
      </div>
      {displayGroups.map(groupName => {
        const teamNames = getGroupTeams(groupName)
        const group = groups.find(g => g.name === groupName)
        return (
          <Card key={groupName} className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-green-400">{groupName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 text-[10px] font-medium text-muted-foreground">
                  <span>Team</span>
                  <span className="text-center">P</span>
                  <span className="text-center">W</span>
                  <span className="text-center">D</span>
                  <span className="text-center">L</span>
                </div>
                {teamNames.map(team => (
                  <div key={team} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 items-center rounded-lg py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getFlagEmoji(team)}</span>
                      <span className="text-xs font-medium truncate">{team}</span>
                    </div>
                    <span className="text-center text-xs text-muted-foreground">0</span>
                    <span className="text-center text-xs text-muted-foreground">0</span>
                    <span className="text-center text-xs text-muted-foreground">0</span>
                    <span className="text-center text-xs text-muted-foreground">0</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
