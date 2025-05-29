"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Article } from "@/lib/types"
import { ExternalLink, Loader2, Sparkles } from "lucide-react"

interface SummaryModalProps {
  article: Article
  isOpen: boolean
  onClose: () => void
}

export function SummaryModal({ article, isOpen, onClose }: SummaryModalProps) {
  const [summary, setSummary] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSummary = async () => {
    setIsLoading(true)
    setError(null)
    setSummary("")

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          url: article.link,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (err) {
      console.error("Error generating summary:", err)
      setError("Failed to generate summary. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && !summary && !isLoading) {
      generateSummary()
    }
  }, [isOpen])

  const handleClose = () => {
    setSummary("")
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-2 text-left">
            <Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{article.title}</span>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-left">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
            >
              Read full article
              <ExternalLink className="h-3 w-3" />
            </a>
            <Badge variant="secondary" className="text-xs">
              {article.source === "dev" ? "Dev.to" : "Hacker News"}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
              <span className="ml-2 text-sm text-muted-foreground">Generating AI summary...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={generateSummary} className="mt-2">
                Try Again
              </Button>
            </div>
          )}

          {summary && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">AI Summary</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
            </div>
          )}

          {!isLoading && !error && !summary && (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">Click to generate summary</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
