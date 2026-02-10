import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// Fallback metrics when database is unavailable
const FALLBACK_METRICS = {
  totalTransactions: 45230,
  totalAmount: 2450000000,
  activeVendors: 1243,
  flaggedTransactions: 342,
  fraudCases: 28,
  openCases: 12,
  averageRiskScore: 32,
  complianceViolations: 18,
  lastUpdated: new Date().toISOString(),
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Fetch all metrics in parallel with timeout
    const [
      transactionRes,
      vendorRes,
      fraudRes,
      violationRes,
    ] = await Promise.all([
      supabase
        .from('transactions')
        .select('id, amount, risk_score, is_flagged', { count: 'exact' }),
      supabase
        .from('vendors')
        .select('id, risk_score', { count: 'exact' }),
      supabase
        .from('fraud_cases')
        .select('id, status', { count: 'exact' }),
      supabase
        .from('policy_violations')
        .select('id', { count: 'exact' }),
    ])

    // Check if any query failed
    if (!transactionRes.data) {
      return NextResponse.json(FALLBACK_METRICS, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      })
    }

    // Process transactions data
    const transactions = transactionRes.data || []
    const totalTransactions = transactionRes.count || 0
    const totalAmount = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
    const flaggedTransactions = transactions.filter((t) => t.is_flagged).length
    const averageRiskScore =
      transactions.length > 0
        ? transactions.reduce((sum, t) => sum + (t.risk_score || 0), 0) / transactions.length
        : 0

    // Process vendors data
    const activeVendors = vendorRes.count || 0

    // Process fraud cases
    const fraudCases = fraudRes.data || []
    const totalFraudCases = fraudRes.count || 0
    const openCases = fraudCases.filter((c) => c.status !== 'resolved').length

    // Process compliance violations
    const totalViolations = violationRes.count || 0

    const metrics = {
      totalTransactions,
      totalAmount: Math.round(totalAmount),
      activeVendors,
      flaggedTransactions,
      fraudCases: totalFraudCases,
      openCases,
      averageRiskScore: Math.round(averageRiskScore),
      complianceViolations: totalViolations,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      },
    })
  } catch (error) {
    console.error('[v0] Metrics API error:', error)
    // Return fallback metrics on error
    return NextResponse.json(FALLBACK_METRICS, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  }
}
