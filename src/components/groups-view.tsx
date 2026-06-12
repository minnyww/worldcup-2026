import { useState, useMemo } from "react"
import type { Match, Team } from "../types"
import { MatchCard } from "./match-card"
import { cn } from "@/lib/utils"

interface GroupsViewProps {
  groups: { name: string; teams: string[] }[]
  teams: Team[]
  matches: Match[]
  onMatchSelect: (match: Match) => void
}

function getTeamFlag(teamName: string, teams: Team[]): string {
  const team = teams.find((t) => t.name === teamName)
  return team?.flag_icon ?? "🏳️"
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
  groupTeams: string[],
  allMatches: Match[],
  groupName: string,
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
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.name ?? "")

  const currentGroup = groups.find((g) => g.name === selectedGroup)
  const standings = useMemo(() => {
    if (!currentGroup) return []
    return computeStandings(currentGroup.teams, matches, currentGroup.name, teams)
  }, [currentGroup, matches, teams])

  const groupMatches = useMemo(() => {
    if (!currentGroup) return []
    return matches.filter((m) => m.group === currentGroup.name)
  }, [currentGroup, matches])

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <section className="mb-8">
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile mb-6 uppercase tracking-tight">Tournament Standings</h2>

        {/* Group Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 -mx-container-margin px-container-margin">
          {groups.map((group) => {
            const isActive = group.name === selectedGroup
            return (
              <button
                key={group.name}
                onClick={() => setSelectedGroup(group.name)}
                className={cn(
                  "flex-shrink-0 px-6 py-2 rounded-full text-label-caps font-label-caps transition-colors",
                  isActive
                    ? "bg-tertiary-container text-tertiary border border-tertiary/20 shadow-[0_0_15px_rgba(173,198,255,0.2)]"
                    : "bg-white/5 text-on-surface-variant hover:bg-white/10"
                )}
              >
                {group.name.replace("Group ", "GROUP ")}
              </button>
            )
          })}
        </div>
      </section>

      {/* Standings Table Container */}
      <div className="glass-card rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="py-4 px-4 text-label-caps font-label-caps opacity-60">POS</th>
                <th className="py-4 px-4 text-label-caps font-label-caps opacity-60">TEAM</th>
                <th className="py-4 px-2 text-label-caps font-label-caps opacity-60 text-center">P</th>
                <th className="py-4 px-2 text-label-caps font-label-caps opacity-60 text-center">W</th>
                <th className="py-4 px-2 text-label-caps font-label-caps opacity-60 text-center">D</th>
                <th className="py-4 px-2 text-label-caps font-label-caps opacity-60 text-center">L</th>
                <th className="py-4 px-2 text-label-caps font-label-caps opacity-60 text-center">GD</th>
                <th className="py-4 px-4 text-label-caps font-label-caps text-on-tertiary-container text-right">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {standings.map((s, i) => {
                const isQualified = i < 2
                return (
                  <tr
                    key={s.team}
                    className={cn(
                      "group transition-all duration-300 hover:bg-white/5",
                      isQualified && "qualification-gradient"
                    )}
                  >
                    <td className="py-5 px-4">
                      <span className={cn(
                        "text-data-tabular font-data-tabular w-6 h-6 flex items-center justify-center rounded-sm",
                        isQualified
                          ? i === 0
                            ? "bg-on-tertiary-container text-white"
                            : "bg-on-tertiary-container/80 text-white"
                          : "text-on-surface-variant"
                      )}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-5 flex items-center justify-center text-lg overflow-hidden rounded-sm border border-white/10 bg-surface-container">
                          {s.flag}
                        </div>
                        <span className={cn(
                          "text-title-md font-title-md uppercase tracking-tight",
                          isQualified ? "" : "text-on-surface-variant"
                        )}>
                          {s.team}
                        </span>
                      </div>
                    </td>
                    <td className={cn("py-5 px-2 text-data-tabular font-data-tabular text-center", isQualified ? "" : "text-on-surface-variant")}>{s.played}</td>
                    <td className={cn("py-5 px-2 text-data-tabular font-data-tabular text-center", isQualified ? "" : "text-on-surface-variant")}>{s.won}</td>
                    <td className={cn("py-5 px-2 text-data-tabular font-data-tabular text-center", isQualified ? "" : "text-on-surface-variant")}>{s.drawn}</td>
                    <td className={cn("py-5 px-2 text-data-tabular font-data-tabular text-center", isQualified ? "" : "text-on-surface-variant")}>{s.lost}</td>
                    <td className={cn(
                      "py-5 px-2 text-data-tabular font-data-tabular text-center",
                      s.gd > 0 ? "text-on-tertiary-container" : s.gd < 0 ? "text-error" : isQualified ? "" : "text-on-surface-variant"
                    )}>
                      {s.gd > 0 ? `+${s.gd}` : s.gd}
                    </td>
                    <td className={cn("py-5 px-4 text-data-tabular font-data-tabular font-bold text-right text-lg", isQualified ? "" : "text-on-surface-variant")}>{s.pts}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="bg-white/5 px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-on-tertiary-container shadow-[0_0_8px_rgba(53,125,241,0.8)]"></div>
            <span className="text-label-caps font-label-caps text-[10px] uppercase opacity-60">Round of 32 Qualification</span>
          </div>
        </div>
      </div>

      {/* Legend Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-card-padding flex items-start gap-4">
          <span className="material-symbols-outlined text-on-tertiary-container">info</span>
          <div>
            <h4 className="text-label-caps font-label-caps mb-1">Tie-breaker Rules</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">Goal difference, goals scored, and head-to-head results determine rankings if points are equal.</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-card-padding flex items-start gap-4">
          <span className="material-symbols-outlined text-secondary">trending_up</span>
          <div>
            <h4 className="text-label-caps font-label-caps mb-1">Group Momentum</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {standings.length >= 2 && `${standings[0].team} leads the group. ${standings[1].team} in second place.`}
            </p>
          </div>
        </div>
      </div>

      {/* Group Matches */}
      <div className="flex flex-col gap-3">
        <h3 className="text-title-md font-title-md uppercase tracking-tight">{selectedGroup} Matches</h3>
        {groupMatches.map((match, i) => (
          <MatchCard
            key={`${selectedGroup}-${i}`}
            match={match}
            teams={teams}
            onClick={() => onMatchSelect(match)}
            delay={i * 50}
          />
        ))}
      </div>
    </div>
  )
}
