import { useMemo } from "react"
import type { Match, Team } from "../types"
import { MatchCard } from "./match-card"

interface GroupsViewProps {
  groups: { name: string; teams: string[] }[]
  teams: Team[]
  matches: Match[]
  onMatchSelect: (match: Match) => void
}

function getTeamFlag(teamName: string, teams: Team[]): string {
  return teams.find((t) => t.name === teamName)?.flag_icon ?? ""
}

interface Standing {
  team: string
  flag: string
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  pts: number
}

function computeStandings(
  groupName: string,
  groupTeams: string[],
  allMatches: Match[],
  allTeams: Team[]
): Standing[] {
  const standings: Standing[] = groupTeams.map((name) => ({
    team: name,
    flag: getTeamFlag(name, allTeams),
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    pts: 0,
  }))

  const groupMatches = allMatches.filter((m) => m.group === groupName && m.score)

  for (const match of groupMatches) {
    const s1 = standings.find((s) => s.team === match.team1)
    const s2 = standings.find((s) => s.team === match.team2)
    if (!s1 || !s2) continue

    const [g1, g2] = match.score!.ft
    s1.played++
    s2.played++
    s1.gf += g1
    s1.ga += g2
    s2.gf += g2
    s2.ga += g1
    s1.gd = s1.gf - s1.ga
    s2.gd = s2.gf - s2.ga

    if (g1 > g2) {
      s1.won++
      s1.pts += 3
      s2.lost++
    } else if (g1 < g2) {
      s2.won++
      s2.pts += 3
      s1.lost++
    } else {
      s1.drawn++
      s2.drawn++
      s1.pts += 1
      s2.pts += 1
    }
  }

  standings.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
  return standings
}

export function GroupsView({
  groups,
  teams,
  matches,
  onMatchSelect,
}: GroupsViewProps) {
  return (
    <div className="flex flex-col gap-6 px-4 pt-4">
      {groups.map((group) => {
        const standings = computeStandings(
          group.name,
          group.teams,
          matches,
          teams
        )
        const groupMatches = matches.filter((m) => m.group === group.name)

        return (
          <div key={group.name} className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-primary">{group.name}</h3>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="px-3 py-2 text-left font-medium">Team</th>
                    <th className="px-2 py-2 text-center font-medium">P</th>
                    <th className="px-2 py-2 text-center font-medium">W</th>
                    <th className="px-2 py-2 text-center font-medium">D</th>
                    <th className="px-2 py-2 text-center font-medium">L</th>
                    <th className="px-2 py-2 text-center font-medium">GD</th>
                    <th className="px-3 py-2 text-center font-bold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((s, i) => (
                    <tr
                      key={s.team}
                      className={`border-b border-border/50 ${i < 2 ? "bg-primary/5" : ""}`}
                    >
                      <td className="flex items-center gap-2 px-3 py-2">
                        <span className="text-base">{s.flag}</span>
                        <span className="font-medium truncate max-w-[100px]">
                          {s.team}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center tabular-nums">
                        {s.played}
                      </td>
                      <td className="px-2 py-2 text-center tabular-nums">
                        {s.won}
                      </td>
                      <td className="px-2 py-2 text-center tabular-nums">
                        {s.drawn}
                      </td>
                      <td className="px-2 py-2 text-center tabular-nums">
                        {s.lost}
                      </td>
                      <td className="px-2 py-2 text-center tabular-nums">
                        {s.gd > 0 ? `+${s.gd}` : s.gd}
                      </td>
                      <td className="px-3 py-2 text-center font-bold tabular-nums">
                        {s.pts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2">
              {groupMatches.map((match, i) => (
                <MatchCard
                  key={`${group.name}-${i}`}
                  match={match}
                  teams={teams}
                  onClick={() => onMatchSelect(match)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
