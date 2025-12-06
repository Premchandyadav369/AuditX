"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tags, Plus, Trash2, Edit2 } from "lucide-react"
import { toast } from "sonner"

interface Tag {
  id: string
  name: string
  color: string
  count: number
}

export default function TagsManagerPage() {
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", name: "high-risk", color: "bg-red-500", count: 45 },
    { id: "2", name: "review-needed", color: "bg-orange-500", count: 32 },
    { id: "3", name: "compliance", color: "bg-blue-500", count: 28 },
    { id: "4", name: "urgent", color: "bg-red-600", count: 15 },
    { id: "5", name: "watch-list", color: "bg-yellow-500", count: 12 },
    { id: "6", name: "investigation", color: "bg-purple-500", count: 8 },
  ])

  const [newTagName, setNewTagName] = useState("")

  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      toast.error("Tag name cannot be empty")
      return
    }

    const newTag: Tag = {
      id: Date.now().toString(),
      name: newTagName.toLowerCase().replace(/\s+/g, "-"),
      color: "bg-primary",
      count: 0,
    }

    setTags([...tags, newTag])
    setNewTagName("")
    toast.success("Tag created successfully")
  }

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id))
    toast.success("Tag deleted")
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">Tags Manager</h2>
          <p className="text-muted-foreground">Organize and categorize your audit items</p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Create New Tag</CardTitle>
          <CardDescription>Add custom tags to organize your documents and cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter tag name..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
            />
            <Button onClick={handleCreateTag}>
              <Plus className="w-4 h-4 mr-2" />
              Create Tag
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tags.map((tag) => (
          <Card key={tag.id} className="glass-card hover-glow transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${tag.color}`} />
                  <div>
                    <CardTitle className="text-base">{tag.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">{tag.count} items</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteTag(tag.id)} className="h-8 w-8 p-0">
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className={`${tag.color} text-white border-0`}>
                {tag.name}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {tags.length === 0 && (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tags className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No tags created yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
