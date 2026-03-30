"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Banner {
  id: string;
  name: string;
  description: string;
  region: string;
  district: string;
  category: string;
  rating: number;
  images: string[];
}

export default function AdBannerSlider({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const venue = banners[current];

  return (
    <div className="relative">
      <Link href={`/venue/${venue.id}`} className="group relative block overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-r from-accent/10 to-transparent transition-all hover:border-accent/40">
        <div className="flex items-center gap-6 p-6">
          {venue.images[0] && (
            <div className="hidden h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:block">
              <img src={venue.images[0]} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <span className="absolute right-3 top-3 rounded bg-accent/20 px-2 py-0.5 text-[10px] text-accent">AD</span>
            <h3 className="text-lg font-bold text-foreground group-hover:text-accent">{venue.name}</h3>
            <p className="mt-1 text-sm text-muted">{venue.region} {venue.district} · {venue.category}</p>
            <p className="mt-2 line-clamp-1 text-sm text-muted">{venue.description}</p>
          </div>
        </div>
      </Link>
      {banners.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-accent" : "w-2 bg-zinc-600 hover:bg-zinc-500"}`}
            />
          ))}
          <span className="ml-2 text-[10px] text-muted">{current + 1}/{banners.length}</span>
        </div>
      )}
    </div>
  );
}
