"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Article } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { ExternalLink, Sparkles } from "lucide-react"
import Image from "next/image"
import { SummaryModal } from "./summary-modal"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [showSummary, setShowSummary] = useState(false)

  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden">
        {article.image && (
          <div className="relative w-full h-48 bg-gray-100">
            <Image
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
              onError={(e) => {
                // Hide image container if image fails to load
                const target = e.target as HTMLImageElement
                const container = target.parentElement
                if (container) {
                  container.style.display = "none"
                }
              }}
            />
          </div>
        )}

        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-2">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-start gap-1"
            >
              {article.title}
              <ExternalLink className="h-4 w-4 flex-shrink-0 mt-1" />
            </a>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-grow pt-0">
          <p className="text-sm text-muted-foreground line-clamp-4">{article.content}</p>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-2 border-t">
          <div className="text-xs text-muted-foreground">{formatDate(article.pubDate)}</div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSummary(true)}
              className="flex items-center gap-1 text-xs"
            >
              <Sparkles className="h-3 w-3" />
              AI Summary
            </Button>

            <div className="flex gap-1">
              {article.tags &&
                article.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
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
