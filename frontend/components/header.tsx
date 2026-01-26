"use client"

import { Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Image src="/favicon.ico" alt="icon" width={24} height={24} />
          </div>
          <span className="text-xl font-semibold text-foreground">Linkly</span>
        </Link>
      </div>
    </header>
  )
}