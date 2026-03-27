"use client";

import Link from "next/link";
import { useState } from "react";
import { feedItems } from "@/data/mock";

const feedCategories = ["전체", "바/라운지", "클럽", "룸살롱", "노래방", "중년노래방", "마사지", "호스트바"];
const feedTypes = [
  { key: "", label: "전체" },
  { key: "event", label: "이벤트" },
  { key: "status", label: "영업현황" },
  { key: "notice", label: "공지" },
  { key: "photo", label: "사진" },
];

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const filtered = feedItems.filter((f) => {
    if (selectedCategory && f.venueCategory !== selectedCategory) return false;
    if (selectedType && f.type !== selectedType) return false;
    return true;
  });

  const liveCount = feedItems.filter((f) => f.isLive).length;

  return (
    <div>
      {/* Header */}
      <section className="border-b border-card-border bg-card-bg">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">실시간 피드</h1>
              <p className="mt-1 text-sm text-muted">
                업소들의 실시간 소식을 확인하세요
                <span className="ml-2 inline-flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  <span className="text-xs text-green-400">{liveCount}개 라이브</span>
                </span>
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-4 flex gap-1.5 overflow-x-auto">
            {feedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === "전체" ? "" : cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                  (cat === "전체" && selectedCategory === "") || selectedCategory === cat
                    ? "bg-accent text-black font-medium"
                    : "border border-card-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="mt-3 flex gap-1.5">
            {feedTypes.map((t) => (
              <button
                key={t.key}
                onClick={() => setSelectedType(t.key)}
                className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  selectedType === t.key
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feed List */}
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-card-border bg-card-bg p-5 transition-all hover:border-accent/30"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-lg">
                  {item.venueCategory === "바/라운지" && "🍸"}
                  {item.venueCategory === "클럽" && "🎵"}
                  {item.venueCategory === "룸살롱" && "🥂"}
                  {item.venueCategory === "노래방" && "🎤"}
                  {item.venueCategory === "중년노래방" && "🎶"}
                  {item.venueCategory === "마사지" && "💆"}
                  {item.venueCategory === "호스트바" && "🌙"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/venue/${item.venueId}`} className="text-sm font-semibold text-foreground hover:text-accent">
                      {item.venueName}
                    </Link>
                    {item.isLive && (
                      <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted">{item.venueCategory} · {item.date} {item.time}</p>
                </div>
              </div>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                  item.type === "event"
                    ? "bg-orange-500/20 text-orange-400"
                    : item.type === "status"
                    ? "bg-blue-500/20 text-blue-400"
                    : item.type === "notice"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-purple-500/20 text-purple-400"
                }`}
              >
                {item.type === "event" ? "이벤트" : item.type === "status" ? "영업현황" : item.type === "notice" ? "공지" : "사진"}
              </span>
            </div>

            {/* Content */}
            <p className="mt-4 text-sm leading-6 text-foreground/90">{item.content}</p>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] text-muted">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-card-border pt-3">
              <div className="flex gap-4">
                <button className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent">
                  ❤️ {item.likes}
                </button>
                <button className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent">
                  💬 댓글
                </button>
                <button className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent">
                  🔗 공유
                </button>
              </div>
              <Link href={`/venue/${item.venueId}`} className="text-xs text-accent hover:text-accent-hover">
                업소 보기 →
              </Link>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex h-48 items-center justify-center rounded-xl border border-card-border bg-card-bg">
            <p className="text-sm text-muted">피드가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
