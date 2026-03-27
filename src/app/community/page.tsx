"use client";

import Link from "next/link";
import { useState } from "react";
import { posts } from "@/data/mock";

const categoryTabs = ["전체", "자유", "추천/질문", "후기", "모임", "정보"];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("전체");
  const [keyword, setKeyword] = useState("");

  const pinnedPosts = posts.filter((p) => p.isPinned);
  const filtered = posts
    .filter((p) => !p.isPinned)
    .filter((p) => activeTab === "전체" || p.category === activeTab)
    .filter((p) => !keyword || p.title.includes(keyword) || p.content.includes(keyword));

  return (
    <div>
      {/* Header */}
      <section className="border-b border-card-border bg-card-bg">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">커뮤니티</h1>
              <p className="mt-1 text-sm text-muted">오늘 밤, 어디로 갈까?</p>
            </div>
            <Link
              href="/community/write"
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
            >
              글쓰기
            </Link>
          </div>

          {/* Search */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="제목, 내용으로 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="mt-4 flex gap-1 overflow-x-auto">
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                  activeTab === tab
                    ? "bg-accent text-black font-medium"
                    : "border border-card-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Pinned Posts */}
        {pinnedPosts.length > 0 && (
          <div className="mb-4 space-y-2">
            {pinnedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-5 py-3 transition-all hover:border-accent/40"
              >
                <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold text-black">공지</span>
                <span className="flex-1 text-sm font-medium text-foreground">{post.title}</span>
                <span className="text-xs text-muted">{post.date}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Post List */}
        <div className="space-y-2">
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className="group block rounded-xl border border-card-border bg-card-bg p-5 transition-all hover:border-accent/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                        post.category === "추천/질문"
                          ? "bg-blue-500/20 text-blue-400"
                          : post.category === "후기"
                          ? "bg-green-500/20 text-green-400"
                          : post.category === "모임"
                          ? "bg-purple-500/20 text-purple-400"
                          : post.category === "정보"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-zinc-500/20 text-zinc-400"
                      }`}
                    >
                      {post.category}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-accent">
                      {post.title}
                    </h3>
                    {post.commentCount > 20 && (
                      <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-400">HOT</span>
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-xs text-muted">{post.content}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted">{post.date}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                <span>{post.author}</span>
                <span>조회 {post.views}</span>
                <span>❤️ {post.likes}</span>
                <span>💬 {post.commentCount}</span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex h-48 items-center justify-center rounded-xl border border-card-border bg-card-bg">
            <p className="text-sm text-muted">게시글이 없습니다.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <button className="rounded-lg border border-card-border px-3 py-2 text-sm text-muted hover:border-accent hover:text-accent">
            ← 이전
          </button>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`h-9 w-9 rounded-lg text-sm transition-colors ${
                n === 1
                  ? "bg-accent text-black font-medium"
                  : "border border-card-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {n}
            </button>
          ))}
          <button className="rounded-lg border border-card-border px-3 py-2 text-sm text-muted hover:border-accent hover:text-accent">
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
}
