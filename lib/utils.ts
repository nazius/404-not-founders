import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString
    }

    // If it's today, show relative time
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours < 24) {
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`
      }
      const hours = Math.floor(diffHours)
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    }

    // Otherwise show formatted date
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: now.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
    }).format(date)
  } catch (e) {
    console.error("Error formatting date:", e)
    return dateString
  }
}

export function extractTags(description: string): string[] {
  const commonTags = [
    "javascript",
    "react",
    "typescript",
    "node",
    "nextjs",
    "css",
    "html",
    "python",
    "webdev",
    "frontend",
    "backend",
    "programming",
    "coding",
    "development",
    "software",
    "tech",
    "technology",
  ]

  const lowerDesc = description.toLowerCase()
  return commonTags.filter((tag) => lowerDesc.includes(tag))
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
