"use client";

import Link from "next/link";

interface AdBannerProps {
  variant?: "horizontal" | "sidebar" | "inline";
}

export default function AdBanner({ variant = "horizontal" }: AdBannerProps) {
  if (variant === "sidebar") {
    return (
      <div className="rounded-xl border border-accent/20 bg-gradient-to-b from-accent/10 to-transparent p-4">
        <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent">AD</span>
        <p className="mt-3 text-sm font-semibold text-foreground">프리미엄 광고</p>
        <p className="mt-1 text-xs text-muted">이 자리에 광고를 게재하세요</p>
        <Link href="#" className="mt-3 block rounded-lg bg-accent py-2 text-center text-xs font-medium text-black transition-colors hover:bg-accent-hover">
          광고 문의
        </Link>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="rounded-xl border border-accent/20 bg-gradient-to-r from-accent/5 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent">AD</span>
            <p className="text-sm text-muted">이 자리에 업소 광고를 게재할 수 있습니다</p>
          </div>
          <Link href="#" className="shrink-0 rounded-lg border border-accent/30 px-3 py-1.5 text-xs text-accent transition-colors hover:bg-accent/10">
            광고 문의
          </Link>
        </div>
      </div>
    );
  }

  // horizontal (기본)
  return (
    <div className="rounded-xl border border-accent/20 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent">AD</span>
            <p className="text-sm font-semibold text-foreground">광고 영역</p>
          </div>
          <p className="mt-1 text-xs text-muted">이 자리에 배너 광고를 게재하세요. 더 많은 고객에게 노출됩니다.</p>
        </div>
        <Link href="#" className="shrink-0 rounded-lg border border-accent/30 px-4 py-2 text-xs text-accent transition-colors hover:bg-accent/10">
          광고 문의하기
        </Link>
      </div>
    </div>
  );
}
