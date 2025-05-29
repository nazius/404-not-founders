import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const source = searchParams.get("source")

  let feedUrl: string

  switch (source) {
    case "dev":
      feedUrl = "https://dev.to/feed"
      break
    case "hn":
      feedUrl = "https://hnrss.org/frontpage"
      break
    default:
      return NextResponse.json({ error: "Invalid source" }, { status: 400 })
  }

  try {
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "RSS Reader App/1.0",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch feed from ${feedUrl}`)
    }

    const feed = await response.text()

    return NextResponse.json({ feed })
  } catch (error) {
    console.error(`Error fetching ${source} feed:`, error)
    return NextResponse.json({ error: `Failed to fetch ${source} feed` }, { status: 500 })
  }
}
