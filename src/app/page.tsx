import Link from "next/link";
import { categories, venues, jobs, posts, feedItems } from "@/data/mock";
import VenueCard from "@/components/VenueCard";
import JobCard from "@/components/JobCard";

export default function Home() {
  const bannerVenues = venues.filter((v) => v.isBanner);
  const premiumVenues = venues.filter((v) => v.isPremium);
  const hotPosts = posts.filter((p) => !p.isPinned).sort((a, b) => b.commentCount - a.commentCount).slice(0, 5);
  const liveFeed = feedItems.filter((f) => f.isLive).slice(0, 4);
  const recentVenues = venues.slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-card-border">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-accent">사랑과</span>전쟁
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-muted">
            밤이 시작되는 곳
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

      {/* Live Feed + Community */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Live Feed */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">실시간 피드</h2>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>
              </div>
              <Link href="/feed" className="text-sm text-accent hover:text-accent-hover">
                전체보기 →
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {liveFeed.map((item) => (
                <Link
                  key={item.id}
                  href={`/venue/${item.venueId}`}
                  className="group block rounded-xl border border-card-border bg-card-bg p-4 transition-all hover:border-accent/40"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground group-hover:text-accent">
                      {item.venueName}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        item.type === "event"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {item.type === "event" ? "이벤트" : "영업현황"}
                    </span>
                    {item.isLive && (
                      <span className="rounded-full bg-green-500/20 px-1.5 py-0.5 text-[10px] text-green-400">LIVE</span>
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted">{item.content}</p>
                  <span className="mt-1 block text-[10px] text-muted">{item.time}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Hot Community Posts */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">커뮤니티 인기글</h2>
              <Link href="/community" className="text-sm text-accent hover:text-accent-hover">
                전체보기 →
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {hotPosts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/community/${post.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-card-border bg-card-bg p-4 transition-all hover:border-accent/40"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-accent">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          post.category === "추천/질문"
                            ? "bg-blue-500/20 text-blue-400"
                            : post.category === "후기"
                            ? "bg-green-500/20 text-green-400"
                            : post.category === "모임"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-zinc-500/20 text-zinc-400"
                        }`}
                      >
                        {post.category}
                      </span>
                      <h3 className="truncate text-sm text-foreground group-hover:text-accent">{post.title}</h3>
                    </div>
                    <div className="mt-1 flex gap-3 text-[10px] text-muted">
                      <span>{post.author}</span>
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.commentCount}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">구인구직</h2>
            <p className="mt-1 text-sm text-muted">최신 구인·구직 정보를 확인하세요</p>
          </div>
          <Link href="/jobs" className="text-sm text-accent hover:text-accent-hover">
            전체보기 →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-t border-card-border">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground">업소를 운영하고 계신가요?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            사랑과전쟁에 업소를 등록하고 더 많은 고객에게 노출하세요.
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
