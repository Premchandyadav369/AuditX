import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory } = await req.json()

    const supabase = createServerClient()

    // Fetch relevant context from database
    const { data: recentTransactions } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)

    const { data: highRiskVendors } = await supabase
      .from("vendors")
      .select("*")
      .gte("risk_score", 70)
      .order("risk_score", { ascending: false })
      .limit(10)

    const { data: recentAlerts } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    const contextData = {
      recentTransactions: recentTransactions || [],
      highRiskVendors: highRiskVendors || [],
      recentAlerts: recentAlerts || [],
    }

    const prompt = `You are AuditX AI Copilot, an expert fraud detection assistant for the Government of India audit system.

You have access to real-time data from the AuditX database:

RECENT TRANSACTIONS (Last 20):
${JSON.stringify(contextData.recentTransactions, null, 2)}

HIGH RISK VENDORS:
${JSON.stringify(contextData.highRiskVendors, null, 2)}

RECENT ALERTS:
${JSON.stringify(contextData.recentAlerts, null, 2)}

Your capabilities:
- Fraud pattern analysis
- Vendor risk assessment
- Transaction anomaly detection
- Compliance checking
- Spending trend analysis
- Natural language database queries
- Predictive risk modeling
- Investigation recommendations

Answer the user's question using the provided data. Be specific, cite actual numbers from the data, and provide actionable insights. If you detect fraud patterns, explain them clearly.

User question: ${message}

Previous conversation:
${conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n")}`

    const { text } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      prompt,
      temperature: 0.5,
    })

    return NextResponse.json({
      success: true,
      response: text,
      context: {
        transactionsAnalyzed: contextData.recentTransactions.length,
        highRiskVendorsCount: contextData.highRiskVendors.length,
        activeAlertsCount: contextData.recentAlerts.length,
      },
    })
  } catch (error) {
    console.error("AI Copilot error:", error)
    return NextResponse.json(
      {
        error: "AI Copilot failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
