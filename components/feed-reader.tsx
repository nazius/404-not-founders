"use client"

import { useState, useEffect } from "react"
import { FeedSelector } from "./feed-selector"
import { SearchBar } from "./search-bar"
import { ArticleList } from "./article-list"
import { RefreshButton } from "./refresh-button"
import { parseRssFeed } from "@/lib/rss-parser"
import type { Article, FeedType } from "@/lib/types"
import { usePinnedArticles } from "@/hooks/use-pinned-articles"

export function FeedReader() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [selectedFeeds, setSelectedFeeds] = useState<FeedType[]>(["dev"])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getPinnedLinks, pinnedArticles, isLoaded } = usePinnedArticles()

  const sortArticlesWithPinned = (articles: Article[]): Article[] => {
    if (!isLoaded) return articles // Don't sort until pinned data is loaded

    const pinnedLinks = getPinnedLinks()
    const pinned = articles.filter((article) => pinnedLinks.includes(article.link))
    const unpinned = articles.filter((article) => !pinnedLinks.includes(article.link))

    // Sort pinned articles by their pin order (most recently pinned first)
    const sortedPinned = pinned.sort((a, b) => {
      const aPinnedData = pinnedArticles.find((p) => p.link === a.link)
      const bPinnedData = pinnedArticles.find((p) => p.link === b.link)

      if (!aPinnedData || !bPinnedData) {
        // Fallback to publication date if pin data is missing
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      }

      // Sort by pin time (most recently pinned first)
      return bPinnedData.pinnedAt - aPinnedData.pinnedAt
    })

    // Sort unpinned articles by publication date (most recent first)
    const sortedUnpinned = unpinned.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    // Return pinned articles first, then unpinned articles
    return [...sortedPinned, ...sortedUnpinned]
  }

  const fetchFeeds = async (feeds: FeedType[]) => {
    setIsLoading(true)
    setError(null)

    try {
      const allArticles: Article[] = []

      // Fetch all selected feeds in parallel
      const feedPromises = feeds.map(async (feed) => {
        try {
          const response = await fetch(`/api/feed?source=${feed}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch ${feed} feed`)
          }
          const data = await response.json()
          return parseRssFeed(data.feed, feed)
        } catch (err) {
          console.error(`Error fetching ${feed} feed:`, err)
          return []
        }
      })

      const feedResults = await Promise.all(feedPromises)

      // Combine all articles
      feedResults.forEach((articles) => {
        allArticles.push(...articles)
      })

      const sortedArticles = sortArticlesWithPinned(allArticles)
      setArticles(sortedArticles)
    } catch (err) {
      console.error("Error fetching feeds:", err)
      setError("Failed to load feeds. Please try again.")
      setArticles([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedFeeds.length > 0 && isLoaded) {
      fetchFeeds(selectedFeeds)
    }
  }, [selectedFeeds, isLoaded])

  // Re-sort articles when pinned articles change
  useEffect(() => {
    if (articles.length > 0 && isLoaded) {
      const sortedArticles = sortArticlesWithPinned(articles)
      // Only update if the order actually changed
      const currentOrder = articles.map((a) => a.link).join(",")
      const newOrder = sortedArticles.map((a) => a.link).join(",")
      if (currentOrder !== newOrder) {
        setArticles(sortedArticles)
      }
    }
  }, [getPinnedLinks().join(","), pinnedArticles.map((p) => p.pinnedAt).join(","), isLoaded])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredArticles(articles)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query),
      )
      setFilteredArticles(sortArticlesWithPinned(filtered))
    }
  }, [searchQuery, articles, isLoaded])

  const handleFeedChange = (feeds: FeedType[]) => {
    setSelectedFeeds(feeds)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleRefresh = () => {
    if (selectedFeeds.length > 0) {
      fetchFeeds(selectedFeeds)
    }
  }

  return (
    <main className="space-y-6" data-feed-section role="main" aria-labelledby="feeds-heading">
      <div className="sr-only">
        <h2 id="feeds-heading">Developer RSS Feeds</h2>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <FeedSelector selectedFeeds={selectedFeeds} onFeedChange={handleFeedChange} />
        <div className="flex gap-2">
          <SearchBar onSearch={handleSearch} />
          <RefreshButton onRefresh={handleRefresh} isLoading={isLoading} />
        </div>
      </div>

      {/* Show pinned articles count if any */}
      {isLoaded && pinnedArticles.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            📌 {pinnedArticles.length} pinned article{pinnedArticles.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      ) : (
        <ArticleList articles={filteredArticles} isLoading={isLoading} />
      )}
    </main>
  )
}
