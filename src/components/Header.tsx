"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

const navItems = [
  { name: "서울 룸살롱", href: "/category/room-salon" },
  { name: "서울 바", href: "/category/bar-lounge" },
  { name: "서울 노래방", href: "/category/karaoke" },
  { name: "서울 클럽", href: "/category/club" },
  { name: "서울 호스트바", href: "/category/host-bar" },
  { name: "서울 중년노래방", href: "/category/middle-age-karaoke" },
  { name: "서울 감성마사지/스웨디시", href: "/category/massage" },
  { name: "커뮤니티", href: "/community" },
  { name: "실시간 목소리", href: "/feed" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    setMobileOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-accent">사랑과</span>
          <span className="text-foreground">전쟁</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2.5 py-2 text-xs text-muted transition-colors hover:bg-card-bg hover:text-foreground"
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
          {user ? (
            <>
              <Link
                href="/mypage"
                className="rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                {user.nickname}님
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition-colors hover:border-red-500/50 hover:text-red-400"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                로그인
              </Link>
              <Link
                href="/venue/register"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
              >
                업소 등록
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-card-border lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="text-lg">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="border-t border-card-border bg-background px-4 py-4 lg:hidden">
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
          {user ? (
            <>
              <Link
                href="/mypage"
                className="block rounded-lg px-3 py-3 text-sm text-muted"
                onClick={() => setMobileOpen(false)}
              >
                마이페이지 ({user.nickname})
              </Link>
              <button
                onClick={handleLogout}
                className="mt-2 w-full rounded-lg border border-card-border py-3 text-center text-sm text-red-400 transition-colors hover:border-red-500/50"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/mypage"
                className="block rounded-lg px-3 py-3 text-sm text-muted"
                onClick={() => setMobileOpen(false)}
              >
                마이페이지
              </Link>
              <div className="mt-2 flex gap-2">
                <Link
                  href="/auth/login"
                  className="flex-1 rounded-lg border border-card-border py-3 text-center text-sm text-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex-1 rounded-lg bg-accent py-3 text-center text-sm font-medium text-black"
                  onClick={() => setMobileOpen(false)}
                >
                  회원가입
                </Link>
              </div>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
