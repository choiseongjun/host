import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ImageGallery from "@/components/ImageGallery";

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const venue = await prisma.venue.findUnique({
    where: { id },
    include: {
      menuItems: { orderBy: { sortOrder: "asc" } },
      priceItems: { orderBy: { sortOrder: "asc" } },
      reviews: { include: { author: { select: { nickname: true } } }, orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  if (!venue) {
    return <div className="flex h-96 items-center justify-center"><p className="text-muted">업소를 찾을 수 없습니다.</p></div>;
  }

  await prisma.venue.update({ where: { id }, data: { viewCount: { increment: 1 } } });

  const similarVenues = await prisma.venue.findMany({
    where: { categorySlug: venue.categorySlug, id: { not: id }, isApproved: true },
    take: 3,
    orderBy: { rating: "desc" },
  });

  const reviews = venue.reviews;

  // 메뉴 카테고리별 그룹
  const menuByCategory: Record<string, typeof venue.menuItems> = {};
  for (const item of venue.menuItems) {
    if (!menuByCategory[item.category]) menuByCategory[item.category] = [];
    menuByCategory[item.category].push(item);
  }

  // 가격 카테고리별 그룹
  const priceByCategory: Record<string, typeof venue.priceItems> = {};
  for (const item of venue.priceItems) {
    if (!priceByCategory[item.category]) priceByCategory[item.category] = [];
    priceByCategory[item.category].push(item);
  }

  return (
    <div>
      {/* Gallery - 한 화면당 사진 하나, 넘기기 가능 */}
      <section className="border-b border-card-border bg-card-bg">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <ImageGallery images={venue.images} />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-accent">홈</Link>
          <span>/</span>
          <Link href={`/category/${venue.categorySlug}`} className="hover:text-accent">{venue.category}</Link>
          <span>/</span>
          <span className="text-foreground">{venue.name}</span>
        </div>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-8">
            {/* Basic Info */}
            <section>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground">{venue.name}</h1>
                    {venue.isPremium && <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">Premium</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted">{venue.category} · {venue.region} {venue.district}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">전체포털서칭</p>
                  <span className="text-xl font-bold text-accent">AI통합평점 {venue.rating}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {venue.tags.map((tag) => <span key={tag} className="rounded-full border border-card-border px-3 py-1 text-xs text-muted">{tag}</span>)}
              </div>
              <p className="mt-6 text-sm leading-7 text-foreground/80">{venue.description}</p>
            </section>

            {/* Detail Info */}
            <section className="rounded-xl border border-card-border bg-card-bg p-6">
              <h2 className="text-lg font-bold text-foreground">상세 정보</h2>
              <dl className="mt-4 space-y-4">
                <div className="flex items-start gap-4"><dt className="w-20 shrink-0 text-sm text-muted">주소</dt><dd className="text-sm text-foreground">{venue.address}</dd></div>
                <div className="flex items-start gap-4"><dt className="w-20 shrink-0 text-sm text-muted">영업시간</dt><dd className="text-sm text-foreground">{venue.hours}{venue.lateNight && <span className="ml-2 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent">심야영업</span>}</dd></div>
                <div className="flex items-start gap-4"><dt className="w-20 shrink-0 text-sm text-muted">가격대</dt><dd className="text-sm text-accent font-medium">{venue.priceRange || "0원~0원"} <span className="ml-1 rounded bg-accent/10 px-2 py-0.5 text-[10px] text-accent">상세문의</span></dd></div>
                <div className="flex items-start gap-4">
                  <dt className="w-20 shrink-0 text-sm text-muted">연락처</dt>
                  <dd className="text-sm text-foreground">
                    <a href={`tel:${venue.phone}`} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
                      📞 {venue.phone} 즉시연결
                    </a>
                  </dd>
                </div>
              </dl>
            </section>

            {/* Menu */}
            {Object.keys(menuByCategory).length > 0 && (
              <section className="rounded-xl border border-card-border bg-card-bg p-6">
                <h2 className="text-lg font-bold text-foreground">메뉴</h2>
                <div className="mt-4 space-y-4">
                  {Object.entries(menuByCategory).map(([cat, items]) => (
                    <div key={cat}>
                      <h3 className="text-xs font-medium text-accent">{cat}</h3>
                      <div className="mt-2 space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between rounded-lg bg-zinc-900/30 px-4 py-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-foreground">{item.name}</span>
                                {item.isPopular && <span className="rounded bg-red-500/20 px-1 py-0.5 text-[9px] text-red-400">인기</span>}
                                {item.isNew && <span className="rounded bg-blue-500/20 px-1 py-0.5 text-[9px] text-blue-400">NEW</span>}
                              </div>
                              {item.description && <p className="mt-0.5 text-[10px] text-muted">{item.description}</p>}
                            </div>
                            <span className="text-sm font-medium text-accent">{item.price.toLocaleString()}원</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Price Table */}
            {Object.keys(priceByCategory).length > 0 && (
              <section className="rounded-xl border border-card-border bg-card-bg p-6">
                <h2 className="text-lg font-bold text-foreground">가격 안내</h2>
                <div className="mt-4 space-y-4">
                  {Object.entries(priceByCategory).map(([cat, items]) => (
                    <div key={cat}>
                      <h3 className="text-xs font-medium text-accent">{cat}</h3>
                      <div className="mt-2 space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between rounded-lg bg-zinc-900/30 px-4 py-3">
                            <div>
                              <span className="text-sm text-foreground">{item.name}</span>
                              {item.description && <p className="mt-0.5 text-[10px] text-muted">{item.description}</p>}
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-accent">{item.price}원</span>
                              {item.unit && <p className="text-[10px] text-muted">{item.unit}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 전체포털서칭 AI통합평가 - 운영팀 수기 평가 + ❤️ 반응 */}
            <section className="rounded-xl border border-card-border bg-card-bg p-6">
              <h2 className="text-lg font-bold text-foreground">전체포털서칭 AI통합평가</h2>
              <p className="mt-1 text-xs text-muted">사랑과전쟁 운영팀 평가</p>
              <div className="mt-4 space-y-4">
                {reviews.length > 0 ? reviews.map((review) => (
                  <div key={review.id} className="rounded-lg bg-zinc-900/30 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{review.author.nickname}</span>
                      <span className="text-xs text-muted">{review.createdAt.toISOString().split("T")[0]}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-foreground/80">{review.content}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1.5 text-sm transition-colors hover:bg-red-500/20">
                        <span>❤️</span>
                        <span className="text-xs text-red-400">{review.likes}</span>
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="flex h-24 items-center justify-center">
                    <p className="text-sm text-muted">아직 평가가 없습니다.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-80">
            <div className="sticky top-24 space-y-6">
              {/* 즉시연결 전화 */}
              <div className="rounded-xl border border-card-border bg-card-bg p-6">
                <h3 className="text-sm font-semibold text-foreground">즉시 연결</h3>
                <a href={`tel:${venue.phone}`} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">📞 전화 즉시연결</a>
                <p className="mt-2 text-center text-xs text-muted">{venue.phone}</p>
              </div>

              <div className="overflow-hidden rounded-xl border border-card-border">
                <div className="flex h-48 items-center justify-center bg-zinc-900"><span className="text-2xl opacity-30">🗺️</span></div>
                <div className="bg-card-bg p-3"><p className="text-xs text-muted">{venue.address}</p></div>
              </div>

              {/* 비슷한 업소 - 사진 포함 */}
              {similarVenues.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground">비슷한 업소</h3>
                  <div className="mt-3 space-y-3">
                    {similarVenues.map((v) => (
                      <Link key={v.id} href={`/venue/${v.id}`} className="group flex items-center gap-3 rounded-xl border border-card-border bg-card-bg p-3 transition-all hover:border-accent/40">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900">
                          {v.images[0] ? (
                            <img src={v.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-lg opacity-30">📸</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground group-hover:text-accent truncate">{v.name}</h4>
                          <p className="mt-0.5 text-xs text-muted">{v.region} {v.district}</p>
                          <div className="mt-0.5 flex items-center gap-1">
                            <span className="text-xs text-accent">★ {v.rating}</span>
                            <span className="text-[10px] text-muted">({v.reviewCount})</span>
                          </div>
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
