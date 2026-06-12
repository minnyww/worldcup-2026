import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "worldcup-favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // localStorage not available
    }
  }, [favorites])

  const toggleFavorite = useCallback((teamName: string) => {
    setFavorites((prev) =>
      prev.includes(teamName)
        ? prev.filter((t) => t !== teamName)
        : [...prev, teamName]
    )
  }, [])

  const isFavorite = useCallback(
    (teamName: string) => favorites.includes(teamName),
    [favorites]
  )

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  return { favorites, toggleFavorite, isFavorite, clearFavorites }
}
