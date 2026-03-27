import Link from "next/link";
import { categories, venues } from "@/data/mock";
import VenueCard from "@/components/VenueCard";

export default function Home() {
  const bannerVenues = venues.filter((v) => v.isBanner);
  const premiumVenues = venues.filter((v) => v.isPremium);
  const recentVenues = venues.slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-card-border">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-accent">NIGHT</span>GUIDE
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-muted">
            대한민국 No.1 나이트라이프 가이드
            <br />
            검증된 업소 정보와 실제 리뷰를 확인하세요
          </p>
          <div className="mx-auto mt-8 flex max-w-lg gap-2">
            <input
              type="text"
              placeholder="업소명, 지역, 키워드로 검색..."
              className="flex-1 rounded-xl border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <Link
              href="/search"
              className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
            >
              검색
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Ads */}
      {bannerVenues.length > 0 && (
        <section className="border-b border-card-border bg-card-bg">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {bannerVenues.map((venue) => (
                <Link
                  key={venue.id}
                  href={`/venue/${venue.id}`}
                  className="group relative overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-r from-accent/10 to-transparent p-6 transition-all hover:border-accent/40"
                >
                  <span className="absolute right-3 top-3 rounded bg-accent/20 px-2 py-0.5 text-[10px] text-accent">
                    AD
                  </span>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-accent">
                    {venue.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {venue.region} {venue.district} · {venue.category}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{venue.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-accent">★ {venue.rating}</span>
                    <span className="text-xs text-muted">리뷰 {venue.reviewCount}개</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-xl font-bold text-foreground">카테고리</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group rounded-xl border border-card-border bg-card-bg p-5 text-center transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="text-3xl">{cat.icon}</div>
              <h3 className="mt-3 text-sm font-semibold text-foreground group-hover:text-accent">
                {cat.name}
              </h3>
              <p className="mt-1 text-xs text-muted">{cat.count}개 업소</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium Listings */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">프리미엄 업소</h2>
            <p className="mt-1 text-sm text-muted">검증된 프리미엄 업소를 만나보세요</p>
          </div>
          <Link href="/search" className="text-sm text-accent hover:text-accent-hover">
            전체보기 →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {premiumVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">최근 등록</h2>
            <p className="mt-1 text-sm text-muted">새로 등록된 업소를 확인하세요</p>
          </div>
          <Link href="/search" className="text-sm text-accent hover:text-accent-hover">
            전체보기 →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recentVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-t border-card-border">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground">업소를 운영하고 계신가요?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            NIGHTGUIDE에 업소를 등록하고 더 많은 고객에게 노출하세요.
            기본 등록은 무료입니다.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="#"
              className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
            >
              무료 등록하기
            </Link>
            <Link
              href="#"
              className="rounded-xl border border-card-border px-6 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
            >
              광고 상품 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
