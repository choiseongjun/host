"use client";

import MypageSidebar from "@/components/MypageSidebar";
import { useState } from "react";

interface PriceItem {
  id: string;
  category: string;
  name: string;
  price: string;
  unit: string;
  description: string;
}

const mockPriceCategories = ["입장/테이블", "룸 요금", "주류", "세트/패키지", "기타"];

const mockPriceItems: PriceItem[] = [
  { id: "pr1", category: "입장/테이블", name: "테이블차지", price: "50,000", unit: "1테이블", description: "2인 기준, 추가 1인당 2만원" },
  { id: "pr2", category: "입장/테이블", name: "루프탑 테이블", price: "100,000", unit: "1테이블", description: "2인 기준, 예약 필수" },
  { id: "pr3", category: "룸 요금", name: "프라이빗 룸 (소)", price: "200,000", unit: "1실", description: "4인까지, 2시간 기준" },
  { id: "pr4", category: "룸 요금", name: "프라이빗 룸 (대)", price: "500,000", unit: "1실", description: "10인까지, 2시간 기준, 노래방 장비 포함" },
  { id: "pr5", category: "룸 요금", name: "VIP 룸", price: "1,000,000", unit: "1실", description: "20인까지, 3시간 기준, 전담 서버" },
  { id: "pr6", category: "주류", name: "칵테일", price: "18,000~28,000", unit: "1잔", description: "클래식/시그니처" },
  { id: "pr7", category: "주류", name: "위스키 (하우스)", price: "15,000~25,000", unit: "1잔", description: "45ml 기준" },
  { id: "pr8", category: "주류", name: "위스키 (보틀)", price: "200,000~", unit: "1병", description: "브랜드별 상이" },
  { id: "pr9", category: "주류", name: "와인", price: "80,000~", unit: "1병", description: "하우스 와인 기준" },
  { id: "pr10", category: "주류", name: "샴페인", price: "150,000~", unit: "1병", description: "모엣샹동 기준" },
  { id: "pr11", category: "세트/패키지", name: "2인 데이트 패키지", price: "150,000", unit: "1세트", description: "칵테일 2잔 + 안주 1 + 루프탑 테이블" },
  { id: "pr12", category: "세트/패키지", name: "4인 파티 패키지", price: "400,000", unit: "1세트", description: "보틀 1 + 안주 2 + 프라이빗룸(소)" },
  { id: "pr13", category: "기타", name: "발렛파킹", price: "무료", unit: "", description: "2시간 무료, 이후 시간당 5,000원" },
  { id: "pr14", category: "기타", name: "케이크 반입", price: "20,000", unit: "1회", description: "사전 연락 필요" },
];

export default function VenuePricePage() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = activeCategory === "전체"
    ? mockPriceItems
    : mockPriceItems.filter((p) => p.category === activeCategory);

  const groupedByCategory = filtered.reduce<Record<string, PriceItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <MypageSidebar />

        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">가격표 관리</h1>
              <p className="mt-1 text-sm text-muted">블루문 라운지 · 총 {mockPriceItems.length}개 항목</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
            >
              항목 추가
            </button>
          </div>

          {/* Info Banner */}
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
            <p className="text-xs text-accent">
              💡 가격표를 상세하게 등록하면 고객 문의가 줄고 방문 전환율이 높아집니다. 가격이 변동되면 즉시 업데이트해주세요.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-1.5 overflow-x-auto">
            {["전체", ...mockPriceCategories].map((cat) => (
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

          {/* Price Table by Category */}
          {Object.entries(groupedByCategory).map(([category, items]) => (
            <div key={category} className="rounded-xl border border-card-border bg-card-bg overflow-hidden">
              <div className="border-b border-card-border bg-zinc-900/50 px-5 py-3">
                <h3 className="text-sm font-semibold text-foreground">{category}</h3>
              </div>
              <div className="divide-y divide-card-border">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-900/30">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground">{item.name}</h4>
                      <p className="mt-0.5 text-xs text-muted">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-accent">{item.price}원</p>
                        {item.unit && <p className="text-[10px] text-muted">{item.unit}</p>}
                      </div>
                      <div className="flex gap-1">
                        <button className="rounded border border-card-border px-2 py-1 text-[10px] text-muted hover:border-accent hover:text-accent">
                          수정
                        </button>
                        <button className="rounded border border-card-border px-2 py-1 text-[10px] text-muted hover:border-red-500/50 hover:text-red-400">
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Customer View Preview */}
          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">고객에게 보이는 화면</h2>
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-muted">미리보기</span>
            </div>
            <div className="mt-4 rounded-lg border border-card-border p-4">
              <h3 className="text-sm font-semibold text-foreground">가격 안내</h3>
              <div className="mt-3 space-y-3">
                {mockPriceCategories.map((cat) => {
                  const catItems = mockPriceItems.filter((p) => p.category === cat);
                  if (catItems.length === 0) return null;
                  return (
                    <div key={cat}>
                      <p className="text-xs font-medium text-accent">{cat}</p>
                      <div className="mt-1 space-y-1">
                        {catItems.map((item) => (
                          <div key={item.id} className="flex justify-between text-xs">
                            <span className="text-foreground/80">{item.name}</span>
                            <span className="text-muted">{item.price}원</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Add Price Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-lg rounded-2xl border border-card-border bg-background p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">가격 항목 추가</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-muted hover:text-foreground">✕</button>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground">카테고리</label>
                    <select className="mt-1.5 w-full rounded-lg border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none">
                      {mockPriceCategories.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">항목명</label>
                    <input
                      type="text"
                      placeholder="예: VIP룸, 위스키 보틀, 테이블차지"
                      className="mt-1.5 w-full rounded-lg border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground">가격</label>
                      <input
                        type="text"
                        placeholder="예: 200,000 또는 무료"
                        className="mt-1.5 w-full rounded-lg border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground">단위</label>
                      <input
                        type="text"
                        placeholder="예: 1잔, 1병, 1실, 1인"
                        className="mt-1.5 w-full rounded-lg border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">비고 / 설명</label>
                    <input
                      type="text"
                      placeholder="예: 2시간 기준, 주말 10% 추가"
                      className="mt-1.5 w-full rounded-lg border border-card-border bg-card-bg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
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
        </div>
      </div>
    </div>
  );
}
