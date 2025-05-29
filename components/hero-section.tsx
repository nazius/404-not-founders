"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDown, Code, Rss, Zap } from "lucide-react"

export function HeroSection() {
  const scrollToFeeds = () => {
    const feedSection = document.querySelector("[data-feed-section]")
    if (feedSection) {
      feedSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
      aria-labelledby="hero-title"
      role="banner"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fillOpacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"
        aria-hidden="true"
      ></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
            <Rss className="w-3 h-3 mr-1" aria-hidden="true" />
            Live Developer Feeds
          </Badge>

          {/* Main Heading */}
          <h1 id="hero-title" className="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Dev
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Stream
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your personalized feed of the latest developer content from
            <span className="text-white font-semibold"> Dev.to</span>,
            <span className="text-orange-300 font-semibold"> Hacker News</span>, and more.
          </p>

          {/* Features */}
          <ul className="flex flex-wrap justify-center gap-6 mb-12 list-none" role="list">
            <li className="flex items-center gap-2 text-blue-200">
              <Code className="w-5 h-5" aria-hidden="true" />
              <span>Developer Focused</span>
            </li>
            <li className="flex items-center gap-2 text-purple-200">
              <Zap className="w-5 h-5" aria-hidden="true" />
              <span>AI Summaries</span>
            </li>
            <li className="flex items-center gap-2 text-pink-200">
              <Rss className="w-5 h-5" aria-hidden="true" />
              <span>Multiple Sources</span>
            </li>
          </ul>

          {/* CTA Button */}
          <Button
            onClick={scrollToFeeds}
            size="lg"
            className="bg-white text-purple-900 hover:bg-blue-50 focus:bg-blue-50 font-semibold px-8 py-3 text-lg shadow-xl hover:shadow-2xl focus:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-describedby="cta-description"
          >
            Explore Feeds
            <ArrowDown className="w-5 h-5 ml-2" aria-hidden="true" />
          </Button>
          <div id="cta-description" className="sr-only">
            Scroll down to view and interact with developer RSS feeds
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Decorative wave"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="rgb(248 250 252)"
          />
        </svg>
      </div>
    </section>
  )
}
