"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories, regions } from "@/data/mock";
import { useAuth } from "@/components/AuthProvider";

const steps = ["기본정보", "상세정보", "사진등록", "미리보기"];

const priceLevels = [
  { level: "LOW", label: "₩", desc: "5만원 이하" },
  { level: "MEDIUM", label: "₩₩", desc: "5~15만원" },
  { level: "HIGH", label: "₩₩₩", desc: "15~30만원" },
  { level: "VERY_HIGH", label: "₩₩₩₩", desc: "30만원 이상" },
];

const facilityOptions = [
  "주차 가능", "발렛파킹", "예약 가능", "단체석",
  "VIP룸", "루프탑", "테라스", "라이브 공연",
  "DJ부스", "다트/당구", "흡연구역", "Wi-Fi",
];

export default function VenueRegisterPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 0: 기본정보
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 1: 상세정보
  const [hoursStart, setHoursStart] = useState("18:00");
  const [hoursEnd, setHoursEnd] = useState("03:00");
  const [lateNight, setLateNight] = useState(false);
  const [closedDays, setClosedDays] = useState<string[]>([]);
  const [priceLevel, setPriceLevel] = useState("MEDIUM");
  const [priceRange, setPriceRange] = useState("");
  const [shortIntro, setShortIntro] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [facilities, setFacilities] = useState<string[]>([]);

  // Step 2: 사진
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentRegion = regions.find((r) => r.name === selectedRegion);
  const catInfo = categories.find((c) => c.slug === selectedCategory);

  const addTag = () => {
    if (tagInput.trim() && tags.length < 10 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const toggleClosedDay = (day: string) => {
    setClosedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const toggleFacility = (f: string) => {
    setFacilities((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 20 - imageFiles.length;
    const newFiles = files.slice(0, remaining);

    setImageFiles((prev) => [...prev, ...newFiles]);

    for (const file of newFiles) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit() {
    setError("");

    if (!name || !selectedCategory || !selectedRegion || !selectedDistrict || !address || !phone) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      // 1. 이미지 업로드
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        const formData = new FormData();
        for (const file of imageFiles) {
          formData.append("files", file);
        }
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrls = uploadData.urls;
        }
      }

      // 2. 업소 등록
      const fullAddress = addressDetail ? `${address} ${addressDetail}` : address;
      const hours = `${hoursStart} ~ ${hoursEnd}`;

      const res = await fetch("/api/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name,
          category: catInfo?.name || selectedCategory,
          categorySlug: selectedCategory,
          region: selectedRegion,
          district: selectedDistrict,
          address: fullAddress,
          phone,
          hours,
          lateNight,
          closedDays: closedDays.join(", "),
          priceRange,
          priceLevel,
          shortIntro,
          description,
          tags,
          facilities,
          images: imageUrls,
          ownerId: user?.id,
          isApproved: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "업소 등록에 실패했습니다.");
        return;
      }

      const venue = await res.json();
      router.push(`/venue/${venue.id}`);
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (!user || user.username !== "admin") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">접근 권한이 없습니다</p>
          <p className="mt-2 text-sm text-muted">관리자만 업소를 등록할 수 있습니다.</p>
          <Link href="/" className="mt-6 inline-block rounded-xl bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-accent">홈</Link>
        <span>/</span>
        <span className="text-foreground">업소 등록</span>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-foreground">업소 등록</h1>
      <p className="mt-1 text-sm text-muted">사랑과전쟁에 업소를 등록하고 더 많은 고객을 만나세요.</p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {/* Step Indicator */}
      <div className="mt-8 flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <button onClick={() => setStep(i)} className="flex flex-col items-center gap-1.5 w-full">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-colors ${step >= i ? "bg-accent text-black" : "border border-card-border text-muted"}`}>
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
                <input type="text" placeholder="업소명을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">업종 <span className="text-red-400">*</span></label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {categories.map((cat) => (
                    <button key={cat.slug} onClick={() => setSelectedCategory(cat.slug)} className={`rounded-lg border p-3 text-center text-sm transition-colors ${selectedCategory === cat.slug ? "border-accent bg-accent/10 text-accent" : "border-card-border text-muted hover:border-accent/40"}`}>
                      <span className="text-lg">{cat.icon}</span>
                      <p className="mt-1 text-xs">{cat.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground">지역 (구) <span className="text-red-400">*</span></label>
                  <select value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); setSelectedDistrict(""); }} className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none">
                    <option value="">구 선택</option>
                    {regions.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">지역 (동) <span className="text-red-400">*</span></label>
                  <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!currentRegion} className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none disabled:opacity-40">
                    <option value="">동 선택</option>
                    {currentRegion?.districts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">상세 주소 <span className="text-red-400">*</span></label>
                <input type="text" placeholder="주소를 입력하세요" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
                <input type="text" placeholder="상세주소 (건물명, 층수 등)" value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} className="mt-2 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">연락처 <span className="text-red-400">*</span></label>
                <input type="tel" placeholder="02-0000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => setStep(1)} className="rounded-xl bg-accent px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">다음 단계 →</button>
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
                  <input type="time" value={hoursStart} onChange={(e) => setHoursStart(e.target.value)} className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">영업 종료 시간</label>
                  <input type="time" value={hoursEnd} onChange={(e) => setHoursEnd(e.target.value)} className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none" />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" checked={lateNight} onChange={(e) => setLateNight(e.target.checked)} className="accent-[#c8a96e]" />
                심야 영업 가능 (AM 2:00 이후)
              </label>

              <div>
                <label className="block text-sm font-medium text-foreground">휴무일</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["월", "화", "수", "목", "금", "토", "일", "연중무휴"].map((day) => (
                    <button key={day} onClick={() => toggleClosedDay(day)} className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${closedDays.includes(day) ? "border-accent bg-accent/10 text-accent" : "border-card-border text-muted hover:border-accent hover:text-accent"}`}>
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
                  {priceLevels.map((p) => (
                    <button key={p.level} onClick={() => setPriceLevel(p.level)} className={`rounded-lg border p-3 text-center transition-colors ${priceLevel === p.level ? "border-accent bg-accent/10 text-accent" : "border-card-border text-muted hover:border-accent/40"}`}>
                      <p className="text-sm font-medium">{p.label}</p>
                      <p className="mt-0.5 text-[10px]">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">가격 상세 (선택)</label>
                <input type="text" placeholder="예: 1인 10만원~, 룸차지 별도" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-lg font-semibold text-foreground">업소 소개</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">한줄 소개</label>
                <input type="text" placeholder="업소의 특징을 한줄로 (최대 50자)" maxLength={50} value={shortIntro} onChange={(e) => setShortIntro(e.target.value)} className="mt-1.5 w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">상세 소개</label>
                <textarea rows={6} placeholder="업소의 분위기, 특징, 메뉴, 서비스 등을 자세히 소개해주세요" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5 w-full resize-none rounded-lg border border-card-border bg-background px-4 py-3 text-sm leading-6 text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">태그 (최대 10개)</label>
                <div className="mt-1.5 flex gap-2">
                  <input type="text" placeholder="태그 입력 후 추가" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} className="flex-1 rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
                  <button onClick={addTag} className="shrink-0 rounded-lg border border-card-border px-4 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent">추가</button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-0.5 text-accent/50 hover:text-accent">×</button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-muted">추천:</span>
                  {["데이트", "접대용", "단체", "루프탑", "칵테일", "라이브", "프라이빗", "심야", "가성비", "VIP"].map((t) => (
                    <button key={t} onClick={() => { if (!tags.includes(t) && tags.length < 10) setTags([...tags, t]); }} className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-muted transition-colors hover:bg-accent/20 hover:text-accent">+{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <h2 className="text-lg font-semibold text-foreground">편의시설 / 특징</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {facilityOptions.map((f) => (
                <button key={f} onClick={() => toggleFacility(f)} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${facilities.includes(f) ? "border-accent bg-accent/10 text-accent" : "border-card-border text-muted hover:border-accent/40"}`}>
                  {facilities.includes(f) ? "✓" : "○"} {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(0)} className="rounded-xl border border-card-border px-8 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent">← 이전</button>
            <button onClick={() => setStep(2)} className="rounded-xl bg-accent px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">다음 단계 →</button>
          </div>
        </div>
      )}

      {/* Step 2: 사진등록 */}
      {step === 2 && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-card-border bg-card-bg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">사진 등록</h2>
                <p className="mt-1 text-xs text-muted">업소 사진을 등록하세요 (최대 20장). 첫 번째 사진이 대표 이미지입니다.</p>
              </div>
              <span className="text-sm text-muted">{imageFiles.length}/20</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {imagePreviews.map((preview, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-card-border">
                  <img src={preview} alt="" className="h-full w-full object-cover" />
                  {i === 0 && <span className="absolute left-2 top-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-black">대표</span>}
                  <button onClick={() => removeImage(i)} className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">×</button>
                </div>
              ))}
              {imageFiles.length < 20 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-card-border transition-colors hover:border-accent/50">
                  <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
                  <span className="text-2xl">+</span>
                  <p className="mt-1 text-[10px] text-muted">사진 추가</p>
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="rounded-xl border border-card-border px-8 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent">← 이전</button>
            <button onClick={() => setStep(3)} className="rounded-xl bg-accent px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover">미리보기 →</button>
          </div>
        </div>
      )}

      {/* Step 3: 미리보기 */}
      {step === 3 && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-card-border bg-card-bg overflow-hidden">
            {imagePreviews.length > 0 ? (
              <div className="aspect-[16/9] overflow-hidden">
                <img src={imagePreviews[0]} alt="" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                <span className="text-4xl opacity-20">📸</span>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{name || "(업소명)"}</h2>
                  <p className="mt-1 text-sm text-muted">{catInfo?.name || "(업종)"} · {selectedRegion} {selectedDistrict}</p>
                </div>
                <p className="text-lg font-bold text-accent">NEW</p>
              </div>
              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.map((tag) => <span key={tag} className="rounded-full border border-card-border px-3 py-1 text-xs text-muted">{tag}</span>)}
                </div>
              )}
              {(shortIntro || description) && (
                <p className="mt-4 text-sm leading-7 text-foreground/80">{shortIntro}{shortIntro && description ? " — " : ""}{description}</p>
              )}
              <div className="mt-4 rounded-lg border border-card-border p-4">
                <dl className="space-y-2">
                  <div className="flex gap-4"><dt className="w-16 text-xs text-muted">주소</dt><dd className="text-xs text-foreground">{address} {addressDetail}</dd></div>
                  <div className="flex gap-4"><dt className="w-16 text-xs text-muted">영업시간</dt><dd className="text-xs text-foreground">{hoursStart} ~ {hoursEnd}</dd></div>
                  <div className="flex gap-4"><dt className="w-16 text-xs text-muted">가격대</dt><dd className="text-xs text-accent">{priceRange || priceLevels.find((p) => p.level === priceLevel)?.desc}</dd></div>
                  <div className="flex gap-4"><dt className="w-16 text-xs text-muted">연락처</dt><dd className="text-xs text-foreground">{phone}</dd></div>
                  {closedDays.length > 0 && <div className="flex gap-4"><dt className="w-16 text-xs text-muted">휴무</dt><dd className="text-xs text-foreground">{closedDays.join(", ")}</dd></div>}
                  {facilities.length > 0 && <div className="flex gap-4"><dt className="w-16 text-xs text-muted">편의시설</dt><dd className="text-xs text-foreground">{facilities.join(", ")}</dd></div>}
                </dl>
              </div>
              {imagePreviews.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {imagePreviews.slice(1, 5).map((p, i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-lg">
                      <img src={p} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="rounded-xl border border-card-border px-8 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent">← 이전</button>
            <button onClick={handleSubmit} disabled={loading} className="rounded-xl bg-accent px-10 py-3 text-sm font-medium text-black transition-colors hover:bg-accent-hover disabled:opacity-50">
              {loading ? "등록 중..." : "업소 등록하기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
