"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const categoryTabs = [
  { key: "latest", label: "최신" },
  { key: "vote", label: "투표" },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("latest");
  const [keyword, setKeyword] = useState("");
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, [activeTab]);

  async function fetchPosts() {
    setLoading(true);
    if (activeTab === "vote") {
      // 투표 탭 - 투표 게시글만 표시
      const params = new URLSearchParams();
      params.set("category", "VOTE");
      if (keyword) params.set("keyword", keyword);
      const data = await api.posts.list(params.toString());
      setPosts(data.posts as Record<string, unknown>[]);
    } else {
      // 최신 탭 - 전체 최신순
      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      const data = await api.posts.list(params.toString());
      setPosts(data.posts as Record<string, unknown>[]);
    }
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
          <div className="mt-4 flex gap-2">
            {categoryTabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`shrink-0 rounded-full px-6 py-2.5 text-sm transition-colors ${activeTab === tab.key ? "bg-accent text-black font-medium" : "border border-card-border text-muted hover:border-accent hover:text-accent"}`}>{tab.label}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-3">
        {loading ? (
          <div className="flex h-48 items-center justify-center"><p className="text-muted">로딩 중...</p></div>
        ) : activeTab === "vote" ? (
          /* 투표 영역 */
          posts.length > 0 ? posts.map((post) => {
            const author = post.author as Record<string, string>;
            return (
              <div key={post.id as string} className="rounded-xl border border-card-border bg-card-bg p-6">
                <h3 className="text-base font-semibold text-foreground">{post.title as string}</h3>
                <p className="mt-2 text-sm text-muted">{post.content as string}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button className="rounded-xl border-2 border-accent/30 bg-accent/5 py-4 text-sm font-medium text-foreground transition-all hover:border-accent hover:bg-accent/10">
                    👈 왼쪽
                  </button>
                  <button className="rounded-xl border-2 border-accent/30 bg-accent/5 py-4 text-sm font-medium text-foreground transition-all hover:border-accent hover:bg-accent/10">
                    오른쪽 👉
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted">
                  <span>{author?.nickname || "운영팀"}</span>
                  <span>❤️ {post.likes as number} · 참여 {(post.views as number) || 0}명</span>
                </div>
              </div>
            );
          }) : (
            <div className="flex h-48 items-center justify-center rounded-xl border border-card-border bg-card-bg"><p className="text-sm text-muted">투표가 없습니다.</p></div>
          )
        ) : (
          /* 최신 글 목록 */
          posts.length > 0 ? posts.map((post) => {
            const author = post.author as Record<string, string>;
            return (
              <Link key={post.id as string} href={`/community/${post.id}`} className="group block rounded-xl border border-card-border bg-card-bg p-5 transition-all hover:border-accent/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-accent">{post.title as string}</h3>
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
          )
        )}
      </div>
    </div>
  );
}
