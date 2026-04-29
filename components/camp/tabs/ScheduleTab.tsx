'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ===== 타입 정의 =====
type DayColorType = 'orientation' | 'regular' | 'exciting' | 'steam' | 'final' | 'checkout' | 'empty';

interface FullScheduleDay {
  date: string;
  colorType: DayColorType;
  label: string;
  sublabel?: string;
  week: 1 | 2 | 3;
}

interface ScheduleItem {
  time: string;
  regular: string;
  steam: string;
  exciting: string;
  detailId?: string;
  regularHighlight?: boolean;
  steamHighlight?: boolean;
  excitingHighlight?: boolean;
}

// ===== 전체 일정표 데이터 (SMIS 28기 제주캠프 7/26 ~ 8/14) =====
// 첫 번째 주는 7/26(일)부터 시작, 빈 칸 없음
const je28FullSchedule: (FullScheduleDay | null)[] = [
  // 1주차 (7/26 ~ 8/1) — 재미구간
  { date: '7/26', colorType: 'orientation', label: 'Orientation', sublabel: 'Placement Test', week: 1 },
  { date: '7/27', colorType: 'regular', label: 'Regular Day', sublabel: '(원어민 ESL 프로그램, 인문학프로그램)', week: 1 },
  { date: '7/28', colorType: 'regular', label: 'Regular Day', sublabel: '(원어민 ESL 프로그램, 인문학프로그램)', week: 1 },
  { date: '7/29', colorType: 'regular', label: 'Regular Day', sublabel: '(원어민 ESL 프로그램, 인문학프로그램)', week: 1 },
  { date: '7/30', colorType: 'regular', label: 'Regular Day', sublabel: '(원어민 ESL 프로그램, 인문학프로그램)', week: 1 },
  { date: '7/31', colorType: 'exciting', label: 'Exciting Day', sublabel: '(Outdoor Activity)', week: 1 },
  { date: '8/1', colorType: 'steam', label: '창의융합사고 STEAM Day', sublabel: '(과학 영역별 이론/실습)', week: 1 },
  // 2주차 (8/2 ~ 8/8) — 감동구간
  { date: '8/2', colorType: 'regular', label: 'Regular Day', sublabel: '(원어민 ESL 프로그램, 인문학프로그램)', week: 2 },
  { date: '8/3', colorType: 'regular', label: 'Regular Day', sublabel: '(원어민 ESL 프로그램, 인문학프로그램)', week: 2 },
  { date: '8/4', colorType: 'regular', label: 'Regular Day', sublabel: '(원어민 ESL 프로그램, 인문학프로그램)', week: 2 },
  { date: '8/5', colorType: 'exciting', label: 'Exciting Day', sublabel: '(Outdoor Activity)', week: 2 },
  { date: '8/6', colorType: 'steam', label: '창의융합사고 STEAM Day', sublabel: '(과학 영역별 이론/실습)', week: 2 },
  { date: '8/7', colorType: 'regular', label: 'Regular Day', sublabel: '(원어민 ESL 프로그램, 인문학프로그램)', week: 2 },
  { date: '8/8', colorType: 'regular', label: 'Regular Day', sublabel: '(원어민 ESL 프로그램, 인문학프로그램)', week: 2 },
  // 3주차 (8/9 ~ 8/14) — 성장구간
  { date: '8/9', colorType: 'regular', label: 'Regular Day', sublabel: '(원어민 ESL 프로그램, 인문학프로그램)', week: 3 },
  { date: '8/10', colorType: 'regular', label: 'Regular Day', sublabel: '(원어민 ESL 프로그램, 인문학프로그램)', week: 3 },
  { date: '8/11', colorType: 'exciting', label: 'Exciting Day', sublabel: '(Outdoor Activity)', week: 3 },
  { date: '8/12', colorType: 'steam', label: '창의융합사고 STEAM Day', sublabel: '(과학 영역별 이론/실습)', week: 3 },
  { date: '8/13', colorType: 'final', label: 'Final Test', sublabel: 'Farewell', week: 3 },
  { date: '8/14', colorType: 'checkout', label: 'Check-out', sublabel: '', week: 3 },
  null, // 빈 칸 (3주차)
];

// ===== 주간 시간표 데이터 (이미지 2 기준) =====
const scheduleData: ScheduleItem[] = [
  {
    time: '08:00–08:20',
    regular: '기상 및 아침 운동',
    steam: '기상 및 아침 운동',
    exciting: '기상 및 아침 운동',
    detailId: 'morning-exercise',
  },
  {
    time: '08:20–09:20',
    regular: '아침 식사',
    steam: '아침 식사',
    exciting: '아침 식사',
    detailId: 'breakfast',
  },
  {
    time: '09:20–10:00',
    regular: '원어민 Speaking 프로그램 1',
    steam: '창의융합 STEAM 프로그램 1',
    exciting: '포인트 경매',
    detailId: 'program-1',
    regularHighlight: true,
    steamHighlight: true,
  },
  {
    time: '10:10–10:50',
    regular: '원어민 Speaking 프로그램 2',
    steam: '( Science 중점 part 1 )',
    exciting: '액티비티 장소 사전교육',
    detailId: 'program-2',
    regularHighlight: true,
  },
  {
    time: '11:00–11:40',
    regular: '스피크업 프로젝트 (영어 패턴)',
    steam: '창의융합 STEAM 프로그램 2',
    exciting: '점심 식사',
    detailId: 'project-1',
    steamHighlight: true,
  },
  {
    time: '11:50–12:30',
    regular: '수학 멘토링',
    steam: '( Science 중점 part 2 )',
    exciting: '',
    detailId: 'mentoring-1',
  },
  {
    time: '12:30–13:30',
    regular: '점심 식사',
    steam: '점심 식사',
    exciting: '',
    detailId: 'lunch',
  },
  {
    time: '13:30–14:10',
    regular: '원어민 Reading 프로그램 1',
    steam: '창의융합 STEAM 프로그램 3',
    exciting: '',
    detailId: 'reading-1',
    regularHighlight: true,
    steamHighlight: true,
  },
  {
    time: '12:30–16:40',
    regular: '',
    steam: '',
    exciting: '아외 액티비티 (with 원어민 선생님)\n\n- 항공우주박물관\n- 런닝맨 & 박물관은 살아있다\n- 수목원 테마파크 & 바운스 슈퍼파크\n\n* 향후 장소 변동가능',
    detailId: 'outdoor-activity',
    excitingHighlight: true,
  },
  {
    time: '14:20–15:00',
    regular: '원어민 Reading 프로그램 2',
    steam: '( Technology 중점 )',
    exciting: '',
    detailId: 'reading-2',
    regularHighlight: true,
  },
  {
    time: '15:10–16:30',
    regular: 'P.E (체육 활동) / 사워',
    steam: '창의융합 STEAM 프로그램 4',
    exciting: '',
    detailId: 'pe-social',
    steamHighlight: true,
  },
  {
    time: '16:00–16:40',
    regular: '',
    steam: '( Engineering 중점 )',
    exciting: '',
    detailId: 'engineering',
  },
  {
    time: '16:40–17:20',
    regular: '원어민 Writing 프로그램 1',
    steam: '',
    exciting: '',
    detailId: 'writing-1',
    regularHighlight: true,
  },
  {
    time: '16:50–18:20',
    regular: '',
    steam: '장기자랑 연습 및 리허설',
    exciting: '사워 및 개인 정비',
    detailId: 'research',
  },
  {
    time: '17:30–18:20',
    regular: '원어민 Writing 프로그램 2',
    steam: '',
    exciting: '',
    detailId: 'writing-2',
    regularHighlight: true,
  },
  {
    time: '18:30–19:30',
    regular: '저녁 식사',
    steam: '저녁 식사',
    exciting: '저녁 식사',
    detailId: 'dinner',
  },
  {
    time: '18:30–19:30',
    regular: 'Paper Trip ver 8\n(테마별 스토리텔링 인문학)',
    steam: '',
    exciting: '',
    detailId: 'paper-trip',
  },
  {
    time: '19:30–20:10',
    regular: '',
    steam: '드림 멘토링 프로그램\n( 자기 탐색 & 게발, 자아 실현 )',
    exciting: 'Week Ending Snack Party\n& 부모님과 통화',
    detailId: 'dream-factory',
  },
  {
    time: '20:20–21:00',
    regular: '',
    steam: '사워 및 개인정비 & 휴식',
    exciting: '',
    detailId: 'night-program',
  },
  {
    time: '21:00–21:30',
    regular: '개인정리 & 휴식',
    steam: '개인정리 & 휴식',
    exciting: '개인정리 & 휴식',
    detailId: 'personal-time',
  },
];

// ===== 주차별 배경색 (구간 색상) =====
const weekBgMap: Record<1 | 2 | 3, string> = {
  1: 'bg-yellow-50',  // 재미구간
  2: 'bg-sky-50',     // 감동구간
  3: 'bg-rose-50',    // 성장구간
};

// ===== 일정 타입별 텍스트 색상 (배경과 독립) =====
const dayTextMap: Record<DayColorType, { label: string; sublabel: string }> = {
  orientation: { label: 'text-emerald-700 font-bold',   sublabel: 'text-emerald-600' },
  regular:     { label: 'text-gray-800 font-semibold',  sublabel: 'text-gray-500' },
  exciting:    { label: 'text-orange-600 font-bold',    sublabel: 'text-orange-500' },
  steam:       { label: 'text-blue-700 font-bold',      sublabel: 'text-blue-500' },
  final:       { label: 'text-red-700 font-bold',       sublabel: 'text-red-500' },
  checkout:    { label: 'text-gray-500 font-semibold',  sublabel: 'text-gray-400' },
  empty:       { label: 'text-gray-300',                sublabel: 'text-gray-200' },
};

const tabConfig = {
  regular: { label: 'Regular Day', color: 'purple', activeClass: 'bg-purple-600 text-white', inactiveClass: 'text-gray-600 hover:text-purple-600', rowHover: 'hover:bg-purple-50', arrow: 'text-purple-400' },
  steam: { label: 'STEAM Day', color: 'blue', activeClass: 'bg-blue-600 text-white', inactiveClass: 'text-gray-600 hover:text-blue-600', rowHover: 'hover:bg-blue-50', arrow: 'text-blue-400' },
  exciting: { label: 'Exciting Day', color: 'orange', activeClass: 'bg-orange-500 text-white', inactiveClass: 'text-gray-600 hover:text-orange-500', rowHover: 'hover:bg-orange-50', arrow: 'text-orange-400' },
} as const;

type TabKey = keyof typeof tabConfig;

const clickableTypes = new Set<DayColorType>(['regular', 'steam', 'exciting']);

const ScheduleTab = ({ campId = 'je', clientId = 'smis' }: { campId?: string; clientId?: string }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('regular');
  const router = useRouter();
  const weeklyScheduleRef = useRef<HTMLDivElement>(null);

  const handleCellClick = (detailId: string) => {
    router.push(`/${clientId}/camp/${campId}/schedule/${detailId}`);
  };

  const handleCalendarCellClick = (colorType: DayColorType) => {
    if (!clickableTypes.has(colorType)) return;
    setActiveTab(colorType as TabKey);
    setTimeout(() => {
      weeklyScheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const currentTab = tabConfig[activeTab];

  // 선택된 탭의 데이터만 필터
  const filteredData = scheduleData.filter(item => item[activeTab] !== '');

  return (
    <div className="space-y-10">
      {/* ===== 섹션 1: 전체 일정표 ===== */}
      <section>
        {/* 구간 뱃지 — 네이비 배경, 모바일 포함 1행 */}
        <div className="bg-[#1e2d4a] rounded-2xl p-4 sm:p-5 mb-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* 1주차 재미구간 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">1주차</span>
                <span className="bg-yellow-300 text-yellow-900 text-xs sm:text-sm font-bold px-2 py-0.5 rounded whitespace-nowrap">
                  재미(FUN)
                </span>
              </div>
              <p className="text-gray-300 text-[10px] sm:text-xs leading-snug hidden sm:block">
                스스로 목표를 세우고 캠프 안에서의 흥미를 찾는 구간입니다.
              </p>
            </div>

            {/* 2주차 감동구간 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">2주차</span>
                <span className="bg-sky-200 text-sky-900 text-xs sm:text-sm font-bold px-2 py-0.5 rounded whitespace-nowrap">
                  감동(EMOTION)
                </span>
              </div>
              <p className="text-gray-300 text-[10px] sm:text-xs leading-snug hidden sm:block">
                멘토와의 교감을 통해 &apos;나&apos;라는 소중한 보물을 발견하는 구간입니다.
              </p>
            </div>

            {/* 3주차 성장구간 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">3주차</span>
                <span className="bg-rose-200 text-rose-900 text-xs sm:text-sm font-bold px-2 py-0.5 rounded whitespace-nowrap">
                  성장(GROWTH)
                </span>
              </div>
              <p className="text-gray-300 text-[10px] sm:text-xs leading-snug hidden sm:block">
                눈에 띄게 달라진 생각의 깊이와 언어의 자신감을 증명할 수 있게 되는 구간입니다.
              </p>
            </div>
          </div>
        </div>

        {/* 캘린더 카드 */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          {/* 헤더 */}
          <div className="bg-[#1e2d4a] py-4 text-center">
            <h2 className="text-white font-bold text-base sm:text-lg tracking-wide">SMIS 28기 제주캠프 시간표</h2>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 bg-[#2c3e5c]">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="py-2 text-center text-xs font-bold text-gray-300 tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 — 3주 × 7일 */}
          <div className="grid grid-cols-7 divide-x divide-y divide-gray-200">
            {je28FullSchedule.map((day, idx) => {
              if (!day) {
                return (
                  <div key={`empty-${idx}`} className="min-h-[72px] sm:min-h-[96px] bg-rose-50" />
                );
              }
              const weekBg = weekBgMap[day.week];
              const textColors = dayTextMap[day.colorType];
              const isClickable = clickableTypes.has(day.colorType);
              return (
                <div
                  key={day.date}
                  className={`min-h-[72px] sm:min-h-[96px] p-1.5 sm:p-2 flex flex-col gap-0.5 ${weekBg} ${
                    isClickable ? 'cursor-pointer hover:brightness-95 transition-all' : ''
                  }`}
                  onClick={isClickable ? () => handleCalendarCellClick(day.colorType) : undefined}
                >
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-400">{day.date}</span>
                  <span className={`text-[9px] sm:text-[11px] leading-tight ${textColors.label}`}>
                    {day.label}
                  </span>
                  {day.sublabel && (
                    <span className={`text-[8px] sm:text-[10px] leading-tight ${textColors.sublabel}`}>
                      {day.sublabel}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* 하단 주석 */}
          <div className="bg-red-50 px-4 py-2.5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <p className="text-[10px] text-gray-500">© 2026 SMIS. All Rights Reserved. 본 자료의 무단 복제 및 배포를 금지합니다.</p>
            <p className="text-[10px] sm:text-xs font-semibold text-red-600">※ It might be changed depending on local situations</p>
          </div>
        </div>
      </section>

      {/* ===== 섹션 2: 주간 시간표 ===== */}
      <section ref={weeklyScheduleRef}>
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          {/* 헤더 */}
          <div className="bg-purple-50 py-4 text-center border-b border-purple-100">
            <h2 className="text-base sm:text-lg font-bold text-purple-900 tracking-wide">
              WEEKLY SCHEDULE <span className="font-normal text-purple-600"></span>
            </h2>
          </div>

          {/* 탭 버튼 */}
          <div className="flex bg-gray-100 p-1 gap-1 border-b border-gray-200">
            {(Object.keys(tabConfig) as TabKey[]).map(key => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === key ? tabConfig[key].activeClass : tabConfig[key].inactiveClass
                }`}
              >
                {tabConfig[key].label}
              </button>
            ))}
          </div>

          {/* 부제 (주 횟수) */}
          <div className="text-center py-2 bg-white border-b border-gray-100">
            <span className="text-xs sm:text-sm font-semibold" style={{ color: activeTab === 'regular' ? '#7c3aed' : activeTab === 'steam' ? '#2563eb' : '#ea580c' }}>
              {activeTab === 'regular' ? 'Regular Day 프로그램 (주 5일)' : activeTab === 'steam' ? 'STEAM Day 프로그램 (주 1일)' : 'Exciting Day 프로그램 (주 1일)'}
            </span>
          </div>

          {/* 시간표 목록 */}
          <div className="divide-y divide-gray-100 bg-white">
            {filteredData.map((item, index) => {
              const program = item[activeTab];
              if (!program) return null;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={`${item.detailId}-${index}`}
                  className={`flex items-stretch cursor-pointer transition-colors ${
                    isEven ? 'bg-white' : 'bg-gray-50'
                  } ${currentTab.rowHover}`}
                  onClick={() => item.detailId && handleCellClick(item.detailId)}
                >
                  {/* 시간 */}
                  <div className="w-24 sm:w-32 flex-shrink-0 flex items-center justify-center px-2 py-2.5 border-r border-gray-200">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-500 text-center leading-tight">
                      {item.time}
                    </span>
                  </div>

                  {/* 프로그램명 */}
                  <div className="flex-1 flex items-center px-3 sm:px-4 py-2.5">
                    <span
                      className={`text-xs sm:text-sm leading-snug whitespace-pre-line ${
                        (activeTab === 'regular' && item.regularHighlight) ||
                        (activeTab === 'steam' && item.steamHighlight) ||
                        (activeTab === 'exciting' && item.excitingHighlight)
                          ? 'font-semibold text-gray-900'
                          : 'text-gray-700'
                      }`}
                    >
                      {program}
                    </span>
                  </div>

                  {/* 화살표 */}
                  <div className={`w-8 flex items-center justify-center flex-shrink-0 ${currentTab.arrow}`}>
                    <span className="text-sm">→</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 하단 주석 */}
          <div className="bg-red-50 px-4 py-2.5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <p className="text-[10px] text-gray-500">© 2026 SMIS. All Rights Reserved. 본 자료의 무단 복제 및 배포를 금지합니다.</p>
            <p className="text-[10px] sm:text-xs font-semibold text-red-600">※ 정규수업 시간표는 각 그룹별로 상이합니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScheduleTab;
