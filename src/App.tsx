import { useState, useMemo } from "react"
import matches from "./data/matches.json"
import teams from "./data/teams.json"
import groups from "./data/groups.json"
import { CalendarView } from "./components/calendar-view"
import { TeamView } from "./components/team-view"
import { GroupsView } from "./components/groups-view"
import { MatchDetailSheet } from "./components/match-detail-sheet"
import type { Match, Team } from "./types"
import { Calendar, Users, Trophy } from "lucide-react"

type View = "calendar" | "teams" | "groups"
type MatchType = "all" | "group" | "knockout"

const allMatches = matches as Match[]
const allTeams = teams as Team[]
const allGroups = groups as { name: string; teams: string[] }[]

export function App() {
  const [view, setView] = useState<View>("calendar")
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  )
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [matchFilter, setMatchFilter] = useState<MatchType>("all")
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const sortedMatches = useMemo(
    () =>
      [...allMatches].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    []
  )

  const dateRange = useMemo(() => {
    const dates = [...new Set(sortedMatches.map((m) => m.date))].sort()
    return dates
  }, [sortedMatches])

  return (
    <div className="dark flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight">
              FIFA World Cup
            </h1>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Mexico 2026
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 pb-20">
        {view === "calendar" && (
          <CalendarView
            matches={sortedMatches}
            teams={allTeams}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            matchFilter={matchFilter}
            onFilterChange={setMatchFilter}
            dateRange={dateRange}
            onMatchSelect={setSelectedMatch}
          />
        )}
        {view === "teams" && (
          <TeamView
            matches={sortedMatches}
            teams={allTeams}
            selectedTeam={selectedTeam}
            onTeamSelect={setSelectedTeam}
            onMatchSelect={setSelectedMatch}
          />
        )}
        {view === "groups" && (
          <GroupsView
            groups={allGroups}
            teams={allTeams}
            matches={sortedMatches}
            onMatchSelect={setSelectedMatch}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg">
          {(
            [
              { key: "calendar", label: "Schedule", icon: Calendar },
              { key: "teams", label: "Teams", icon: Users },
              { key: "groups", label: "Groups", icon: Trophy },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                view === key
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-5" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <MatchDetailSheet
        match={selectedMatch}
        teams={allTeams}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  )
}

export default App
