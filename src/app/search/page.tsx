"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import VenueCard from "@/components/VenueCard";

const categories = [
  { name: "룸살롱", slug: "room-salon", icon: "🥂" },
  { name: "바/라운지", slug: "bar-lounge", icon: "🍸" },
  { name: "노래방", slug: "karaoke", icon: "🎤" },
  { name: "클럽", slug: "club", icon: "🎵" },
  { name: "호스트바", slug: "host-bar", icon: "🌙" },
  { name: "중년노래방", slug: "middle-age-karaoke", icon: "🎶" },
  { name: "마사지", slug: "massage", icon: "💆" },
];

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [lateNightOnly, setLateNightOnly] = useState(false);
  const [venues, setVenues] = useState<unknown[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchVenues(); }, [selectedCategory, selectedRegion, lateNightOnly]);

  async function fetchVenues() {
    setLoading(true);
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedRegion) params.set("region", selectedRegion);
    if (lateNightOnly) params.set("lateNight", "true");
    const data = await api.venues.list(params.toString());
    setVenues(data.venues);
    setTotal(data.total);
    setLoading(false);
  }

  function toMock(v: Record<string, unknown>) {
    return { id: v.id as string, name: v.name as string, category: v.category as string, categorySlug: v.categorySlug as string, region: v.region as string, district: v.district as string, address: v.address as string, hours: v.hours as string, lateNight: v.lateNight as boolean, priceRange: (v.priceRange as string) || "", priceLevel: 2, phone: v.phone as string, tags: v.tags as string[], rating: v.rating as number, reviewCount: v.reviewCount as number, images: v.images as string[], description: (v.description as string) || "", isPremium: v.isPremium as boolean, isBanner: v.isBanner as boolean };
  }

  return (
    <div>
      <section className="border-b border-card-border bg-card-bg">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-xl font-bold text-foreground">업소 검색</h1>
          <div className="mt-4 flex gap-2">
            <input type="text" placeholder="업소명, 키워드로 검색..." value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchVenues()} className="flex-1 rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
            <button onClick={fetchVenues} className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">검색</button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-64">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground">업종</h3>
                <div className="mt-3 flex flex-col gap-1">
                  <button onClick={() => setSelectedCategory("")} className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${selectedCategory === "" ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"}`}>전체</button>
                  {categories.map((cat) => (
                    <button key={cat.slug} onClick={() => setSelectedCategory(cat.slug)} className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${selectedCategory === cat.slug ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"}`}>{cat.icon} {cat.name}</button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">영업시간</h3>
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-muted">
                  <input type="checkbox" checked={lateNightOnly} onChange={(e) => setLateNightOnly(e.target.checked)} className="accent-[#c8a96e]" />
                  심야 영업 가능
                </label>
              </div>
              <button onClick={() => { setKeyword(""); setSelectedCategory(""); setSelectedRegion(""); setLateNightOnly(false); }} className="w-full rounded-lg border border-card-border py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent">필터 초기화</button>
            </div>
          </aside>

          <div className="flex-1">
            <p className="mb-6 text-sm text-muted">검색 결과 <span className="font-medium text-foreground">{total}</span>개</p>
            {loading ? (
              <div className="flex h-64 items-center justify-center"><p className="text-muted">로딩 중...</p></div>
            ) : venues.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {venues.map((v) => <VenueCard key={(v as Record<string, unknown>).id as string} venue={toMock(v as Record<string, unknown>)} />)}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-card-border bg-card-bg"><p className="text-muted">검색 결과가 없습니다.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
