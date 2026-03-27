"use client";

import { useState } from "react";
import { venues, categories, regions } from "@/data/mock";
import VenueCard from "@/components/VenueCard";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [lateNightOnly, setLateNightOnly] = useState(false);

  const currentRegion = regions.find((r) => r.name === selectedRegion);

  const filteredVenues = venues.filter((v) => {
    if (keyword && !v.name.includes(keyword) && !v.tags.some((t) => t.includes(keyword))) return false;
    if (selectedCategory && v.categorySlug !== selectedCategory) return false;
    if (selectedRegion && v.region !== selectedRegion) return false;
    if (selectedDistrict && v.district !== selectedDistrict) return false;
    if (selectedPrice && v.priceLevel !== selectedPrice) return false;
    if (lateNightOnly && !v.lateNight) return false;
    return true;
  });

  return (
    <div>
      {/* Search Header */}
      <section className="border-b border-card-border bg-card-bg">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-xl font-bold text-foreground">업소 검색</h1>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="업소명, 키워드로 검색..."
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
          {/* Filters */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="sticky top-24 space-y-6">
              {/* Category */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">업종</h3>
                <ul className="mt-3 space-y-1">
                  <li>
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedCategory === ""
                          ? "bg-accent/10 text-accent"
                          : "text-muted hover:bg-card-bg hover:text-foreground"
                      }`}
                    >
                      전체
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <button
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          selectedCategory === cat.slug
                            ? "bg-accent/10 text-accent"
                            : "text-muted hover:bg-card-bg hover:text-foreground"
                        }`}
                      >
                        {cat.icon} {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Region */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">지역</h3>
                <select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setSelectedDistrict("");
                  }}
                  className="mt-3 w-full rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-muted focus:border-accent focus:outline-none"
                >
                  <option value="">전체 지역</option>
                  {regions.map((r) => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>

                {currentRegion && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {currentRegion.districts.map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDistrict(selectedDistrict === d ? "" : d)}
                        className={`rounded-full px-3 py-1 text-xs transition-colors ${
                          selectedDistrict === d
                            ? "bg-accent text-black"
                            : "border border-card-border text-muted hover:border-accent hover:text-accent"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">가격대</h3>
                <div className="mt-3 flex gap-2">
                  {[
                    { level: 0, label: "전체" },
                    { level: 1, label: "₩" },
                    { level: 2, label: "₩₩" },
                    { level: 3, label: "₩₩₩" },
                    { level: 4, label: "₩₩₩₩" },
                  ].map((p) => (
                    <button
                      key={p.level}
                      onClick={() => setSelectedPrice(p.level)}
                      className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                        selectedPrice === p.level
                          ? "bg-accent text-black"
                          : "border border-card-border text-muted hover:border-accent"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Late Night */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">영업시간</h3>
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={lateNightOnly}
                    onChange={(e) => setLateNightOnly(e.target.checked)}
                    className="accent-[#c8a96e]"
                  />
                  심야 영업 가능
                </label>
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  setKeyword("");
                  setSelectedCategory("");
                  setSelectedRegion("");
                  setSelectedDistrict("");
                  setSelectedPrice(0);
                  setLateNightOnly(false);
                }}
                className="w-full rounded-lg border border-card-border py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                필터 초기화
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted">
                검색 결과 <span className="font-medium text-foreground">{filteredVenues.length}</span>개
              </p>
              <select className="rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-muted focus:border-accent focus:outline-none">
                <option>추천순</option>
                <option>별점 높은순</option>
                <option>리뷰 많은순</option>
                <option>가격 낮은순</option>
              </select>
            </div>

            {filteredVenues.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-card-border bg-card-bg">
                <div className="text-center">
                  <p className="text-muted">검색 결과가 없습니다.</p>
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
