import Link from "next/link";
import type { Venue } from "@/data/mock";
import StarRating from "./StarRating";

export default function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Link
      href={`/venue/${venue.id}`}
      className="group block overflow-hidden rounded-xl border border-card-border bg-card-bg transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
        {venue.images && venue.images.length > 0 ? (
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl opacity-30">
            {venue.category === "룸살롱" && "🥂"}
            {venue.category === "바/라운지" && "🍸"}
            {venue.category === "노래방" && "🎤"}
            {venue.category === "클럽" && "🎵"}
            {venue.category === "호스트바" && "🌙"}
            {venue.category === "중년노래방" && "🎶"}
            {venue.category === "마사지" && "💆"}
          </div>
        )}
        {venue.isPremium && (
          <span className="absolute left-3 top-3 rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
            Premium
          </span>
        )}
        {venue.lateNight && (
          <span className="absolute right-3 top-3 rounded bg-white/10 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
            심야영업
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground transition-colors group-hover:text-accent">
              {venue.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              {venue.region} {venue.district} · {venue.category}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <StarRating rating={venue.rating} />
              <span className="text-xs font-medium text-accent">{venue.rating}</span>
            </div>
            <p className="mt-0.5 text-[10px] text-muted">리뷰 {venue.reviewCount}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {venue.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-card-border px-2 py-0.5 text-[10px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-card-border pt-3">
          <span className="text-xs text-muted">{venue.hours}</span>
          <span className="text-sm font-medium text-accent">{venue.priceRange}</span>
        </div>
      </div>
    </Link>
  );
}
