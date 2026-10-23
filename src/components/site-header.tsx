"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8 md:py-7">
        <Link
          href="/"
          className={cn(
            "font-display text-2xl tracking-tight md:text-3xl",
            isAdmin ? "text-ink" : "text-paper"
          )}
        >
          Sanwra Traders
        </Link>
        <nav className="flex items-center gap-4 text-sm md:gap-6">
          <a
            href="#collection"
            className={cn(
              "transition hover:opacity-80",
              isAdmin ? "text-ink/70" : "text-paper/85"
            )}
          >
            Collection
          </a>
          <Link
            href="/admin"
            className={cn(
              "transition hover:opacity-80",
              isAdmin ? "text-ink/70" : "text-paper/85"
            )}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
