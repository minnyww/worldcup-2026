import { useState, useCallback, useEffect } from "react"
import { useWorldCupData } from "./hooks/useWorldCupData"
import { CalendarView } from "./components/calendar-view"
import { TeamView } from "./components/team-view"
import { GroupsView } from "./components/groups-view"
import { SquadView } from "./components/squad-view"
import { MatchDetailSheet } from "./components/match-detail-sheet"
import type { Match } from "./types"
import { cn } from "@/lib/utils"

type View = "calendar" | "teams" | "groups" | "squads"

const tabs: { key: View; label: string; icon: string }[] = [
  { key: "calendar", label: "Scores", icon: "sports_soccer" },
  { key: "groups", label: "Groups", icon: "format_list_numbered" },
  { key: "squads", label: "Squads", icon: "groups" },
]

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tertiary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-container/5 blur-[100px] rounded-full" />
      </div>
      <div className="animate-bounce-in flex flex-col items-center gap-4 relative z-10">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-tertiary-container border border-tertiary/20 shadow-[0_0_24px_rgba(53,125,241,0.3)]">
          <span className="material-symbols-outlined text-4xl text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-headline-lg-mobile font-headline-lg-mobile tracking-tighter text-white uppercase">World Cup</h1>
          <p className="text-label-caps font-label-caps text-tertiary tracking-widest">2026</p>
        </div>
      </div>
      <div className="absolute bottom-12 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="size-1.5 rounded-full bg-tertiary/40 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export function App() {
  const { teams, matches, groups, squads, loading, error } = useWorldCupData()
  const [showSplash, setShowSplash] = useState(true)

  const [view, setView] = useState<View>("calendar")
  const [selectedDate, setSelectedDate] = useState<string>("2026-06-11")
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [matchFilter, setMatchFilter] = useState<"all" | "group" | "knockout">("all")
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [sheetClosing, setSheetClosing] = useState(false)

  const dateRange = [...new Set(matches.map((m) => m.date))].sort()

  const handleViewChange = useCallback((newView: View) => {
    setView(newView)
  }, [])

  const handleCloseSheet = useCallback(() => {
    setSheetClosing(true)
    setTimeout(() => {
      setSelectedMatch(null)
      setSheetClosing(false)
    }, 280)
  }, [])

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tertiary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-container/5 blur-[100px] rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="relative">
            <div className="size-16 rounded-2xl bg-tertiary-container flex items-center justify-center animate-glow-pulse border border-tertiary/20">
              <span className="material-symbols-outlined text-2xl text-tertiary">sports_soccer</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-body-base font-body-base font-semibold tracking-tight text-on-surface">World Cup 2026</p>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="size-1.5 rounded-full bg-tertiary animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tertiary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-container/5 blur-[100px] rounded-full" />
        </div>
        <div className="animate-fade-in-scale flex flex-col items-center gap-6 text-center relative z-10">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-error-container/20">
            <span className="material-symbols-outlined text-2xl text-error">error</span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-title-md font-title-md text-on-surface">Connection Error</p>
            <p className="text-body-base font-body-base text-on-surface-variant max-w-[240px]">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl electric-gradient px-8 py-3 text-label-caps font-label-caps text-on-tertiary transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background relative">
      {/* Background atmospheric effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tertiary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-container/5 blur-[100px] rounded-full" />
      </div>

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-container-margin h-16 shadow-[0_4px_24px_rgba(53,125,241,0.15)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary overflow-hidden border border-white/20">
            <div className="w-full h-full bg-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-xs text-tertiary">person</span>
            </div>
          </div>
          <h1 className="text-headline-lg-mobile font-headline-lg-mobile tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-tertiary to-on-tertiary-container uppercase">
            WORLD CUP 2026
          </h1>
        </div>
        <div className="flex items-center">
          <span className="px-3 py-1 rounded-full sunset-gradient text-[10px] font-extrabold tracking-widest text-white animate-pulse">LIVE</span>
        </div>
      </header>

      <main className="mt-20 flex-1 pb-24 px-container-margin space-y-8">
        <div key={view} className="animate-fade-in-up">
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
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-surface-container/90 backdrop-blur-2xl flex justify-around items-center px-4 pb-safe z-50 border-t border-white/5 rounded-t-xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
        {tabs.map(({ key, label, icon }) => {
          const isActive = view === key
          return (
            <button
              key={key}
              onClick={() => handleViewChange(key)}
              className={cn(
                "flex flex-col items-center justify-center transition-all active:scale-90 duration-150",
                isActive
                  ? "bg-tertiary-container text-tertiary rounded-xl px-4 py-1.5 shadow-[0_0_15px_rgba(173,198,255,0.3)]"
                  : "text-on-surface-variant opacity-60 hover:opacity-100"
              )}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span className="text-label-caps font-label-caps mt-1 uppercase">{label}</span>
            </button>
          )
        })}
      </nav>

      {selectedMatch && (
        <MatchDetailSheet
          match={selectedMatch}
          teams={teams}
          onClose={handleCloseSheet}
          closing={sheetClosing}
        />
      )}
    </div>
  )
}

export default App
