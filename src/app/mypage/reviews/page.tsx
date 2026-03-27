import MypageSidebar from "@/components/MypageSidebar";
import StarRating from "@/components/StarRating";
import Link from "next/link";

const myReviews = [
  {
    id: "mr1",
    venueName: "르누아르",
    venueId: "1",
    category: "룸살롱",
    date: "2026-03-25",
    overall: 4.5,
    ratings: { atmosphere: 5, value: 3, service: 5 },
    content: "비즈니스 접대로 방문했는데 서비스가 정말 훌륭했습니다. 룸도 넓고 깨끗하고 직원분들도 매우 친절합니다.",
    likes: 5,
    verified: true,
  },
  {
    id: "mr2",
    venueName: "블루문 라운지",
    venueId: "2",
    category: "바/라운지",
    date: "2026-03-20",
    overall: 4.5,
    ratings: { atmosphere: 5, value: 4, service: 4 },
    content: "루프탑에서 보는 야경이 정말 환상적입니다. 칵테일도 수준급이에요. 데이트 코스로 강력 추천합니다.",
    likes: 12,
    verified: true,
  },
  {
    id: "mr3",
    venueName: "클럽 옥타곤",
    venueId: "4",
    category: "클럽",
    date: "2026-03-18",
    overall: 4.5,
    ratings: { atmosphere: 5, value: 4, service: 4 },
    content: "사운드 시스템이 진짜 미쳤습니다. 해외 DJ 올 때 꼭 가세요. 분위기 최고!",
    likes: 8,
    verified: false,
  },
];

export default function MyReviewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <MypageSidebar />

        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">내 리뷰</h1>
              <p className="mt-1 text-sm text-muted">총 {myReviews.length}개</p>
            </div>
            <select className="rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-muted focus:border-accent focus:outline-none">
              <option>최신순</option>
              <option>별점 높은순</option>
              <option>좋아요 많은순</option>
            </select>
          </div>

          <div className="space-y-4">
            {myReviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-card-border bg-card-bg p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link href={`/venue/${review.venueId}`} className="text-sm font-semibold text-foreground hover:text-accent">
                        {review.venueName}
                      </Link>
                      <span className="rounded-full border border-card-border px-2 py-0.5 text-[10px] text-muted">
                        {review.category}
                      </span>
                      {review.verified && (
                        <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                          방문인증
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarRating rating={review.overall} size="md" />
                    <span className="text-sm font-semibold text-accent">{review.overall}</span>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-foreground/80">{review.content}</p>

                <div className="mt-4 flex items-center justify-between border-t border-card-border pt-4">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-[10px] text-muted">분위기</p>
                      <p className="text-sm font-medium text-foreground">{review.ratings.atmosphere}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted">가성비</p>
                      <p className="text-sm font-medium text-foreground">{review.ratings.value}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted">서비스</p>
                      <p className="text-sm font-medium text-foreground">{review.ratings.service}</p>
                    </div>
                    <div className="flex items-end gap-1 text-xs text-muted">
                      <span>❤️ {review.likes}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent">
                      수정
                    </button>
                    <button className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-red-500/50 hover:text-red-400">
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
