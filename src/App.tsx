import { useState } from "react"
import { useWorldCupData } from "./hooks/useWorldCupData"
import { CalendarView } from "./components/calendar-view"
import { TeamView } from "./components/team-view"
import { GroupsView } from "./components/groups-view"
import { SquadView } from "./components/squad-view"
import { MatchDetailSheet } from "./components/match-detail-sheet"
import type { Match } from "./types"
import { Calendar, Users, Trophy, Shirt } from "lucide-react"
import { cn } from "@/lib/utils"

type View = "calendar" | "teams" | "groups" | "squads"
type MatchType = "all" | "group" | "knockout"

const tabs: { key: View; label: string; icon: typeof Calendar }[] = [
  { key: "calendar", label: "Schedule", icon: Calendar },
  { key: "teams", label: "Teams", icon: Users },
  { key: "groups", label: "Groups", icon: Trophy },
  { key: "squads", label: "Squads", icon: Shirt },
]

export function App() {
  const { teams, matches, groups, squads, loading, error } =
    useWorldCupData()

  const [view, setView] = useState<View>("calendar")
  const [selectedDate, setSelectedDate] = useState<string>("2026-06-11")
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [matchFilter, setMatchFilter] = useState<MatchType>("all")
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const dateRange = [...new Set(matches.map((m) => m.date))].sort()

  if (loading) {
    return (
      <div className="dark flex min-h-svh flex-col items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Loading World Cup 2026 data...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dark flex min-h-svh flex-col items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

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
            matches={matches}
            teams={teams}
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
            matches={matches}
            teams={teams}
            selectedTeam={selectedTeam}
            onTeamSelect={setSelectedTeam}
            onMatchSelect={setSelectedMatch}
          />
        )}
        {view === "groups" && (
          <GroupsView
            groups={groups}
            teams={teams}
            matches={matches}
            onMatchSelect={setSelectedMatch}
          />
        )}
        {view === "squads" && (
          <SquadView squads={squads} teams={teams} />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                view === key
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-5" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <MatchDetailSheet
        match={selectedMatch}
        teams={teams}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  )
}

export default App
