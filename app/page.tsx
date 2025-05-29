import { FeedReader } from "@/components/feed-reader"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">RSS Feed Reader</h1>
      <FeedReader />
    </div>
  )
}
