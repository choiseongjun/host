export default function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = { sm: "text-xs", md: "text-sm", lg: "text-base" }[size];
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<span key={i} className="text-accent">★</span>);
    } else if (i - 0.5 <= rating) {
      stars.push(<span key={i} className="text-accent">★</span>);
    } else {
      stars.push(<span key={i} className="text-card-border">★</span>);
    }
  }
  return <span className={`inline-flex gap-0.5 ${sizeClass}`}>{stars}</span>;
}
