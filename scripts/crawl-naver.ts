/**
 * 네이버 지도 API를 활용한 업소 데이터 크롤링 스크립트
 *
 * 사용법:
 *   npx tsx scripts/crawl-naver.ts
 *
 * 환경변수 필요:
 *   NAVER_CLIENT_ID - 네이버 개발자센터 클라이언트 ID
 *   NAVER_CLIENT_SECRET - 네이버 개발자센터 클라이언트 시크릿
 *
 * 네이버 개발자센터: https://developers.naver.com
 * → 애플리케이션 등록 → 검색 API 사용 설정
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || "";
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET || "";

interface NaverSearchResult {
  title: string;
  link: string;
  category: string;
  description: string;
  telephone: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

interface NaverSearchResponse {
  items: NaverSearchResult[];
  total: number;
}

// 카테고리별 검색 키워드
const searchQueries = [
  { keyword: "강남 바", categorySlug: "bar-lounge", category: "바/라운지" },
  { keyword: "강남 라운지바", categorySlug: "bar-lounge", category: "바/라운지" },
  { keyword: "청담 바", categorySlug: "bar-lounge", category: "바/라운지" },
  { keyword: "신사 바", categorySlug: "bar-lounge", category: "바/라운지" },
  { keyword: "이태원 바", categorySlug: "bar-lounge", category: "바/라운지" },
  { keyword: "홍대 바", categorySlug: "bar-lounge", category: "바/라운지" },
  { keyword: "강남 클럽", categorySlug: "club", category: "클럽" },
  { keyword: "홍대 클럽", categorySlug: "club", category: "클럽" },
  { keyword: "이태원 클럽", categorySlug: "club", category: "클럽" },
  { keyword: "강남 노래방", categorySlug: "karaoke", category: "노래방" },
  { keyword: "강남 마사지", categorySlug: "massage", category: "마사지" },
  { keyword: "강남 스파", categorySlug: "massage", category: "마사지" },
];

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

function extractRegionDistrict(address: string): { region: string; district: string } {
  // "서울특별시 강남구 역삼동 123-45" → region: "강남구", district: "역삼동"
  const parts = address.split(" ");
  let region = "";
  let district = "";

  for (const part of parts) {
    if (part.endsWith("구")) region = part;
    if (part.endsWith("동") || part.endsWith("로")) {
      district = part;
      break;
    }
  }

  return { region, district };
}

async function searchNaver(query: string, start: number = 1): Promise<NaverSearchResponse | null> {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.log("⚠️  네이버 API 키가 설정되지 않았습니다. .env에 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET을 설정하세요.");
    return null;
  }

  const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=5&start=${start}&sort=comment`;

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
    },
  });

  if (!res.ok) {
    console.error(`❌ 네이버 API 에러: ${res.status} ${res.statusText}`);
    return null;
  }

  return res.json();
}

async function crawlAndSave() {
  console.log("🕷️  크롤링 시작...\n");

  let totalSaved = 0;
  let totalSkipped = 0;

  for (const q of searchQueries) {
    console.log(`🔍 검색: "${q.keyword}"`);

    const result = await searchNaver(q.keyword);
    if (!result || !result.items.length) {
      console.log("   → 결과 없음\n");
      continue;
    }

    for (const item of result.items) {
      const name = stripHtml(item.title);
      const address = item.roadAddress || item.address;
      const { region, district } = extractRegionDistrict(address);

      // 서울 외 지역 스킵
      if (!address.includes("서울")) continue;

      // 중복 체크 (이름 + 주소)
      const existing = await prisma.venue.findFirst({
        where: {
          OR: [
            { sourceUrl: item.link },
            { AND: [{ name }, { address }] },
          ],
        },
      });

      if (existing) {
        totalSkipped++;
        continue;
      }

      await prisma.venue.create({
        data: {
          name,
          category: q.category,
          categorySlug: q.categorySlug,
          region,
          district,
          address,
          phone: item.telephone || "",
          hours: "",
          description: stripHtml(item.description) || `${region} ${district}에 위치한 ${q.category}`,
          tags: [q.category],
          facilities: [],
          images: [],
          priceLevel: "MEDIUM",
          sourceUrl: item.link,
          sourceName: "naver",
          isApproved: true,
        },
      });

      totalSaved++;
      console.log(`   ✅ ${name} (${region} ${district})`);
    }

    // API 호출 간격
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n🎉 크롤링 완료! 저장: ${totalSaved}개, 스킵(중복): ${totalSkipped}개`);
}

// 네이버 API 없이도 동작하도록 수동 데이터 삽입 옵션
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
    const existing = await prisma.venue.findFirst({
      where: { name: v.name, address: v.address },
    });
    if (existing) continue;

    await prisma.venue.create({
      data: { ...v, images: [], isApproved: true, sourceName: "manual" },
    });
    count++;
    console.log(`✅ ${v.name} (${v.region} ${v.district})`);
  }

  console.log(`\n🎉 수동 데이터 삽입 완료! ${count}개 추가`);
}

async function main() {
  const mode = process.argv[2] || "manual";

  if (mode === "naver") {
    await crawlAndSave();
  } else {
    await insertManualData();
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
