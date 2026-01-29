"use client"

import { useState, useEffect } from "react"
import { Copy, Check, ExternalLink, MoreHorizontal, Trash2, Link2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Link {
  id: number;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

export function RecentLinksSection() {
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [links, setLinks] = useState<Link[]>([])

  const fetchLinks = async () => {
    try {
      const savedCodes = JSON.parse(localStorage.getItem('recentLinks') || '[]');

      if (savedCodes.length === 0) {
        setLinks([]);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/links/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codes: savedCodes })
      });

      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      console.error("Failed to fetch links", err);
    }
  };

  useEffect(() => {
    fetchLinks();

    const handleStorageChange = () => fetchLinks();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const handleCopy = (id: number, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete/${id}`, {
        method: 'DELETE',
      });
      fetchLinks();
    } catch (err) {
      console.error("Failed to delete link", err);
    }
  }

  const handleOpenLink = () => {
    setTimeout(() => {
      fetchLinks();
    }, 1000);
  }

  const handleShare = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Linkly - Shortened Link',
          text: 'Check out this shortened link!',
          url: url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Error sharing", err);
        }
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopiedId(-1); // Special ID for general copy
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Recent Links</h2>
        </div>

        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16 px-4 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Link2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">No links yet</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Start shortening your URLs above and they will appear here for easy access and tracking.
            </p>
            <Button
              variant="outline"
              className="rounded-lg border-primary/30 text-primary hover:text-accent hover:bg-primary/10 bg-transparent"
              onClick={() => {
                const input = document.querySelector('input[type="url"]') as HTMLInputElement
                input?.focus()
              }}
            >
              Shorten your first link
            </Button>
          </div>
        ) : (

        <div className="space-y-4">
          {links.map((link) => (
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
                    className="h-7 w-7 rounded-lg p-0 text-muted-foreground hover:text-accent-foreground"
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
                      className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:text-accent-foreground"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-lg">
                    <DropdownMenuItem>
                      <Link
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-row items-center gap-2 hover:text-accent-foreground"
                        onClick={handleOpenLink}
                      >
                        <ExternalLink className="h-4 w-4 hover:text-accent-foreground" />
                        Open link
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="gap-2 cursor-pointer"
                        onClick={() => handleShare(link.shortUrl)}
                      >
                        <Share2 className="h-4 w-4" />
                        Share link
                      </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive bg-accent-foreground hover:text-destructive/80! hover:bg-destructive/10! cursor-pointer">
                      <button
                        className="flex flex-row items-center gap-2"
                        onClick={() => handleDelete(link.id)}
                      >
                        <Trash2 className="h-4 w-4 hover:text-destructive/80" />
                        Delete
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  )
}