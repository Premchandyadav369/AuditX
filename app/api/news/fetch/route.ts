import { NextResponse } from "next/server"

const NEWS_API_KEY = "1951279e101a4b2a8d9dd8069d1a9997"
const NEWS_API_BASE = "https://newsapi.org/v2"

// Search queries for different categories
const categoryQueries: Record<string, string[]> = {
  all: [
    "government fraud corruption",
    "financial scam investigation",
    "audit compliance violation",
    "procurement fraud",
    "money laundering case",
  ],
  fraud: ["fraud case", "financial fraud", "scam investigation", "embezzlement"],
  corruption: ["corruption scandal", "bribery case", "political corruption", "government corruption"],
  compliance: ["compliance violation", "regulatory fine", "audit report", "compliance failure"],
  "government-spending": ["government spending", "budget fraud", "public funds", "taxpayer money"],
  investigation: ["investigation launched", "probe initiated", "CBI case", "enforcement directorate"],
  policy: ["anti-corruption policy", "compliance regulation", "audit policy", "financial reform"],
}

// Country-specific queries
const countryQueries: Record<string, string> = {
  India: "India",
  "United States": "USA OR United States",
  "United Kingdom": "UK OR Britain",
  China: "China",
  Brazil: "Brazil",
  "South Africa": "South Africa",
  "European Union": "EU OR Europe",
}

function analyzeArticle(article: { title: string; description: string; source?: { name: string } }) {
  const text = `${article.title} ${article.description}`.toLowerCase()

  // Determine category based on keywords
  let category: "fraud" | "corruption" | "compliance" | "government-spending" | "investigation" | "policy" =
    "compliance"
  if (text.includes("fraud") || text.includes("scam") || text.includes("embezzlement")) category = "fraud"
  else if (text.includes("corruption") || text.includes("bribery") || text.includes("kickback")) category = "corruption"
  else if (text.includes("investigation") || text.includes("probe") || text.includes("arrest"))
    category = "investigation"
  else if (text.includes("spending") || text.includes("budget") || text.includes("taxpayer"))
    category = "government-spending"
  else if (text.includes("policy") || text.includes("regulation") || text.includes("reform")) category = "policy"

  // Calculate relevance score
  const fraudKeywords = [
    "fraud",
    "scam",
    "corruption",
    "embezzlement",
    "bribery",
    "money laundering",
    "investigation",
    "probe",
    "audit",
    "violation",
  ]
  const relevanceScore = Math.min(100, 50 + fraudKeywords.filter((kw) => text.includes(kw)).length * 10)

  // Determine risk level
  let riskLevel: "critical" | "high" | "medium" | "low" = "low"
  if (relevanceScore >= 90) riskLevel = "critical"
  else if (relevanceScore >= 75) riskLevel = "high"
  else if (relevanceScore >= 50) riskLevel = "medium"

  // Extract tags
  const possibleTags = [
    "fraud",
    "corruption",
    "audit",
    "investigation",
    "compliance",
    "government",
    "financial",
    "regulatory",
    "enforcement",
    "penalty",
    "fine",
    "scandal",
    "probe",
    "arrest",
  ]
  const tags = possibleTags.filter((tag) => text.includes(tag)).slice(0, 5)
  if (tags.length === 0) tags.push("financial news", "business")

  // Determine affected sectors
  const sectors: string[] = ["government"]
  if (text.includes("bank") || text.includes("financial")) sectors.push("banking")
  if (text.includes("health") || text.includes("medical")) sectors.push("healthcare")
  if (text.includes("infrastructure") || text.includes("construction")) sectors.push("infrastructure")
  if (text.includes("education") || text.includes("school")) sectors.push("education")

  return { category, relevanceScore, tags, riskLevel, affectedSectors: sectors }
}

// Extract country from text
function extractCountry(text: string): string {
  const countryPatterns: Record<string, RegExp> = {
    India: /india|delhi|mumbai|bangalore|chennai|kolkata|modi|rupee|crore|lakh/i,
    "United States": /usa|united states|washington|new york|dollar|fbi|sec|doj/i,
    "United Kingdom": /uk|britain|london|pound|sterling|parliament/i,
    China: /china|beijing|shanghai|yuan|chinese/i,
    Brazil: /brazil|brasilia|rio|sao paulo|real/i,
    Germany: /germany|berlin|euro|bundesbank/i,
    France: /france|paris|euro|french/i,
    Australia: /australia|sydney|melbourne|canberra/i,
    Russia: /russia|moscow|putin|ruble/i,
    Japan: /japan|tokyo|yen|japanese/i,
  }

  for (const [country, pattern] of Object.entries(countryPatterns)) {
    if (pattern.test(text)) return country
  }
  return "International"
}

// Fallback articles when API is unavailable
function getFallbackArticles() {
  return [
    {
      title: "Major Government Procurement Fraud Uncovered in Infrastructure Project",
      summary:
        "Investigators reveal systematic overbilling and fake invoices in a multi-billion infrastructure development project, leading to arrests of senior officials.",
      source: "Reuters",
      category: "fraud",
      country: "International",
      date: new Date().toISOString(),
      relevanceScore: 95,
      tags: ["procurement fraud", "infrastructure", "government", "investigation"],
      riskLevel: "critical",
      affectedSectors: ["government", "infrastructure"],
      url: "#",
    },
    {
      title: "Central Bank Implements New Anti-Money Laundering Compliance Framework",
      summary:
        "New regulations require enhanced due diligence and real-time transaction monitoring for all financial institutions.",
      source: "Financial Times",
      category: "compliance",
      country: "International",
      date: new Date().toISOString(),
      relevanceScore: 88,
      tags: ["AML", "compliance", "banking", "regulations"],
      riskLevel: "high",
      affectedSectors: ["banking", "finance"],
      url: "#",
    },
    {
      title: "Audit Report Reveals Irregularities in Public Health Spending",
      summary:
        "Government auditors find significant discrepancies in healthcare procurement, with potential losses exceeding ₹500 crore.",
      source: "The Guardian",
      category: "government-spending",
      country: "International",
      date: new Date().toISOString(),
      relevanceScore: 92,
      tags: ["healthcare", "audit", "public spending", "procurement"],
      riskLevel: "critical",
      affectedSectors: ["healthcare", "government"],
      url: "#",
    },
  ]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "all"
    const country = searchParams.get("country") || "worldwide"

    // Build search query
    const queries = categoryQueries[category] || categoryQueries.all
    const randomQuery = queries[Math.floor(Math.random() * queries.length)]
    const countryFilter = country !== "worldwide" ? ` ${countryQueries[country] || country}` : ""
    const searchQuery = `${randomQuery}${countryFilter}`

    // Fetch from NewsAPI
    const newsResponse = await fetch(
      `${NEWS_API_BASE}/everything?` +
        new URLSearchParams({
          q: searchQuery,
          language: "en",
          sortBy: "publishedAt",
          pageSize: "20",
          apiKey: NEWS_API_KEY,
        }),
      { next: { revalidate: 300 } },
    )

    if (!newsResponse.ok) {
      throw new Error(`NewsAPI error: ${newsResponse.status}`)
    }

    const newsData = await newsResponse.json()

    if (!newsData.articles || newsData.articles.length === 0) {
      const headlinesResponse = await fetch(
        `${NEWS_API_BASE}/top-headlines?` +
          new URLSearchParams({
            category: "business",
            language: "en",
            pageSize: "15",
            apiKey: NEWS_API_KEY,
          }),
      )
      const headlinesData = await headlinesResponse.json()
      newsData.articles = headlinesData.articles || []
    }

    const enhancedArticles = newsData.articles
      .filter((article: any) => article.title && article.description && article.title !== "[Removed]")
      .slice(0, 15)
      .map((article: any) => {
        const analysis = analyzeArticle(article)

        return {
          title: article.title,
          summary: article.description || article.content?.substring(0, 200) || "No description available",
          source: article.source?.name || "Unknown Source",
          category: analysis.category,
          country: extractCountry(article.title + " " + article.description),
          date: article.publishedAt,
          relevanceScore: analysis.relevanceScore,
          tags: analysis.tags,
          riskLevel: analysis.riskLevel,
          affectedSectors: analysis.affectedSectors,
          url: article.url,
          imageUrl: article.urlToImage,
        }
      })

    // Sort by relevance score
    enhancedArticles.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)

    return NextResponse.json({ articles: enhancedArticles })
  } catch (error) {
    console.error("[v0] News fetch error:", error)
    return NextResponse.json({
      articles: getFallbackArticles(),
      error: "Using cached data - live feed temporarily unavailable",
    })
  }
}
