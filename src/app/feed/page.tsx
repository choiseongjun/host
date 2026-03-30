"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import AdBanner from "@/components/AdBanner";

export default function FeedPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFeed(); }, []);

  async function fetchFeed() {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("type", "EVENT");
    const data = await api.feed.list(params.toString());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItems(data.items as any[]);
    setLoading(false);
  }

  return (
    <div>
      <section className="border-b border-card-border bg-card-bg">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground">실시간 목소리</h1>
          <p className="mt-1 text-sm text-muted">업소들의 실시간 이벤트 소식을 확인하세요</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        {/* 상단 광고 */}
        <AdBanner />

        {loading ? (
          <div className="flex h-48 items-center justify-center"><p className="text-muted">로딩 중...</p></div>
        ) : items.length > 0 ? items.map((item) => {
          const venue = item.venue as Record<string, string>;
          return (
            <div key={item.id as string} className="rounded-xl border border-card-border bg-card-bg p-5 transition-all hover:border-accent/30">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-lg">🏢</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{venue?.name}</span>
                      {item.isLive && <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400"><span className="h-1.5 w-1.5 rounded-full bg-green-400" />LIVE</span>}
                    </div>
                    <p className="text-xs text-muted">{venue?.category} · {(item.createdAt as string).split("T")[0]}</p>
                  </div>
                </div>
                <span className="rounded px-2 py-0.5 text-[10px] font-medium bg-orange-500/20 text-orange-400">이벤트</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-foreground/90">{item.content as string}</p>
              {(item.tags as string[])?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(item.tags as string[]).map((tag) => <span key={tag} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] text-muted">#{tag}</span>)}
                </div>
              )}
              {/* 전화번호/주소만 표시 */}
              <div className="mt-4 flex items-center justify-between border-t border-card-border pt-3">
                <div className="flex items-center gap-4 text-xs text-muted">
                  {venue?.phone && (
                    <a href={`tel:${venue.phone}`} className="flex items-center gap-1 text-accent hover:text-accent-hover">
                      📞 즉시연결
                    </a>
                  )}
                  {venue?.address && <span>📍 {venue.address}</span>}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="flex h-48 items-center justify-center rounded-xl border border-card-border bg-card-bg"><p className="text-sm text-muted">이벤트가 없습니다.</p></div>
        )}
      </div>
    </div>
  );
}
