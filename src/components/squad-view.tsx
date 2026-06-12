import { useState, useMemo } from "react"
import type { Team, Squad } from "../types"
import { cn } from "@/lib/utils"

interface SquadViewProps {
  squads: Squad[]
  teams: Team[]
  onToggleFavorite: (teamName: string) => void
  isFavorite: (teamName: string) => boolean
}

function calcAge(dob: string): number {
  const birth = new Date(dob)
  const now = new Date("2026-06-11")
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

const POS_BG: Record<string, string> = {
  GK: "bg-secondary",
  DF: "bg-tertiary",
  MF: "bg-on-tertiary-container",
  FW: "bg-error",
}

const POS_LABELS: Record<string, string> = {
  GK: "Goalkeepers",
  DF: "Defenders",
  MF: "Midfielders",
  FW: "Forwards",
}

export function SquadView({ squads, teams, onToggleFavorite, isFavorite }: SquadViewProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const sortedSquads = useMemo(
    () => [...squads].sort((a, b) => a.name.localeCompare(b.name)),
    [squads]
  )

  const filteredSquads = useMemo(() => {
    if (!search) return sortedSquads
    const q = search.toLowerCase()
    return sortedSquads.filter(
      (s) => s.name.toLowerCase().includes(q) || s.fifa_code.toLowerCase().includes(q)
    )
  }, [sortedSquads, search])

  const squad = squads.find((s) => s.name === selectedTeam)

  if (squad) {
    return (
      <div className="space-y-gutter">
        {/* Player list by position */}
        {(["GK", "DF", "MF", "FW"] as const).map((pos) => {
          const posPlayers = squad.players.filter(p => p.pos === pos)
          if (posPlayers.length === 0) return null

          return (
            <section key={pos}>
              <div className="flex items-center gap-3 mb-4">
                <span className={cn("w-1.5 h-6 rounded-full", POS_BG[pos])} />
                <h2 className="text-title-md font-title-md uppercase tracking-widest text-tertiary">{POS_LABELS[pos]}</h2>
              </div>
              <div className="space-y-2">
                {posPlayers
                  .slice()
                  .sort((a, b) => a.number - b.number)
                  .map((player) => (
                    <div
                      key={player.number}
                      className="glass-card rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-data-tabular font-data-tabular text-secondary text-lg w-6">{player.number}</span>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container border border-white/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant">person</span>
                        </div>
                        <div>
                          <h3 className="text-body-base font-body-base leading-none">{player.name}</h3>
                          <p className="text-on-surface-variant text-[12px] uppercase tracking-wider mt-1">Age {calcAge(player.date_of_birth)}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary transition-colors">chevron_right</span>
                    </div>
                  ))}
              </div>
            </section>
          )
        })}
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
          placeholder="Search squads..."
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

      {/* Squad cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredSquads.map((s) => {
          const fav = isFavorite(s.name)
          return (
            <div key={s.fifa_code} className="relative group">
              <button
                onClick={() => setSelectedTeam(s.name)}
                className="animate-fade-in-up relative w-full overflow-hidden glass-card rounded-xl p-4 text-left transition-transform active:scale-[0.97] hover:border-white/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-surface-container border border-white/10 transition-transform duration-300 group-hover:scale-110 text-2xl overflow-hidden">
                    {teams.find((t) => t.name === s.name)?.flag_icon ?? "🏳️"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-body-base font-body-base font-bold">{s.name}</p>
                    <p className="text-on-surface-variant text-[9px] mt-0.5 font-medium">
                      {s.players.length} players
                    </p>
                  </div>
                </div>
              </button>
              {/* Favorite button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(s.name)
                }}
                className={cn(
                  "absolute top-2 right-2 flex size-8 items-center justify-center rounded-full transition-all active:scale-90 z-10",
                  fav
                    ? "bg-error/20"
                    : "bg-surface-container/80"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-sm",
                    fav ? "text-error" : "text-on-surface-variant"
                  )}
                  style={fav ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  favorite
                </span>
              </button>
            </div>
          )
        })}
      </div>

      {filteredSquads.length === 0 && (
        <div className="animate-fade-in-scale flex flex-col items-center gap-3 py-16">
          <div className="flex size-14 items-center justify-center rounded-2xl glass-card">
            <span className="material-symbols-outlined text-xl text-on-surface-variant/50">groups</span>
          </div>
          <p className="text-body-base font-body-base text-on-surface-variant">No squads found</p>
        </div>
      )}
    </div>
  )
}
