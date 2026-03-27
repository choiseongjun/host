/**
 * 네이버 업소 데이터 + 이미지 크롤링 스크립트
 *
 * 사용법:
 *   npx tsx scripts/crawl-naver.ts              → 수동 데이터 10개 (DB만 필요)
 *   npx tsx scripts/crawl-naver.ts crawl        → 네이버 지도 크롤링 (API 키 불필요!)
 *   npx tsx scripts/crawl-naver.ts crawl --dry   → 크롤링 미리보기 (DB 저장 안 함)
 *   npx tsx scripts/crawl-naver.ts naver        → 네이버 공식 API (키 필요)
 *
 * 환경변수 (.env):
 *   DATABASE_URL          - PostgreSQL 연결 문자열 (필수)
 *   NAVER_CLIENT_ID       - naver 모드에서만 필요
 *   NAVER_CLIENT_SECRET   - naver 모드에서만 필요
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || "";
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET || "";
const DRY_RUN = process.argv.includes("--dry");

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "venues");

// ══════════════════════════════════════════
// 공통 타입 & 유틸
// ══════════════════════════════════════════

interface VenueData {
  name: string;
  category: string;
  categorySlug: string;
  region: string;
  district: string;
  address: string;
  phone: string;
  hours: string;
  lateNight: boolean;
  description: string;
  tags: string[];
  facilities: string[];
  images: string[];
  priceLevel: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  sourceUrl?: string;
  sourceName: string;
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

function extractRegionDistrict(address: string): { region: string; district: string } {
  const parts = address.split(" ");
  let region = "";
  let district = "";
  for (const part of parts) {
    if (part.endsWith("구")) region = part;
    if (part.endsWith("동") || part.endsWith("로")) { district = part; break; }
  }
  return { region, district };
}

function slugify(str: string): string {
  return str.replace(/[^a-zA-Z0-9가-힣]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function inferLateNight(hours: string, category: string): boolean {
  if (["클럽", "호스트바"].includes(category)) return true;
  if (hours && (hours.includes("AM") || hours.includes("새벽") || hours.includes("05:") || hours.includes("06:"))) return true;
  return false;
}

function inferPriceLevel(category: string): "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH" {
  const map: Record<string, "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH"> = {
    "클럽": "MEDIUM", "호스트바": "HIGH", "바/라운지": "MEDIUM",
    "마사지": "MEDIUM", "노래방": "LOW", "중년노래방": "MEDIUM",
  };
  return map[category] || "MEDIUM";
}

function inferTags(name: string, category: string, description: string, extra = ""): string[] {
  const tags: string[] = [category];
  const text = `${name} ${description} ${extra}`.toLowerCase();
  const kwMap: Record<string, string> = {
    "와인": "와인", "칵테일": "칵테일", "맥주": "크래프트맥주", "크래프트": "크래프트맥주",
    "루프탑": "루프탑", "라이브": "라이브", "dj": "DJ", "디제이": "DJ",
    "edm": "EDM", "힙합": "힙합", "재즈": "재즈", "위스키": "위스키",
    "데이트": "데이트", "프리미엄": "프리미엄", "vip": "프리미엄",
    "파티": "파티", "단체": "파티", "심야": "심야", "새벽": "심야",
    "타이": "타이마사지", "스웨디시": "스웨디시", "아로마": "아로마",
    "스포츠": "스포츠", "이자카야": "이자카야", "일본": "이자카야",
    "와인바": "와인", "칵테일바": "칵테일",
  };
  for (const [kw, tag] of Object.entries(kwMap)) {
    if (text.includes(kw)) tags.push(tag);
  }
  return [...new Set(tags)];
}

function inferFacilities(text: string): string[] {
  const facilities: string[] = [];
  const lower = text.toLowerCase();
  if (lower.includes("주차")) facilities.push("주차 가능");
  if (lower.includes("발렛")) facilities.push("발렛파킹");
  if (lower.includes("예약")) facilities.push("예약 가능");
  if (lower.includes("wifi") || lower.includes("와이파이")) facilities.push("Wi-Fi");
  if (lower.includes("루프탑") || lower.includes("테라스")) facilities.push("테라스");
  if (lower.includes("흡연")) facilities.push("흡연구역");
  if (lower.includes("vip") || lower.includes("룸")) facilities.push("VIP룸");
  return facilities;
}

// ══════════════════════════════════════════
// 이미지 다운로드 (공통)
// ══════════════════════════════════════════

function downloadFile(url: string, dest: string, maxRedirects = 3): Promise<boolean> {
  return new Promise((resolve) => {
    if (maxRedirects <= 0) { resolve(false); return; }
    const protocol = url.startsWith("https") ? https : http;

    const req = protocol.get(url, {
      timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(downloadFile(res.headers.location, dest, maxRedirects - 1));
        return;
      }
      if (res.statusCode !== 200) { resolve(false); return; }

      const contentType = res.headers["content-type"] || "";
      if (!contentType.startsWith("image/")) { resolve(false); return; }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(true); });
      file.on("error", () => { fs.unlink(dest, () => {}); resolve(false); });
    });

    req.on("error", () => resolve(false));
    req.on("timeout", () => { req.destroy(); resolve(false); });
  });
}

function getImageExt(url: string): string {
  try {
    const p = new URL(url).pathname.toLowerCase();
    if (p.endsWith(".png")) return ".png";
    if (p.endsWith(".webp")) return ".webp";
    if (p.endsWith(".gif")) return ".gif";
  } catch {}
  return ".jpg";
}

async function downloadImages(imageUrls: string[], venueSlug: string, maxCount = 5): Promise<string[]> {
  if (!imageUrls.length) return [];

  const venueDir = path.join(UPLOAD_DIR, venueSlug);
  if (!fs.existsSync(venueDir)) fs.mkdirSync(venueDir, { recursive: true });

  const saved: string[] = [];
  for (const imgUrl of imageUrls) {
    if (saved.length >= maxCount) break;

    const ext = getImageExt(imgUrl);
    const filename = `${saved.length + 1}${ext}`;
    const destPath = path.join(venueDir, filename);
    const webPath = `/uploads/venues/${venueSlug}/${filename}`;

    if (fs.existsSync(destPath)) {
      saved.push(webPath);
      continue;
    }

    const ok = await downloadFile(imgUrl, destPath);
    if (ok) {
      saved.push(webPath);
      console.log(`      📷 [${saved.length}/${maxCount}] 저장 완료`);
    }
    await sleep(200);
  }
  return saved;
}

// ══════════════════════════════════════════
// DB 저장 (공통)
// ══════════════════════════════════════════

async function saveVenue(data: VenueData): Promise<"saved" | "skipped" | "images_added"> {
  // 중복 체크
  const existing = await prisma.venue.findFirst({
    where: {
      OR: [
        ...(data.sourceUrl ? [{ sourceUrl: data.sourceUrl }] : []),
        { AND: [{ name: data.name }, { address: data.address }] },
      ],
    },
  });

  if (existing) {
    // 기존 업소에 이미지가 없으면 추가
    if (existing.images.length === 0 && data.images.length > 0) {
      await prisma.venue.update({
        where: { id: existing.id },
        data: { images: data.images },
      });
      return "images_added";
    }
    return "skipped";
  }

  await prisma.venue.create({
    data: { ...data, isApproved: true },
  });
  return "saved";
}

// ══════════════════════════════════════════
// 검색 쿼리 생성
// ══════════════════════════════════════════

const REGIONS = [
  "강남", "청담", "신사", "압구정", "역삼", "논현", "삼성",
  "이태원", "한남", "경리단길",
  "홍대", "합정", "연남", "상수",
  "건대", "성수", "왕십리",
  "종로", "을지로", "명동", "익선동",
  "잠실", "송파", "방이",
  "신촌", "연희", "이대",
  "서초", "방배", "교대",
  "여의도", "영등포",
  "마포", "공덕",
  "신림", "노량진",
];

const CATEGORY_KEYWORDS: { keywords: string[]; categorySlug: string; category: string }[] = [
  { keywords: ["바", "라운지바", "와인바", "칵테일바", "루프탑바", "펍"], categorySlug: "bar-lounge", category: "바/라운지" },
  { keywords: ["클럽", "나이트클럽"], categorySlug: "club", category: "클럽" },
  { keywords: ["노래방", "코인노래방"], categorySlug: "karaoke", category: "노래방" },
  { keywords: ["마사지", "스파", "타이마사지", "스웨디시"], categorySlug: "massage", category: "마사지" },
  { keywords: ["호스트바"], categorySlug: "host-bar", category: "호스트바" },
  { keywords: ["중년노래방", "어른노래방"], categorySlug: "middle-age-karaoke", category: "중년노래방" },
];

interface SearchQuery { keyword: string; categorySlug: string; category: string; }

function buildSearchQueries(): SearchQuery[] {
  const queries: SearchQuery[] = [];
  for (const cat of CATEGORY_KEYWORDS) {
    for (const region of REGIONS) {
      for (const kw of cat.keywords) {
        queries.push({ keyword: `${region} ${kw}`, categorySlug: cat.categorySlug, category: cat.category });
      }
    }
  }
  return queries;
}

// ══════════════════════════════════════════
// 모드 1: 네이버 지도 크롤링 (API 키 불필요!)
// ══════════════════════════════════════════

const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
  "Referer": "https://map.naver.com/",
};

interface NaverPlaceItem {
  id: string;
  name: string;
  address: string;
  roadAddress: string;
  tel: string;
  category: string[];
  x: string;
  y: string;
  thumUrl?: string;
  businessHours?: string;
  bizhourInfo?: string;
  microReview?: string;
}

interface NaverPlaceDetail {
  id: string;
  name: string;
  address: string;
  roadAddress: string;
  tel: string;
  category: string[];
  businessHours?: { status?: { text?: string }; list?: { day?: string; businessHours?: { start?: string; end?: string } }[] };
  imageURL?: string[];
  images?: { url?: string }[];
  description?: string;
  microReview?: string;
}

async function fetchNaverPlace(url: string): Promise<unknown> {
  try {
    const res = await fetch(url, { headers: BROWSER_HEADERS });
    if (res.status === 429) {
      console.log("   ⏳ 요청 제한 - 3초 대기...");
      await sleep(3000);
      return fetchNaverPlace(url);
    }
    if (!res.ok) {
      console.error(`   ❌ ${res.status} ${res.statusText}`);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error(`   ❌ 네트워크 에러:`, (err as Error).message);
    return null;
  }
}

async function searchNaverPlace(query: string): Promise<NaverPlaceItem[]> {
  // 네이버 지도 내부 검색 API (키 불필요)
  const url = `https://map.naver.com/p/api/search/allSearch?query=${encodeURIComponent(query)}&type=all&searchCoord=126.9783882%3B37.5666103&boundary=`;
  const data = await fetchNaverPlace(url) as { result?: { place?: { list?: NaverPlaceItem[] } } } | null;

  if (!data?.result?.place?.list) return [];
  return data.result.place.list;
}

async function getPlaceDetail(placeId: string): Promise<NaverPlaceDetail | null> {
  const url = `https://map.naver.com/p/api/sites/summary/${placeId}?lang=ko`;
  const data = await fetchNaverPlace(url) as NaverPlaceDetail | null;
  return data;
}

async function getPlacePhotos(placeId: string): Promise<string[]> {
  // 업체 사진 목록 API
  const url = `https://map.naver.com/p/api/sites/summary/${placeId}/photo?page=1&size=10&lang=ko`;
  const data = await fetchNaverPlace(url) as { photoList?: { list?: { photoUrl?: string; orgPhotoUrl?: string }[] } } | null;

  if (!data?.photoList?.list) return [];
  return data.photoList.list
    .map((p) => p.orgPhotoUrl || p.photoUrl || "")
    .filter(Boolean);
}

function parseBusinessHours(detail: NaverPlaceDetail): string {
  if (!detail.businessHours?.list?.length) return "";
  const items = detail.businessHours.list;
  // 영업시간 텍스트 생성
  const first = items[0];
  if (first?.businessHours?.start && first?.businessHours?.end) {
    return `${first.businessHours.start} - ${first.businessHours.end}`;
  }
  return detail.businessHours?.status?.text || "";
}

async function crawlNaverPlace() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const queries = buildSearchQueries();
  console.log(`🕷️  네이버 지도 크롤링 시작 (${queries.length}개 쿼리)${DRY_RUN ? " [DRY RUN]" : ""}\n`);

  let stats = { saved: 0, skipped: 0, images: 0, errors: 0 };
  const seenIds = new Set<string>();

  for (let qi = 0; qi < queries.length; qi++) {
    const q = queries[qi];
    const progress = `[${qi + 1}/${queries.length}]`;
    process.stdout.write(`🔍 ${progress} "${q.keyword}" `);

    const places = await searchNaverPlace(q.keyword);
    if (!places.length) { console.log("→ 결과 없음"); await sleep(300); continue; }
    console.log(`→ ${places.length}개 발견`);

    for (const place of places) {
      // 중복 스킵 (세션 내)
      if (seenIds.has(place.id)) continue;
      seenIds.add(place.id);

      const address = place.roadAddress || place.address;
      if (!address.includes("서울")) continue;

      const name = stripHtml(place.name);
      const { region, district } = extractRegionDistrict(address);
      const sourceUrl = `https://map.naver.com/p/entry/place/${place.id}`;

      if (DRY_RUN) {
        console.log(`   📋 ${name} | ${region} ${district} | ${place.tel || "-"} | 📷 ${place.thumUrl ? "Y" : "N"}`);
        stats.saved++;
        continue;
      }

      // 상세 정보 가져오기
      const detail = await getPlaceDetail(place.id);
      await sleep(200);

      // 사진 가져오기
      let photoUrls: string[] = [];
      const photoResult = await getPlacePhotos(place.id);
      if (photoResult.length) {
        photoUrls = photoResult;
      } else if (place.thumUrl) {
        // 썸네일이라도 사용
        photoUrls = [place.thumUrl];
      }
      await sleep(200);

      // 이미지 다운로드
      const venueSlug = slugify(`${name}-${place.id}`);
      const images = photoUrls.length > 0
        ? await downloadImages(photoUrls, venueSlug, 5)
        : [];
      stats.images += images.length;

      // 영업시간
      const hours = detail ? parseBusinessHours(detail) : "";
      const description = detail?.description
        || detail?.microReview
        || place.microReview
        || `${region} ${district}에 위치한 ${q.category}`;
      const naverCat = (place.category || []).join(" ");

      const venueData: VenueData = {
        name,
        category: q.category,
        categorySlug: q.categorySlug,
        region,
        district,
        address,
        phone: place.tel || "",
        hours,
        lateNight: inferLateNight(hours, q.category),
        description: stripHtml(description),
        tags: inferTags(name, q.category, description, naverCat),
        facilities: inferFacilities(`${description} ${naverCat}`),
        images,
        priceLevel: inferPriceLevel(q.category),
        sourceUrl,
        sourceName: "naver-place",
      };

      const result = await saveVenue(venueData);
      if (result === "saved") {
        stats.saved++;
        console.log(`   ✅ ${name} (${region} ${district}) - 📷 ${images.length}장`);
      } else if (result === "images_added") {
        stats.saved++;
        console.log(`   🖼️  ${name} - 이미지 ${images.length}장 추가`);
      } else {
        stats.skipped++;
      }
    }

    // 검색 쿼리 간 간격 (차단 방지)
    await sleep(800);
  }

  console.log("\n" + "═".repeat(50));
  console.log("🎉 크롤링 완료!");
  console.log(`   업소 저장: ${stats.saved}개`);
  console.log(`   중복 스킵: ${stats.skipped}개`);
  console.log(`   이미지 총: ${stats.images}장`);
  if (DRY_RUN) console.log("   ⚠️  DRY RUN 모드 - DB에 저장되지 않았습니다.");
  console.log("═".repeat(50));
}

// ══════════════════════════════════════════
// 모드 2: 네이버 공식 API (키 필요)
// ══════════════════════════════════════════

async function naverApiFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
      },
    });
    if (res.status === 429) { await sleep(2000); return naverApiFetch(url); }
    if (!res.ok) { console.error(`   ❌ API 에러: ${res.status}`); return null; }
    return res.json();
  } catch (err) { console.error(`   ❌`, (err as Error).message); return null; }
}

async function crawlNaverApi() {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.error("❌ .env에 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET을 설정하세요.");
    console.log("   또는 'crawl' 모드를 사용하세요 (API 키 불필요):\n");
    console.log("   npx tsx scripts/crawl-naver.ts crawl\n");
    process.exit(1);
  }

  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const queries = buildSearchQueries();
  console.log(`🕷️  네이버 API 크롤링 시작 (${queries.length}개 쿼리)${DRY_RUN ? " [DRY RUN]" : ""}\n`);

  let stats = { saved: 0, skipped: 0, images: 0 };
  const seenNames = new Set<string>();

  for (let qi = 0; qi < queries.length; qi++) {
    const q = queries[qi];
    console.log(`🔍 [${qi + 1}/${queries.length}] "${q.keyword}"`);

    for (let start = 1; start <= 11; start += 5) {
      const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(q.keyword)}&display=5&start=${start}&sort=comment`;
      const result = await naverApiFetch<{ items: { title: string; link: string; category: string; description: string; telephone: string; address: string; roadAddress: string }[] }>(url);
      if (!result?.items?.length) break;

      for (const item of result.items) {
        const name = stripHtml(item.title);
        const address = item.roadAddress || item.address;
        if (!address.includes("서울")) continue;

        const dedupeKey = `${name}::${address}`;
        if (seenNames.has(dedupeKey)) continue;
        seenNames.add(dedupeKey);

        const { region, district } = extractRegionDistrict(address);

        // 이미지 검색
        const imgUrl = `https://openapi.naver.com/v1/search/image?query=${encodeURIComponent(`${region} ${name}`)}&display=8&sort=sim&filter=large`;
        const imgResult = await naverApiFetch<{ items: { link: string }[] }>(imgUrl);
        const imageUrls = imgResult?.items?.map((i) => i.link) || [];
        const venueSlug = slugify(`${name}-${region}`);
        const images = DRY_RUN ? [] : await downloadImages(imageUrls, venueSlug, 5);
        stats.images += images.length;

        const description = stripHtml(item.description) || `${region} ${district}에 위치한 ${q.category}`;

        if (DRY_RUN) {
          console.log(`   📋 ${name} | ${region} ${district} | 📷 ${imageUrls.length}장`);
          stats.saved++;
          continue;
        }

        const result2 = await saveVenue({
          name, category: q.category, categorySlug: q.categorySlug,
          region, district, address, phone: item.telephone || "", hours: "",
          lateNight: inferLateNight("", q.category),
          description, tags: inferTags(name, q.category, description, item.category),
          facilities: inferFacilities(`${description} ${item.category}`),
          images, priceLevel: inferPriceLevel(q.category),
          sourceUrl: item.link || undefined, sourceName: "naver",
        });

        if (result2 === "saved") { stats.saved++; console.log(`   ✅ ${name} (${region} ${district}) - 📷 ${images.length}장`); }
        else { stats.skipped++; }
      }
      await sleep(300);
    }
    await sleep(500);
  }

  console.log("\n" + "═".repeat(50));
  console.log(`🎉 완료! 저장: ${stats.saved}개, 스킵: ${stats.skipped}개, 이미지: ${stats.images}장`);
  console.log("═".repeat(50));
}

// ══════════════════════════════════════════
// 모드 3: 수동 데이터
// ══════════════════════════════════════════

async function insertManualData() {
  console.log("📝 수동 데이터 삽입 모드...\n");

  const manualVenues = [
    { name: "르쎄라", category: "바/라운지", categorySlug: "bar-lounge", region: "강남구", district: "청담동", address: "서울 강남구 청담동 89-10", phone: "02-511-1234", hours: "PM 6:00 - AM 3:00", lateNight: true, priceRange: "15만원~30만원", priceLevel: "HIGH" as const, description: "청담동 프리미엄 와인바. 소믈리에가 추천하는 와인과 함께하는 특별한 밤.", tags: ["와인", "데이트", "프리미엄", "소믈리에"], facilities: ["예약 가능", "발렛파킹", "Wi-Fi"] },
    { name: "클럽 매스", category: "클럽", categorySlug: "club", region: "강남구", district: "논현동", address: "서울 강남구 논현동 200-5", phone: "02-544-5678", hours: "PM 10:00 - AM 6:00", lateNight: true, priceRange: "5만원~", priceLevel: "MEDIUM" as const, description: "강남 대표 일렉트로닉 클럽. 국내외 유명 DJ 공연.", tags: ["EDM", "하우스", "파티", "강남"], facilities: ["DJ부스", "흡연구역", "발렛파킹"] },
    { name: "앨리스", category: "바/라운지", categorySlug: "bar-lounge", region: "용산구", district: "이태원동", address: "서울 용산구 이태원동 34-21", phone: "02-797-3456", hours: "PM 7:00 - AM 2:00", lateNight: false, priceRange: "5만원~15만원", priceLevel: "MEDIUM" as const, description: "이태원 숨겨진 스피크이지 바. 1920년대 컨셉의 프라이빗한 공간.", tags: ["스피크이지", "칵테일", "데이트", "분위기"], facilities: ["예약 가능"] },
    { name: "비비", category: "클럽", categorySlug: "club", region: "마포구", district: "홍대입구", address: "서울 마포구 서교동 357-12", phone: "02-332-7890", hours: "PM 10:00 - AM 5:00", lateNight: true, priceRange: "2만원~", priceLevel: "LOW" as const, description: "홍대 인디 음악 씬의 중심. 다양한 장르의 라이브와 DJ 공연.", tags: ["인디", "라이브", "20대", "홍대"], facilities: ["DJ부스", "라이브 공연"] },
    { name: "루프135", category: "바/라운지", categorySlug: "bar-lounge", region: "강남구", district: "역삼동", address: "서울 강남구 역삼동 735-4", phone: "02-555-1350", hours: "PM 5:00 - AM 2:00", lateNight: false, priceRange: "8만원~20만원", priceLevel: "MEDIUM" as const, description: "역삼역 인근 루프탑 바. 서울 도심 야경과 함께하는 칵테일.", tags: ["루프탑", "야경", "칵테일", "퇴근후"], facilities: ["루프탑", "테라스", "Wi-Fi", "예약 가능"] },
    { name: "소울 타이 스파", category: "마사지", categorySlug: "massage", region: "강남구", district: "논현동", address: "서울 강남구 논현동 88-15", phone: "02-518-8899", hours: "AM 10:00 - AM 2:00", lateNight: true, priceRange: "6만원~15만원", priceLevel: "MEDIUM" as const, description: "태국 출신 전문 테라피스트의 정통 타이마사지. 가성비 최고.", tags: ["타이마사지", "가성비", "심야", "강남"], facilities: ["주차 가능", "예약 가능"] },
    { name: "글램 나이트", category: "호스트바", categorySlug: "host-bar", region: "강남구", district: "압구정동", address: "서울 강남구 압구정동 456-2", phone: "02-517-7777", hours: "PM 9:00 - AM 5:00", lateNight: true, priceRange: "30만원~", priceLevel: "HIGH" as const, description: "압구정 프리미엄 호스트바. 수준 높은 대화와 서비스.", tags: ["프리미엄", "여성전용", "압구정"], facilities: ["VIP룸", "발렛파킹", "예약 가능"] },
    { name: "올드보이", category: "중년노래방", categorySlug: "middle-age-karaoke", region: "서초구", district: "방배동", address: "서울 서초구 방배동 123-7", phone: "02-533-4567", hours: "PM 4:00 - AM 1:00", lateNight: false, priceRange: "10만원~25만원", priceLevel: "MEDIUM" as const, description: "방배동 중년 맞춤 노래방. 7080부터 최신 트로트까지.", tags: ["7080", "트로트", "중년", "가족모임"], facilities: ["단체석", "주차 가능"] },
    { name: "문바", category: "바/라운지", categorySlug: "bar-lounge", region: "성동구", district: "성수동", address: "서울 성동구 성수동 300-15", phone: "02-499-2233", hours: "PM 6:00 - AM 1:00", lateNight: false, priceRange: "5만원~12만원", priceLevel: "MEDIUM" as const, description: "성수동 감성 크래프트 맥주바. 20종 이상의 수제맥주.", tags: ["크래프트맥주", "성수동", "감성", "데이트"], facilities: ["테라스", "Wi-Fi"] },
    { name: "아레나", category: "클럽", categorySlug: "club", region: "광진구", district: "건대입구", address: "서울 광진구 화양동 5-20", phone: "02-462-8888", hours: "PM 10:00 - AM 6:00", lateNight: true, priceRange: "3만원~", priceLevel: "LOW" as const, description: "건대 최대 규모 클럽. EDM부터 힙합까지 다양한 파티.", tags: ["EDM", "힙합", "건대", "대형"], facilities: ["DJ부스", "흡연구역"] },
  ];

  let count = 0;
  for (const v of manualVenues) {
    const existing = await prisma.venue.findFirst({ where: { name: v.name, address: v.address } });
    if (existing) continue;

    await prisma.venue.create({ data: { ...v, images: [], isApproved: true, sourceName: "manual" } });
    count++;
    console.log(`✅ ${v.name} (${v.region} ${v.district})`);
  }

  console.log(`\n🎉 수동 데이터 삽입 완료! ${count}개 추가`);
}

// ══════════════════════════════════════════
// 엔트리포인트
// ══════════════════════════════════════════

async function main() {
  const mode = process.argv[2] || "manual";

  switch (mode) {
    case "crawl":
      await crawlNaverPlace();
      break;
    case "naver":
      await crawlNaverApi();
      break;
    default:
      await insertManualData();
      break;
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => { pool.end(); prisma.$disconnect(); });
