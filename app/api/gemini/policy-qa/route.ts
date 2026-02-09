import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: NextRequest) {
  try {
    const { question, policyDocuments } = await req.json()

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    const policyContext = policyDocuments ? `POLICY DOCUMENTS:\n${JSON.stringify(policyDocuments, null, 2)}\n\n` : ""

    const prompt = `${policyContext}You are a government procurement policy expert. Answer this question based on Indian government procurement rules and the provided policy documents.

QUESTION: ${question}

Provide a comprehensive answer in JSON format:
{
  "answer": "detailed, clear answer",
  "citations": [
    {
      "source": "specific policy or rule name",
      "section": "section number or clause",
      "text": "relevant excerpt"
    }
  ],
  "relatedRules": ["other related policies or rules"],
  "examples": ["practical examples if applicable"],
  "caveats": ["any exceptions or special conditions"]
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const answer = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    return NextResponse.json({
      success: true,
      answer,
    })
  } catch (error) {
    console.error("[v0] Policy Q&A error:", error)
    return NextResponse.json({ error: "Q&A generation failed" }, { status: 500 })
  }
}
