import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, FileSearch, Network, Brain, Activity, BookCheck, TrendingUp, Zap } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image src="/auditx-logo.jpeg" alt="AuditX Logo" width={40} height={40} className="rounded-lg" />
              <span className="text-xl font-bold text-foreground">AuditX</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Full Guide
              </Link>
              <Link href="#solution" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Solution
              </Link>
              <Link href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </Link>
              <ThemeSwitcher />
              <Link href="/dashboard">
                <Button size="sm" className="holographic-gradient glow-blue">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

        {/* Holographic Glow Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full holographic-gradient opacity-20 blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-secondary opacity-20 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <div className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-6">
                <span className="text-sm font-medium text-primary">AI-Powered Government Auditing</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
              <span className="text-foreground">Every transaction audited.</span>
              <br />
              <span className="holographic-gradient bg-clip-text text-transparent">Every rupee protected.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              AuditX autonomously analyzes financial documents, detects anomalies, enforces compliance, and prevents
              fraud with AI-powered intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="holographic-gradient glow-blue text-lg px-8 h-12">
                  Try Demo
                  <Zap className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 h-12 border-border hover:border-primary/50 hover:bg-primary/5 bg-transparent"
              >
                Watch Demo Video
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 px-6 lg:px-8 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Intelligent Fraud Detection</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Powered by autonomous AI agents that work 24/7 to protect public funds
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:glow-blue">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileSearch className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Smart Document Understanding</h3>
              <p className="text-muted-foreground">
                AI extracts and validates data from invoices, POs, GRNs, and tender documents automatically
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:glow-blue">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Autonomous Fraud Detection</h3>
              <p className="text-muted-foreground">
                Identifies duplicate invoices, fake vendors, abnormal spikes, and suspicious patterns in real-time
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:glow-blue">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Network className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Cross-Department Integration</h3>
              <p className="text-muted-foreground">
                Unified view across all departments with automated data reconciliation and linking
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:glow-blue">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Explainable AI Evidence</h3>
              <p className="text-muted-foreground">
                Every alert includes detailed reasoning, evidence trails, and actionable recommendations
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:glow-blue">
              <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-chart-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Real-Time Risk Dashboards</h3>
              <p className="text-muted-foreground">
                Live monitoring with fraud heatmaps, risk scores, and predictive analytics
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:glow-blue">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Policy Compliance Agent</h3>
              <p className="text-muted-foreground">
                Automatically validates transactions against procurement rules and government regulations
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">The Challenge</h2>
              <p className="text-xl text-muted-foreground text-pretty">
                Government auditing faces critical obstacles that cost billions annually
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-background/50 border-destructive/30">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-destructive mt-2" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Unstructured Documents</h3>
                    <p className="text-muted-foreground">
                      Thousands of PDFs, scanned bills, and handwritten records impossible to process manually
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-background/50 border-destructive/30">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-destructive mt-2" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Manual Sampling</h3>
                    <p className="text-muted-foreground">
                      Auditors can only check 5-10% of transactions, leaving 90% unaudited
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-background/50 border-destructive/30">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-destructive mt-2" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">Billions Lost to Fraud</h3>
                    <p className="text-muted-foreground">
                      Ghost vendors, duplicate payments, and inflated bills drain public funds
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-background/50 border-destructive/30">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-destructive mt-2" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">No Unified System</h3>
                    <p className="text-muted-foreground">
                      Siloed departments prevent cross-verification and pattern detection
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              <span className="holographic-gradient bg-clip-text text-transparent">Autonomous AI Agents</span> Working
              for You
            </h2>
            <p className="text-xl text-muted-foreground text-pretty">
              AuditX deploys multiple specialized AI agents that collaborate to audit every transaction
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-xl holographic-gradient flex items-center justify-center glow-blue">
                <FileSearch className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Ingestion Agent</h3>
              <p className="text-muted-foreground">
                Automatically reads and extracts data from all document types using advanced OCR and LLM parsing
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-xl holographic-gradient flex items-center justify-center glow-purple">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Fraud Detection Agent</h3>
              <p className="text-muted-foreground">
                Analyzes patterns, detects anomalies, and flags suspicious transactions with explainable evidence
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-xl holographic-gradient flex items-center justify-center glow-blue">
                <BookCheck className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Compliance Agent</h3>
              <p className="text-muted-foreground">
                Validates every transaction against procurement policies and government regulations automatically
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Card className="inline-block p-8 bg-card/50 backdrop-blur-sm border-primary/30 glow-blue">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-12 h-12 text-primary" />
                <div className="text-left">
                  <div className="text-4xl font-bold holographic-gradient bg-clip-text text-transparent">100%</div>
                  <div className="text-muted-foreground">of transactions audited autonomously</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="demo" className="py-20 px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-balance">Ready to protect public funds?</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              See AuditX in action. Generate audit reports in 30 seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="holographic-gradient glow-blue text-lg px-8 h-12">
                  Try Interactive Demo
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 h-12 border-border hover:border-primary/50 bg-transparent"
              >
                Schedule Presentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
              {/* AuditX logo fixed to be icon-style without white borders */}
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
