"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { name: "룸살롱", href: "/category/room-salon" },
  { name: "바/라운지", href: "/category/bar-lounge" },
  { name: "노래방", href: "/category/karaoke" },
  { name: "클럽", href: "/category/club" },
  { name: "호스트바", href: "/category/host-bar" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-accent">NIGHT</span>
          <span className="text-foreground">GUIDE</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-card-bg hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/search"
            className="rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            검색
          </Link>
          <Link
            href="#"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
          >
            업소 등록
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-card-border md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="text-lg">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="border-t border-card-border bg-background px-4 py-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-3 text-sm text-muted transition-colors hover:bg-card-bg hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <hr className="my-3 border-card-border" />
          <Link
            href="/search"
            className="block rounded-lg px-3 py-3 text-sm text-muted"
            onClick={() => setMobileOpen(false)}
          >
            검색
          </Link>
          <Link
            href="#"
            className="mt-2 block rounded-lg bg-accent px-3 py-3 text-center text-sm font-medium text-black"
            onClick={() => setMobileOpen(false)}
          >
            업소 등록
          </Link>
        </nav>
      )}
    </header>
  );
}
