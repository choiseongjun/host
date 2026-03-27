"use client";

import Link from "next/link";
import { useState } from "react";
import { categories, regions } from "@/data/mock";

const steps = ["기본정보", "상세정보", "사진등록", "미리보기"];

export default function VenueRegisterPage() {
  const [step, setStep] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [lateNight, setLateNight] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const currentRegion = regions.find((r) => r.name === selectedRegion);

  const addTag = () => {
    if (tagInput.trim() && tags.length < 10 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-accent">홈</Link>
        <span>/</span>
        <span className="text-foreground">업소 등록</span>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-foreground">업소 등록</h1>
      <p className="mt-1 text-sm text-muted">사랑과전쟁에 업소를 등록하고 더 많은 고객을 만나세요. 기본 등록은 무료입니다.</p>

      {/* Step Indicator */}
      <div className="mt-8 flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <button
              onClick={() => setStep(i)}
              className="flex flex-col items-center gap-1.5 w-full"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  step >= i
                    ? "bg-accent text-black"
                    : "border border-card-border text-muted"
                }`}
              >
                {step > i ? "✓" : i + 1}
              </div>
              <span className={`text-[10px] ${step >= i ? "text-accent" : "text-muted"}`}>{s}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`mx-1 mb-5 h-px flex-1 ${step > i ? "bg-accent" : "bg-card-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: 기본정보 */}
      {step === 0 && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-lg font-semibold text-foreground">기본 정보</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">업소명 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="업소명을 입력하세요"
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">업종 <span className="text-red-400">*</span></label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`rounded-lg border p-3 text-center text-sm transition-colors ${
                        selectedCategory === cat.slug
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-card-border text-muted hover:border-accent/40"
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <p className="mt-1 text-xs">{cat.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground">지역 (구) <span className="text-red-400">*</span></label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                  >
                    <option value="">구 선택</option>
                    {regions.map((r) => (
                      <option key={r.name} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">지역 (동) <span className="text-red-400">*</span></label>
                  <select
                    disabled={!currentRegion}
                    className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none disabled:opacity-40"
                  >
                    <option value="">동 선택</option>
                    {currentRegion?.districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">상세 주소 <span className="text-red-400">*</span></label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    placeholder="주소를 검색하세요"
                    className="flex-1 rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                  />
                  <button className="shrink-0 rounded-lg border border-card-border px-4 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent">
                    주소검색
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="상세주소 (건물명, 층수 등)"
                  className="mt-2 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">연락처 <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  placeholder="02-0000-0000"
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(1)}
              className="rounded-xl bg-accent px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
            >
              다음 단계 →
            </button>
          </div>
        </div>
      )}

      {/* Step 1: 상세정보 */}
      {step === 1 && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-lg font-semibold text-foreground">영업 정보</h2>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">영업 시작 시간</label>
                  <input
                    type="time"
                    defaultValue="18:00"
                    className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">영업 종료 시간</label>
                  <input
                    type="time"
                    defaultValue="03:00"
                    className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={lateNight}
                  onChange={(e) => setLateNight(e.target.checked)}
                  className="accent-[#c8a96e]"
                />
                심야 영업 가능 (AM 2:00 이후)
              </label>

              <div>
                <label className="block text-sm font-medium text-foreground">휴무일</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["월", "화", "수", "목", "금", "토", "일", "연중무휴"].map((day) => (
                    <button
                      key={day}
                      className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-lg font-semibold text-foreground">가격 정보</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">가격대</label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[
                    { level: 1, label: "₩", desc: "5만원 이하" },
                    { level: 2, label: "₩₩", desc: "5~15만원" },
                    { level: 3, label: "₩₩₩", desc: "15~30만원" },
                    { level: 4, label: "₩₩₩₩", desc: "30만원 이상" },
                  ].map((p) => (
                    <button
                      key={p.level}
                      className="rounded-lg border border-card-border p-3 text-center transition-colors hover:border-accent/40"
                    >
                      <p className="text-sm font-medium text-foreground">{p.label}</p>
                      <p className="mt-0.5 text-[10px] text-muted">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">가격 상세 (선택)</label>
                <input
                  type="text"
                  placeholder="예: 1인 10만원~, 룸차지 별도, 테이블차지 5만원"
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-lg font-semibold text-foreground">업소 소개</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">한줄 소개</label>
                <input
                  type="text"
                  placeholder="업소의 특징을 한줄로 소개해주세요 (최대 50자)"
                  maxLength={50}
                  className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">상세 소개</label>
                <textarea
                  rows={6}
                  placeholder="업소의 분위기, 특징, 메뉴, 서비스 등을 자세히 소개해주세요"
                  className="mt-1.5 w-full resize-none rounded-lg border border-card-border bg-background px-4 py-3 text-sm leading-6 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">태그 (최대 10개)</label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    placeholder="태그 입력 후 추가 (예: 데이트, 루프탑)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="flex-1 rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                  />
                  <button
                    onClick={addTag}
                    className="shrink-0 rounded-lg border border-card-border px-4 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    추가
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-0.5 text-accent/50 hover:text-accent">×</button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-muted">추천 태그:</span>
                  {["데이트", "접대용", "단체", "루프탑", "칵테일", "라이브", "프라이빗", "심야", "가성비", "VIP"].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        if (!tags.includes(t) && tags.length < 10) setTags([...tags, t]);
                      }}
                      className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-muted transition-colors hover:bg-accent/20 hover:text-accent"
                    >
                      +{t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-lg font-semibold text-foreground">편의시설 / 특징</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                "주차 가능", "발렛파킹", "예약 가능", "단체석",
                "VIP룸", "루프탑", "테라스", "라이브 공연",
                "DJ부스", "다트/당구", "흡연구역", "Wi-Fi",
              ].map((facility) => (
                <label
                  key={facility}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-card-border px-3 py-2.5 text-sm text-muted transition-colors hover:border-accent/40 has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-accent"
                >
                  <input type="checkbox" className="accent-[#c8a96e]" />
                  {facility}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(0)}
              className="rounded-xl border border-card-border px-8 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
            >
              ← 이전
            </button>
            <button
              onClick={() => setStep(2)}
              className="rounded-xl bg-accent px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
            >
              다음 단계 →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: 사진등록 */}
      {step === 2 && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-lg font-semibold text-foreground">대표 사진</h2>
            <p className="mt-1 text-xs text-muted">검색 결과와 상단에 표시되는 메인 이미지입니다.</p>
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-card-border py-12 transition-colors hover:border-accent/50">
              <input type="file" accept="image/*" className="hidden" />
              <span className="text-4xl">📸</span>
              <p className="mt-2 text-sm text-muted">클릭하여 대표 사진 업로드</p>
              <p className="mt-0.5 text-xs text-muted">권장 비율 16:10, 최대 10MB</p>
            </label>
          </div>

          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">갤러리 사진</h2>
                <p className="mt-1 text-xs text-muted">업소의 분위기를 보여줄 수 있는 사진을 등록하세요 (최대 20장)</p>
              </div>
              <span className="text-sm text-muted">0/20</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-card-border transition-colors hover:border-accent/50">
                <input type="file" accept="image/*" multiple className="hidden" />
                <span className="text-2xl">+</span>
                <p className="mt-1 text-[10px] text-muted">사진 추가</p>
              </label>
            </div>
            <p className="mt-3 text-xs text-muted">
              팁: 외관, 내부 인테리어, 좌석, 메뉴/음료, 이벤트 사진을 다양하게 올리면 방문율이 높아집니다.
            </p>
          </div>

          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-lg font-semibold text-foreground">메뉴판 / 가격표 (선택)</h2>
            <p className="mt-1 text-xs text-muted">메뉴판이나 가격표 이미지를 등록하면 고객 신뢰도가 올라갑니다.</p>
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-card-border py-8 transition-colors hover:border-accent/50">
              <input type="file" accept="image/*" multiple className="hidden" />
              <span className="text-2xl">📋</span>
              <p className="mt-1 text-xs text-muted">메뉴판 이미지 업로드 (최대 5장)</p>
            </label>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="rounded-xl border border-card-border px-8 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
            >
              ← 이전
            </button>
            <button
              onClick={() => setStep(3)}
              className="rounded-xl bg-accent px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
            >
              미리보기 →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: 미리보기 */}
      {step === 3 && (
        <div className="mt-8 space-y-6">
          {/* Preview Card */}
          <div className="rounded-xl border border-card-border bg-card-bg overflow-hidden">
            {/* Gallery Preview */}
            <div className="grid grid-cols-4 gap-1">
              <div className="col-span-2 row-span-2 flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                <span className="text-4xl opacity-20">📸</span>
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                  <span className="text-lg opacity-20">📸</span>
                </div>
              ))}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">(업소명)</h2>
                  <p className="mt-1 text-sm text-muted">(업종) · (지역)</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-accent">NEW</p>
                  <p className="text-xs text-muted">리뷰 0개</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {(tags.length > 0 ? tags : ["태그1", "태그2", "태그3"]).map((tag) => (
                  <span key={tag} className="rounded-full border border-card-border px-3 py-1 text-xs text-muted">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-sm leading-7 text-foreground/80">
                (업소 소개가 여기에 표시됩니다)
              </p>

              <div className="mt-4 rounded-lg border border-card-border p-4">
                <dl className="space-y-2">
                  <div className="flex gap-4">
                    <dt className="w-16 text-xs text-muted">주소</dt>
                    <dd className="text-xs text-foreground">(입력한 주소)</dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-16 text-xs text-muted">영업시간</dt>
                    <dd className="text-xs text-foreground">(영업시간)</dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-16 text-xs text-muted">가격대</dt>
                    <dd className="text-xs text-accent">(가격대)</dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-16 text-xs text-muted">연락처</dt>
                    <dd className="text-xs text-foreground">(연락처)</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
            <h3 className="text-sm font-semibold text-foreground">등록 전 확인사항</h3>
            <ul className="mt-3 space-y-2">
              {[
                "입력하신 정보가 정확한지 확인해주세요.",
                "허위 정보 등록 시 사전 경고 없이 삭제될 수 있습니다.",
                "사진은 직접 촬영한 이미지를 권장합니다.",
                "등록 후 관리자 검수를 거쳐 24시간 내 노출됩니다.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted">
                  <span className="mt-0.5 text-accent">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" className="accent-[#c8a96e]" />
            위 내용을 확인했으며, 이용약관에 동의합니다.
          </label>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="rounded-xl border border-card-border px-8 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
            >
              ← 이전
            </button>
            <button className="rounded-xl bg-accent px-10 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
              업소 등록하기
            </button>
          </div>

          {/* Ad Upsell */}
          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h3 className="text-sm font-semibold text-foreground">더 많은 노출이 필요하신가요?</h3>
            <p className="mt-1 text-xs text-muted">프리미엄 광고 상품으로 상단 노출과 더 많은 고객을 확보하세요.</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { name: "일반 등록", price: "무료", features: ["기본 프로필", "리뷰 수신", "검색 노출"], current: true },
                { name: "지역 상단", price: "월 50만원~", features: ["상단 고정", "프리미엄 배지", "통계 리포트"], current: false },
                { name: "메인 배너", price: "월 200만원~", features: ["메인 배너", "전 지역 상단", "맞춤 컨설팅"], current: false },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl border p-4 ${
                    plan.current
                      ? "border-accent/30 bg-accent/5"
                      : "border-card-border"
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                  <p className="mt-1 text-lg font-bold text-accent">{plan.price}</p>
                  <ul className="mt-3 space-y-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-1 text-xs text-muted">
                        <span className="text-accent">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  {plan.current ? (
                    <p className="mt-3 text-center text-xs text-accent">현재 선택</p>
                  ) : (
                    <button className="mt-3 w-full rounded-lg border border-accent py-2 text-xs text-accent transition-colors hover:bg-accent hover:text-black">
                      선택하기
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
