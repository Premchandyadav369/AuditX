import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { template_id } = await request.json()

    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get template
    const { data: template, error: templateError } = await supabase
      .from("report_templates")
      .select("*")
      .eq("id", template_id)
      .single()

    if (templateError) throw templateError

    const config = template.config as any

    // Build query based on template
    let query = supabase.from(template.report_type).select(config.columns.join(", "))

    // Apply date range
    if (config.dateRange?.from) {
      query = query.gte("created_at", config.dateRange.from)
    }
    if (config.dateRange?.to) {
      query = query.lte("created_at", config.dateRange.to)
    }

    // Apply filters
    for (const filter of config.filters || []) {
      if (filter.operator === "equals") {
        query = query.eq(filter.column, filter.value)
      } else if (filter.operator === "greater_than") {
        query = query.gt(filter.column, filter.value)
      } else if (filter.operator === "less_than") {
        query = query.lt(filter.column, filter.value)
      }
    }

    const { data, error: queryError } = await query

    if (queryError) throw queryError

    // Generate AI summary
    const summaryPrompt = `Generate a comprehensive audit report summary based on this data:

Report Name: ${template.name}
Data Source: ${template.report_type}
Total Records: ${data?.length || 0}
Data: ${JSON.stringify(data?.slice(0, 100))}

Provide:
1. Executive Summary (2-3 paragraphs)
2. Key Findings (bullet points)
3. Risk Assessment
4. Recommendations

Format as professional audit report.`

    const { text: aiSummary } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      prompt: summaryPrompt,
      temperature: 0.5,
      maxTokens: 2000,
    })

    // Create report record
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        report_name: template.name,
        report_type: template.report_type,
        parameters: config,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (reportError) throw reportError

    return NextResponse.json({
      report_id: report.id,
      summary: aiSummary,
      data_count: data?.length || 0,
    })
  } catch (error: any) {
    console.error("Report generation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
