"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "마이페이지", href: "/mypage", icon: "👤" },
  { name: "내 즐겨찾기", href: "/mypage/favorites", icon: "❤️" },
];

export default function MypageSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <div className="sticky top-24">
        {/* Profile Summary */}
        <div className="rounded-xl border border-card-border bg-card-bg p-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-accent/10 text-2xl">
            👤
          </div>
          <h3 className="mt-3 text-sm font-semibold text-foreground">내 프로필</h3>
          <p className="mt-0.5 text-xs text-muted">일반회원</p>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                pathname === item.href
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-card-bg hover:text-foreground"
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <button className="mt-4 w-full rounded-lg border border-card-border py-2.5 text-sm text-muted transition-colors hover:border-red-500/50 hover:text-red-400">
          로그아웃
        </button>
      </div>
    </aside>
  );
}
