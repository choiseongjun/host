"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import JobCard from "@/components/JobCard";

const categories = [
  { name: "룸살롱", slug: "room-salon" }, { name: "바/라운지", slug: "bar-lounge" }, { name: "노래방", slug: "karaoke" },
  { name: "클럽", slug: "club" }, { name: "호스트바", slug: "host-bar" }, { name: "중년노래방", slug: "middle-age-karaoke" }, { name: "마사지", slug: "massage" },
];

export default function JobsPage() {
  const [jobType, setJobType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchJobs(); }, [jobType, selectedCategory]);

  async function fetchJobs() {
    setLoading(true);
    const params = new URLSearchParams();
    if (jobType) params.set("type", jobType);
    if (selectedCategory) params.set("category", selectedCategory);
    const data = await api.jobs.list(params.toString());
    setJobs(data.jobs as Record<string, unknown>[]);
    setLoading(false);
  }

  function toMock(j: Record<string, unknown>) {
    return {
      id: j.id as string, type: (j.type as string) === "HIRING" ? "구인" as const : "구직" as const,
      title: j.title as string, category: j.category as string, region: j.region as string,
      district: (j.district as string) || "", salary: j.salary as string, workHours: (j.workHours as string) || "",
      gender: (j.gender as string) || "", age: (j.age as string) || "", description: j.description as string,
      requirements: j.requirements as string[], contact: j.contact as string,
      author: ((j.author as Record<string, string>)?.nickname) || "",
      date: (j.createdAt as string).split("T")[0],
      isUrgent: j.isUrgent as boolean, isPremium: j.isPremium as boolean,
    };
  }

  return (
    <div>
      <section className="border-b border-card-border bg-card-bg">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-xl font-bold text-foreground">구인구직</h1>
          <div className="mt-4 flex gap-2">
            <input type="text" placeholder="직종, 지역, 키워드 검색..." value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchJobs()} className="flex-1 rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
            <button onClick={fetchJobs} className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">검색</button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-60">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground">유형</h3>
                <div className="mt-3 flex flex-col gap-1">
                  {[{ v: "", l: "전체" }, { v: "HIRING", l: "구인" }, { v: "SEEKING", l: "구직" }].map((o) => (
                    <button key={o.v} onClick={() => setJobType(o.v)} className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${jobType === o.v ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"}`}>{o.l}</button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">업종</h3>
                <div className="mt-3 flex flex-col gap-1">
                  <button onClick={() => setSelectedCategory("")} className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${selectedCategory === "" ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"}`}>전체</button>
                  {categories.map((c) => (
                    <button key={c.name} onClick={() => setSelectedCategory(c.name)} className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${selectedCategory === c.name ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"}`}>{c.name}</button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex h-64 items-center justify-center"><p className="text-muted">로딩 중...</p></div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {jobs.map((j) => <JobCard key={j.id as string} job={toMock(j)} />)}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-card-border bg-card-bg"><p className="text-muted">등록된 글이 없습니다.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
