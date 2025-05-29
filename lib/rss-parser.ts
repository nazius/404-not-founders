import type { Article, FeedType } from "./types"
import { extractTags } from "./utils"

function extractImageFromContent(content: string): string | undefined {
  // Try to extract image from HTML content
  const imgRegex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"]/i
  const match = content.match(imgRegex)
  if (match && match[1]) {
    return match[1]
  }
  return undefined
}

function processHackerNewsDescription(description: string): { content: string; commentUrl?: string; points?: string } {
  // Extract the actual content from HN description
  let content = description
  let commentUrl: string | undefined
  let points: string | undefined

  // Remove CDATA if present
  content = content.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")

  // Extract comments URL
  const commentsMatch = content.match(/<a href="(https:\/\/news\.ycombinator\.com\/item\?id=[^"]+)">/i)
  if (commentsMatch && commentsMatch[1]) {
    commentUrl = commentsMatch[1]
  }

  // Extract points
  const pointsMatch = content.match(/<p>Points: (\d+)<\/p>/i)
  if (pointsMatch && pointsMatch[1]) {
    points = pointsMatch[1]
  }

  // Extract the actual content - for HN, we'll use the first paragraph after removing metadata
  // First, remove all the metadata paragraphs
  content = content.replace(/<p>Article URL:.*?<\/p>/i, "")
  content = content.replace(/<p>Comments URL:.*?<\/p>/i, "")
  content = content.replace(/<p>Points:.*?<\/p>/i, "")
  content = content.replace(/<p># Comments:.*?<\/p>/i, "")

  // If there's any content left, use it
  const contentMatch = content.match(/<p>(.*?)<\/p>/i)
  if (contentMatch && contentMatch[1]) {
    content = contentMatch[1]
  } else {
    // If no content is found, create a summary from points
    content = points ? `${points} points on Hacker News` : "Discussion on Hacker News"
  }

  return { content, commentUrl, points }
}

export function parseRssFeed(xmlString: string, source: FeedType): Article[] {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, "text/xml")

    const items = Array.from(xmlDoc.querySelectorAll("item"))

    return items.map((item) => {
      const title = item.querySelector("title")?.textContent || "No title"
      const link = item.querySelector("link")?.textContent || "#"
      const pubDate = item.querySelector("pubDate")?.textContent || new Date().toUTCString()

      // Get raw description and content
      const description = item.querySelector("description")?.textContent || ""
      const contentEncoded = item.querySelector("content\\:encoded, encoded")?.textContent || ""
      const contentTag = item.querySelector("content")?.textContent || ""

      // Raw content for image extraction
      const rawContent = contentEncoded || contentTag || description

      let cleanContent = ""
      let commentUrl: string | undefined

      // Handle Hacker News specific format
      if (source === "hn") {
        const processed = processHackerNewsDescription(description)
        cleanContent = processed.content
        commentUrl = processed.commentUrl
      } else {
        // For other feeds, prioritize description tag, fall back to content
        let content = ""

        if (description) {
          content = description
        } else if (contentEncoded) {
          content = contentEncoded
        } else if (contentTag) {
          content = contentTag
        }

        // Clean content - remove HTML tags and decode HTML entities
        cleanContent = content.replace(/<\/?[^>]+(>|$)/g, "")
        cleanContent = cleanContent.replace(/&nbsp;/g, " ")
        cleanContent = cleanContent.replace(/&amp;/g, "&")
        cleanContent = cleanContent.replace(/&lt;/g, "<")
        cleanContent = cleanContent.replace(/&gt;/g, ">")
        cleanContent = cleanContent.replace(/&quot;/g, '"')
        cleanContent = cleanContent.replace(/&#39;/g, "'")
        cleanContent = cleanContent.replace(/&apos;/g, "'")
      }

      // Extract image from various sources
      let image: string | undefined

      // 1. Try media:content or media:thumbnail
      const mediaContent = item.querySelector("media\\:content, media\\:thumbnail")
      if (mediaContent) {
        image = mediaContent.getAttribute("url") || undefined
      }

      // 2. Try enclosure tag (for podcasts/media)
      if (!image) {
        const enclosure = item.querySelector("enclosure")
        const enclosureType = enclosure?.getAttribute("type")
        if (enclosure && enclosureType?.startsWith("image/")) {
          image = enclosure.getAttribute("url") || undefined
        }
      }

      // 3. Try to extract from content HTML
      if (!image && rawContent) {
        image = extractImageFromContent(rawContent)
      }

      // 4. For Dev.to, try to get social image or cover image
      if (!image && source === "dev") {
        const socialImage = item.querySelector("social_image")?.textContent
        const coverImage = item.querySelector("cover_image")?.textContent
        image = socialImage || coverImage
      }

      // Limit to 200 characters
      if (cleanContent.length > 200) {
        cleanContent = cleanContent.substring(0, 200).trim() + "..."
      }

      // Extract tags from the content
      const tags = extractTags(cleanContent)

      // For Hacker News, add a "comments" tag
      if (source === "hn" && commentUrl) {
        const article: Article = {
          title,
          link,
          pubDate,
          description: cleanContent,
          content: cleanContent,
          image,
          tags,
          source,
          commentUrl,
        }
        return article
      }

      return {
        title,
        link,
        pubDate,
        description: cleanContent,
        content: cleanContent,
        image,
        tags,
        source,
      }
    })
  } catch (error) {
    console.error("Error parsing RSS feed:", error)
    return []
  }
}
