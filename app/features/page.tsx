import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Shield,
  FileSearch,
  Brain,
  Activity,
  BookCheck,
  Users,
  Search,
  AlertCircle,
  FileText,
  Newspaper,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import Image from "next/image"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/auditx-logo.jpeg" alt="AuditX Logo" width={40} height={40} className="rounded-lg" />
              <span className="text-xl font-bold text-foreground">AuditX</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button size="sm" className="holographic-gradient glow-blue">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-balance">
              <span className="holographic-gradient bg-clip-text text-transparent">Complete Feature Guide</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about AuditX's AI-powered fraud detection platform
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Features</h2>

          <div className="space-y-8">
            {/* Document Upload */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-xl holographic-gradient flex items-center justify-center shrink-0 glow-blue">
                  <FileSearch className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Document Upload & AI Analysis</h3>
                  <p className="text-muted-foreground mb-6">
                    Upload financial documents and let Google Gemini AI extract all relevant data automatically.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm mb-1">Drag & Drop Upload</div>
                        <div className="text-sm text-muted-foreground">PDF, images, Excel files supported</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm mb-1">AI OCR Extraction</div>
                        <div className="text-sm text-muted-foreground">Vendor, amount, date, line items</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm mb-1">Fraud Risk Scoring</div>
                        <div className="text-sm text-muted-foreground">Automatic risk calculation 0-100</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm mb-1">Database Storage</div>
                        <div className="text-sm text-muted-foreground">All data saved to Supabase</div>
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard/upload">
                    <Button className="mt-6 bg-transparent" variant="outline">
                      Try Document Upload <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* AI Copilot */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-xl holographic-gradient flex items-center justify-center shrink-0 glow-purple">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">AI Copilot</h3>
                  <p className="text-muted-foreground mb-6">
                    Ask natural language questions about your audit data and get instant AI-powered insights.
                  </p>
                  <div className="space-y-3">
                    <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                      <div className="text-sm font-medium mb-1">Example Question:</div>
                      <div className="text-sm text-muted-foreground italic">
                        "Which vendors have the highest fraud risk in the Finance Ministry?"
                      </div>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                      <div className="text-sm font-medium mb-1">Example Question:</div>
                      <div className="text-sm text-muted-foreground italic">
                        "Show me all transactions above ₹10 lakhs from last month"
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard/ai-copilot">
                    <Button className="mt-6 bg-transparent" variant="outline">
                      Ask AI Copilot <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Fraud Detection */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                  <Shield className="w-8 h-8 text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Fraud Detection & Alerts</h3>
                  <p className="text-muted-foreground mb-6">
                    Real-time monitoring of all transactions with automatic fraud detection and risk scoring.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-destructive/5 rounded-lg">
                      <div className="text-3xl font-bold text-destructive mb-1">100%</div>
                      <div className="text-sm text-muted-foreground">Transactions Scanned</div>
                    </div>
                    <div className="text-center p-4 bg-destructive/5 rounded-lg">
                      <div className="text-3xl font-bold text-destructive mb-1">24/7</div>
                      <div className="text-sm text-muted-foreground">Continuous Monitoring</div>
                    </div>
                    <div className="text-center p-4 bg-destructive/5 rounded-lg">
                      <div className="text-3xl font-bold text-destructive mb-1">AI</div>
                      <div className="text-sm text-muted-foreground">Powered Detection</div>
                    </div>
                  </div>
                  <Link href="/dashboard/fraud">
                    <Button className="mt-6 bg-transparent" variant="outline">
                      View Fraud Cases <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* News Intelligence */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Newspaper className="w-8 h-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Real-Time News Intelligence</h3>
                  <p className="text-muted-foreground mb-6">
                    Stay updated with worldwide fraud, corruption, and compliance news from 50+ sources via NewsAPI.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-1">Fraud</div>
                      <div className="text-sm text-muted-foreground">Global cases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-1">Corruption</div>
                      <div className="text-sm text-muted-foreground">Investigations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-1">Compliance</div>
                      <div className="text-sm text-muted-foreground">Regulatory updates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-1">India-Specific</div>
                      <div className="text-sm text-muted-foreground">CAG, CBI reports</div>
                    </div>
                  </div>
                  <Link href="/dashboard/news">
                    <Button className="mt-6 bg-transparent" variant="outline">
                      Read News Feed <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* More Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <Activity className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Real-time KPIs, interactive charts, fraud trends, and department risk scores.
                </p>
                <Link href="/dashboard">
                  <Button size="sm" variant="ghost">
                    View Dashboard →
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <BookCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Compliance Monitoring</h3>
                <p className="text-muted-foreground mb-4">
                  Track policy violations, regulatory compliance, and remediation status.
                </p>
                <Link href="/dashboard/compliance">
                  <Button size="sm" variant="ghost">
                    Check Compliance →
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Vendor Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive vendor risk profiling, transaction history, and ratings.
                </p>
                <Link href="/dashboard/vendors">
                  <Button size="sm" variant="ghost">
                    Analyze Vendors →
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <FileText className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Report Generation</h3>
                <p className="text-muted-foreground mb-4">
                  Generate comprehensive audit reports with AI analysis in seconds.
                </p>
                <Link href="/dashboard/reports">
                  <Button size="sm" variant="ghost">
                    Generate Reports →
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <Search className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
                <p className="text-muted-foreground mb-4">
                  Full-text search across documents, transactions, and vendors with filters.
                </p>
                <Link href="/dashboard/search">
                  <Button size="sm" variant="ghost">
                    Search Data →
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <AlertCircle className="w-10 h-10 text-destructive mb-4" />
                <h3 className="text-xl font-semibold mb-2">Case Management</h3>
                <p className="text-muted-foreground mb-4">
                  Track fraud investigations from detection to resolution with full audit trail.
                </p>
                <Link href="/dashboard/cases">
                  <Button size="sm" variant="ghost">
                    Manage Cases →
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Typical Workflow</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Login & Access Dashboard</h3>
                <p className="text-muted-foreground text-sm">
                  Sign in with your credentials and view the real-time analytics dashboard with KPIs and recent alerts.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Upload Documents</h3>
                <p className="text-muted-foreground text-sm">
                  Drag and drop invoices, receipts, or financial documents. AI extracts data and calculates fraud risk
                  automatically.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Review Alerts & Cases</h3>
                <p className="text-muted-foreground text-sm">
                  Check fraud alerts with AI explanations. Create cases for high-risk transactions and assign
                  investigators.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Analyze Vendors & Transactions</h3>
                <p className="text-muted-foreground text-sm">
                  Deep dive into vendor risk profiles, transaction history, and spending patterns across departments.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                5
              </div>
              <div>
                <h3 className="font-semibold mb-1">Monitor Compliance</h3>
                <p className="text-muted-foreground text-sm">
                  Track policy violations and regulatory compliance scores. Review remediation progress.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                6
              </div>
              <div>
                <h3 className="font-semibold mb-1">Ask AI Copilot</h3>
                <p className="text-muted-foreground text-sm">
                  Use natural language to query your data: "Show me suspicious vendors" or "Generate fraud summary
                  report".
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                7
              </div>
              <div>
                <h3 className="font-semibold mb-1">Generate & Export Reports</h3>
                <p className="text-muted-foreground text-sm">
                  Create comprehensive audit reports with AI analysis. Download in multiple formats for stakeholders.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                8
              </div>
              <div>
                <h3 className="font-semibold mb-1">Stay Updated with News</h3>
                <p className="text-muted-foreground text-sm">
                  Check the news feed for worldwide fraud intelligence, government updates, and compliance changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to start auditing?</h2>
          <p className="text-muted-foreground">Explore all features in the interactive dashboard</p>
          <Link href="/dashboard">
            <Button size="lg" className="holographic-gradient glow-blue">
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Team Red-Dragon footer section */}
      <footer className="py-16 px-6 lg:px-8 border-t border-border/50 bg-card/30">
        <div className="container mx-auto">
          {/* Team Section */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Image
                src="/red-dragon-logo.png"
                alt="Team Red-Dragon Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">Made by Team Red-Dragon</h3>
            <p className="text-muted-foreground mb-8">Building the future of AI-powered government auditing</p>

            {/* Team Members Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">VP</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">V C Premchand Yadav</h4>
                <p className="text-xs text-muted-foreground">Team Lead</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">PR</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">P R Kiran Kumar Reddy</h4>
                <p className="text-xs text-muted-foreground">Developer</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ES</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">Edupulapati Sai Praneeth</h4>
                <p className="text-xs text-muted-foreground">Developer</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CM</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">C R Mohith Reddy</h4>
                <p className="text-xs text-muted-foreground">Developer</p>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
            <div className="flex items-center gap-3">
              <Image
                src="/auditx-logo.jpeg"
                alt="AuditX Logo"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <span className="text-xl font-bold text-foreground">AuditX</span>
            </div>
            <p className="text-sm text-muted-foreground">Government-grade AI-powered fraud detection © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
