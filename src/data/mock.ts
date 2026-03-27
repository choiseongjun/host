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
  { name: "바/라운지", slug: "bar-lounge", icon: "🍸", count: 256, description: "세련된 분위기의 바 & 라운지" },
  { name: "노래방", slug: "karaoke", icon: "🎤", count: 89, description: "도우미와 함께하는 프리미엄 노래방" },
  { name: "클럽", slug: "club", icon: "🎵", count: 64, description: "최고의 DJ와 사운드 시스템" },
  { name: "호스트바", slug: "host-bar", icon: "🌙", count: 42, description: "매력적인 호스트와 함께하는 시간" },
  { name: "중년노래방", slug: "middle-age-karaoke", icon: "🎶", count: 76, description: "편안한 분위기에서 즐기는 중년 맞춤 노래방" },
  { name: "마사지", slug: "massage", icon: "💆", count: 134, description: "전문 테라피스트의 힐링 마사지" },
];

export const regions = [
  { name: "강남구", districts: ["논현동", "역삼동", "삼성동", "청담동", "신사동", "압구정동", "대치동", "도곡동", "개포동", "일원동", "수서동"] },
  { name: "서초구", districts: ["서초동", "방배동", "잠원동", "반포동", "양재동", "내곡동"] },
  { name: "송파구", districts: ["잠실동", "신천동", "석촌동", "가락동", "문정동", "장지동", "방이동"] },
  { name: "강동구", districts: ["천호동", "성내동", "길동", "암사동", "명일동", "고덕동"] },
  { name: "마포구", districts: ["홍대입구", "합정동", "상수동", "연남동", "망원동", "서교동", "공덕동"] },
  { name: "용산구", districts: ["이태원동", "한남동", "녹사평", "경리단길", "후암동", "용산동"] },
  { name: "중구", districts: ["명동", "을지로", "충무로", "신당동", "약수동", "회현동"] },
  { name: "종로구", districts: ["종로", "인사동", "삼청동", "북촌", "혜화동", "광화문", "익선동"] },
  { name: "성동구", districts: ["성수동", "왕십리", "금호동", "옥수동", "행당동"] },
  { name: "광진구", districts: ["건대입구", "구의동", "자양동", "화양동", "군자동"] },
  { name: "동대문구", districts: ["장안동", "답십리", "청량리", "회기동", "전농동"] },
  { name: "성북구", districts: ["성북동", "길음동", "정릉동", "돈암동", "안암동"] },
  { name: "강북구", districts: ["수유동", "미아동", "번동", "우이동"] },
  { name: "도봉구", districts: ["창동", "쌍문동", "방학동", "도봉동"] },
  { name: "노원구", districts: ["노원역", "상계동", "중계동", "하계동", "월계동", "공릉동"] },
  { name: "서대문구", districts: ["신촌", "연희동", "홍은동", "북아현동", "충정로"] },
  { name: "은평구", districts: ["응암동", "역촌동", "불광동", "갈현동", "연신내"] },
  { name: "양천구", districts: ["목동", "신월동", "신정동"] },
  { name: "강서구", districts: ["화곡동", "등촌동", "발산동", "마곡동", "공항동"] },
  { name: "구로구", districts: ["구로동", "고척동", "개봉동", "신도림", "오류동"] },
  { name: "금천구", districts: ["가산동", "독산동", "시흥동"] },
  { name: "영등포구", districts: ["여의도", "영등포동", "당산동", "문래동", "양평동", "신길동"] },
  { name: "동작구", districts: ["노량진", "사당동", "신대방동", "흑석동", "상도동"] },
  { name: "관악구", districts: ["신림동", "봉천동", "남현동"] },
  { name: "중랑구", districts: ["면목동", "상봉동", "망우동", "신내동"] },
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
    category: "바/라운지",
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
    category: "노래방",
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
    category: "바/라운지",
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
  {
    id: "9",
    name: "황금시대",
    category: "중년노래방",
    categorySlug: "middle-age-karaoke",
    region: "강남구",
    district: "역삼동",
    address: "서울 강남구 역삼동 890-12",
    hours: "PM 5:00 - AM 2:00",
    lateNight: false,
    priceRange: "15만원~30만원",
    priceLevel: 2,
    phone: "02-9012-3456",
    tags: ["중년", "트로트", "편안한분위기", "단체"],
    rating: 4.3,
    reviewCount: 95,
    images: [],
    description: "역삼역 인근 중년 맞춤 노래방. 트로트부터 7080 팝송까지, 편안한 분위기에서 즐길 수 있습니다. 단체 모임에도 적합합니다.",
    isPremium: true,
    isBanner: false,
  },
  {
    id: "10",
    name: "추억의 무대",
    category: "중년노래방",
    categorySlug: "middle-age-karaoke",
    region: "서초구",
    district: "서초동",
    address: "서울 서초구 서초동 456-78",
    hours: "PM 4:00 - AM 12:00",
    lateNight: false,
    priceRange: "10만원~20만원",
    priceLevel: 2,
    phone: "02-0123-4567",
    tags: ["7080", "중년", "가족모임", "깨끗한시설"],
    rating: 4.1,
    reviewCount: 67,
    images: [],
    description: "서초동 중년노래방. 깨끗한 시설과 넓은 룸, 합리적인 가격으로 편안하게 즐길 수 있는 곳입니다.",
    isPremium: false,
    isBanner: false,
  },
  {
    id: "11",
    name: "테라피 스파",
    category: "마사지",
    categorySlug: "massage",
    region: "강남구",
    district: "삼성동",
    address: "서울 강남구 삼성동 123-99",
    hours: "AM 11:00 - AM 3:00",
    lateNight: true,
    priceRange: "8만원~20만원",
    priceLevel: 2,
    phone: "02-1111-2222",
    tags: ["타이마사지", "아로마", "커플룸", "심야"],
    rating: 4.4,
    reviewCount: 112,
    images: [],
    description: "삼성동 프리미엄 스파. 태국 출신 전문 테라피스트의 정통 타이마사지와 아로마 테라피를 제공합니다.",
    isPremium: true,
    isBanner: false,
  },
  {
    id: "12",
    name: "힐링 터치",
    category: "마사지",
    categorySlug: "massage",
    region: "마포구",
    district: "홍대입구",
    address: "서울 마포구 홍대입구 555-66",
    hours: "PM 12:00 - AM 12:00",
    lateNight: false,
    priceRange: "5만원~12만원",
    priceLevel: 1,
    phone: "02-3333-4444",
    tags: ["스웨디시", "경락", "가성비", "깨끗한시설"],
    rating: 4.2,
    reviewCount: 88,
    images: [],
    description: "홍대입구역 도보 2분. 합리적인 가격에 수준 높은 마사지를 받을 수 있는 곳입니다.",
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

export interface Job {
  id: string;
  type: "구인" | "구직";
  title: string;
  category: string;
  region: string;
  district: string;
  salary: string;
  workHours: string;
  gender: string;
  age: string;
  description: string;
  requirements: string[];
  contact: string;
  author: string;
  date: string;
  isUrgent: boolean;
  isPremium: boolean;
}

export const jobs: Job[] = [
  {
    id: "j1",
    type: "구인",
    title: "강남 룸살롱 여성 직원 모집",
    category: "룸살롱",
    region: "강남구",
    district: "논현동",
    salary: "일 50만원~",
    workHours: "PM 7:00 - AM 5:00",
    gender: "여성",
    age: "20~30대",
    description: "강남 논현동 프리미엄 룸살롱에서 함께할 여성 직원을 모집합니다. 경력 우대, 미경력자도 환영합니다. 친절한 교육 시스템을 갖추고 있습니다.",
    requirements: ["20~30대 여성", "단정한 외모", "미경력 가능"],
    contact: "010-1234-5678",
    author: "르누아르",
    date: "2026-03-25",
    isUrgent: true,
    isPremium: true,
  },
  {
    id: "j2",
    type: "구인",
    title: "청담동 라운지바 바텐더 모집",
    category: "바/라운지",
    region: "강남구",
    district: "청담동",
    salary: "월 350만원~",
    workHours: "PM 6:00 - AM 3:00",
    gender: "무관",
    age: "20~30대",
    description: "청담동 루프탑 라운지바에서 바텐더를 모집합니다. 칵테일 제조 경력 1년 이상 우대합니다.",
    requirements: ["칵테일 제조 가능자", "경력 1년 이상 우대", "영어 가능자 우대"],
    contact: "010-2345-6789",
    author: "블루문 라운지",
    date: "2026-03-24",
    isUrgent: false,
    isPremium: true,
  },
  {
    id: "j3",
    type: "구인",
    title: "홍대 클럽 DJ 모집",
    category: "클럽",
    region: "마포구",
    district: "홍대입구",
    salary: "회당 30만원~",
    workHours: "PM 10:00 - AM 5:00 (주말)",
    gender: "무관",
    age: "무관",
    description: "홍대 클럽에서 주말 레지던트 DJ를 모집합니다. 힙합, EDM 장르 가능자를 찾고 있습니다.",
    requirements: ["DJ 경력 2년 이상", "힙합/EDM 장르", "장비 보유자 우대"],
    contact: "010-3456-7890",
    author: "네온 파라다이스",
    date: "2026-03-23",
    isUrgent: false,
    isPremium: false,
  },
  {
    id: "j4",
    type: "구직",
    title: "바텐더 경력 3년, 일자리 구합니다",
    category: "바/라운지",
    region: "강남구",
    district: "",
    salary: "월 300만원 이상 희망",
    workHours: "저녁 시간대 선호",
    gender: "남성",
    age: "20대 후반",
    description: "강남권 바/라운지바 취업 희망합니다. 클래식 칵테일 및 시그니처 칵테일 제조 가능하며, 고객 응대에 자신 있습니다.",
    requirements: ["바텐더 경력 3년", "칵테일 자격증 보유", "강남권 근무 희망"],
    contact: "010-4567-8901",
    author: "김**",
    date: "2026-03-22",
    isUrgent: false,
    isPremium: false,
  },
  {
    id: "j5",
    type: "구인",
    title: "역삼동 노래방 도우미 모집",
    category: "노래방",
    region: "강남구",
    district: "역삼동",
    salary: "일 40만원~",
    workHours: "PM 6:00 - AM 6:00",
    gender: "여성",
    age: "20~30대",
    description: "역삼역 인근 프리미엄 노래방에서 도우미를 모집합니다. 밝은 성격의 분을 찾고 있습니다.",
    requirements: ["20~30대 여성", "밝은 성격", "미경력 가능"],
    contact: "010-5678-9012",
    author: "골든 마이크",
    date: "2026-03-21",
    isUrgent: true,
    isPremium: false,
  },
  {
    id: "j6",
    type: "구인",
    title: "삼성동 마사지샵 테라피스트 모집",
    category: "마사지",
    region: "강남구",
    district: "삼성동",
    salary: "월 400만원~ (인센티브 별도)",
    workHours: "AM 11:00 - PM 11:00 (2교대)",
    gender: "여성",
    age: "무관",
    description: "삼성동 프리미엄 스파에서 테라피스트를 모집합니다. 타이마사지, 아로마 자격증 보유자 우대합니다.",
    requirements: ["관련 자격증 보유자", "경력 1년 이상", "외국어 가능자 우대"],
    contact: "010-6789-0123",
    author: "테라피 스파",
    date: "2026-03-20",
    isUrgent: false,
    isPremium: true,
  },
  {
    id: "j7",
    type: "구직",
    title: "중년노래방 경력 매니저, 자리 찾습니다",
    category: "중년노래방",
    region: "서초구",
    district: "",
    salary: "월 250만원 이상 희망",
    workHours: "오후~새벽 가능",
    gender: "남성",
    age: "40대",
    description: "중년노래방 매니저 경력 5년입니다. 고객 관리 및 매장 운영에 자신 있습니다. 서초/강남권 근무 희망합니다.",
    requirements: ["매니저 경력 5년", "고객관리 능숙", "서초/강남권 희망"],
    contact: "010-7890-1234",
    author: "박**",
    date: "2026-03-19",
    isUrgent: false,
    isPremium: false,
  },
  {
    id: "j8",
    type: "구인",
    title: "호스트바 신규 호스트 모집",
    category: "호스트바",
    region: "강남구",
    district: "신사동",
    salary: "일 30만원~ (팁 별도)",
    workHours: "PM 8:00 - AM 4:00",
    gender: "남성",
    age: "20~30대",
    description: "신사동 프리미엄 호스트바에서 신규 호스트를 모집합니다. 외모 및 대화 스킬이 좋은 분을 찾고 있습니다.",
    requirements: ["20~30대 남성", "커뮤니케이션 능력", "단정한 외모"],
    contact: "010-8901-2345",
    author: "미드나잇 로즈",
    date: "2026-03-18",
    isUrgent: false,
    isPremium: false,
  },
];

// ── 커뮤니티 ──

export interface Post {
  id: string;
  category: "자유" | "추천/질문" | "후기" | "모임" | "정보";
  title: string;
  content: string;
  author: string;
  date: string;
  views: number;
  likes: number;
  commentCount: number;
  isPinned: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  isAuthor: boolean;
}

export const posts: Post[] = [
  {
    id: "p1",
    category: "추천/질문",
    title: "강남 데이트 코스로 괜찮은 바 추천해주세요",
    content: "이번 주말 여자친구랑 강남에서 데이트하는데 분위기 좋은 바 추천 좀 해주세요. 예산은 1인 5만원 정도로 생각하고 있습니다. 루프탑이면 더 좋고요!",
    author: "강남러버",
    date: "2026-03-27",
    views: 342,
    likes: 15,
    commentCount: 23,
    isPinned: false,
  },
  {
    id: "p2",
    category: "후기",
    title: "블루문 라운지 다녀왔습니다 (사진 있음)",
    content: "어제 친구들이랑 블루문 라운지 다녀왔는데 진짜 야경이 미쳤습니다. 칵테일도 맛있고 서비스도 좋았어요. 다만 주말이라 웨이팅이 좀 있었습니다.",
    author: "청담맨",
    date: "2026-03-26",
    views: 567,
    likes: 32,
    commentCount: 18,
    isPinned: false,
  },
  {
    id: "p3",
    category: "자유",
    title: "요즘 홍대 클럽 분위기 어떤가요?",
    content: "한 1년 만에 홍대 가려고 하는데 요즘 분위기가 어떤지 궁금합니다. 예전에 자주 가던 곳들이 아직도 있나요?",
    author: "클럽러",
    date: "2026-03-26",
    views: 234,
    likes: 8,
    commentCount: 31,
    isPinned: false,
  },
  {
    id: "p4",
    category: "정보",
    title: "[공지] 사랑과전쟁 커뮤니티 이용 규칙",
    content: "안녕하세요. 사랑과전쟁 커뮤니티 이용 규칙을 안내드립니다. 상업적 광고, 허위 정보, 욕설 등은 제재 대상입니다.",
    author: "운영자",
    date: "2026-03-20",
    views: 1205,
    likes: 45,
    commentCount: 5,
    isPinned: true,
  },
  {
    id: "p5",
    category: "모임",
    title: "이번 금요일 강남 바 투어 같이 가실 분",
    content: "금요일 저녁 8시부터 강남 바 3~4곳 돌아볼 계획입니다. 30대 남녀 혼성 모임이고 현재 4명 모였습니다. 관심 있으신 분 댓글 주세요!",
    author: "모임장",
    date: "2026-03-25",
    views: 456,
    likes: 22,
    commentCount: 38,
    isPinned: false,
  },
  {
    id: "p6",
    category: "추천/질문",
    title: "접대용 룸살롱 추천 부탁드립니다",
    content: "다음 주에 중요한 비즈니스 미팅이 있는데 접대용으로 괜찮은 곳 있을까요? 서초/강남 쪽으로 찾고 있습니다. 예산은 넉넉합니다.",
    author: "비즈맨",
    date: "2026-03-25",
    views: 189,
    likes: 5,
    commentCount: 12,
    isPinned: false,
  },
  {
    id: "p7",
    category: "후기",
    title: "역삼 골든마이크 노래방 후기",
    content: "단체 회식으로 갔는데 룸이 넓고 음향도 좋았습니다. 가격은 좀 있지만 서비스가 좋아서 만족합니다. 다음에 또 갈 예정입니다.",
    author: "노래왕",
    date: "2026-03-24",
    views: 145,
    likes: 10,
    commentCount: 7,
    isPinned: false,
  },
  {
    id: "p8",
    category: "자유",
    title: "마사지 받고 바 가는 코스 어떤가요",
    content: "퇴근하고 마사지 1시간 받고 근처 바에서 한잔 하는 코스를 즐기는데 저만 이러나요? ㅋㅋ 같은 취미 가진 분 계신가요?",
    author: "힐링맨",
    date: "2026-03-24",
    views: 278,
    likes: 35,
    commentCount: 42,
    isPinned: false,
  },
];

export const comments: Comment[] = [
  { id: "c1", postId: "p1", author: "바매니아", content: "블루문 라운지 강추합니다! 루프탑 야경이 진짜 좋아요.", date: "2026-03-27", likes: 8, isAuthor: false },
  { id: "c2", postId: "p1", author: "청담동주민", content: "예산 5만원이면 청담쪽은 좀 빠듯할 수 있어요. 신사동 쪽 찾아보세요.", date: "2026-03-27", likes: 5, isAuthor: false },
  { id: "c3", postId: "p1", author: "강남러버", content: "감사합니다! 블루문 라운지 한번 가볼게요.", date: "2026-03-27", likes: 2, isAuthor: true },
  { id: "c4", postId: "p1", author: "데이트고수", content: "재즈 앤 블루스도 좋아요. 이태원이긴 한데 분위기 최고입니다.", date: "2026-03-27", likes: 6, isAuthor: false },
  { id: "c5", postId: "p2", author: "야경러버", content: "저도 갔었는데 진짜 좋았어요! 칵테일 뭐 드셨어요?", date: "2026-03-26", likes: 3, isAuthor: false },
  { id: "c6", postId: "p2", author: "청담맨", content: "시그니처 칵테일 '문라이트' 추천합니다. 진짜 맛있어요.", date: "2026-03-26", likes: 7, isAuthor: true },
];

// ── 실시간 피드 ──

export interface FeedItem {
  id: string;
  venueId: string;
  venueName: string;
  venueCategory: string;
  type: "event" | "status" | "notice" | "photo";
  content: string;
  date: string;
  time: string;
  likes: number;
  isLive: boolean;
  tags: string[];
}

export const feedItems: FeedItem[] = [
  {
    id: "f1",
    venueId: "2",
    venueName: "블루문 라운지",
    venueCategory: "바/라운지",
    type: "event",
    content: "🍸 오늘의 해피아워! PM 6:00~8:00 칵테일 전 메뉴 30% 할인. 루프탑 테이블 5석 남았습니다!",
    date: "2026-03-27",
    time: "17:30",
    likes: 24,
    isLive: true,
    tags: ["해피아워", "할인", "루프탑"],
  },
  {
    id: "f2",
    venueId: "4",
    venueName: "클럽 옥타곤",
    venueCategory: "클럽",
    type: "event",
    content: "🎧 이번 주 토요일 스페셜 게스트 DJ SODA! 사전 예약 시 입장료 50% 할인. 예약 마감 임박!",
    date: "2026-03-27",
    time: "16:00",
    likes: 89,
    isLive: true,
    tags: ["DJ", "이벤트", "사전예약"],
  },
  {
    id: "f3",
    venueId: "1",
    venueName: "르누아르",
    venueCategory: "룸살롱",
    type: "status",
    content: "오늘 영업 시작했습니다. VIP룸 2개, 일반룸 5개 예약 가능합니다. 사전 예약 시 웰컴 드링크 서비스!",
    date: "2026-03-27",
    time: "19:00",
    likes: 12,
    isLive: true,
    tags: ["영업중", "예약가능"],
  },
  {
    id: "f4",
    venueId: "11",
    venueName: "테라피 스파",
    venueCategory: "마사지",
    type: "event",
    content: "💆 3월 마지막 주 특별 프로모션! 타이마사지 90분 + 아로마 30분 패키지 12만원 (정가 18만원). 선착순 10명!",
    date: "2026-03-27",
    time: "11:00",
    likes: 34,
    isLive: true,
    tags: ["프로모션", "할인", "패키지"],
  },
  {
    id: "f5",
    venueId: "3",
    venueName: "골든 마이크",
    venueCategory: "노래방",
    type: "status",
    content: "오늘 대형룸(20인) 1개, 중형룸(10인) 3개 남아있습니다. 단체 예약 환영합니다!",
    date: "2026-03-27",
    time: "18:00",
    likes: 6,
    isLive: true,
    tags: ["잔여룸", "단체가능"],
  },
  {
    id: "f6",
    venueId: "9",
    venueName: "황금시대",
    venueCategory: "중년노래방",
    type: "notice",
    content: "이번 주 금요일 트로트 라이브 이벤트! 인기 트로트 가수 미니 공연이 있습니다. 예약 필수!",
    date: "2026-03-26",
    time: "15:00",
    likes: 18,
    isLive: false,
    tags: ["라이브", "트로트", "이벤트"],
  },
  {
    id: "f7",
    venueId: "7",
    venueName: "재즈 앤 블루스",
    venueCategory: "바/라운지",
    type: "photo",
    content: "오늘 밤 라이브 재즈 공연 라인업 공개! 9시부터 시작합니다. 분위기 있는 밤을 보내세요 🎷",
    date: "2026-03-26",
    time: "20:00",
    likes: 27,
    isLive: false,
    tags: ["라이브재즈", "공연"],
  },
  {
    id: "f8",
    venueId: "8",
    venueName: "네온 파라다이스",
    venueCategory: "클럽",
    type: "event",
    content: "매주 수요일은 레이디스 나이트! 여성 무료 입장 + 첫 잔 무료. 이번 수요일도 파티 준비 완료!",
    date: "2026-03-25",
    time: "21:00",
    likes: 45,
    isLive: false,
    tags: ["레이디스나이트", "무료입장"],
  },
];

export const adPricing = [
  { name: "일반 리스팅", price: "무료", features: ["기본 프로필 등록", "리뷰 수신", "기본 검색 노출"] },
  { name: "지역 상단 노출", price: "월 50만원~", features: ["지역 검색 상단 고정", "프리미엄 배지", "우선 노출", "통계 리포트"] },
  { name: "메인 배너", price: "월 200만원~", features: ["메인페이지 배너 노출", "전 지역 상단 노출", "프리미엄 배지", "맞춤 컨설팅", "상세 통계 리포트"] },
];
