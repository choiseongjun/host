import Link from "next/link";
import { prisma } from "@/lib/prisma";
import VenueCard from "@/components/VenueCard";
import AdBanner from "@/components/AdBanner";

const categoriesMap: Record<string, { name: string; icon: string; description: string }> = {
  "room-salon": { name: "룸살롱", icon: "🥂", description: "프라이빗 룸에서 즐기는 프리미엄 서비스" },
  "bar-lounge": { name: "바/라운지", icon: "🍸", description: "세련된 분위기의 바 & 라운지" },
  "karaoke": { name: "노래방", icon: "🎤", description: "도우미와 함께하는 프리미엄 노래방" },
  "club": { name: "클럽", icon: "🎵", description: "최고의 DJ와 사운드 시스템" },
  "host-bar": { name: "호스트바", icon: "🌙", description: "매력적인 호스트와 함께하는 시간" },
  "middle-age-karaoke": { name: "중년노래방", icon: "🎶", description: "편안한 분위기에서 즐기는 중년 맞춤 노래방" },
  "massage": { name: "마사지", icon: "💆", description: "전문 테라피스트의 힐링 마사지" },
};

function toMockVenue(v: Record<string, unknown>) {
  return {
    id: v.id as string, name: v.name as string, category: v.category as string, categorySlug: v.categorySlug as string,
    region: v.region as string, district: v.district as string, address: v.address as string, hours: v.hours as string,
    lateNight: v.lateNight as boolean, priceRange: (v.priceRange as string) || "", priceLevel: 2, phone: v.phone as string,
    tags: v.tags as string[], rating: v.rating as number, reviewCount: v.reviewCount as number, images: v.images as string[],
    description: (v.description as string) || "", isPremium: v.isPremium as boolean, isBanner: v.isBanner as boolean,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoriesMap[slug];

  if (!category) {
    return <div className="flex h-96 items-center justify-center"><p className="text-muted">카테고리를 찾을 수 없습니다.</p></div>;
  }

  const venues = await prisma.venue.findMany({
    where: { categorySlug: slug, isApproved: true },
    orderBy: [{ isPremium: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
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
          <p className="mt-4 text-sm text-muted">총 <span className="font-medium text-accent">{venues.length}</span>개 업소</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        {/* 상단 광고 배너 */}
        <AdBanner />

        {venues.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {venues.slice(0, 8).map((v) => <VenueCard key={v.id} venue={toMockVenue(v as Record<string, unknown>)} />)}
            </div>

            {/* 중간 인라인 광고 */}
            {venues.length > 8 && <AdBanner variant="inline" />}

            {venues.length > 8 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {venues.slice(8).map((v) => <VenueCard key={v.id} venue={toMockVenue(v as Record<string, unknown>)} />)}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-xl border border-card-border bg-card-bg">
            <p className="text-muted">등록된 업소가 없습니다.</p>
          </div>
        )}

        {/* 하단 광고 배너 */}
        <AdBanner />
      </div>
    </div>
  );
}
