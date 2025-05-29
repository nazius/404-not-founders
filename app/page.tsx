import { FeedReader } from "@/components/feed-reader"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <FeedReader />
      </div>
      <Footer />
    </div>
  )
}
