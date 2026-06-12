export interface Team {
  name: string
  continent: string
  flag_icon: string
  fifa_code: string
  group: string
  confed: string
}

export interface Match {
  round: string
  date: string
  time: string
  team1: string
  team2: string
  score?: { ft: number[]; ht: number[] }
  goals1?: { name: string; minute: string }[]
  goals2?: { name: string; minute: string }[]
  group: string
  ground: string
  num?: number
}

export interface Group {
  name: string
  teams: string[]
}

export interface Stadium {
  city: string
  timezone: string
  name: string
  capacity: number
}

export type ViewMode = 'home' | 'schedule' | 'teams' | 'groups'
