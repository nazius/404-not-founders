export type FeedType = "dev" | "hn"

export interface Article {
  title: string
  link: string
  pubDate: string
  description: string
  content: string
  image?: string
  tags?: string[]
  source: FeedType
  commentUrl?: string
}
