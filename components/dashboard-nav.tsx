"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Upload,
  AlertTriangle,
  Receipt,
  Network,
  BookCheck,
  Settings,
  Search,
  Bell,
  FolderOpen,
  BarChart3,
  FileBarChart,
  Newspaper,
  Sparkles,
  GitCompare as FileCompare,
  Layers,
  FileCheck,
  HelpCircle,
  TrendingUp,
  Bookmark,
  Clock,
  Tags,
  MapPin,
  Shield,
  FileUp,
  Brain,
  Layout,
  FileText,
  Package,
  Palette,
  Target,
  Users,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import Image from "next/image"

const navGroups = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Executive Dashboard", href: "/dashboard/executive", icon: Layout },
    ],
  },
  {
    title: "AI Assistant",
    icon: Sparkles,
    items: [
      { title: "AI Copilot", href: "/dashboard/ai-copilot", icon: Sparkles },
      { title: "Smart Search", href: "/dashboard/smart-search", icon: Brain },
      { title: "Advanced Search", href: "/dashboard/search", icon: Search },
    ],
  },
  {
    title: "Fraud & Risk",
    icon: AlertTriangle,
    items: [
      { title: "Fraud & Anomalies", href: "/dashboard/fraud", icon: AlertTriangle },
      { title: "Fraud Patterns", href: "/dashboard/fraud-patterns", icon: Target },
      { title: "Anomaly Detection", href: "/dashboard/anomaly-detection", icon: AlertTriangle },
      { title: "Alerts", href: "/dashboard/alerts", icon: Bell },
      { title: "Risk Heatmap", href: "/dashboard/heatmap", icon: MapPin },
      { title: "Network Graph", href: "/dashboard/network-graph", icon: Network },
    ],
  },
  {
    title: "Audit & Compliance",
    icon: BookCheck,
    items: [
      { title: "Policy Compliance", href: "/dashboard/compliance", icon: BookCheck },
      { title: "Regulatory Compliance", href: "/dashboard/regulatory-compliance", icon: Shield },
      { title: "Contract Validation", href: "/dashboard/contract-validation", icon: FileCheck },
      { title: "Policy Q&A", href: "/dashboard/policy-qa", icon: HelpCircle },
      { title: "Cases", href: "/dashboard/cases", icon: FolderOpen },
      { title: "Case Management", href: "/dashboard/case-management", icon: FileText },
    ],
  },
  {
    title: "Intelligence",
    icon: Brain,
    items: [
      { title: "News Intelligence", href: "/dashboard/news", icon: Newspaper },
      { title: "Company Intelligence", href: "/dashboard/company-intel", icon: Search },
      { title: "Vendor Intelligence", href: "/dashboard/vendor-intelligence", icon: Brain },
      { title: "Vendor Analytics", href: "/dashboard/vendors", icon: Network },
    ],
  },
  {
    title: "Operations",
    icon: Package,
    items: [
      { title: "Document Upload", href: "/dashboard/upload", icon: Upload },
      { title: "Import Data", href: "/dashboard/import", icon: FileUp },
      { title: "Batch Analysis", href: "/dashboard/batch-analyze", icon: Layers },
      { title: "Bulk Operations", href: "/dashboard/bulk-operations", icon: Package },
      { title: "Activity Timeline", href: "/dashboard/activity", icon: Clock },
      { title: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
      { title: "Tags Manager", href: "/dashboard/tags", icon: Tags },
    ],
  },
  {
    title: "Reports & Analytics",
    icon: FileBarChart,
    items: [
      { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { title: "Reports", href: "/dashboard/reports", icon: FileBarChart },
      { title: "Report Builder", href: "/dashboard/report-builder", icon: FileText },
      { title: "Auto Reports", href: "/dashboard/auto-reports", icon: FileBarChart },
      { title: "Predictive Analytics", href: "/dashboard/predictive", icon: TrendingUp },
      { title: "Compare Documents", href: "/dashboard/compare", icon: FileCompare },
      { title: "Department Benchmarking", href: "/dashboard/benchmarking", icon: BarChart3 },
      { title: "Budget Variance", href: "/dashboard/budget-variance", icon: TrendingUp },
      { title: "Transactions", href: "/dashboard/transactions", icon: Receipt },
    ],
  },
  {
    title: "System Setup",
    icon: Settings,
    items: [
      { title: "Customize Dashboard", href: "/dashboard/customize", icon: Palette },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<string[]>(navGroups.map(g => g.title))

  const toggleGroup = (title: string) => {
    setOpenGroups(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

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
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-4">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <group.icon className="w-4 h-4" />
                    {group.title}
                  </div>
                  {openGroups.includes(group.title) ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>

                {openGroups.includes(group.title) && (
                  <div className="space-y-1 ml-2 border-l border-sidebar-border pl-2">
                    {group.items.map((item) => {
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
                          <item.icon className="w-4 h-4" />
                          {item.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
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
