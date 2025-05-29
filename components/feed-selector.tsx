"use client"

import { Button } from "@/components/ui/button"
import type { FeedType } from "@/lib/types"

interface FeedSelectorProps {
  selectedFeeds: FeedType[]
  onFeedChange: (feeds: FeedType[]) => void
}

export function FeedSelector({ selectedFeeds, onFeedChange }: FeedSelectorProps) {
  const toggleFeed = (feed: FeedType) => {
    if (selectedFeeds.includes(feed)) {
      // Remove feed if already selected
      const newFeeds = selectedFeeds.filter((f) => f !== feed)
      if (newFeeds.length > 0) {
        onFeedChange(newFeeds)
      }
    } else {
      // Add feed if not selected
      onFeedChange([...selectedFeeds, feed])
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={selectedFeeds.includes("dev") ? "default" : "outline"}
        onClick={() => toggleFeed("dev")}
        className="flex items-center gap-2"
      >
        <div className="w-5 h-5 bg-black text-white flex items-center justify-center text-xs font-bold rounded">
          DEV
        </div>
        Dev.to
      </Button>
      <Button
        variant={selectedFeeds.includes("hn") ? "default" : "outline"}
        onClick={() => toggleFeed("hn")}
        className="flex items-center gap-2"
      >
        <div className="w-5 h-5 bg-orange-500 text-white flex items-center justify-center text-xs font-bold rounded">
          Y
        </div>
        Hacker News
      </Button>
    </div>
  )
}
