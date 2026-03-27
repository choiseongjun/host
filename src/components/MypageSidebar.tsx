"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "대시보드", href: "/mypage", icon: "📊" },
  { name: "프로필 수정", href: "/mypage/edit", icon: "👤" },
  { name: "찜 목록", href: "/mypage/favorites", icon: "❤️" },
  { name: "내 리뷰", href: "/mypage/reviews", icon: "✍️" },
  { name: "내 구인구직", href: "/mypage/jobs", icon: "💼" },
  { name: "업소 관리", href: "/mypage/venue", icon: "🏢" },
  { name: "메뉴 관리", href: "/mypage/venue/menu", icon: "📋" },
  { name: "가격표 관리", href: "/mypage/venue/price", icon: "💰" },
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
          <h3 className="mt-3 text-sm font-semibold text-foreground">강남유저123</h3>
          <p className="mt-0.5 text-xs text-muted">일반회원</p>
          <div className="mt-3 flex justify-center gap-4 border-t border-card-border pt-3">
            <div className="text-center">
              <p className="text-sm font-semibold text-accent">12</p>
              <p className="text-[10px] text-muted">리뷰</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-accent">8</p>
              <p className="text-[10px] text-muted">찜</p>
            </div>
          </div>
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
