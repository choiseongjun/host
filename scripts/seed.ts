import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 시드 데이터 생성 시작...");

  // 관리자 계정
  const adminPassword = await bcrypt.hash("admin1234", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@lovewar.kr" },
    update: {},
    create: {
      username: "admin",
      email: "admin@lovewar.kr",
      password: adminPassword,
      nickname: "운영자",
      role: "ADMIN",
    },
  });

  // 테스트 일반 유저
  const userPassword = await bcrypt.hash("user1234", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      username: "gangnam_user",
      email: "user@test.com",
      password: userPassword,
      nickname: "강남유저123",
      phone: "010-1234-5678",
      gender: "남성",
      role: "USER",
    },
  });

  // 테스트 사장님 유저
  const bizPassword = await bcrypt.hash("biz1234", 12);
  const bizUser = await prisma.user.upsert({
    where: { email: "biz@test.com" },
    update: {},
    create: {
      username: "bluemoon_owner",
      email: "biz@test.com",
      password: bizPassword,
      nickname: "블루문사장",
      phone: "010-9876-5432",
      role: "BUSINESS",
      businessNumber: "123-45-67890",
      businessName: "블루문 라운지",
      representative: "김대표",
    },
  });

  console.log("✅ 유저 생성 완료");

  // 업소 데이터
  const venuesData = [
    { name: "르누아르", category: "룸살롱", categorySlug: "room-salon", region: "강남구", district: "논현동", address: "서울 강남구 논현동 123-45", phone: "02-1234-5678", hours: "PM 7:00 - AM 5:00", lateNight: true, priceRange: "50만원~", priceLevel: "VERY_HIGH" as const, description: "강남 최고급 룸살롱. 20년 전통의 프리미엄 서비스와 세련된 인테리어가 돋보이는 곳입니다.", tags: ["접대용", "VIP룸", "발렛파킹", "프리미엄"], facilities: ["발렛파킹", "VIP룸", "예약 가능"], isPremium: true, isBanner: true },
    { name: "블루문 라운지", category: "바/라운지", categorySlug: "bar-lounge", region: "강남구", district: "청담동", address: "서울 강남구 청담동 456-78", phone: "02-2345-6789", hours: "PM 6:00 - AM 3:00", lateNight: true, priceRange: "10만원~30만원", priceLevel: "HIGH" as const, description: "청담동 루프탑 라운지바. 서울 야경을 내려다보며 프리미엄 칵테일을 즐길 수 있는 곳입니다.", tags: ["데이트", "칵테일", "루프탑", "분위기"], facilities: ["루프탑", "예약 가능", "발렛파킹", "Wi-Fi"], isPremium: true, isBanner: false, ownerId: bizUser.id },
    { name: "골든 마이크", category: "노래방", categorySlug: "karaoke", region: "강남구", district: "역삼동", address: "서울 강남구 역삼동 789-12", phone: "02-3456-7890", hours: "PM 6:00 - AM 6:00", lateNight: true, priceRange: "20만원~50만원", priceLevel: "HIGH" as const, description: "역삼역 도보 3분. 최신 음향시스템과 넓은 대형룸을 갖춘 프리미엄 노래방입니다.", tags: ["단체", "접대용", "최신시설", "대형룸"], facilities: ["단체석", "예약 가능", "주차 가능"], isPremium: false, isBanner: false },
    { name: "클럽 옥타곤", category: "클럽", categorySlug: "club", region: "강남구", district: "논현동", address: "서울 강남구 논현동 345-67", phone: "02-4567-8901", hours: "PM 10:00 - AM 6:00", lateNight: true, priceRange: "5만원~15만원", priceLevel: "MEDIUM" as const, description: "아시아 최대 규모의 클럽. 세계적인 DJ 라인업과 최첨단 사운드 시스템을 자랑합니다.", tags: ["EDM", "대형클럽", "해외DJ", "파티"], facilities: ["DJ부스", "발렛파킹", "흡연구역"], isPremium: true, isBanner: true },
    { name: "미드나잇 로즈", category: "호스트바", categorySlug: "host-bar", region: "강남구", district: "신사동", address: "서울 강남구 신사동 567-89", phone: "02-5678-9012", hours: "PM 8:00 - AM 4:00", lateNight: true, priceRange: "30만원~", priceLevel: "HIGH" as const, description: "신사동 가로수길 인근 프리미엄 호스트바.", tags: ["여성전용", "프리미엄", "이벤트"], facilities: ["예약 가능", "VIP룸"], isPremium: false, isBanner: false },
    { name: "더 클래식", category: "룸살롱", categorySlug: "room-salon", region: "서초구", district: "서초동", address: "서울 서초구 서초동 234-56", phone: "02-6789-0123", hours: "PM 7:00 - AM 4:00", lateNight: true, priceRange: "40만원~", priceLevel: "VERY_HIGH" as const, description: "서초동 대표 룸살롱. 클래식한 인테리어와 최상의 서비스.", tags: ["접대용", "단체", "고급인테리어"], facilities: ["발렛파킹", "VIP룸", "단체석", "예약 가능"], isPremium: true, isBanner: false },
    { name: "재즈 앤 블루스", category: "바/라운지", categorySlug: "bar-lounge", region: "용산구", district: "이태원동", address: "서울 용산구 이태원동 111-22", phone: "02-7890-1234", hours: "PM 6:00 - AM 2:00", lateNight: false, priceRange: "5만원~15만원", priceLevel: "MEDIUM" as const, description: "이태원 라이브 재즈바. 매일 밤 라이브 공연과 클래식 칵테일.", tags: ["라이브재즈", "데이트", "외국인친화"], facilities: ["라이브 공연", "예약 가능", "Wi-Fi"], isPremium: false, isBanner: false },
    { name: "네온 파라다이스", category: "클럽", categorySlug: "club", region: "마포구", district: "홍대입구", address: "서울 마포구 홍대입구 333-44", phone: "02-8901-2345", hours: "PM 9:00 - AM 5:00", lateNight: true, priceRange: "3만원~10만원", priceLevel: "LOW" as const, description: "홍대 대표 클럽. 다양한 장르의 음악과 자유로운 분위기.", tags: ["힙합", "인디", "20대", "파티"], facilities: ["DJ부스", "흡연구역"], isPremium: false, isBanner: false },
    { name: "황금시대", category: "중년노래방", categorySlug: "middle-age-karaoke", region: "강남구", district: "역삼동", address: "서울 강남구 역삼동 890-12", phone: "02-9012-3456", hours: "PM 5:00 - AM 2:00", lateNight: false, priceRange: "15만원~30만원", priceLevel: "MEDIUM" as const, description: "역삼역 인근 중년 맞춤 노래방. 트로트부터 7080 팝송까지.", tags: ["중년", "트로트", "편안한분위기", "단체"], facilities: ["단체석", "주차 가능", "예약 가능"], isPremium: true, isBanner: false },
    { name: "테라피 스파", category: "마사지", categorySlug: "massage", region: "강남구", district: "삼성동", address: "서울 강남구 삼성동 123-99", phone: "02-1111-2222", hours: "AM 11:00 - AM 3:00", lateNight: true, priceRange: "8만원~20만원", priceLevel: "MEDIUM" as const, description: "삼성동 프리미엄 스파. 전문 테라피스트의 정통 타이마사지와 아로마 테라피.", tags: ["타이마사지", "아로마", "커플룸", "심야"], facilities: ["주차 가능", "예약 가능", "Wi-Fi"], isPremium: true, isBanner: false },
  ];

  const venues = [];
  for (const v of venuesData) {
    const venue = await prisma.venue.create({
      data: { ...v, isApproved: true },
    });
    venues.push(venue);
  }

  console.log(`✅ 업소 ${venues.length}개 생성 완료`);

  // 블루문 라운지 메뉴
  const bluemoon = venues[1];
  await prisma.menuItem.createMany({
    data: [
      { venueId: bluemoon.id, category: "시그니처 칵테일", name: "문라이트", price: 25000, description: "진, 블루큐라소, 라임, 토닉워터", isPopular: true, sortOrder: 1 },
      { venueId: bluemoon.id, category: "시그니처 칵테일", name: "선셋 블러쉬", price: 22000, description: "럼, 패션프루트, 코코넛크림", isNew: true, sortOrder: 2 },
      { venueId: bluemoon.id, category: "시그니처 칵테일", name: "미드나잇 가든", price: 28000, description: "보드카, 엘더플라워, 라벤더시럽", isPopular: true, sortOrder: 3 },
      { venueId: bluemoon.id, category: "클래식 칵테일", name: "올드 패션드", price: 18000, description: "버번, 앙고스투라비터스, 오렌지필", sortOrder: 1 },
      { venueId: bluemoon.id, category: "클래식 칵테일", name: "네그로니", price: 18000, description: "진, 캄파리, 스위트 베르무트", sortOrder: 2 },
      { venueId: bluemoon.id, category: "안주/푸드", name: "트러플 감자튀김", price: 22000, description: "트러플오일, 파마산 치즈", isPopular: true, sortOrder: 1 },
      { venueId: bluemoon.id, category: "안주/푸드", name: "모둠 치즈 플래터", price: 35000, description: "브리, 체다, 고르곤졸라, 크래커", isNew: true, sortOrder: 2 },
    ],
  });

  // 블루문 라운지 가격표
  await prisma.priceItem.createMany({
    data: [
      { venueId: bluemoon.id, category: "입장/테이블", name: "테이블차지", price: "50,000", unit: "1테이블", description: "2인 기준", sortOrder: 1 },
      { venueId: bluemoon.id, category: "입장/테이블", name: "루프탑 테이블", price: "100,000", unit: "1테이블", description: "예약 필수", sortOrder: 2 },
      { venueId: bluemoon.id, category: "룸 요금", name: "프라이빗 룸 (소)", price: "200,000", unit: "1실", description: "4인까지, 2시간", sortOrder: 1 },
      { venueId: bluemoon.id, category: "룸 요금", name: "VIP 룸", price: "1,000,000", unit: "1실", description: "20인까지, 3시간", sortOrder: 2 },
    ],
  });

  console.log("✅ 메뉴/가격 데이터 생성 완료");

  // 리뷰
  await prisma.review.createMany({
    data: [
      { venueId: venues[0].id, authorId: user.id, content: "비즈니스 접대로 방문했는데 서비스가 정말 훌륭했습니다.", atmosphere: 5, value: 3, service: 5, overall: 4.5, verified: true },
      { venueId: bluemoon.id, authorId: user.id, content: "루프탑에서 보는 야경이 정말 환상적입니다. 칵테일도 수준급!", atmosphere: 5, value: 4, service: 4, overall: 4.5, verified: true },
      { venueId: venues[3].id, authorId: user.id, content: "사운드 시스템이 진짜 미쳤습니다. 분위기 최고!", atmosphere: 5, value: 4, service: 4, overall: 4.5, verified: true },
    ],
  });

  // 업소 평점 업데이트
  await prisma.venue.update({ where: { id: venues[0].id }, data: { rating: 4.5, reviewCount: 1 } });
  await prisma.venue.update({ where: { id: bluemoon.id }, data: { rating: 4.5, reviewCount: 1 } });
  await prisma.venue.update({ where: { id: venues[3].id }, data: { rating: 4.5, reviewCount: 1 } });

  console.log("✅ 리뷰 데이터 생성 완료");

  // 커뮤니티 게시글
  await prisma.post.createMany({
    data: [
      { category: "RECOMMEND", title: "강남 데이트 코스로 괜찮은 바 추천해주세요", content: "이번 주말 여자친구랑 강남에서 데이트하는데 분위기 좋은 바 추천 좀 해주세요.", authorId: user.id, views: 342, likes: 15, commentCount: 23 },
      { category: "REVIEW", title: "블루문 라운지 다녀왔습니다", content: "어제 친구들이랑 블루문 라운지 다녀왔는데 진짜 야경이 미쳤습니다.", authorId: user.id, views: 567, likes: 32, commentCount: 18 },
      { category: "FREE", title: "요즘 홍대 클럽 분위기 어떤가요?", content: "한 1년 만에 홍대 가려고 하는데 요즘 분위기가 어떤지 궁금합니다.", authorId: user.id, views: 234, likes: 8, commentCount: 31 },
      { category: "INFO", title: "[공지] 사랑과전쟁 커뮤니티 이용 규칙", content: "상업적 광고, 허위 정보, 욕설 등은 제재 대상입니다.", authorId: admin.id, views: 1205, likes: 45, commentCount: 5, isPinned: true },
      { category: "MEETUP", title: "이번 금요일 강남 바 투어 같이 가실 분", content: "금요일 저녁 8시부터 강남 바 3~4곳 돌아볼 계획입니다.", authorId: user.id, views: 456, likes: 22, commentCount: 38 },
    ],
  });

  console.log("✅ 커뮤니티 게시글 생성 완료");

  // 실시간 피드
  await prisma.feedItem.createMany({
    data: [
      { venueId: bluemoon.id, authorId: bizUser.id, type: "EVENT", content: "🍸 오늘의 해피아워! PM 6:00~8:00 칵테일 전 메뉴 30% 할인. 루프탑 테이블 5석 남았습니다!", tags: ["해피아워", "할인", "루프탑"], isLive: true },
      { venueId: venues[3].id, authorId: admin.id, type: "EVENT", content: "🎧 이번 주 토요일 스페셜 게스트 DJ! 사전 예약 시 입장료 50% 할인!", tags: ["DJ", "이벤트", "사전예약"], isLive: true },
      { venueId: venues[0].id, authorId: admin.id, type: "STATUS", content: "오늘 영업 시작했습니다. VIP룸 2개, 일반룸 5개 예약 가능합니다.", tags: ["영업중", "예약가능"], isLive: true },
      { venueId: venues[9].id, authorId: admin.id, type: "EVENT", content: "💆 3월 마지막 주 특별 프로모션! 타이마사지 90분 + 아로마 30분 패키지 12만원!", tags: ["프로모션", "할인"], isLive: true },
    ],
  });

  console.log("✅ 실시간 피드 생성 완료");

  // 구인구직
  await prisma.job.createMany({
    data: [
      { type: "HIRING", title: "강남 룸살롱 여성 직원 모집", category: "룸살롱", region: "강남구", district: "논현동", salary: "일 50만원~", workHours: "PM 7:00 - AM 5:00", gender: "여성", age: "20~30대", description: "강남 논현동 프리미엄 룸살롱에서 함께할 직원을 모집합니다.", requirements: ["20~30대 여성", "단정한 외모", "미경력 가능"], contact: "010-1234-5678", authorId: admin.id, isUrgent: true, isPremium: true },
      { type: "HIRING", title: "청담동 라운지바 바텐더 모집", category: "바/라운지", region: "강남구", district: "청담동", salary: "월 350만원~", workHours: "PM 6:00 - AM 3:00", gender: "무관", age: "20~30대", description: "칵테일 제조 경력 1년 이상 우대합니다.", requirements: ["칵테일 제조 가능자", "경력 1년 이상 우대"], contact: "010-2345-6789", authorId: bizUser.id, isPremium: true },
      { type: "SEEKING", title: "바텐더 경력 3년, 일자리 구합니다", category: "바/라운지", region: "강남구", salary: "월 300만원 이상 희망", workHours: "저녁 시간대 선호", gender: "남성", age: "20대 후반", description: "강남권 바/라운지 취업 희망합니다.", requirements: ["바텐더 경력 3년", "칵테일 자격증 보유"], contact: "010-4567-8901", authorId: user.id },
    ],
  });

  console.log("✅ 구인구직 데이터 생성 완료");
  console.log("\n🎉 시드 완료!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
