import { Timestamp } from 'firebase/firestore';

export type LocationType = 'je' | 's' | 'f' | 'common';

// ClientType은 이제 동적으로 로드됩니다 (useClients 훅 사용)
// 하드코딩된 타입 대신 string 사용
export type ClientType = string;

// 기본 카테고리 (초기 설정 시 사용)
export const DEFAULT_CATEGORIES = [
  '등록',
  '프로그램(수업)',
  '야외활동',
  '반배정',
  '환자',
  '원어민 선생님',
  '멘토 선생님',
  '생활&숙소',
  '식단',
];

// 거래처 설정 (하드코딩 제거 - Firestore에서 동적으로 로드)
// 이제 useClients() 훅을 사용하여 거래처 목록을 가져옵니다
// 예: const { clients } = useClients();

// 캠프 위치 설정
export const LOCATIONS = [
  { 
    id: 'je' as const, 
    name: 'SMIS 제주캠프', 
    emoji: '🏝️',
    subtitle: '제주의 자연 속에서 완성되는 아이의 진짜 성장',
    description: '제주도에서 진행되는 여름/겨울 캠프',
    target: '초3 - 중2',
    location: '제주 한림읍 일성 콘도',
    period: '7/26 - 8/14\n(19박 20일)',
    price: '390만원\n\n포함 : 수업료, 식대, 숙박비, 전 수업 교재비, 보험료, 청소 및 세탁, 야외 활동비(입장료, 교통비, 중식비)\n\n불포함 : 왕복 항공료, 개인용돈(10만원), 수학교재(개인지참)'
  },
  { 
    id: 's' as const, 
    name: 'SMIS 싱가포르&말레이시아 주니어캠프', 
    emoji: '🌴',
    subtitle: '아이의 세계가 한 번 더 커지는 시간, 말레이시아에서 만나는 더 큰 세상',
    description: '싱가포르와 말레이시아를 체험하는 주니어 캠프',
    target: '초3 - 중2',
    location: '말레이시아 조호바루 포레스트 시티 리조트',
    period: '4주 : 7/22 - 8/17\n2.5주 : 7/22 - 8/8',
    price: '4주 : 555만원\n2.5주 : 415만원\n\n포함 : 수업료, 식대, 숙박비, 전 수업 교재비, 보험료, 청소 및 세탁, 야외 활동비(입장료, 교통비, 중식비)\n\n불포함 : 왕복 항공료, 개인용돈(20만원 상당), 수학교재(개인지참)'
  },
  { 
    id: 'f' as const, 
    name: 'SMIS 말레이시아 가족캠프', 
    emoji: '👨‍👩‍👧‍👦',
    subtitle: '따로 또 같이, 우리 가족이 함께 써 내려가는 글로벌 한 달 살기',
    description: '가족과 함께하는 말레이시아 캠프',
    target: '만5세 - 초6\n(이외 학년은 별도 문의)',
    location: '말레이시아 조호바루 RAMADA HOTEL',
    period: '4주 : 7/23 - 8/17\n2.5주 : 7/23 - 8/8',
    price: '4주 : 2인 810 / 3인 1140 / 4인 1430\n2.5주 : 2인 670 / 3인 945 / 4인 1160\n\n포함 : 수업료, 식대, 숙박비, 교재비, 여행자 보험료, 청소 및 세탁, 공항 픽업비)\n\n불포함 : 왕복 항공료, 수학교재(개인지참), 휴일 학생 중식 불포함, 연수 기간 전체 일정 보호자 중식 불포함, 부모님 원어민 수업 (선택), 공항 샌딩비'
  },
  { 
    id: 'common' as const, 
    name: '공통 (모든 캠프)', 
    emoji: '🌏',
    subtitle: '',
    description: '모든 캠프에 공통으로 적용되는 FAQ',
    target: '',
    location: '',
    period: '',
    price: ''
  },
] as const;

// 기본 색상 팔레트
export const COLOR_PALETTE = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-red-100 text-red-700',
  'bg-indigo-100 text-indigo-700',
  'bg-pink-100 text-pink-700',
  'bg-yellow-100 text-yellow-700',
  'bg-teal-100 text-teal-700',
  'bg-cyan-100 text-cyan-700',
  'bg-lime-100 text-lime-700',
  'bg-amber-100 text-amber-700',
];

export interface Category {
  id: string;
  name: string;
  color: string;
  order: number;
  location: LocationType;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  location: LocationType;
  clients: ClientType[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  category?: string;
  location?: string;
}

export interface ChatRequest {
  query: string;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
}
