/**
 * 네이버 업소 데이터 + 이미지 크롤링 스크립트 (S3 업로드)
 *
 * 사용법:
 *   npx tsx scripts/crawl-naver.ts              → 수동 데이터 10개 (DB만 필요)
 *   npx tsx scripts/crawl-naver.ts naver        → 네이버 API 크롤링 + S3 업로드
 *   npx tsx scripts/crawl-naver.ts naver --dry  → 미리보기
 *   npx tsx scripts/crawl-naver.ts migrate-s3   → 로컬 이미지 → S3 마이그레이션
 *
 * 환경변수 (.env):
 *   DATABASE_URL           - PostgreSQL (필수)
 *   NAVER_CLIENT_ID        - 네이버 API
 *   NAVER_CLIENT_SECRET    - 네이버 API
 *   AWS_S3_BUCKET          - S3 버킷명
 *   AWS_REGION             - AWS 리전
 *   AWS_ACCESS_KEY_ID      - AWS 키
 *   AWS_SECRET_ACCESS_KEY  - AWS 시크릿
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
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

const S3_BUCKET = process.env.AWS_S3_BUCKET || "crewcheck-prod";
const S3_REGION = process.env.AWS_REGION || "ap-northeast-2";
const S3_PREFIX = "venues"; // S3 key prefix: venues/{slug}/1.jpg

const s3 = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

function s3Url(key: string): string {
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
}

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
// 이미지 다운로드 → S3 업로드
// ══════════════════════════════════════════

function downloadToBuffer(url: string, maxRedirects = 3): Promise<{ buffer: Buffer; contentType: string } | null> {
  return new Promise((resolve) => {
    if (maxRedirects <= 0) { resolve(null); return; }
    const protocol = url.startsWith("https") ? https : http;

    const req = protocol.get(url, {
      timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(downloadToBuffer(res.headers.location, maxRedirects - 1));
        return;
      }
      if (res.statusCode !== 200) { resolve(null); return; }

      const contentType = res.headers["content-type"] || "image/jpeg";
      if (!contentType.startsWith("image/")) { resolve(null); return; }

      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => resolve({ buffer: Buffer.concat(chunks), contentType }));
      res.on("error", () => resolve(null));
    });

    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
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

function contentTypeFromExt(ext: string): string {
  const map: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif" };
  return map[ext] || "image/jpeg";
}

async function s3Exists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    return true;
  } catch { return false; }
}

async function uploadImagesToS3(imageUrls: string[], venueSlug: string, maxCount = 5): Promise<string[]> {
  if (!imageUrls.length) return [];

  const saved: string[] = [];
  for (const imgUrl of imageUrls) {
    if (saved.length >= maxCount) break;

    const ext = getImageExt(imgUrl);
    const s3Key = `${S3_PREFIX}/${venueSlug}/${saved.length + 1}${ext}`;

    // S3에 이미 있으면 스킵
    if (await s3Exists(s3Key)) {
      saved.push(s3Url(s3Key));
      continue;
    }

    const result = await downloadToBuffer(imgUrl);
    if (!result) continue;

    try {
      await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
        Body: result.buffer,
        ContentType: result.contentType,
        CacheControl: "public, max-age=31536000",
      }));
      saved.push(s3Url(s3Key));
      console.log(`      📷 [${saved.length}/${maxCount}] S3 업로드 완료`);
    } catch (err) {
      console.error(`      ❌ S3 업로드 실패:`, (err as Error).message);
    }

    await sleep(100);
  }
  return saved;
}

// ══════════════════════════════════════════
// DB 저장 (공통)
// ══════════════════════════════════════════

async function saveVenue(data: VenueData): Promise<"saved" | "skipped" | "images_added"> {
  const existing = await prisma.venue.findFirst({
    where: {
      OR: [
        ...(data.sourceUrl ? [{ sourceUrl: data.sourceUrl }] : []),
        { AND: [{ name: data.name }, { address: data.address }] },
      ],
    },
  });

  if (existing) {
    if (existing.images.length === 0 && data.images.length > 0) {
      await prisma.venue.update({ where: { id: existing.id }, data: { images: data.images } });
      return "images_added";
    }
    return "skipped";
  }

  await prisma.venue.create({ data: { ...data, isApproved: true } });
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

// 네이버 category 필드 기반 필터링
// 카테고리 슬러그별로 허용하는 네이버 카테고리 키워드
const ALLOWED_NAVER_CATEGORIES: Record<string, string[]> = {
  "bar-lounge": ["술집", "바", "라운지", "펍", "호프", "와인바", "칵테일", "위스키", "이자카야", "주점", "포차"],
  "club": ["클럽", "나이트", "댄스"],
  "karaoke": ["노래방", "노래", "코인노래"],
  "massage": ["마사지", "스파", "안마", "테라피", "힐링", "사우나", "찜질"],
  "host-bar": ["술집", "바", "호스트", "주점"],
  "middle-age-karaoke": ["노래방", "노래"],
};

// 무조건 제외할 카테고리
const BLOCKED_NAVER_CATEGORIES = [
  "베이커리", "빵", "카페", "디저트", "금매매", "금거래", "쇼핑", "유통",
  "부동산", "학원", "병원", "의원", "약국", "은행", "보험",
  "세탁", "미용실", "헤어", "네일", "피부과", "성형",
  "편의점", "마트", "슈퍼", "문구", "서점", "주유소",
  "숙박", "모텔", "호텔", "게스트하우스",
  "스테이크", "한식", "중식", "일식", "양식", "분식", "패스트푸드",
  "치킨", "피자", "햄버거", "국수", "냉면", "삼겹살", "곱창", "족발",
  "고기", "구이", "갈비", "보쌈", "찌개", "탕", "국밥",
  "초밥", "돈까스", "라멘", "우동", "떡볶이",
];

function isRelevantVenue(naverCategory: string, targetSlug: string): boolean {
  const catLower = naverCategory.toLowerCase();

  // 차단 목록 체크
  for (const blocked of BLOCKED_NAVER_CATEGORIES) {
    if (catLower.includes(blocked)) return false;
  }

  // 허용 목록 체크
  const allowed = ALLOWED_NAVER_CATEGORIES[targetSlug];
  if (!allowed) return true;

  for (const kw of allowed) {
    if (catLower.includes(kw)) return true;
  }

  // 허용 목록에도 차단 목록에도 안 걸리면 → 제외 (안전하게)
  return false;
}

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
// 네이버 Place 공식 사진 추출
// ══════════════════════════════════════════

async function getPlaceIdFromSearch(name: string, address: string): Promise<string | null> {
  // 네이버 검색 HTML에서 Place ID 추출
  const query = `${name} ${address.split(" ").slice(1, 3).join(" ")}`;
  try {
    const res = await fetch(`https://search.naver.com/search.naver?where=nexearch&query=${encodeURIComponent(query)}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const ids = [...html.matchAll(/place\/(\d+)/g)].map(m => m[1]);
    return ids[0] || null;
  } catch { return null; }
}

async function getPlacePhotos(placeId: string): Promise<string[]> {
  try {
    const res = await fetch(`https://m.place.naver.com/restaurant/${placeId}/home`, {
      headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15" },
    });
    if (!res.ok) return [];
    const html = await res.text();

    // URL이 HTML 인코딩되어 있음: https%3A%2F%2Fldb-phinf.pstatic.net%2F...
    // 1) 인코딩된 URL 추출
    const encoded = [...html.matchAll(/https%3A%2F%2Fldb-phinf\.pstatic\.net%2F[^"'&\s)]+/g)]
      .map(m => decodeURIComponent(m[0]));
    // 2) 일반 URL도 추출
    const plain = [...html.matchAll(/https:\/\/ldb-phinf\.pstatic\.net\/[^"'\s)\\]+/g)]
      .map(m => m[0]);

    const all = [...new Set([...encoded, ...plain])];
    // .jpg, .jpeg, .png, .webp 로 끝나는 것만 필터
    return all.filter(u => /\.(jpg|jpeg|png|webp)/i.test(u));
  } catch { return []; }
}

// ══════════════════════════════════════════
// 네이버 공식 API 크롤링 → S3
// ══════════════════════════════════════════

async function naverApiFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "X-Naver-Client-Id": NAVER_CLIENT_ID, "X-Naver-Client-Secret": NAVER_CLIENT_SECRET },
    });
    if (res.status === 429) { await sleep(2000); return naverApiFetch(url); }
    if (!res.ok) { console.error(`   ❌ API 에러: ${res.status}`); return null; }
    return res.json();
  } catch (err) { console.error(`   ❌`, (err as Error).message); return null; }
}

async function crawlNaverApi() {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.error("❌ .env에 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET을 설정하세요.");
    process.exit(1);
  }

  const queries = buildSearchQueries();
  console.log(`🕷️  네이버 API 크롤링 → S3 (${queries.length}개 쿼리)${DRY_RUN ? " [DRY RUN]" : ""}\n`);

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

        // 카테고리 필터링 — 관련 없는 업종 제외
        if (!isRelevantVenue(item.category, q.categorySlug)) {
          console.log(`   ⛔ ${name} (${item.category}) — 업종 불일치, 스킵`);
          continue;
        }

        const dedupeKey = `${name}::${address}`;
        if (seenNames.has(dedupeKey)) continue;
        seenNames.add(dedupeKey);

        const { region, district } = extractRegionDistrict(address);

        // Place ID로 공식 사진 가져오기
        const placeId = await getPlaceIdFromSearch(name, address);
        await sleep(300);
        let imageUrls: string[] = [];
        if (placeId) {
          imageUrls = await getPlacePhotos(placeId);
          await sleep(300);
          if (imageUrls.length) console.log(`      🔗 Place ${placeId} → 공식사진 ${imageUrls.length}장`);
        }

        const venueSlug = slugify(`${name}-${region}`);
        const images = DRY_RUN ? [] : await uploadImagesToS3(imageUrls, venueSlug, 5);
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
        else if (result2 === "images_added") { console.log(`   🖼️  ${name} - 이미지 ${images.length}장 추가`); }
        else { stats.skipped++; }
      }
      await sleep(300);
    }
    await sleep(500);
  }

  console.log("\n" + "═".repeat(50));
  console.log(`🎉 완료! 저장: ${stats.saved}개, 스킵: ${stats.skipped}개, 이미지: ${stats.images}장 (S3)`);
  console.log("═".repeat(50));
}

// ══════════════════════════════════════════
// 로컬 이미지 → S3 마이그레이션
// ══════════════════════════════════════════

async function migrateLocalToS3() {
  const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "venues");
  if (!fs.existsSync(UPLOAD_DIR)) {
    console.log("❌ public/uploads/venues/ 폴더가 없습니다.");
    return;
  }

  // DB에서 로컬 이미지 경로를 가진 업소 찾기
  const venues = await prisma.venue.findMany({
    where: { images: { isEmpty: false } },
  });

  const localVenues = venues.filter(v => v.images.some(img => img.startsWith("/uploads/")));
  console.log(`🔄 로컬 → S3 마이그레이션 (${localVenues.length}개 업소)\n`);

  let uploaded = 0;
  let failed = 0;

  for (const venue of localVenues) {
    const newImages: string[] = [];

    for (const imgPath of venue.images) {
      if (!imgPath.startsWith("/uploads/")) {
        newImages.push(imgPath); // 이미 S3 URL이면 그대로
        continue;
      }

      const localFile = path.join(process.cwd(), "public", imgPath);
      if (!fs.existsSync(localFile)) {
        console.log(`   ⚠️  파일 없음: ${imgPath}`);
        failed++;
        continue;
      }

      // /uploads/venues/slug/1.jpg → venues/slug/1.jpg
      const s3Key = imgPath.replace(/^\/uploads\//, "");
      const fileBuffer = fs.readFileSync(localFile);
      const ext = path.extname(localFile).toLowerCase();

      try {
        await s3.send(new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: s3Key,
          Body: fileBuffer,
          ContentType: contentTypeFromExt(ext),
          CacheControl: "public, max-age=31536000",
        }));
        newImages.push(s3Url(s3Key));
        uploaded++;
      } catch (err) {
        console.error(`   ❌ ${imgPath}:`, (err as Error).message);
        newImages.push(imgPath); // 실패하면 원래 경로 유지
        failed++;
      }
    }

    // DB 업데이트
    await prisma.venue.update({
      where: { id: venue.id },
      data: { images: newImages },
    });
    console.log(`   ✅ ${venue.name} - ${venue.images.length}장 마이그레이션`);
  }

  console.log("\n" + "═".repeat(50));
  console.log(`🎉 마이그레이션 완료! 업로드: ${uploaded}장, 실패: ${failed}장`);
  console.log("═".repeat(50));
}

// ══════════════════════════════════════════
// DB 정리 — 관련 없는 업소 제거 + 이미지 재검색
// ══════════════════════════════════════════

async function cleanupVenues() {
  console.log("🧹 DB 정리 시작...\n");

  // 이름 기반으로 관련 없는 업소 제거
  const suspiciousKeywords = [
    "금거래", "금매매", "부동산", "학원", "병원", "의원", "약국",
    "세탁", "편의점", "마트", "주유소", "은행", "보험",
    "삼겹살", "곱창", "족발", "치킨", "피자", "햄버거", "국밥",
    "갈비", "고기", "구이", "보쌈", "찌개", "탕", "냉면",
    "초밥", "돈까스", "라멘", "떡볶이", "분식", "국수",
    "빵집", "베이커리", "카페", "커피",
    "헤어", "미용", "네일", "피부과", "성형",
    "모텔", "게스트하우스",
    "트레이닝", "헬스", "필라테스", "요가", "PT",
    "스테이크", "파스타",
  ];

  const allVenues = await prisma.venue.findMany({ where: { sourceName: "naver" } });
  let deleted = 0;

  for (const venue of allVenues) {
    const nameLower = venue.name.toLowerCase();
    const descLower = (venue.description || "").toLowerCase();
    const isSuspicious = suspiciousKeywords.some(kw => nameLower.includes(kw) || descLower.includes(kw));

    if (isSuspicious) {
      if (!DRY_RUN) {
        await prisma.venue.delete({ where: { id: venue.id } });
      }
      console.log(`   🗑️  ${venue.name} (${venue.category}) — 삭제${DRY_RUN ? " (dry)" : ""}`);
      deleted++;
    }
  }

  console.log(`\n🎉 정리 완료! ${deleted}개 업소 삭제${DRY_RUN ? " (dry run)" : ""}`);
  console.log(`   남은 업소: ${allVenues.length - deleted}개`);
}

// ══════════════════════════════════════════
// 기존 업소 이미지 → Place 공식사진으로 교체
// ══════════════════════════════════════════

async function reimageVenues() {
  const venues = await prisma.venue.findMany({
    where: { sourceName: { in: ["naver", "naver-place"] } },
    orderBy: { createdAt: "desc" },
  });

  console.log(`🖼️  이미지 교체 시작 (${venues.length}개 업소)${DRY_RUN ? " [DRY RUN]" : ""}\n`);

  let stats = { updated: 0, skipped: 0, noPlace: 0 };

  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i];
    process.stdout.write(`[${i + 1}/${venues.length}] ${venue.name} `);

    // Place ID 찾기
    const placeId = await getPlaceIdFromSearch(venue.name, venue.address);
    await sleep(500);

    if (!placeId) {
      console.log("→ Place ID 없음");
      stats.noPlace++;
      continue;
    }

    // 공식 사진 가져오기
    const photos = await getPlacePhotos(placeId);
    await sleep(500);

    if (!photos.length) {
      console.log(`→ Place ${placeId} 사진 없음`);
      stats.skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`→ 📷 ${photos.length}장 (dry)`);
      stats.updated++;
      continue;
    }

    // S3 업로드
    const venueSlug = slugify(`${venue.name}-${placeId}`);
    const images = await uploadImagesToS3(photos, venueSlug, 5);

    if (images.length > 0) {
      await prisma.venue.update({ where: { id: venue.id }, data: { images } });
      console.log(`→ 📷 ${images.length}장 교체 완료`);
      stats.updated++;
    } else {
      console.log("→ 업로드 실패");
      stats.skipped++;
    }
  }

  console.log("\n" + "═".repeat(50));
  console.log(`🎉 이미지 교체 완료! 교체: ${stats.updated}, 스킵: ${stats.skipped}, Place 없음: ${stats.noPlace}`);
  console.log("═".repeat(50));
}

// ══════════════════════════════════════════
// 수동 데이터
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
    case "naver":
      await crawlNaverApi();
      break;
    case "migrate-s3":
      await migrateLocalToS3();
      break;
    case "cleanup":
      await cleanupVenues();
      break;
    case "reimage":
      await reimageVenues();
      break;
    default:
      await insertManualData();
      break;
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => { pool.end(); prisma.$disconnect(); });
