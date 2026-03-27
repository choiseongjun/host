export interface Venue {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  region: string;
  district: string;
  address: string;
  hours: string;
  lateNight: boolean;
  priceRange: string;
  priceLevel: number; // 1-4
  phone: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  isPremium: boolean;
  isBanner: boolean;
}

export interface Review {
  id: string;
  venueId: string;
  author: string;
  date: string;
  verified: boolean;
  content: string;
  ratings: {
    atmosphere: number;
    value: number;
    service: number;
  };
  overall: number;
}

export const categories = [
  { name: "룸살롱", slug: "room-salon", icon: "🥂", count: 128, description: "프라이빗 룸에서 즐기는 프리미엄 서비스" },
  { name: "바/라운지바", slug: "bar-lounge", icon: "🍸", count: 256, description: "세련된 분위기의 바 & 라운지" },
  { name: "노래방 (도우미)", slug: "karaoke", icon: "🎤", count: 89, description: "도우미와 함께하는 프리미엄 노래방" },
  { name: "클럽", slug: "club", icon: "🎵", count: 64, description: "최고의 DJ와 사운드 시스템" },
  { name: "호스트바", slug: "host-bar", icon: "🌙", count: 42, description: "매력적인 호스트와 함께하는 시간" },
];

export const regions = [
  {
    name: "강남구",
    districts: ["논현동", "역삼동", "삼성동", "청담동", "신사동", "압구정동"],
  },
  {
    name: "서초구",
    districts: ["서초동", "방배동", "잠원동"],
  },
  {
    name: "마포구",
    districts: ["홍대입구", "합정동", "상수동", "연남동"],
  },
  {
    name: "중구",
    districts: ["명동", "을지로", "충무로"],
  },
  {
    name: "용산구",
    districts: ["이태원동", "한남동", "녹사평"],
  },
];

export const venues: Venue[] = [
  {
    id: "1",
    name: "르누아르",
    category: "룸살롱",
    categorySlug: "room-salon",
    region: "강남구",
    district: "논현동",
    address: "서울 강남구 논현동 123-45",
    hours: "PM 7:00 - AM 5:00",
    lateNight: true,
    priceRange: "50만원~",
    priceLevel: 4,
    phone: "02-1234-5678",
    tags: ["접대용", "VIP룸", "발렛파킹", "프리미엄"],
    rating: 4.5,
    reviewCount: 87,
    images: [],
    description: "강남 최고급 룸살롱. 20년 전통의 프리미엄 서비스와 세련된 인테리어가 돋보이는 곳입니다. VIP 전용 룸과 발렛 파킹 서비스를 제공합니다.",
    isPremium: true,
    isBanner: true,
  },
  {
    id: "2",
    name: "블루문 라운지",
    category: "바/라운지바",
    categorySlug: "bar-lounge",
    region: "강남구",
    district: "청담동",
    address: "서울 강남구 청담동 456-78",
    hours: "PM 6:00 - AM 3:00",
    lateNight: true,
    priceRange: "10만원~30만원",
    priceLevel: 3,
    phone: "02-2345-6789",
    tags: ["데이트", "칵테일", "루프탑", "분위기"],
    rating: 4.2,
    reviewCount: 156,
    images: [],
    description: "청담동 루프탑 라운지바. 서울 야경을 내려다보며 프리미엄 칵테일을 즐길 수 있는 곳입니다.",
    isPremium: true,
    isBanner: false,
  },
  {
    id: "3",
    name: "골든 마이크",
    category: "노래방 (도우미)",
    categorySlug: "karaoke",
    region: "강남구",
    district: "역삼동",
    address: "서울 강남구 역삼동 789-12",
    hours: "PM 6:00 - AM 6:00",
    lateNight: true,
    priceRange: "20만원~50만원",
    priceLevel: 3,
    phone: "02-3456-7890",
    tags: ["단체", "접대용", "최신시설", "대형룸"],
    rating: 4.0,
    reviewCount: 63,
    images: [],
    description: "역삼역 도보 3분. 최신 음향시스템과 넓은 대형룸을 갖춘 프리미엄 노래방입니다.",
    isPremium: false,
    isBanner: false,
  },
  {
    id: "4",
    name: "클럽 옥타곤",
    category: "클럽",
    categorySlug: "club",
    region: "강남구",
    district: "논현동",
    address: "서울 강남구 논현동 345-67",
    hours: "PM 10:00 - AM 6:00",
    lateNight: true,
    priceRange: "5만원~15만원",
    priceLevel: 2,
    phone: "02-4567-8901",
    tags: ["EDM", "대형클럽", "해외DJ", "파티"],
    rating: 4.3,
    reviewCount: 312,
    images: [],
    description: "아시아 최대 규모의 클럽. 세계적인 DJ 라인업과 최첨단 사운드 시스템을 자랑합니다.",
    isPremium: true,
    isBanner: true,
  },
  {
    id: "5",
    name: "미드나잇 로즈",
    category: "호스트바",
    categorySlug: "host-bar",
    region: "강남구",
    district: "신사동",
    address: "서울 강남구 신사동 567-89",
    hours: "PM 8:00 - AM 4:00",
    lateNight: true,
    priceRange: "30만원~",
    priceLevel: 3,
    phone: "02-5678-9012",
    tags: ["여성전용", "프리미엄", "이벤트"],
    rating: 4.1,
    reviewCount: 45,
    images: [],
    description: "신사동 가로수길 인근 프리미엄 호스트바. 세련된 인테리어와 수준 높은 서비스를 제공합니다.",
    isPremium: false,
    isBanner: false,
  },
  {
    id: "6",
    name: "더 클래식",
    category: "룸살롱",
    categorySlug: "room-salon",
    region: "서초구",
    district: "서초동",
    address: "서울 서초구 서초동 234-56",
    hours: "PM 7:00 - AM 4:00",
    lateNight: true,
    priceRange: "40만원~",
    priceLevel: 4,
    phone: "02-6789-0123",
    tags: ["접대용", "단체", "고급인테리어"],
    rating: 4.4,
    reviewCount: 92,
    images: [],
    description: "서초동 대표 룸살롱. 클래식한 인테리어와 최상의 서비스로 비즈니스 접대에 최적화된 공간입니다.",
    isPremium: true,
    isBanner: false,
  },
  {
    id: "7",
    name: "재즈 앤 블루스",
    category: "바/라운지바",
    categorySlug: "bar-lounge",
    region: "용산구",
    district: "이태원동",
    address: "서울 용산구 이태원동 111-22",
    hours: "PM 6:00 - AM 2:00",
    lateNight: false,
    priceRange: "5만원~15만원",
    priceLevel: 2,
    phone: "02-7890-1234",
    tags: ["라이브재즈", "데이트", "외국인친화"],
    rating: 4.6,
    reviewCount: 201,
    images: [],
    description: "이태원 라이브 재즈바. 매일 밤 라이브 공연과 함께 클래식 칵테일을 즐길 수 있습니다.",
    isPremium: false,
    isBanner: false,
  },
  {
    id: "8",
    name: "네온 파라다이스",
    category: "클럽",
    categorySlug: "club",
    region: "마포구",
    district: "홍대입구",
    address: "서울 마포구 홍대입구 333-44",
    hours: "PM 9:00 - AM 5:00",
    lateNight: true,
    priceRange: "3만원~10만원",
    priceLevel: 1,
    phone: "02-8901-2345",
    tags: ["힙합", "인디", "20대", "파티"],
    rating: 3.9,
    reviewCount: 178,
    images: [],
    description: "홍대 대표 클럽. 다양한 장르의 음악과 자유로운 분위기를 즐길 수 있는 곳입니다.",
    isPremium: false,
    isBanner: false,
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    venueId: "1",
    author: "강남***",
    date: "2026-03-15",
    verified: true,
    content: "비즈니스 접대로 방문했는데 서비스가 정말 훌륭했습니다. 룸도 넓고 깨끗하고 직원분들도 매우 친절합니다. 다음에도 꼭 다시 방문하겠습니다.",
    ratings: { atmosphere: 5, value: 3, service: 5 },
    overall: 4.5,
  },
  {
    id: "r2",
    venueId: "1",
    author: "서초***",
    date: "2026-03-10",
    verified: true,
    content: "가격이 좀 있지만 그만큼의 가치는 있습니다. VIP룸이 특히 좋았어요.",
    ratings: { atmosphere: 5, value: 3, service: 4 },
    overall: 4.0,
  },
  {
    id: "r3",
    venueId: "1",
    author: "익명",
    date: "2026-03-05",
    verified: false,
    content: "분위기는 좋은데 가격대가 조금 높은 편이에요. 특별한 날에 가기 좋은 곳입니다.",
    ratings: { atmosphere: 4, value: 2, service: 4 },
    overall: 3.5,
  },
  {
    id: "r4",
    venueId: "2",
    author: "청담***",
    date: "2026-03-20",
    verified: true,
    content: "루프탑에서 보는 야경이 정말 환상적입니다. 칵테일도 수준급이에요. 데이트 코스로 강력 추천합니다.",
    ratings: { atmosphere: 5, value: 4, service: 4 },
    overall: 4.5,
  },
  {
    id: "r5",
    venueId: "4",
    author: "클럽***",
    date: "2026-03-18",
    verified: true,
    content: "사운드 시스템이 진짜 미쳤습니다. 해외 DJ 올 때 꼭 가세요. 분위기 최고!",
    ratings: { atmosphere: 5, value: 4, service: 4 },
    overall: 4.5,
  },
];

export const adPricing = [
  { name: "일반 리스팅", price: "무료", features: ["기본 프로필 등록", "리뷰 수신", "기본 검색 노출"] },
  { name: "지역 상단 노출", price: "월 50만원~", features: ["지역 검색 상단 고정", "프리미엄 배지", "우선 노출", "통계 리포트"] },
  { name: "메인 배너", price: "월 200만원~", features: ["메인페이지 배너 노출", "전 지역 상단 노출", "프리미엄 배지", "맞춤 컨설팅", "상세 통계 리포트"] },
];
