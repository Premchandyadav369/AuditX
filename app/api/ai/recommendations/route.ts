import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { model } from "@/lib/ai/model"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get recent user activity
    const { data: activity } = await supabase
      .from("activity_timeline")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)

    // Get current fraud cases
    const { data: fraudCases } = await supabase.from("fraud_cases").select("*").eq("status", "open").limit(10)

    // Get high-risk vendors
    const { data: vendors } = await supabase.from("vendors").select("*").gte("risk_score", 70).limit(10)

    const prompt = `Based on this audit system data, generate 5 smart recommendations for the auditor:

Recent Activity: ${JSON.stringify(activity)}
Open Fraud Cases: ${JSON.stringify(fraudCases)}
High-Risk Vendors: ${JSON.stringify(vendors)}

For each recommendation, provide:
{
  "title": "Action title",
  "description": "Why this is important",
  "action_url": "/dashboard/page",
  "priority": 1-100,
  "type": "investigate|review|monitor|alert"
}

Return as JSON array. Focus on:
- Investigating suspicious patterns
- Reviewing high-risk items
- Monitoring trends
- Following up on open cases

Only return the JSON array, no explanation.`

    const { text: responseText } = await generateText({
      model,
      prompt,
      temperature: 0.3,
    })

    // Extract JSON array
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return NextResponse.json({ recommendations: [] })
    }

    const recommendations = JSON.parse(jsonMatch[0])

    // Store recommendations in database
    for (const rec of recommendations) {
      await supabase.from("recommendations").insert({
        user_id: user.id,
        recommendation_type: rec.type,
        title: rec.title,
        description: rec.description,
        action_url: rec.action_url,
        priority: rec.priority,
      })
    }

    return NextResponse.json({ recommendations })
  } catch (error: any) {
    console.error("Recommendations error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
