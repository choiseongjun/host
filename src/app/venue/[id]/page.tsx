import Link from "next/link";
import { venues, reviews } from "@/data/mock";
import StarRating from "@/components/StarRating";
import ReviewCard from "@/components/ReviewCard";
import VenueCard from "@/components/VenueCard";

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const venue = venues.find((v) => v.id === id);
  const venueReviews = reviews.filter((r) => r.venueId === id);
  const similarVenues = venues.filter((v) => v.categorySlug === venue?.categorySlug && v.id !== id).slice(0, 3);

  if (!venue) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted">업소를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const avgAtmosphere = venueReviews.length
    ? (venueReviews.reduce((s, r) => s + r.ratings.atmosphere, 0) / venueReviews.length).toFixed(1)
    : "-";
  const avgValue = venueReviews.length
    ? (venueReviews.reduce((s, r) => s + r.ratings.value, 0) / venueReviews.length).toFixed(1)
    : "-";
  const avgService = venueReviews.length
    ? (venueReviews.reduce((s, r) => s + r.ratings.service, 0) / venueReviews.length).toFixed(1)
    : "-";

  return (
    <div>
      {/* Photo Gallery */}
      <section className="border-b border-card-border bg-card-bg">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="grid grid-cols-4 gap-2 overflow-hidden rounded-xl">
            <div className="col-span-2 row-span-2 flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
              <span className="text-6xl opacity-20">📸</span>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                <span className="text-2xl opacity-20">📸</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-accent">홈</Link>
          <span>/</span>
          <Link href={`/category/${venue.categorySlug}`} className="hover:text-accent">{venue.category}</Link>
          <span>/</span>
          <span className="text-foreground">{venue.name}</span>
        </div>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Basic Info */}
            <section>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground">{venue.name}</h1>
                    {venue.isPremium && (
                      <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted">{venue.category} · {venue.region} {venue.district}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <StarRating rating={venue.rating} size="lg" />
                    <span className="text-xl font-bold text-accent">{venue.rating}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">리뷰 {venue.reviewCount}개</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {venue.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-card-border px-3 py-1 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-sm leading-7 text-foreground/80">{venue.description}</p>
            </section>

            {/* Detail Info */}
            <section className="rounded-xl border border-card-border bg-card-bg p-6">
              <h2 className="text-lg font-bold text-foreground">상세 정보</h2>
              <dl className="mt-4 space-y-4">
                <div className="flex items-start gap-4">
                  <dt className="w-20 shrink-0 text-sm text-muted">주소</dt>
                  <dd className="text-sm text-foreground">{venue.address}</dd>
                </div>
                <div className="flex items-start gap-4">
                  <dt className="w-20 shrink-0 text-sm text-muted">영업시간</dt>
                  <dd className="text-sm text-foreground">
                    {venue.hours}
                    {venue.lateNight && (
                      <span className="ml-2 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent">
                        심야영업
                      </span>
                    )}
                  </dd>
                </div>
                <div className="flex items-start gap-4">
                  <dt className="w-20 shrink-0 text-sm text-muted">가격대</dt>
                  <dd className="text-sm text-accent font-medium">{venue.priceRange}</dd>
                </div>
                <div className="flex items-start gap-4">
                  <dt className="w-20 shrink-0 text-sm text-muted">연락처</dt>
                  <dd className="text-sm text-foreground">{venue.phone}</dd>
                </div>
              </dl>
            </section>

            {/* Menu & Price */}
            <section className="rounded-xl border border-card-border bg-card-bg p-6">
              <h2 className="text-lg font-bold text-foreground">메뉴 / 가격</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-xs font-medium text-accent">시그니처 칵테일</h3>
                  <div className="mt-2 space-y-2">
                    {[
                      { name: "문라이트", price: "25,000원", desc: "진, 블루큐라소, 라임, 토닉워터", popular: true },
                      { name: "선셋 블러쉬", price: "22,000원", desc: "럼, 패션프루트, 코코넛크림", popular: false },
                      { name: "미드나잇 가든", price: "28,000원", desc: "보드카, 엘더플라워, 라벤더시럽", popular: true },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-lg bg-zinc-900/30 px-4 py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-foreground">{item.name}</span>
                            {item.popular && <span className="rounded bg-red-500/20 px-1 py-0.5 text-[9px] text-red-400">인기</span>}
                          </div>
                          <p className="mt-0.5 text-[10px] text-muted">{item.desc}</p>
                        </div>
                        <span className="text-sm font-medium text-accent">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-accent">테이블 / 룸</h3>
                  <div className="mt-2 space-y-2">
                    {[
                      { name: "일반 테이블", price: "50,000원", desc: "2인 기준" },
                      { name: "루프탑 테이블", price: "100,000원", desc: "2인 기준, 예약 필수" },
                      { name: "프라이빗 룸", price: "200,000원~", desc: "4인부터, 2시간 기준" },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-lg bg-zinc-900/30 px-4 py-3">
                        <div>
                          <span className="text-sm text-foreground">{item.name}</span>
                          <p className="mt-0.5 text-[10px] text-muted">{item.desc}</p>
                        </div>
                        <span className="text-sm font-medium text-accent">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Rating Breakdown */}
            <section className="rounded-xl border border-card-border bg-card-bg p-6">
              <h2 className="text-lg font-bold text-foreground">평가 항목</h2>
              <div className="mt-4 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent">{avgAtmosphere}</p>
                  <p className="mt-1 text-xs text-muted">분위기</p>
                  <div className="mt-2 h-1.5 rounded-full bg-zinc-800">
                    <div
                      className="h-1.5 rounded-full bg-accent"
                      style={{ width: `${(Number(avgAtmosphere) / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent">{avgValue}</p>
                  <p className="mt-1 text-xs text-muted">가격대비</p>
                  <div className="mt-2 h-1.5 rounded-full bg-zinc-800">
                    <div
                      className="h-1.5 rounded-full bg-accent"
                      style={{ width: `${(Number(avgValue) / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent">{avgService}</p>
                  <p className="mt-1 text-xs text-muted">서비스</p>
                  <div className="mt-2 h-1.5 rounded-full bg-zinc-800">
                    <div
                      className="h-1.5 rounded-full bg-accent"
                      style={{ width: `${(Number(avgService) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">리뷰 ({venueReviews.length})</h2>
                <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
                  리뷰 작성
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {venueReviews.length > 0 ? (
                  venueReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-xl border border-card-border bg-card-bg">
                    <p className="text-sm text-muted">아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-80">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <div className="rounded-xl border border-card-border bg-card-bg p-6">
                <h3 className="text-sm font-semibold text-foreground">예약 / 문의</h3>
                <a
                  href={`tel:${venue.phone}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
                >
                  전화 문의 {venue.phone}
                </a>
                <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-card-border py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent">
                  온라인 예약
                </button>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-lg border border-card-border py-2 text-xs text-muted hover:border-accent hover:text-accent">
                    공유
                  </button>
                  <button className="flex-1 rounded-lg border border-card-border py-2 text-xs text-muted hover:border-accent hover:text-accent">
                    찜하기
                  </button>
                  <button className="flex-1 rounded-lg border border-card-border py-2 text-xs text-muted hover:border-accent hover:text-accent">
                    신고
                  </button>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="overflow-hidden rounded-xl border border-card-border">
                <div className="flex h-48 items-center justify-center bg-zinc-900">
                  <div className="text-center">
                    <span className="text-2xl opacity-30">🗺️</span>
                    <p className="mt-2 text-xs text-muted">지도 영역</p>
                  </div>
                </div>
                <div className="bg-card-bg p-3">
                  <p className="text-xs text-muted">{venue.address}</p>
                </div>
              </div>

              {/* Similar Venues */}
              {similarVenues.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground">비슷한 업소</h3>
                  <div className="mt-3 space-y-3">
                    {similarVenues.map((v) => (
                      <Link
                        key={v.id}
                        href={`/venue/${v.id}`}
                        className="group block rounded-xl border border-card-border bg-card-bg p-4 transition-all hover:border-accent/40"
                      >
                        <h4 className="text-sm font-medium text-foreground group-hover:text-accent">
                          {v.name}
                        </h4>
                        <p className="mt-1 text-xs text-muted">
                          {v.region} {v.district}
                        </p>
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-xs text-accent">★ {v.rating}</span>
                          <span className="text-[10px] text-muted">({v.reviewCount})</span>
                          <span className="ml-auto text-xs text-muted">{v.priceRange}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
