"use client"

import { useState, useEffect } from "react"
import { FeedSelector } from "./feed-selector"
import { SearchBar } from "./search-bar"
import { ArticleList } from "./article-list"
import { RefreshButton } from "./refresh-button"
import { parseRssFeed } from "@/lib/rss-parser"
import type { Article, FeedType } from "@/lib/types"

export function FeedReader() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [selectedFeeds, setSelectedFeeds] = useState<FeedType[]>(["dev"])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      // Sort by publication date (newest first)
      allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

      setArticles(allArticles)
      setFilteredArticles(allArticles)
    } catch (err) {
      console.error("Error fetching feeds:", err)
      setError("Failed to load feeds. Please try again.")
      setArticles([])
      setFilteredArticles([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedFeeds.length > 0) {
      fetchFeeds(selectedFeeds)
    }
  }, [selectedFeeds])

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
      setFilteredArticles(filtered)
    }
  }, [searchQuery, articles])

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <FeedSelector selectedFeeds={selectedFeeds} onFeedChange={handleFeedChange} />
        <div className="flex gap-2">
          <SearchBar onSearch={handleSearch} />
          <RefreshButton onRefresh={handleRefresh} isLoading={isLoading} />
        </div>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      ) : (
        <ArticleList articles={filteredArticles} isLoading={isLoading} />
      )}
    </div>
  )
}
