"use client";

import { useState } from "react";
import { jobs, categories, regions } from "@/data/mock";
import JobCard from "@/components/JobCard";
import Link from "next/link";

export default function JobsPage() {
  const [jobType, setJobType] = useState<"" | "구인" | "구직">("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [keyword, setKeyword] = useState("");

  const filtered = jobs.filter((j) => {
    if (jobType && j.type !== jobType) return false;
    if (selectedCategory && j.category !== selectedCategory) return false;
    if (selectedRegion && j.region !== selectedRegion) return false;
    if (keyword && !j.title.includes(keyword) && !j.description.includes(keyword)) return false;
    return true;
  });

  const hiringCount = jobs.filter((j) => j.type === "구인").length;
  const seekingCount = jobs.filter((j) => j.type === "구직").length;

  return (
    <div>
      {/* Header */}
      <section className="border-b border-card-border bg-card-bg">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-accent">홈</Link>
            <span>/</span>
            <span className="text-foreground">구인구직</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">구인구직</h1>
          <p className="mt-1 text-sm text-muted">
            구인 <span className="text-blue-400 font-medium">{hiringCount}</span>건 · 구직 <span className="text-emerald-400 font-medium">{seekingCount}</span>건
          </p>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="직종, 지역, 키워드 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <button className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
              검색
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full shrink-0 lg:w-60">
            <div className="sticky top-24 space-y-6">
              {/* Type Filter */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">유형</h3>
                <div className="mt-3 flex flex-col gap-1">
                  {[
                    { value: "" as const, label: "전체" },
                    { value: "구인" as const, label: "구인" },
                    { value: "구직" as const, label: "구직" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setJobType(opt.value)}
                      className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        jobType === opt.value
                          ? "bg-accent/10 text-accent"
                          : "text-muted hover:bg-card-bg hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">업종</h3>
                <div className="mt-3 flex flex-col gap-1">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selectedCategory === ""
                        ? "bg-accent/10 text-accent"
                        : "text-muted hover:bg-card-bg hover:text-foreground"
                    }`}
                  >
                    전체
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedCategory === cat.name
                          ? "bg-accent/10 text-accent"
                          : "text-muted hover:bg-card-bg hover:text-foreground"
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Region Filter */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">지역</h3>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="mt-3 w-full rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-muted focus:border-accent focus:outline-none"
                >
                  <option value="">전체 지역</option>
                  {regions.map((r) => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  setJobType("");
                  setSelectedCategory("");
                  setSelectedRegion("");
                  setKeyword("");
                }}
                className="w-full rounded-lg border border-card-border py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                필터 초기화
              </button>

              {/* CTA */}
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                <p className="text-sm font-medium text-foreground">구인/구직 등록</p>
                <p className="mt-1 text-xs text-muted">무료로 구인·구직 글을 등록할 수 있습니다.</p>
                <button className="mt-3 w-full rounded-lg bg-accent py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
                  글 작성하기
                </button>
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted">
                {filtered.length}개 결과
              </p>
              <select className="rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-muted focus:border-accent focus:outline-none">
                <option>최신순</option>
                <option>급여 높은순</option>
              </select>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filtered.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-card-border bg-card-bg">
                <div className="text-center">
                  <p className="text-muted">등록된 글이 없습니다.</p>
                  <p className="mt-1 text-sm text-muted">필터를 변경해보세요.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
