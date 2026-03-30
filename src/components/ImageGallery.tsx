"use client";

import { useState } from "react";

export default function ImageGallery({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl">
        <span className="text-6xl opacity-20">📸</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900">
        <img
          src={images[current]}
          alt=""
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              ›
            </button>
            <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-accent" : "w-2 bg-zinc-600 hover:bg-zinc-500"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
