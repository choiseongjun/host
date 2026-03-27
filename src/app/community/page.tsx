"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const categoryTabs = [
  { key: "", label: "전체" },
  { key: "FREE", label: "자유" },
  { key: "RECOMMEND", label: "추천/질문" },
  { key: "REVIEW", label: "후기" },
  { key: "MEETUP", label: "모임" },
  { key: "INFO", label: "정보" },
];

const catColors: Record<string, string> = {
  RECOMMEND: "bg-blue-500/20 text-blue-400",
  REVIEW: "bg-green-500/20 text-green-400",
  MEETUP: "bg-purple-500/20 text-purple-400",
  INFO: "bg-yellow-500/20 text-yellow-400",
  FREE: "bg-zinc-500/20 text-zinc-400",
};

const catLabels: Record<string, string> = { RECOMMEND: "추천/질문", REVIEW: "후기", MEETUP: "모임", INFO: "정보", FREE: "자유" };

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("");
  const [keyword, setKeyword] = useState("");
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, [activeTab]);

  async function fetchPosts() {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeTab) params.set("category", activeTab);
    if (keyword) params.set("keyword", keyword);
    const data = await api.posts.list(params.toString());
    setPosts(data.posts as Record<string, unknown>[]);
    setLoading(false);
  }

  return (
    <div>
      <section className="border-b border-card-border bg-card-bg">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">커뮤니티</h1>
              <p className="mt-1 text-sm text-muted">오늘 밤, 어디로 갈까?</p>
            </div>
            <Link href="/community/write" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-accent-hover">글쓰기</Link>
          </div>
          <input type="text" placeholder="제목, 내용으로 검색..." value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchPosts()} className="mt-4 w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
          <div className="mt-4 flex gap-1 overflow-x-auto">
            {categoryTabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${activeTab === tab.key ? "bg-accent text-black font-medium" : "border border-card-border text-muted hover:border-accent hover:text-accent"}`}>{tab.label}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-2">
        {loading ? (
          <div className="flex h-48 items-center justify-center"><p className="text-muted">로딩 중...</p></div>
        ) : posts.length > 0 ? posts.map((post) => {
          const cat = post.category as string;
          const author = post.author as Record<string, string>;
          return (
            <Link key={post.id as string} href={`/community/${post.id}`} className="group block rounded-xl border border-card-border bg-card-bg p-5 transition-all hover:border-accent/40">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${catColors[cat] || catColors.FREE}`}>{catLabels[cat] || cat}</span>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-accent">{post.title as string}</h3>
                    {(post.commentCount as number) > 20 && <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-400">HOT</span>}
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-xs text-muted">{post.content as string}</p>
                </div>
                <span className="text-xs text-muted">{(post.createdAt as string).split("T")[0]}</span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                <span>{author?.nickname || "익명"}</span>
                <span>조회 {post.views as number}</span>
                <span>❤️ {post.likes as number}</span>
                <span>💬 {post.commentCount as number}</span>
              </div>
            </Link>
          );
        }) : (
          <div className="flex h-48 items-center justify-center rounded-xl border border-card-border bg-card-bg"><p className="text-sm text-muted">게시글이 없습니다.</p></div>
        )}
      </div>
    </div>
  );
}
