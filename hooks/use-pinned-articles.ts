"use client"

import { useState, useEffect, useCallback } from "react"

interface PinnedArticle {
  link: string
  title: string
  pinnedAt: number
}

const STORAGE_KEY = "devstream-pinned-articles"

export function usePinnedArticles() {
  const [pinnedArticles, setPinnedArticles] = useState<PinnedArticle[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load pinned articles from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setPinnedArticles(parsed)
        } else {
          // Handle legacy single item format
          setPinnedArticles([])
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch (error) {
      console.error("Error loading pinned articles:", error)
      setPinnedArticles([])
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage whenever pinnedArticles changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedArticles))
      } catch (error) {
        console.error("Error saving pinned articles:", error)
      }
    }
  }, [pinnedArticles, isLoaded])

  const isPinned = useCallback(
    (link: string): boolean => {
      return pinnedArticles.some((article) => article.link === link)
    },
    [pinnedArticles],
  )

  const togglePin = useCallback((link: string, title: string): void => {
    setPinnedArticles((prev) => {
      const existingIndex = prev.findIndex((article) => article.link === link)

      if (existingIndex !== -1) {
        // Remove from pinned - create new array without this item
        return prev.filter((_, index) => index !== existingIndex)
      } else {
        // Add to pinned - create new array with this item
        const newPinnedArticle: PinnedArticle = {
          link,
          title,
          pinnedAt: Date.now(),
        }
        return [...prev, newPinnedArticle]
      }
    })
  }, [])

  const getPinnedLinks = useCallback((): string[] => {
    return pinnedArticles.map((article) => article.link)
  }, [pinnedArticles])

  const clearAllPinned = useCallback((): void => {
    setPinnedArticles([])
  }, [])

  return {
    pinnedArticles,
    isPinned,
    togglePin,
    getPinnedLinks,
    clearAllPinned,
    isLoaded,
  }
}
