"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Upload, AlertTriangle, Receipt, Network, BookCheck, Settings, Search, Bell, FolderOpen, BarChart3, FileBarChart, Newspaper, Sparkles, GitCompare as FileCompare, Layers, FileCheck, HelpCircle, TrendingUp, Bookmark, Clock, Tags, MapPin, Shield, FileUp, Brain, Layout, FileText, Package, Palette, Target, Users } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import Image from "next/image"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "News Intelligence",
    href: "/dashboard/news",
    icon: Newspaper,
  },
  {
    title: "Company Intelligence",
    href: "/dashboard/company-intel",
    icon: Search,
  },
  {
    title: "AI Copilot",
    href: "/dashboard/ai-copilot",
    icon: Sparkles,
  },
  {
    title: "Smart Search",
    href: "/dashboard/smart-search",
    icon: Brain,
  },
  {
    title: "Batch Analysis",
    href: "/dashboard/batch-analyze",
    icon: Layers,
  },
  {
    title: "Contract Validation",
    href: "/dashboard/contract-validation",
    icon: FileCheck,
  },
  {
    title: "Policy Q&A",
    href: "/dashboard/policy-qa",
    icon: HelpCircle,
  },
  {
    title: "Predictive Analytics",
    href: "/dashboard/predictive",
    icon: TrendingUp,
  },
  {
    title: "Compare Documents",
    href: "/dashboard/compare",
    icon: FileCompare,
  },
  {
    title: "Document Upload",
    href: "/dashboard/upload",
    icon: Upload,
  },
  {
    title: "Import Data",
    href: "/dashboard/import",
    icon: FileUp,
  },
  {
    title: "Advanced Search",
    href: "/dashboard/search",
    icon: Search,
  },
  {
    title: "Bookmarks",
    href: "/dashboard/bookmarks",
    icon: Bookmark,
  },
  {
    title: "Activity Timeline",
    href: "/dashboard/activity",
    icon: Clock,
  },
  {
    title: "Tags Manager",
    href: "/dashboard/tags",
    icon: Tags,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: Receipt,
  },
  {
    title: "Fraud & Anomalies",
    href: "/dashboard/fraud",
    icon: AlertTriangle,
  },
  {
    title: "Fraud Patterns",
    href: "/dashboard/fraud-patterns",
    icon: Target,
  },
  {
    title: "Vendor Analytics",
    href: "/dashboard/vendors",
    icon: Network,
  },
  {
    title: "Department Benchmarking",
    href: "/dashboard/benchmarking",
    icon: BarChart3,
  },
  {
    title: "Risk Heatmap",
    href: "/dashboard/heatmap",
    icon: MapPin,
  },
  {
    title: "Network Graph",
    href: "/dashboard/network-graph",
    icon: Network,
  },
  {
    title: "Policy Compliance",
    href: "/dashboard/compliance",
    icon: BookCheck,
  },
  {
    title: "Cases",
    href: "/dashboard/cases",
    icon: FolderOpen,
  },
  {
    title: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Executive Dashboard",
    href: "/dashboard/executive",
    icon: Layout,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileBarChart,
  },
  {
    title: "Report Builder",
    href: "/dashboard/report-builder",
    icon: FileText,
  },
  {
    title: "Bulk Operations",
    href: "/dashboard/bulk-operations",
    icon: Package,
  },
  {
    title: "Collaboration Live",
    href: "/dashboard/collaboration-live",
    icon: Users,
  },
  {
    title: "Anomaly Detection",
    href: "/dashboard/anomaly-detection",
    icon: AlertTriangle,
  },
  {
    title: "Regulatory Compliance",
    href: "/dashboard/regulatory-compliance",
    icon: Shield,
  },
  {
    title: "Case Management",
    href: "/dashboard/case-management",
    icon: FileText,
  },
  {
    title: "Vendor Intelligence",
    href: "/dashboard/vendor-intelligence",
    icon: Brain,
  },
  {
    title: "Budget Variance",
    href: "/dashboard/budget-variance",
    icon: TrendingUp,
  },
  {
    title: "Auto Reports",
    href: "/dashboard/auto-reports",
    icon: FileBarChart,
  },
  {
    title: "NLP Search",
    href: "/dashboard/nlp-search",
    icon: Brain,
  },
  {
    title: "Customize Dashboard",
    href: "/dashboard/customize",
    icon: Palette,
  },
  {
    title: "MFA Setup",
    href: "/dashboard/mfa-setup",
    icon: Shield,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-sidebar z-40">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
          <Image
            src="/auditx-logo.jpeg"
            alt="AuditX Logo"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <span className="text-xl font-bold text-sidebar-foreground">AuditX</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground glow-blue"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          {/* Theme Switcher */}
          <div className="px-3">
            <ThemeSwitcher />
          </div>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">AU</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Auditor</p>
              <p className="text-xs text-muted-foreground truncate">admin@auditx.gov</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
