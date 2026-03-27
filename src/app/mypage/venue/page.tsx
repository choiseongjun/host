"use client";

import MypageSidebar from "@/components/MypageSidebar";
import { useState } from "react";

export default function VenueManagePage() {
  const [activeTab, setActiveTab] = useState<"info" | "photos" | "stats">("info");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <MypageSidebar />

        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">업소 관리</h1>
              <p className="mt-1 text-sm text-muted">등록된 업소 정보를 관리하세요</p>
            </div>
            <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">사장님 계정</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-xl border border-card-border bg-card-bg p-1">
            {[
              { key: "info" as const, label: "기본정보" },
              { key: "photos" as const, label: "사진관리" },
              { key: "stats" as const, label: "통계" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-accent text-black"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Info Tab */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-card-border bg-card-bg p-6">
                <h2 className="text-sm font-semibold text-foreground">업소 기본 정보</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground">업소명</label>
                    <input
                      type="text"
                      defaultValue="블루문 라운지"
                      className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground">업종</label>
                      <select className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none">
                        <option>바/라운지</option>
                        <option>룸살롱</option>
                        <option>노래방</option>
                        <option>클럽</option>
                        <option>호스트바</option>
                        <option>중년노래방</option>
                        <option>마사지</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground">가격대</label>
                      <select className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none">
                        <option>₩ (저렴)</option>
                        <option>₩₩ (보통)</option>
                        <option selected>₩₩₩ (높음)</option>
                        <option>₩₩₩₩ (매우 높음)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground">주소</label>
                    <div className="mt-1.5 flex gap-2">
                      <input
                        type="text"
                        defaultValue="서울 강남구 청담동 456-78"
                        className="flex-1 rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                      />
                      <button className="shrink-0 rounded-lg border border-card-border px-4 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent">
                        주소검색
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground">영업 시작</label>
                      <input
                        type="time"
                        defaultValue="18:00"
                        className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground">영업 종료</label>
                      <input
                        type="time"
                        defaultValue="03:00"
                        className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-muted">
                    <input type="checkbox" defaultChecked className="accent-[#c8a96e]" />
                    심야 영업 가능
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-foreground">연락처</label>
                    <input
                      type="tel"
                      defaultValue="02-2345-6789"
                      className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground">업소 소개</label>
                    <textarea
                      rows={4}
                      defaultValue="청담동 루프탑 라운지바. 서울 야경을 내려다보며 프리미엄 칵테일을 즐길 수 있는 곳입니다."
                      className="mt-1.5 w-full resize-none rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground">태그 (쉼표로 구분)</label>
                    <input
                      type="text"
                      defaultValue="데이트, 칵테일, 루프탑, 분위기"
                      className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <button className="mt-6 rounded-xl bg-accent px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
                  정보 저장
                </button>
              </div>

              {/* Ad Plan */}
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                <h2 className="text-sm font-semibold text-foreground">현재 광고 상품</h2>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-accent">지역 상단 노출</p>
                    <p className="mt-0.5 text-xs text-muted">강남구 상단 고정 · 프리미엄 배지 · 2026-04-24 만료</p>
                  </div>
                  <button className="rounded-lg border border-accent px-4 py-2 text-sm text-accent transition-colors hover:bg-accent hover:text-black">
                    업그레이드
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === "photos" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-card-border bg-card-bg p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">사진 관리 (6/20)</h2>
                  <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
                    사진 추가
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900">
                      <div className="flex h-full items-center justify-center text-2xl opacity-30">📸</div>
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                        <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-sm hover:bg-white/20">
                          {i === 1 ? "대표사진" : "대표로 설정"}
                        </button>
                        <button className="rounded-lg bg-red-500/30 px-3 py-1.5 text-xs text-white backdrop-blur-sm hover:bg-red-500/50">
                          삭제
                        </button>
                      </div>
                      {i === 1 && (
                        <span className="absolute left-2 top-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-black">
                          대표
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-xs text-muted">
                  JPG, PNG 파일 (최대 10MB, 최대 20장). 드래그하여 순서를 변경할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              {/* Overview */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "이번 달 조회수", value: "1,234", change: "+12%" },
                  { label: "이번 달 찜", value: "45", change: "+8%" },
                  { label: "이번 달 전화연결", value: "23", change: "+15%" },
                  { label: "평균 별점", value: "4.2", change: "+0.1" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-card-border bg-card-bg p-4">
                    <p className="text-xs text-muted">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="mt-0.5 text-xs text-green-400">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="rounded-xl border border-card-border bg-card-bg p-6">
                <h2 className="text-sm font-semibold text-foreground">월별 조회수</h2>
                <div className="mt-4 flex h-48 items-end justify-between gap-2 border-b border-card-border px-2 pb-2">
                  {[40, 65, 55, 80, 70, 95, 85, 100, 90, 75, 110, 120].map((h, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t bg-accent/60 transition-all hover:bg-accent"
                        style={{ height: `${(h / 120) * 100}%` }}
                      />
                      <span className="text-[9px] text-muted">{i + 1}월</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Reviews for Venue */}
              <div className="rounded-xl border border-card-border bg-card-bg p-6">
                <h2 className="text-sm font-semibold text-foreground">최근 리뷰</h2>
                <div className="mt-4 space-y-4">
                  {[
                    { author: "청담***", date: "2026-03-20", rating: 4.5, content: "루프탑에서 보는 야경이 정말 환상적입니다." },
                    { author: "강남***", date: "2026-03-18", rating: 4.0, content: "칵테일 맛있고 분위기 좋아요. 가격은 좀 있지만 만족합니다." },
                    { author: "서초***", date: "2026-03-15", rating: 3.5, content: "주말에 너무 붐벼서 대기가 길었어요." },
                  ].map((review, i) => (
                    <div key={i} className="flex items-start justify-between border-b border-card-border pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground">{review.author}</span>
                          <span className="text-xs text-accent">★ {review.rating}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted">{review.content}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <span className="text-xs text-muted">{review.date}</span>
                        <button className="text-xs text-muted hover:text-accent">답변</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
