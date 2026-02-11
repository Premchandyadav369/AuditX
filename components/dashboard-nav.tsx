"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Upload, AlertTriangle, Receipt, Settings, Search, Bell, Newspaper, Sparkles, Brain, FileText, ChevronDown, Shield } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import Image from "next/image"
import { useState } from "react"

interface NavSection {
  title: string
  icon?: React.ElementType
  items: Array<{
    title: string
    href: string
    icon: React.ElementType
  }>
}

const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Intelligence & Analysis",
    icon: Brain,
    items: [
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
    ],
  },
  {
    title: "Documents & Data",
    icon: FileText,
    items: [
      {
        title: "Upload & Extract",
        href: "/dashboard/upload",
        icon: Upload,
      },
      {
        title: "Transactions",
        href: "/dashboard/transactions",
        icon: Receipt,
      },
    ],
  },
  {
    title: "Compliance & Risk",
    icon: Shield,
    items: [
      {
        title: "Intelligence Center",
        href: "/dashboard/compliance-risk",
        icon: Brain,
        description: "Vendor, Policy, Regulatory & Heatmap",
      },
    ],
  },
  {
    title: "Monitoring",
    icon: Bell,
    items: [
      {
        title: "Alerts",
        href: "/dashboard/alerts",
        icon: Bell,
      },
      {
        title: "Fraud Detection",
        href: "/dashboard/fraud",
        icon: AlertTriangle,
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      {
        title: "Preferences",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Main": true,
    "Intelligence & Analysis": true,
  })

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
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
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-2">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                {/* Section Header */}
                {section.items.length > 0 && (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors",
                      "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                    )}
                  >
                    {section.icon && <section.icon className="w-4 h-4" />}
                    <span className="flex-1 text-left">{section.title}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSections[section.title] ? "rotate-180" : "",
                      )}
                    />
                  </button>
                )}

                {/* Section Items */}
                {expandedSections[section.title] && (
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ml-2",
                            isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground glow-blue"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
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
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
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
