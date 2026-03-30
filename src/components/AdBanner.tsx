"use client";

import Link from "next/link";

interface AdBannerProps {
  variant?: "horizontal" | "sidebar" | "inline";
}

export default function AdBanner({ variant = "horizontal" }: AdBannerProps) {
  if (variant === "sidebar") {
    return (
      <div className="rounded-xl border border-zinc-300 bg-white p-4">
        <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-500">AD</span>
        <p className="mt-3 text-sm font-semibold text-zinc-800">프리미엄 광고</p>
        <p className="mt-1 text-xs text-zinc-500">이 자리에 광고를 게재하세요</p>
        <Link href="#" className="mt-3 block rounded-lg bg-accent py-2 text-center text-xs font-medium text-black transition-colors hover:bg-accent-hover">
          광고 문의
        </Link>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="rounded-xl border border-zinc-300 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-500">AD</span>
            <p className="text-sm text-zinc-500">이 자리에 업소 광고를 게재할 수 있습니다</p>
          </div>
          <Link href="#" className="shrink-0 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:bg-zinc-100">
            광고 문의
          </Link>
        </div>
      </div>
    );
  }

  // horizontal (기본)
  return (
    <div className="rounded-xl border border-zinc-300 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-500">AD</span>
            <p className="text-sm font-semibold text-zinc-800">광고 영역</p>
          </div>
          <p className="mt-1 text-xs text-zinc-500">이 자리에 배너 광고를 게재하세요. 더 많은 고객에게 노출됩니다.</p>
        </div>
        <Link href="#" className="shrink-0 rounded-lg border border-zinc-300 px-4 py-2 text-xs text-zinc-600 transition-colors hover:bg-zinc-100">
          광고 문의하기
        </Link>
      </div>
    </div>
  );
}
