"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch(newQuery)
  }

  return (
    <div className="relative">
      <label htmlFor="search-articles" className="sr-only">
        Search articles by title or content
      </label>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <Input
        id="search-articles"
        type="search"
        placeholder="Search articles..."
        className="pl-8 w-full sm:w-[250px] focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={handleChange}
        aria-describedby="search-help"
      />
      <div id="search-help" className="sr-only">
        Search through article titles and content. Results update as you type.
      </div>
    </div>
  )
}
