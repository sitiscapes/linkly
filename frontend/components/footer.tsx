import { Link2, Github, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Image src="/favicon.ico" alt="icon" width={24} height={24} />
            </div>
            <span className="font-semibold text-foreground">Linkly</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/sitiscapes/linkly"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">© 2026 Linkly. All rights reserved.</div>
      </div>
    </footer>
  )
}