import { useMemo, useState } from "react"
import type { Match, Team } from "../types"
import { MatchCard } from "./match-card"

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
      const key = m.group ? `Group ${m.group}` : m.round
      const arr = map.get(key) ?? []
      arr.push(m)
      map.set(key, arr)
    }
    return Array.from(map.entries())
  }, [teamMatches])

  const selectedTeamData = selectedTeam
    ? teams.find((t) => t.name === selectedTeam)
    : null

  if (selectedTeam) {
    return (
      <div className="space-y-gutter">
        {/* Team header */}
        <div className="animate-fade-in-up flex items-center gap-4">
          <button
            onClick={() => onTeamSelect(null)}
            className="flex size-10 items-center justify-center rounded-xl glass-card transition-all active:scale-90 hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <div className="flex items-center gap-3">
            {selectedTeamData && (
              <div className="flex size-12 items-center justify-center rounded-xl bg-tertiary-container border border-tertiary/20 text-3xl overflow-hidden">
                {selectedTeamData.flag_icon}
              </div>
            )}
            <div>
              <h2 className="text-headline-lg-mobile font-headline-lg-mobile uppercase tracking-tight text-on-surface">{selectedTeam}</h2>
              <p className="text-label-caps font-label-caps text-on-surface-variant font-extrabold uppercase tracking-[0.1em]">
                {teamMatches.length} matches
              </p>
            </div>
          </div>
        </div>

        {/* Matches */}
        <div className="flex flex-col gap-4">
          {groupedByRound.map(([round, roundMatches], ri) => (
            <div key={round} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                <span className="text-label-caps font-label-caps text-tertiary tracking-widest bg-tertiary/10 px-3 py-1 rounded-full border border-tertiary/20">{round}</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
              </div>
              {roundMatches.map((match, i) => (
                <MatchCard
                  key={`${round}-${i}`}
                  match={match}
                  teams={teams}
                  onClick={() => onMatchSelect(match)}
                  delay={(ri * 3 + i) * 60}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-gutter">
      {/* Search */}
      <div className="animate-fade-in-up relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-on-surface-variant">search</span>
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl glass-card py-3.5 pl-11 pr-11 text-body-base font-body-base text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-tertiary/25 focus:border-tertiary/40 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        )}
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-3 gap-2">
        {filteredTeams.map((team) => (
          <button
            key={team.fifa_code}
            onClick={() => onTeamSelect(team.name)}
            className="animate-fade-in-up group relative flex flex-col items-center gap-2 glass-card rounded-xl p-3 transition-transform active:scale-90 hover:border-white/30 overflow-hidden"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-surface-container border border-white/10 transition-transform duration-300 group-hover:scale-110 text-2xl">
              {team.flag_icon}
            </div>
            <span className="text-label-caps font-label-caps text-on-surface-variant group-hover:text-on-surface transition-colors uppercase">
              {team.fifa_code}
            </span>
          </button>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="animate-fade-in-scale flex flex-col items-center gap-3 py-16">
          <div className="flex size-14 items-center justify-center rounded-2xl glass-card">
            <span className="material-symbols-outlined text-xl text-on-surface-variant/50">groups</span>
          </div>
          <p className="text-body-base font-body-base text-on-surface-variant">No teams found</p>
        </div>
      )}
    </div>
  )
}
