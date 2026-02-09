import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { model } from "@/lib/ai/model"

export async function POST(req: NextRequest) {
  try {
    const { prompt: userPrompt } = await req.json()

    if (!userPrompt) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 })
    }

    const { text } = await generateText({
      model,
      prompt: userPrompt,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { answer: text }

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("[v0] Policy QA error:", error)
    return NextResponse.json({ error: "Policy QA failed" }, { status: 500 })
  }
}
