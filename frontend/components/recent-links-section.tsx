"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockLinks = [
  {
    id: 1,
    shortUrl: "linkly.co/abc123",
    originalUrl: "https://example.com/very/long/url/that/needs/shortening",
    clicks: 1234,
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    shortUrl: "linkly.co/xyz789",
    originalUrl: "https://another-example.com/path/to/resource",
    clicks: 567,
    createdAt: "Yesterday",
  },
  {
    id: 3,
    shortUrl: "linkly.co/def456",
    originalUrl: "https://verylongdomainname.com/with/multiple/paths/included",
    clicks: 89,
    createdAt: "3 days ago",
  },
]

export function RecentLinksSection() {
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const handleCopy = (id: number, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Recent Links</h2>
          <Button
            variant="outline"
            className="rounded-lg border-border text-muted-foreground hover:text-foreground bg-transparent"
          >
            View all
          </Button>
        </div>

        <div className="space-y-4">
          {mockLinks.map((link) => (
            <div
              key={link.id}
              className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{link.shortUrl}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 rounded-lg p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => handleCopy(link.id, link.shortUrl)}
                  >
                    {copiedId === link.id ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="truncate text-sm text-muted-foreground">{link.originalUrl}</p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{link.clicks.toLocaleString()} clicks</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{link.createdAt}</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-lg">
                    <DropdownMenuItem className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Open link
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}