"use client";

import MypageSidebar from "@/components/MypageSidebar";
import { useState } from "react";

interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: number;
  description: string;
  isPopular: boolean;
  isNew: boolean;
}

const mockMenuCategories = ["시그니처 칵테일", "클래식 칵테일", "위스키", "와인", "맥주", "논알콜", "안주/푸드"];

const mockMenuItems: MenuItem[] = [
  { id: "m1", category: "시그니처 칵테일", name: "문라이트", price: 25000, description: "블루문 라운지 시그니처. 진, 블루큐라소, 라임, 토닉워터", isPopular: true, isNew: false },
  { id: "m2", category: "시그니처 칵테일", name: "선셋 블러쉬", price: 22000, description: "럼, 패션프루트, 코코넛크림, 라임", isPopular: false, isNew: true },
  { id: "m3", category: "시그니처 칵테일", name: "미드나잇 가든", price: 28000, description: "보드카, 엘더플라워, 라벤더시럽, 프로세코", isPopular: true, isNew: false },
  { id: "m4", category: "클래식 칵테일", name: "올드 패션드", price: 18000, description: "버번, 앙고스투라비터스, 오렌지필", isPopular: false, isNew: false },
  { id: "m5", category: "클래식 칵테일", name: "네그로니", price: 18000, description: "진, 캄파리, 스위트 베르무트", isPopular: false, isNew: false },
  { id: "m6", category: "위스키", name: "맥캘란 12년", price: 20000, description: "1잔 기준 (45ml)", isPopular: false, isNew: false },
  { id: "m7", category: "안주/푸드", name: "트러플 감자튀김", price: 22000, description: "트러플오일, 파마산 치즈, 허브솔트", isPopular: true, isNew: false },
  { id: "m8", category: "안주/푸드", name: "모둠 치즈 플래터", price: 35000, description: "브리, 체다, 고르곤졸라, 크래커, 잼", isPopular: false, isNew: true },
];

export default function VenueMenuPage() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const filtered = activeCategory === "전체"
    ? mockMenuItems
    : mockMenuItems.filter((m) => m.category === activeCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <MypageSidebar />

        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">메뉴 관리</h1>
              <p className="mt-1 text-sm text-muted">블루문 라운지 · 총 {mockMenuItems.length}개 메뉴</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddCategory(true)}
                className="rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                카테고리 추가
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
              >
                메뉴 추가
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto">
            {["전체", ...mockMenuCategories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                  activeCategory === cat
                    ? "bg-accent text-black font-medium"
                    : "border border-card-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu List */}
          <div className="space-y-3">
            {filtered.map((item) => (
              <div key={item.id} className="rounded-xl border border-card-border bg-card-bg p-5 transition-all hover:border-accent/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    {/* Image placeholder */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900">
                      <span className="text-xl opacity-30">🍸</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                        {item.isPopular && (
                          <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-medium text-red-400">인기</span>
                        )}
                        {item.isNew && (
                          <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">NEW</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted">{item.category}</p>
                      <p className="mt-1.5 text-xs leading-5 text-foreground/60">{item.description}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold text-accent">{item.price.toLocaleString()}원</p>
                    <div className="mt-2 flex gap-1.5">
                      <button className="rounded border border-card-border px-2 py-1 text-[10px] text-muted hover:border-accent hover:text-accent">
                        수정
                      </button>
                      <button className="rounded border border-card-border px-2 py-1 text-[10px] text-muted hover:border-red-500/50 hover:text-red-400">
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex h-48 items-center justify-center rounded-xl border border-card-border bg-card-bg">
              <div className="text-center">
                <p className="text-muted">등록된 메뉴가 없습니다.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-2 text-sm text-accent hover:text-accent-hover"
                >
                  첫 메뉴를 등록해보세요
                </button>
              </div>
            </div>
          )}

          {/* Add Menu Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-lg rounded-2xl border border-card-border bg-background p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">메뉴 추가</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-muted hover:text-foreground">✕</button>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground">카테고리</label>
                    <select className="mt-1.5 w-full rounded-lg border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none">
                      {mockMenuCategories.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">메뉴명</label>
                    <input
                      type="text"
                      placeholder="메뉴명 입력"
                      className="mt-1.5 w-full rounded-lg border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">가격 (원)</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="mt-1.5 w-full rounded-lg border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">설명 (선택)</label>
                    <textarea
                      rows={2}
                      placeholder="재료, 용량 등 간단한 설명"
                      className="mt-1.5 w-full resize-none rounded-lg border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">메뉴 사진 (선택)</label>
                    <label className="mt-1.5 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-card-border py-6 hover:border-accent/50">
                      <input type="file" accept="image/*" className="hidden" />
                      <span className="text-xs text-muted">클릭하여 사진 업로드</span>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 text-sm text-muted">
                      <input type="checkbox" className="accent-[#c8a96e]" />
                      인기 메뉴
                    </label>
                    <label className="flex items-center gap-2 text-sm text-muted">
                      <input type="checkbox" className="accent-[#c8a96e]" />
                      신메뉴
                    </label>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
                    >
                      등록
                    </button>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 rounded-xl border border-card-border py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Category Modal */}
          {showAddCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-sm rounded-2xl border border-card-border bg-background p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">카테고리 추가</h2>
                  <button onClick={() => setShowAddCategory(false)} className="text-muted hover:text-foreground">✕</button>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground">카테고리명</label>
                    <input
                      type="text"
                      placeholder="예: 스페셜 메뉴, 세트 메뉴"
                      className="mt-1.5 w-full rounded-lg border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddCategory(false)}
                      className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
                    >
                      추가
                    </button>
                    <button
                      onClick={() => setShowAddCategory(false)}
                      className="flex-1 rounded-xl border border-card-border py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
