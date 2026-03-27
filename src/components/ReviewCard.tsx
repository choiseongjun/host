import type { Review } from "@/data/mock";
import StarRating from "./StarRating";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-muted">
            {review.author.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{review.author}</span>
              {review.verified && (
                <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                  방문인증
                </span>
              )}
            </div>
            <span className="text-xs text-muted">{review.date}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StarRating rating={review.overall} size="md" />
          <span className="text-sm font-semibold text-accent">{review.overall}</span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-foreground/80">{review.content}</p>

      <div className="mt-4 flex gap-4 border-t border-card-border pt-4">
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
      </div>
    </div>
  );
}
