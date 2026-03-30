import Link from "next/link";
import { prisma } from "@/lib/prisma";
import VenueCard from "@/components/VenueCard";
import AdBannerSlider from "@/components/AdBannerSlider";

// mock 타입 호환을 위한 변환
function toMockVenue(v: Record<string, unknown>) {
  return {
    id: v.id as string,
    name: v.name as string,
    category: v.category as string,
    categorySlug: v.categorySlug as string,
    region: v.region as string,
    district: v.district as string,
    address: v.address as string,
    hours: v.hours as string,
    lateNight: v.lateNight as boolean,
    priceRange: (v.priceRange as string) || "",
    priceLevel: 2,
    phone: v.phone as string,
    tags: v.tags as string[],
    rating: v.rating as number,
    reviewCount: v.reviewCount as number,
    images: v.images as string[],
    description: (v.description as string) || "",
    isPremium: v.isPremium as boolean,
    isBanner: v.isBanner as boolean,
  };
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const [bannerVenues, premiumVenues, recentVenues, liveFeed, hotPosts] = await Promise.all([
    prisma.venue.findMany({ where: { isBanner: true, isApproved: true }, take: 6 }),
    prisma.venue.findMany({ where: { isPremium: true, isApproved: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.venue.findMany({ where: { isApproved: true }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.feedItem.findMany({ where: { isLive: true }, include: { venue: { select: { name: true, category: true } } }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.post.findMany({ where: { isPinned: false }, orderBy: { commentCount: "desc" }, include: { author: { select: { nickname: true } } }, take: 5 }),
  ]);

  const categories = [
    { name: "서울 룸살롱", slug: "room-salon", icon: "🥂" },
    { name: "서울 바", slug: "bar-lounge", icon: "🍸" },
    { name: "서울 노래방", slug: "karaoke", icon: "🎤" },
    { name: "서울 클럽", slug: "club", icon: "🎵" },
    { name: "서울 호스트바", slug: "host-bar", icon: "🌙" },
    { name: "서울 중년노래방", slug: "middle-age-karaoke", icon: "🎶" },
    { name: "서울 감성마사지/스웨디시", slug: "massage", icon: "💆" },
  ];

  return (
    <div>
      {/* Hero Section - 검색창만 표시 */}
      <section className="relative overflow-hidden border-b border-card-border">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-accent">사랑과</span>전쟁
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
            &ldquo;사랑과전쟁&rdquo;통해서 연락드립니다 라고 꼭 말씀해주셔야 우대됩니다.
          </p>
          <div className="mx-auto mt-8 flex max-w-lg gap-2">
            <input
              type="text"
              placeholder="업소명, 지역, 키워드로 검색..."
              className="flex-1 rounded-xl border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <Link href="/search" className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
              검색
            </Link>
          </div>
        </div>
      </section>

      {/* 광고 배너 슬라이드 */}
      {bannerVenues.length > 0 && (
        <section className="border-b border-card-border bg-card-bg">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <AdBannerSlider banners={bannerVenues.map((v) => ({
              id: v.id,
              name: v.name,
              description: v.description || "",
              region: v.region,
              district: v.district,
              category: v.category,
              rating: v.rating,
              images: v.images,
            }))} />
          </div>
        </section>
      )}

      {/* 프리미엄 인기업체 - 최상단 (제휴사) */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">프리미엄 인기업체</h2>
            <p className="mt-1 text-sm text-muted">제휴사 추천 업체를 만나보세요</p>
          </div>
          <Link href="/search" className="text-sm text-accent hover:text-accent-hover">전체보기 →</Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {premiumVenues.map((v) => <VenueCard key={v.id} venue={toMockVenue(v as Record<string, unknown>)} />)}
        </div>
      </section>

      {/* 카테고리 (서울 놀이동산) */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-xl font-bold text-foreground">서울 놀이동산</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="group rounded-xl border border-card-border bg-card-bg p-5 text-center transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
              <div className="text-3xl">{cat.icon}</div>
              <h3 className="mt-3 text-sm font-semibold text-foreground group-hover:text-accent">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 정보제공 소개업체 (최근 등록) */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">정보제공 소개업체</h2>
            <p className="mt-1 text-sm text-muted">새로 등록된 업소를 확인하세요</p>
          </div>
          <Link href="/search" className="text-sm text-accent hover:text-accent-hover">전체보기 →</Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recentVenues.map((v) => <VenueCard key={v.id} venue={toMockVenue(v as Record<string, unknown>)} />)}
        </div>
      </section>

      {/* 실시간 목소리 + 커뮤니티 */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">실시간 목소리</h2>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>
              </div>
              <Link href="/feed" className="text-sm text-accent hover:text-accent-hover">전체보기 →</Link>
            </div>
            <div className="mt-4 space-y-3">
              {liveFeed.map((item) => (
                <Link key={item.id} href={`/venue/${item.venueId}`} className="group block rounded-xl border border-card-border bg-card-bg p-4 transition-all hover:border-accent/40">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground group-hover:text-accent">{item.venue.name}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${item.type === "EVENT" ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"}`}>
                      {item.type === "EVENT" ? "이벤트" : "영업현황"}
                    </span>
                    <span className="rounded-full bg-green-500/20 px-1.5 py-0.5 text-[10px] text-green-400">LIVE</span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted">{item.content}</p>
                </Link>
              ))}
              {liveFeed.length === 0 && <p className="text-sm text-muted py-8 text-center">실시간 목소리가 없습니다.</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">커뮤니티 인기글</h2>
              <Link href="/community" className="text-sm text-accent hover:text-accent-hover">전체보기 →</Link>
            </div>
            <div className="mt-4 space-y-2">
              {hotPosts.map((post, i) => {
                return (
                  <Link key={post.id} href={`/community/${post.id}`} className="group flex items-center gap-4 rounded-xl border border-card-border bg-card-bg p-4 transition-all hover:border-accent/40">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-accent">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate text-sm text-foreground group-hover:text-accent">{post.title}</h3>
                      <div className="mt-1 flex gap-3 text-[10px] text-muted">
                        <span>{post.author.nickname}</span>
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.commentCount}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {hotPosts.length === 0 && <p className="text-sm text-muted py-8 text-center">게시글이 없습니다.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-t border-card-border">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground">업소를 운영하고 계신가요?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            사랑과전쟁에 업소를 등록하고 더 많은 고객에게 노출하세요. 기본 등록은 무료입니다.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/venue/register" className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">무료 등록하기</Link>
            <Link href="#" className="rounded-xl border border-card-border px-6 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent">광고 상품 보기</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
