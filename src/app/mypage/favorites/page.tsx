import MypageSidebar from "@/components/MypageSidebar";
import VenueCard from "@/components/VenueCard";
import { venues } from "@/data/mock";

export default function FavoritesPage() {
  const favoriteVenues = venues.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <MypageSidebar />

        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">찜 목록</h1>
              <p className="mt-1 text-sm text-muted">총 {favoriteVenues.length}개</p>
            </div>
            <select className="rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-muted focus:border-accent focus:outline-none">
              <option>최근 추가순</option>
              <option>별점 높은순</option>
              <option>리뷰 많은순</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {favoriteVenues.map((venue) => (
              <div key={venue.id} className="relative">
                <VenueCard venue={venue} />
                <button className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-sm backdrop-blur-sm transition-colors hover:bg-red-500/50">
                  ❤️
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
