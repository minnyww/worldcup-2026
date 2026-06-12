import type { Team, Match, Group, Stadium, Squad } from "./types"

const BASE =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026"

async function fetchJSON<T>(file: string): Promise<T> {
  const res = await fetch(`${BASE}/${file}`)
  if (!res.ok) throw new Error(`Failed to fetch ${file}: ${res.status}`)
  return res.json()
}

export async function fetchTeams(): Promise<Team[]> {
  return fetchJSON<Team[]>("worldcup.teams.json")
}

export async function fetchMatches(): Promise<Match[]> {
  const data = await fetchJSON<{ matches: Match[] }>("worldcup.json")
  return data.matches
}

export async function fetchGroups(): Promise<Group[]> {
  const data = await fetchJSON<{ name: string; groups: Group[] }>(
    "worldcup.groups.json"
  )
  return data.groups
}

export async function fetchStadiums(): Promise<Stadium[]> {
  const data = await fetchJSON<{ stadiums: Stadium[] }>("worldcup.stadiums.json")
  return data.stadiums
}

export async function fetchSquads(): Promise<Squad[]> {
  return fetchJSON<Squad[]>("worldcup.squads.json")
}
