import { useMemo, useState } from "react"
import type { Match, Team } from "../types"
import { MatchCard } from "./match-card"
import { Badge } from "./ui/badge"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

interface TeamViewProps {
  matches: Match[]
  teams: Team[]
  selectedTeam: string | null
  onTeamSelect: (team: string | null) => void
  onMatchSelect: (match: Match) => void
}

export function TeamView({
  matches,
  teams,
  selectedTeam,
  onTeamSelect,
  onMatchSelect,
}: TeamViewProps) {
  const [search, setSearch] = useState("")

  const filteredTeams = useMemo(() => {
    if (!search) return teams
    const q = search.toLowerCase()
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.fifa_code.toLowerCase().includes(q)
    )
  }, [teams, search])

  const teamMatches = useMemo(() => {
    if (!selectedTeam) return []
    return matches.filter(
      (m) => m.team1 === selectedTeam || m.team2 === selectedTeam
    )
  }, [matches, selectedTeam])

  const groupedByRound = useMemo(() => {
    const map = new Map<string, Match[]>()
    for (const m of teamMatches) {
      const key = m.group ? `Group Stage — ${m.group}` : m.round
      const arr = map.get(key) ?? []
      arr.push(m)
      map.set(key, arr)
    }
    return Array.from(map.entries())
  }, [teamMatches])

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filteredTeams.map((team) => (
          <button
            key={team.fifa_code}
            onClick={() =>
              onTeamSelect(selectedTeam === team.name ? null : team.name)
            }
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
              selectedTeam === team.name
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="text-base">{team.flag_icon}</span>
            {team.fifa_code}
          </button>
        ))}
      </div>

      {selectedTeam && (
        <div className="flex flex-col gap-2">
          {groupedByRound.map(([round, roundMatches]) => (
            <div key={round} className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                {round}
              </h3>
              {roundMatches.map((match, i) => (
                <MatchCard
                  key={`${round}-${i}`}
                  match={match}
                  teams={teams}
                  onClick={() => onMatchSelect(match)}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {!selectedTeam && (
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <p className="text-sm">Select a team to view their matches</p>
        </div>
      )}
    </div>
  )
}
