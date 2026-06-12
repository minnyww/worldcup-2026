import { useState, useEffect } from "react"
import type { Team, Match, Group, Stadium, Squad } from "../types"
import {
  fetchTeams,
  fetchMatches,
  fetchGroups,
  fetchStadiums,
  fetchSquads,
} from "../api"

export interface WorldCupData {
  teams: Team[]
  matches: Match[]
  groups: Group[]
  stadiums: Stadium[]
  squads: Squad[]
  loading: boolean
  error: string | null
}

export function useWorldCupData(): WorldCupData {
  const [data, setData] = useState<WorldCupData>({
    teams: [],
    matches: [],
    groups: [],
    stadiums: [],
    squads: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [teams, matches, groups, stadiums, squads] = await Promise.all([
          fetchTeams(),
          fetchMatches(),
          fetchGroups(),
          fetchStadiums(),
          fetchSquads(),
        ])
        if (!cancelled) {
          setData({
            teams,
            matches: [...matches].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            ),
            groups,
            stadiums,
            squads,
            loading: false,
            error: null,
          })
        }
      } catch (err) {
        if (!cancelled) {
          setData((prev) => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : "Failed to load data",
          }))
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return data
}
