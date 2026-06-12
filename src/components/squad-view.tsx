import { useState, useMemo } from "react"
import type { Team, Squad, Player } from "../types"
import { Search, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface SquadViewProps {
  squads: Squad[]
  teams: Team[]
}

function calcAge(dob: string): number {
  const birth = new Date(dob)
  const now = new Date("2026-06-11")
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

const FORMATION_442: { pos: string; x: number; y: number }[] = [
  { pos: "GK", x: 50, y: 90 },
  { pos: "LB", x: 12, y: 68 },
  { pos: "CB", x: 37, y: 72 },
  { pos: "CB", x: 63, y: 72 },
  { pos: "RB", x: 88, y: 68 },
  { pos: "LM", x: 15, y: 45 },
  { pos: "CM", x: 38, y: 50 },
  { pos: "CM", x: 62, y: 50 },
  { pos: "RM", x: 85, y: 45 },
  { pos: "ST", x: 37, y: 20 },
  { pos: "ST", x: 63, y: 20 },
]

function groupByPosition(players: Player[]) {
  const groups: Record<string, Player[]> = { GK: [], DF: [], MF: [], FW: [] }
  for (const p of players) {
    groups[p.pos]?.push(p)
  }
  return groups
}

function buildFormation(players: Player[]) {
  const grouped = groupByPosition(players)
  const formation: { player: Player; x: number; y: number }[] = []

  const gk = grouped.GK[0]
  if (gk) formation.push({ player: gk, x: 50, y: 90 })

  const defenders = grouped.DF
  const dCount = Math.min(defenders.length, 5)
  const dStartX = 50 - (dCount - 1) * 10
  defenders.slice(0, dCount).forEach((p, i) => {
    formation.push({ player: p, x: dStartX + i * 20, y: 72 })
  })

  const midfielders = grouped.MF
  const mCount = Math.min(midfielders.length, 5)
  const mStartX = 50 - (mCount - 1) * 10
  midfielders.slice(0, mCount).forEach((p, i) => {
    formation.push({ player: p, x: mStartX + i * 20, y: 48 })
  })

  const forwards = grouped.FW
  const fCount = Math.min(forwards.length, 4)
  const fStartX = 50 - (fCount - 1) * 12
  forwards.slice(0, fCount).forEach((p, i) => {
    formation.push({ player: p, x: fStartX + i * 24, y: 22 })
  })

  return { formation, grouped, extras: {
    GK: grouped.GK.slice(dCount > 0 ? 0 : 1),
    DF: grouped.DF.slice(dCount),
    MF: grouped.MF.slice(mCount),
    FW: grouped.FW.slice(fCount),
  }}
}

const POS_COLORS: Record<string, string> = {
  GK: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  DF: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  MF: "bg-green-500/20 text-green-400 border-green-500/40",
  FW: "bg-red-500/20 text-red-400 border-red-500/40",
}

const POS_BG: Record<string, string> = {
  GK: "bg-yellow-500",
  DF: "bg-blue-500",
  MF: "bg-green-500",
  FW: "bg-red-500",
}

export function SquadView({ squads, teams }: SquadViewProps) {
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
  const teamFlag = teams.find((t) => t.name === selectedTeam)?.flag_icon ?? ""

  if (squad) {
    const { formation, grouped, extras } = buildFormation(squad.players)
    const hasExtras = extras.DF.length + extras.MF.length + extras.FW.length > 0

    return (
      <div className="flex flex-col gap-4 px-4 pt-4">
        <button
          onClick={() => setSelectedTeam(null)}
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

        {/* Pitch Formation */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-green-900/50 bg-gradient-to-b from-[#1a5c2a] to-[#145a22]">
          {/* Field markings */}
          <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="0" y="0" width="100" height="100" fill="none" stroke="white" strokeWidth="0.3" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="9.15" fill="none" stroke="white" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="0.5" fill="white" />
            <rect x="0" y="30" width="16.5" height="40" fill="none" stroke="white" strokeWidth="0.2" />
            <rect x="83.5" y="30" width="16.5" height="40" fill="none" stroke="white" strokeWidth="0.2" />
            <rect x="0" y="37" width="5.5" height="26" fill="none" stroke="white" strokeWidth="0.2" />
            <rect x="94.5" y="37" width="5.5" height="26" fill="none" stroke="white" strokeWidth="0.2" />
            <path d="M 16.5 40.85 A 9.15 9.15 0 0 1 16.5 59.15" fill="none" stroke="white" strokeWidth="0.2" />
            <path d="M 83.5 40.85 A 9.15 9.15 0 0 0 83.5 59.15" fill="none" stroke="white" strokeWidth="0.2" />
          </svg>

          <div className="relative h-[320px]">
            {formation.map(({ player, x, y }, i) => (
              <div
                key={player.number}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 transition-all hover:scale-110 hover:z-10"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className={cn(
                  "flex size-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg",
                  POS_BG[player.pos]
                )}>
                  {player.number}
                </div>
                <span className="max-w-[72px] truncate rounded-full bg-black/60 px-1.5 py-0.5 text-[8px] font-medium text-white backdrop-blur-sm">
                  {player.name.split(" ").pop()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bench / Reserves */}
        {hasExtras && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground">Bench</h3>
            <div className="flex flex-wrap gap-1.5">
              {(["GK", "DF", "MF", "FW"] as const).map((pos) =>
                extras[pos].map((p) => (
                  <div
                    key={p.number}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-2 py-1",
                      POS_COLORS[p.pos]
                    )}
                  >
                    <span className="text-[10px] font-bold">{p.number}</span>
                    <span className="text-[10px] font-medium">{p.name.split(" ").pop()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Full Squad List */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase text-muted-foreground">Full Squad</h3>
          <div className="grid grid-cols-2 gap-2">
            {squad.players
              .slice()
              .sort((a, b) => a.number - b.number)
              .map((player) => (
                <div
                  key={player.number}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <div className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                    POS_BG[player.pos]
                  )}>
                    {player.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{player.name}</p>
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "rounded-full px-1.5 py-0 text-[9px] font-bold",
                        POS_COLORS[player.pos]
                      )}>
                        {player.pos}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {calcAge(player.date_of_birth)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
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
