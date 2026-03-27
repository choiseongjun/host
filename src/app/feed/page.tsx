"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const feedCategories = ["전체", "바/라운지", "클럽", "룸살롱", "노래방", "중년노래방", "마사지", "호스트바"];
const feedTypes = [
  { key: "", label: "전체" },
  { key: "EVENT", label: "이벤트" },
  { key: "STATUS", label: "영업현황" },
  { key: "NOTICE", label: "공지" },
  { key: "PHOTO", label: "사진" },
];

const categoryIcons: Record<string, string> = { "바/라운지": "🍸", "클럽": "🎵", "룸살롱": "🥂", "노래방": "🎤", "중년노래방": "🎶", "마사지": "💆", "호스트바": "🌙" };
const typeColors: Record<string, string> = { EVENT: "bg-orange-500/20 text-orange-400", STATUS: "bg-blue-500/20 text-blue-400", NOTICE: "bg-yellow-500/20 text-yellow-400", PHOTO: "bg-purple-500/20 text-purple-400" };
const typeLabels: Record<string, string> = { EVENT: "이벤트", STATUS: "영업현황", NOTICE: "공지", PHOTO: "사진" };

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFeed(); }, [selectedCategory, selectedType]);

  async function fetchFeed() {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set("venueCategory", selectedCategory);
    if (selectedType) params.set("type", selectedType);
    const data = await api.feed.list(params.toString());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItems(data.items as any[]);
    setLoading(false);
  }

  return (
    <div>
      <section className="border-b border-card-border bg-card-bg">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground">실시간 피드</h1>
          <p className="mt-1 text-sm text-muted">업소들의 실시간 소식을 확인하세요</p>
          <div className="mt-4 flex gap-1.5 overflow-x-auto">
            {feedCategories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat === "전체" ? "" : cat)} className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${(cat === "전체" && !selectedCategory) || selectedCategory === cat ? "bg-accent text-black font-medium" : "border border-card-border text-muted hover:border-accent hover:text-accent"}`}>{cat}</button>
            ))}
          </div>
          <div className="mt-3 flex gap-1.5">
            {feedTypes.map((t) => (
              <button key={t.key} onClick={() => setSelectedType(t.key)} className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${selectedType === t.key ? "bg-accent/10 text-accent font-medium" : "text-muted hover:text-foreground"}`}>{t.label}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        {loading ? (
          <div className="flex h-48 items-center justify-center"><p className="text-muted">로딩 중...</p></div>
        ) : items.length > 0 ? items.map((item) => {
          const venue = item.venue as Record<string, string>;
          const type = item.type as string;
          return (
            <div key={item.id as string} className="rounded-xl border border-card-border bg-card-bg p-5 transition-all hover:border-accent/30">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-lg">{categoryIcons[venue?.category] || "🏢"}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link href={`/venue/${item.venueId}`} className="text-sm font-semibold text-foreground hover:text-accent">{venue?.name}</Link>
                      {item.isLive && <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400"><span className="h-1.5 w-1.5 rounded-full bg-green-400" />LIVE</span>}
                    </div>
                    <p className="text-xs text-muted">{venue?.category} · {(item.createdAt as string).split("T")[0]}</p>
                  </div>
                </div>
                <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${typeColors[type] || ""}`}>{typeLabels[type] || type}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-foreground/90">{item.content as string}</p>
              {(item.tags as string[])?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(item.tags as string[]).map((tag) => <span key={tag} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] text-muted">#{tag}</span>)}
                </div>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-card-border pt-3">
                <button className="text-xs text-muted hover:text-accent">❤️ {item.likes as number}</button>
                <Link href={`/venue/${item.venueId}`} className="text-xs text-accent hover:text-accent-hover">업소 보기 →</Link>
              </div>
            </div>
          );
        }) : (
          <div className="flex h-48 items-center justify-center rounded-xl border border-card-border bg-card-bg"><p className="text-sm text-muted">피드가 없습니다.</p></div>
        )}
      </div>
    </div>
  );
}
