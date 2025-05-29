import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { title, content, url } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are an expert at summarizing technical articles and blog posts. 
      Create concise, informative summaries that capture the key points and insights.
      Keep summaries between 100-150 words and focus on the main takeaways.`,
      prompt: `Please summarize this article:

Title: ${title}

Content: ${content}

URL: ${url}

Provide a clear, concise summary that highlights the main points and key insights.`,
    })

    return NextResponse.json({ summary: text })
  } catch (error) {
    console.error("Error generating summary:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
