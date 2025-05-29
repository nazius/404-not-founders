"use client"

import { useState, useEffect } from "react"

interface PinnedArticle {
  link: string
  title: string
  pinnedAt: number
}

export function usePinnedArticles() {
  const [pinnedArticles, setPinnedArticles] = useState<PinnedArticle[]>([])

  // Load pinned articles from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("devstream-pinned-articles")
      if (stored) {
        const parsed = JSON.parse(stored)
        setPinnedArticles(Array.isArray(parsed) ? parsed : [])
      }
    } catch (error) {
      console.error("Error loading pinned articles:", error)
      setPinnedArticles([])
    }
  }, [])

  // Save to localStorage whenever pinnedArticles changes
  useEffect(() => {
    try {
      localStorage.setItem("devstream-pinned-articles", JSON.stringify(pinnedArticles))
    } catch (error) {
      console.error("Error saving pinned articles:", error)
    }
  }, [pinnedArticles])

  const isPinned = (link: string): boolean => {
    return pinnedArticles.some((article) => article.link === link)
  }

  const togglePin = (link: string, title: string): void => {
    setPinnedArticles((prev) => {
      const existing = prev.find((article) => article.link === link)

      if (existing) {
        // Remove from pinned
        return prev.filter((article) => article.link !== link)
      } else {
        // Add to pinned
        return [...prev, { link, title, pinnedAt: Date.now() }]
      }
    })
  }

  const getPinnedLinks = (): string[] => {
    return pinnedArticles.map((article) => article.link)
  }

  return {
    pinnedArticles,
    isPinned,
    togglePin,
    getPinnedLinks,
  }
}
