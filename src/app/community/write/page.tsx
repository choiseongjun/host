"use client";

import Link from "next/link";
import { useState } from "react";

const categoryOptions = ["자유", "추천/질문", "후기", "모임", "정보"];

export default function CommunityWritePage() {
  const [category, setCategory] = useState("자유");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-accent">홈</Link>
        <span>/</span>
        <Link href="/community" className="hover:text-accent">커뮤니티</Link>
        <span>/</span>
        <span className="text-foreground">글쓰기</span>
      </div>

      <h1 className="mt-6 text-xl font-bold text-foreground">글쓰기</h1>

      <div className="mt-6 space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-foreground">카테고리</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  category === cat
                    ? "bg-accent text-black font-medium"
                    : "border border-card-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground">제목</label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className="mt-1.5 w-full rounded-xl border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-foreground">내용</label>
          <textarea
            rows={12}
            placeholder="내용을 입력하세요..."
            className="mt-1.5 w-full resize-none rounded-xl border border-card-border bg-card-bg px-4 py-3 text-sm leading-6 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground">이미지 첨부</label>
          <div className="mt-1.5 flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-card-border px-6 py-8 text-center transition-colors hover:border-accent">
              <input type="file" multiple accept="image/*" className="hidden" />
              <div>
                <span className="text-2xl">📸</span>
                <p className="mt-1 text-xs text-muted">클릭하여 이미지 업로드</p>
                <p className="text-[10px] text-muted">JPG, PNG (최대 5장, 각 10MB)</p>
              </div>
            </label>
          </div>
        </div>

        {/* Related Venue */}
        <div>
          <label className="block text-sm font-medium text-foreground">관련 업소 (선택)</label>
          <input
            type="text"
            placeholder="업소명을 검색하세요"
            className="mt-1.5 w-full rounded-xl border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <p className="mt-1 text-xs text-muted">후기 작성 시 관련 업소를 연결하면 더 많은 사람들이 볼 수 있습니다.</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 border-t border-card-border pt-6">
          <button className="rounded-xl bg-accent px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
            등록하기
          </button>
          <Link
            href="/community"
            className="rounded-xl border border-card-border px-8 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            취소
          </Link>
        </div>
      </div>
    </div>
  );
}
