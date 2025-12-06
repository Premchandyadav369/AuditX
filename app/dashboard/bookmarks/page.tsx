"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Bookmark, Search, Trash2, ExternalLink, FileText, AlertTriangle, Building2 } from "lucide-react"
import { toast } from "sonner"

interface BookmarkItem {
  id: string
  type: "document" | "vendor" | "case" | "transaction"
  title: string
  description: string
  url: string
  tags: string[]
  createdAt: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
    {
      id: "1",
      type: "document",
      title: "Invoice INV-2024-001234",
      description: "High-risk invoice from TechCorp Solutions",
      url: "/dashboard/upload",
      tags: ["high-risk", "tech", "review-needed"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      type: "vendor",
      title: "DataSecure India Ltd",
      description: "Vendor with multiple compliance violations",
      url: "/dashboard/vendors",
      tags: ["compliance", "watch-list"],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      type: "case",
      title: "Case #FRAUD-2024-456",
      description: "Ongoing investigation into duplicate payments",
      url: "/dashboard/cases",
      tags: ["urgent", "investigation"],
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  const filteredBookmarks = bookmarks.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || b.type === filterType
    return matchesSearch && matchesType
  })

  const handleDelete = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id))
    toast.success("Bookmark removed")
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="w-5 h-5" />
      case "vendor":
        return <Building2 className="w-5 h-5" />
      case "case":
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Bookmark className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-500/20 text-blue-500"
      case "vendor":
        return "bg-purple-500/20 text-purple-500"
      case "case":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">Bookmarks</h2>
          <p className="text-muted-foreground">Quick access to important items</p>
        </div>
      </div>

      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant={filterType === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterType("all")}>
            All
          </Button>
          <Button
            variant={filterType === "document" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("document")}
          >
            Documents
          </Button>
          <Button
            variant={filterType === "vendor" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("vendor")}
          >
            Vendors
          </Button>
          <Button
            variant={filterType === "case" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("case")}
          >
            Cases
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBookmarks.map((bookmark) => (
          <Card key={bookmark.id} className="glass-card hover-glow transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(bookmark.type)}`}>
                  {getIcon(bookmark.type)}
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(bookmark.id)} className="h-8 w-8 p-0">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <CardTitle className="text-base mt-3">{bookmark.title}</CardTitle>
              <CardDescription className="text-xs">{bookmark.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {bookmark.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <a href={bookmark.url}>
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Open
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookmarks.length === 0 && (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bookmark className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No bookmarks found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
