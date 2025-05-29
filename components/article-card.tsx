"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Article } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { ExternalLink, Sparkles, Pin, PinOff } from "lucide-react"
import Image from "next/image"
import { SummaryModal } from "./summary-modal"
import { usePinnedArticles } from "@/hooks/use-pinned-articles"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [showSummary, setShowSummary] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { isPinned, togglePin } = usePinnedArticles()

  const pinned = isPinned(article.link)

  const handleTogglePin = () => {
    togglePin(article.link, article.title)
  }

  return (
    <>
      <Card
        className={`h-full flex flex-col overflow-hidden transition-all duration-200 ${
          pinned ? "ring-2 ring-yellow-400 shadow-lg" : ""
        }`}
        role="article"
        aria-labelledby={`article-title-${article.link.replace(/[^a-zA-Z0-9]/g, "")}`}
      >
        {article.image && !imageError && (
          <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
            <Image
              src={article.image || "/placeholder.svg"}
              alt={`Featured image for ${article.title}`}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              priority={false}
            />
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle
              id={`article-title-${article.link.replace(/[^a-zA-Z0-9]/g, "")}`}
              className="text-lg line-clamp-2 flex-1"
            >
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded flex items-start gap-1"
                aria-describedby={`article-source-${article.link.replace(/[^a-zA-Z0-9]/g, "")}`}
              >
                {article.title}
                <ExternalLink className="h-4 w-4 flex-shrink-0 mt-1" aria-hidden="true" />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </CardTitle>
            <Button
              variant={pinned ? "default" : "ghost"}
              size="sm"
              onClick={handleTogglePin}
              className={`flex-shrink-0 ${pinned ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100" : ""}`}
              aria-label={pinned ? `Unpin article: ${article.title}` : `Pin article: ${article.title}`}
              aria-pressed={pinned}
            >
              {pinned ? (
                <Pin className="h-4 w-4" aria-hidden="true" />
              ) : (
                <PinOff className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-grow pt-0">
          <p className="text-sm text-muted-foreground line-clamp-4">{article.content}</p>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-2 border-t">
          <div className="flex flex-col gap-1">
            <time className="text-xs text-muted-foreground" dateTime={article.pubDate}>
              {formatDate(article.pubDate)}
            </time>
            <Badge
              variant="outline"
              className="text-xs w-fit"
              id={`article-source-${article.link.replace(/[^a-zA-Z0-9]/g, "")}`}
            >
              {article.source === "dev" ? "Dev.to" : "Hacker News"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSummary(true)}
              className="flex items-center gap-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Generate AI summary for ${article.title}`}
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              AI Summary
            </Button>

            <div className="flex gap-1" role="list" aria-label="Article tags">
              {article.tags &&
                article.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs" role="listitem">
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
        </CardFooter>
      </Card>

      <SummaryModal article={article} isOpen={showSummary} onClose={() => setShowSummary(false)} />
    </>
  )
}
