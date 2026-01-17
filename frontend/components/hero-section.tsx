"use client"

import { useState } from "react"
import { ArrowRight, Copy, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleShorten = async () => {
    if (!url) return
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3000/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten link');
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);

      // Save to localStorage
      const savedCodes = JSON.parse(localStorage.getItem('recentLinks') || '[]');
      if (!savedCodes.includes(data.code)) {
        const newCodes = [data.code, ...savedCodes].slice(0, 10); // Keep last 10
        localStorage.setItem('recentLinks', JSON.stringify(newCodes));

        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-32">
      {/* Decorative background elements */}
      <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">Fast, simple, and free</span>
        </div>

        <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Shorten your links, <span className="text-primary">amplify your reach</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-pretty text-lg text-muted-foreground">
          Create short, memorable links in seconds. Track clicks, analyze performance, and share with confidence.
        </p>

        <div className="mx-auto max-w-xl">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="url"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 flex-1 rounded-lg border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
            <Button
              onClick={handleShorten}
              disabled={!url || isLoading}
              className="h-12 gap-2 rounded-lg bg-primary px-6 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Shortening...
                </span>
              ) : (
                <>
                  Shorten <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {shortUrl && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Your shortened link</p>
                    <p className="font-medium text-foreground">{shortUrl}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2 rounded-lg border-border text-foreground hover:text-accent hover:bg-secondary bg-transparent"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-accent" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}