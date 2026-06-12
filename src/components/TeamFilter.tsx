import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { teams, getGroupsList } from '@/data'

interface TeamFilterProps {
  selectedTeam: string | null
  onTeamSelect: (team: string | null) => void
}

export function TeamFilter({ selectedTeam, onTeamSelect }: TeamFilterProps) {
  const groupNames = getGroupsList()

  return (
    <div className="flex flex-col gap-3">
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-3">
          <button
            onClick={() => onTeamSelect(null)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              selectedTeam === null
                ? 'bg-green-500 text-white'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            }`}
          >
            All Teams
          </button>
          {groupNames.map(group => (
            <button
              key={group}
              onClick={() => onTeamSelect(group)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                selectedTeam === group
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
    </div>
  )
}
