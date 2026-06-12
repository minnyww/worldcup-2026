import { useState, useMemo } from "react"
import type { Team, Squad } from "../types"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { Search, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface SquadViewProps {
  squads: Squad[]
  teams: Team[]
}

const POS_COLORS: Record<string, string> = {
  GK: "bg-yellow-500/20 text-yellow-400",
  DF: "bg-blue-500/20 text-blue-400",
  MF: "bg-green-500/20 text-green-400",
  FW: "bg-red-500/20 text-red-400",
}

const POS_LABELS: Record<string, string> = {
  GK: "Goalkeeper",
  DF: "Defender",
  MF: "Midfielder",
  FW: "Forward",
}

function calcAge(dob: string): number {
  const birth = new Date(dob)
  const now = new Date("2026-06-11")
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

export function SquadView({ squads, teams }: SquadViewProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [posFilter, setPosFilter] = useState<string | null>(null)

  const sortedSquads = useMemo(
    () =>
      [...squads].sort((a, b) => a.name.localeCompare(b.name)),
    [squads]
  )

  const filteredSquads = useMemo(() => {
    if (!search) return sortedSquads
    const q = search.toLowerCase()
    return sortedSquads.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.fifa_code.toLowerCase().includes(q)
    )
  }, [sortedSquads, search])

  const squad = squads.find((s) => s.name === selectedTeam)

  const filteredPlayers = useMemo(() => {
    if (!squad) return []
    if (!posFilter) return squad.players
    return squad.players.filter((p) => p.pos === posFilter)
  }, [squad, posFilter])

  const playersByPos = useMemo(() => {
    if (!squad) return { GK: [], DF: [], MF: [], FW: [] } as Record<string, typeof squad.players>
    const map: Record<string, typeof squad.players> = { GK: [], DF: [], MF: [], FW: [] }
    for (const p of squad.players) {
      map[p.pos]?.push(p)
    }
    return map
  }, [squad])

  const teamFlag = useMemo(() => {
    if (!selectedTeam) return ""
    return teams.find((t) => t.name === selectedTeam)?.flag_icon ?? ""
  }, [teams, selectedTeam])

  if (squad) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4">
        <button
          onClick={() => { setSelectedTeam(null); setPosFilter(null) }}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 self-start"
        >
          <ChevronLeft className="size-4" />
          All Teams
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <span className="text-4xl">{teamFlag}</span>
          <div>
            <h2 className="text-lg font-bold">{squad.name}</h2>
            <p className="text-xs text-muted-foreground">
              {squad.group} &middot; {squad.players.length} players
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPosFilter(null)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              !posFilter
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {(["GK", "DF", "MF", "FW"] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => setPosFilter(posFilter === pos ? null : pos)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                posFilter === pos
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {POS_LABELS[pos]} ({playersByPos[pos].length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {filteredPlayers
            .slice()
            .sort((a, b) => a.number - b.number)
            .map((player) => (
              <div
                key={player.number}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                  {player.number}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{player.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0 text-[9px] font-bold",
                        POS_COLORS[player.pos]
                      )}
                    >
                      {player.pos}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {calcAge(player.date_of_birth)} yrs
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  }

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

      <div className="grid grid-cols-2 gap-2">
        {filteredSquads.map((s) => {
          const flag = teams.find((t) => t.name === s.name)?.flag_icon ?? ""
          return (
            <button
              key={s.fifa_code}
              onClick={() => setSelectedTeam(s.name)}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:bg-accent/10 active:scale-[0.98]"
            >
              <span className="text-3xl">{flag}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{s.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {s.group} &middot; {s.players.length} players
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
