import Link from "next/link";
import { categories, venues, regions } from "@/data/mock";
import VenueCard from "@/components/VenueCard";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  const categoryVenues = venues.filter((v) => v.categorySlug === slug);

  if (!category) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted">카테고리를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Category Header */}
      <section className="border-b border-card-border bg-card-bg">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-accent">홈</Link>
            <span>/</span>
            <span className="text-foreground">{category.name}</span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{category.name}</h1>
              <p className="mt-1 text-sm text-muted">{category.description}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">
            총 <span className="font-medium text-accent">{category.count}</span>개 업소
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full shrink-0 lg:w-60">
            <div className="sticky top-24 space-y-6">
              {/* Region Filter */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">지역</h3>
                <ul className="mt-3 space-y-1">
                  {regions.map((region) => (
                    <li key={region.name}>
                      <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-card-bg hover:text-foreground">
                        {region.name}
                        <span className="ml-1 text-xs text-muted">
                          ({categoryVenues.filter((v) => v.region === region.name).length})
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">가격대</h3>
                <ul className="mt-3 space-y-1">
                  {["₩ (저렴)", "₩₩ (보통)", "₩₩₩ (높음)", "₩₩₩₩ (매우 높음)"].map((price, i) => (
                    <li key={price}>
                      <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-card-bg hover:text-foreground">
                        {price}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Late Night Filter */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">영업시간</h3>
                <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-card-bg">
                  <input type="checkbox" className="accent-[#c8a96e]" />
                  심야 영업 가능
                </label>
              </div>
            </div>
          </aside>

          {/* Venue Grid */}
          <div className="flex-1">
            {/* Sort */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted">
                {categoryVenues.length}개 결과
              </p>
              <select className="rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-muted focus:border-accent focus:outline-none">
                <option>추천순</option>
                <option>별점 높은순</option>
                <option>리뷰 많은순</option>
                <option>가격 낮은순</option>
              </select>
            </div>

            {categoryVenues.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {categoryVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-card-border bg-card-bg">
                <p className="text-muted">등록된 업소가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
