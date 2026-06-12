import type { Team, Match } from "../types"
import { MatchCard } from "./match-card"

interface FavoriteViewProps {
  teams: Team[]
  matches: Match[]
  favorites: string[]
  onToggleFavorite: (teamName: string) => void
  onMatchSelect: (match: Match) => void
}

export function FavoriteView({
  teams,
  matches,
  favorites,
  onToggleFavorite,
  onMatchSelect,
}: FavoriteViewProps) {
  const favoriteTeams = teams.filter((t) => favorites.includes(t.name))

  const favoriteMatches = matches.filter(
    (m) => favorites.includes(m.team1) || favorites.includes(m.team2)
  )

  // Group matches by team
  const matchesByTeam = new Map<string, Match[]>()
  for (const teamName of favorites) {
    const teamMatches = favoriteMatches.filter(
      (m) => m.team1 === teamName || m.team2 === teamName
    )
    if (teamMatches.length > 0) {
      matchesByTeam.set(teamName, teamMatches)
    }
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex size-20 items-center justify-center rounded-full bg-tertiary-container border border-tertiary/20 mb-6">
          <span className="material-symbols-outlined text-3xl text-tertiary">favorite</span>
        </div>
        <h2 className="text-title-md font-title-md text-on-surface mb-2">No Favorite Teams</h2>
        <p className="text-body-base font-body-base text-on-surface-variant text-center max-w-[280px]">
          Go to Squads or Groups and tap the heart icon to add your favorite teams
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Favorite Teams Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-headline-lg-mobile font-headline-lg-mobile uppercase tracking-tight">
            My Teams
          </h2>
          <span className="text-label-caps font-label-caps text-on-surface-variant">
            {favorites.length} TEAMS
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-container-margin px-container-margin pb-2">
          {favoriteTeams.map((team) => (
            <div
              key={team.fifa_code}
              className="flex-shrink-0 flex flex-col items-center gap-2"
            >
              <div className="relative">
                <div className="flex size-16 items-center justify-center rounded-full bg-surface-container border-2 border-tertiary/30 text-3xl overflow-hidden shadow-[0_0_15px_rgba(173,198,255,0.2)]">
                  {team.flag_icon}
                </div>
                <button
                  onClick={() => onToggleFavorite(team.name)}
                  className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-error shadow-lg"
                >
                  <span className="material-symbols-outlined text-xs text-white" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </button>
              </div>
              <span className="text-label-caps font-label-caps text-on-surface-variant text-center max-w-[64px] truncate">
                {team.fifa_code}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Matches for Favorite Teams */}
      <section>
        <h3 className="text-title-md font-title-md uppercase tracking-tight mb-4">Upcoming Matches</h3>
        <div className="flex flex-col gap-3">
          {favoriteMatches
            .filter((m) => !m.score)
            .slice(0, 5)
            .map((match, i) => (
              <MatchCard
                key={`fav-upcoming-${i}`}
                match={match}
                teams={teams}
                onClick={() => onMatchSelect(match)}
                delay={i * 50}
              />
            ))}
          {favoriteMatches.filter((m) => !m.score).length === 0 && (
            <p className="text-body-base font-body-base text-on-surface-variant text-center py-8">
              No upcoming matches for your favorite teams
            </p>
          )}
        </div>
      </section>

      {/* Recent Results for Favorite Teams */}
      <section>
        <h3 className="text-title-md font-title-md uppercase tracking-tight mb-4">Recent Results</h3>
        <div className="flex flex-col gap-3">
          {favoriteMatches
            .filter((m) => m.score)
            .slice(-5)
            .reverse()
            .map((match, i) => (
              <MatchCard
                key={`fav-results-${i}`}
                match={match}
                teams={teams}
                onClick={() => onMatchSelect(match)}
                delay={i * 50}
              />
            ))}
          {favoriteMatches.filter((m) => m.score).length === 0 && (
            <p className="text-body-base font-body-base text-on-surface-variant text-center py-8">
              No results yet for your favorite teams
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
