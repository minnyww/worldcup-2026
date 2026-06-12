import teamsData from './teams.json'
import matchesData from './matches.json'
import groupsData from './groups.json'
import stadiumsData from './stadiums.json'
import type { Team, Match, Group, Stadium } from './types'

export const teams: Team[] = teamsData as Team[]
export const matches: Match[] = matchesData as Match[]
export const groups: Group[] = groupsData as Group[]
export const stadiums: Stadium[] = stadiumsData as Stadium[]

export function getTeamByName(name: string): Team | undefined {
  return teams.find(t => t.name === name)
}

export function getFlagEmoji(name: string): string {
  const team = getTeamByName(name)
  if (team) return team.flag_icon
  if (name.length <= 3) return '🏳️'
  if (name.startsWith('W') || name.startsWith('L')) return '⏳'
  return '🏳️'
}

export function getStadiumForCity(city: string): Stadium | undefined {
  return stadiums.find(s => s.city === city)
}

export function getUniqueDates(): string[] {
  const dates = new Set(matches.map(m => m.date))
  return Array.from(dates).sort()
}

export function getMatchesByDate(date: string): Match[] {
  return matches.filter(m => m.date === date)
}

export function getMatchesByTeam(teamName: string): Match[] {
  return matches.filter(m => m.team1 === teamName || m.team2 === teamName)
}

export function getMatchesByGroup(groupName: string): Match[] {
  return matches.filter(m => m.group === groupName)
}

export function getGroupsList(): string[] {
  return groups.map(g => g.name)
}

export function getGroupTeams(groupName: string): string[] {
  const group = groups.find(g => g.name === groupName)
  return group ? group.teams : []
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export function getRoundLabel(round: string, group: string): string {
  if (round.startsWith('Matchday')) return `${group} - ${round}`
  return round
}
