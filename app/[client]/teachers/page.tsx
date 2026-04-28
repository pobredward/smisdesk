'use client';

/**
 * Teachers Page — 최고의 강사진
 * 컬러 팔레트
 * Deep Navy  : #071B3A
 * Gold       : #F4B400
 * Ivory      : #FFFDF7
 * Light Blue : #EAF3FF
 * Text       : #111827
 * Sub Text   : #6B7280
 */

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { X, Plus, Check, Phone, MessageCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { useClients, Client } from '@/lib/hooks/useClients';
import StickyBottomBar from '@/components/StickyBottomBar';

// ─── 상수 ────────────────────────────────────────────────────────────────────

const NAVY = '#071B3A';
const GOLD = '#F4B400';
const IVORY = '#FFFDF7';
const LIGHT_BLUE = '#EAF3FF';

// ─── 헤더 ────────────────────────────────────────────────────────────────────

function TeachersHeader({ client }: { client: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const menuGroups = [
    {
      title: 'SMIS란',
      campId: null as string | null,
      links: [
        { label: '브랜드 스토리', section: 'brand', href: 'brand' },
        { label: '최고의 강사진', section: 'teachers', href: 'teachers' },
        { label: '빈틈없는 학생 관리', section: 'management' },
      ],
    },
    {
      title: '프리미엄 제주캠프',
      campId: 'je',
      links: [
        { label: '일정표 및 프로그램', section: 'schedule' },
        { label: '시설 및 환경 소개', section: 'environment' },
        { label: '사진 및 영상', section: 'gallery' },
      ],
    },
    {
      title: '싱가포르&말레이시아 주니어 캠프',
      campId: 's',
      links: [
        { label: '일정표 및 프로그램', section: 'schedule' },
        { label: '시설 및 환경 소개', section: 'environment' },
        { label: '사진 및 영상', section: 'gallery' },
      ],
    },
    {
      title: '말레이시아 가족캠프',
      campId: 'f',
      links: [
        { label: '일정표 및 프로그램', section: 'schedule' },
        { label: '시설 및 환경 소개', section: 'environment' },
        { label: '사진 및 영상', section: 'gallery' },
      ],
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href={`/${client}`} className="flex items-center gap-2.5">
              <Image
                src="/logo-circle-blue.png"
                alt="SMIS 로고"
                width={32}
                height={32}
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <div>
                <p className="font-bold text-gray-900 text-sm leading-tight">SMIS</p>
                <p className="text-xs text-gray-400 leading-tight">인포데스크</p>
              </div>
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              className="flex items-center gap-1.5 border-2 border-gray-300 hover:border-blue-500 rounded-full px-3.5 py-1.5 transition-all duration-200 text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen
                ? <X className="w-4 h-4" strokeWidth={2.5} />
                : <Plus className="w-4 h-4" strokeWidth={2.5} />
              }
              <span className="text-sm font-semibold leading-none">
                {isMenuOpen ? '닫기' : '메뉴'}
              </span>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl rounded-b-2xl overflow-y-auto"
            style={{ maxHeight: 'calc(100dvh - 56px)', animation: 'dropDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className="max-w-lg mx-auto px-4 py-5">
              <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                {menuGroups.map((group) => (
                  <div key={group.title}>
                    <p className="text-xs font-semibold text-gray-400 mb-2 leading-tight">{group.title}</p>
                    <div className="border-t border-gray-100 mb-2" />
                    <ul className="space-y-2">
                      {group.links.map((link) => (
                        <li key={link.section}>
                          <Link
                            href={'href' in link ? `/${client}/${link.href}` : `/${client}/camp/${group.campId ?? 'je'}/${link.section}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-sm text-gray-700 hover:text-blue-600 transition-colors py-0.5 leading-tight"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
      )}

      <style jsx global>{`
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .fade-up-1 { animation-delay: 0.08s; }
        .fade-up-2 { animation-delay: 0.18s; }
        .fade-up-3 { animation-delay: 0.28s; }
        .fade-up-4 { animation-delay: 0.38s; }
        .fade-up-5 { animation-delay: 0.48s; }
      `}</style>
    </>
  );
}

// ─── 섹션 1: Hero ─────────────────────────────────────────────────────────────

function HeroSection({ client }: { client: string }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0d2d5e 60%, #102040 100%)`, minHeight: '100svh' }}
    >
      {/* 배경 광원 효과 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15"
          style={{ background: `radial-gradient(ellipse, ${GOLD} 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: `radial-gradient(ellipse, #60a5fa 0%, transparent 70%)`, transform: 'translate(-30%, 30%)' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 min-h-screen md:min-h-0">

        {/* 좌측 카피 */}
        <div className="flex-1 text-white">
          {/* 배지 */}
          <div className="fade-up inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest"
            style={{ background: 'rgba(244,180,0,0.15)', border: `1px solid ${GOLD}`, color: GOLD }}>
            최고의 강사진
          </div>

          <h1 className="fade-up fade-up-1 text-3xl md:text-5xl font-black leading-tight mb-6">
            아무나<br />
            함께하지 않습니다.<br />
            <span style={{ color: GOLD }}>아무 준비나</span><br />
            시키지도 않습니다.
          </h1>

          <p className="fade-up fade-up-2 text-base md:text-lg text-blue-100 leading-relaxed mb-8">
            선발부터 교육, 리허설, 피드백까지<br />
            SMIS는 교사도 체계적으로 성장시킵니다.<br />
            <span className="text-white font-medium">아이를 맡기는 일이기에, 우리는 선생님을 가장 까다롭게 봅니다.</span>
          </p>

          <div className="fade-up fade-up-3 flex flex-col sm:flex-row gap-3">
            <a
              href="#native-teacher"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
              style={{ background: GOLD, color: NAVY }}
            >
              교사진 선발 기준 보기
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="tel:010-6711-7933"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm border-2 text-white transition-all duration-200 hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }}
            >
              <Phone className="w-4 h-4" />
              상담 신청하기
            </a>
          </div>
        </div>

        {/* 우측 이미지 */}
        <div className="fade-up fade-up-4 flex-1 w-full max-w-sm md:max-w-none">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]"
            style={{ border: `2px solid rgba(244,180,0,0.3)` }}>
            <Image
              src="/hero-camp.jpg"
              alt="SMIS 캠프 선생님과 아이들"
              fill
              className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            {/* 이미지 fallback */}
            <div className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0d2d5e 0%, #1a3a6b 100%)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                style={{ background: `rgba(244,180,0,0.2)`, border: `2px solid ${GOLD}` }}>
                <span className="text-2xl">🎓</span>
              </div>
              <p className="text-white/60 text-sm text-center">선생님과 아이들이<br />함께하는 SMIS 캠프</p>
            </div>
          </div>

          {/* 통계 배지 */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { num: '6단계', label: '검증 시스템' },
              { num: '120h+', label: '사전 교육' },
              { num: '100%', label: '리허설 완료' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <p className="font-black text-lg leading-tight" style={{ color: GOLD }}>{stat.num}</p>
                <p className="text-xs text-blue-200 mt-0.5 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 스크롤 힌트 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 animate-bounce">
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
}

// ─── 섹션 2: 부모 불안 공감 ────────────────────────────────────────────────────

function ParentConcernSection() {
  const concerns = [
    {
      q: '원어민이라고 다 좋은 선생님일까?',
      a: '영어를 잘하는 것과 아이를 잘 가르치는 것은 다릅니다.',
    },
    {
      q: '선생님마다 수업 차이가 크면 어떡하지?',
      a: '좋은 캠프일수록 개인 역량이 아니라 공통 기준이 있어야 합니다.',
    },
    {
      q: '한국인 멘토가 아이를 제대로 관리할 수 있을까?',
      a: '아이를 좋아하는 마음만으로는 부족합니다. 역할, 규칙, 대응 방식이 훈련되어야 합니다.',
    },
    {
      q: '우리 아이의 성향을 제대로 이해할까?',
      a: '좋은 관리는 아이를 많이 보는 것에서 끝나지 않습니다. 아이별 특이사항을 알고 대응할 수 있어야 합니다.',
    },
  ];

  return (
    <section className="py-16 md:py-20 px-5" style={{ background: IVORY }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-widest mb-3" style={{ color: GOLD }}>PARENT CONCERNS</p>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4">
          학부모님이 가장 먼저 걱정하는 것은<br />
          결국 <span style={{ color: NAVY }}>&apos;사람&apos;</span>입니다.
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-10">
          시설이 좋아도, 프로그램이 좋아도, 일정표가 촘촘해도,<br className="hidden sm:block" />
          아이와 하루 종일 함께하는 사람의 기준이 흔들리면<br className="hidden sm:block" />
          캠프의 퀄리티는 흔들릴 수밖에 없습니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {concerns.map((c, i) => (
            <div key={i} className="rounded-2xl p-5 bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `rgba(244,180,0,0.15)` }}>
                  <span className="text-sm font-black" style={{ color: GOLD }}>Q</span>
                </div>
                <p className="font-bold text-gray-900 text-sm leading-snug">{c.q}</p>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed pl-10">{c.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 3: SMIS의 답 ────────────────────────────────────────────────────────

function SMISAnswerSection() {
  const values = [
    '아이를 존중하는 태도',
    '수업을 준비하는 성실성',
    '상황에 대응하는 책임감',
    '팀 안에서 함께 움직이는 협업력',
    'SMIS 교육 기준을 현장에서 구현하는 능력',
  ];

  return (
    <section className="py-16 md:py-20 px-5" style={{ background: NAVY }}>
      <div className="max-w-2xl mx-auto text-white">
        <p className="text-xs font-bold tracking-widest mb-3" style={{ color: GOLD }}>SMIS STANDARD</p>
        <h2 className="text-2xl md:text-3xl font-black leading-tight mb-6">
          SMIS는 좋은 선생님을<br />
          <span style={{ color: GOLD }}>&apos;감&apos;</span>으로 뽑지 않습니다.<br />
          시스템으로 검증합니다.
        </h2>

        <p className="text-blue-200 text-sm md:text-base leading-relaxed mb-8">
          SMIS가 생각하는 최고의 강사진은 단순히 스펙이 좋은 사람들이 아닙니다.
          선발부터 교육, 리허설, 피드백까지 하나의 시스템으로 운영합니다.
        </p>

        <div className="space-y-3 mb-10">
          {values.map((v, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: GOLD }}>
                <Check className="w-3 h-3" style={{ color: NAVY }} strokeWidth={3} />
              </div>
              <span className="text-sm md:text-base text-white">{v}</span>
            </div>
          ))}
        </div>

        {/* 강조 박스 */}
        <div className="rounded-2xl p-5 md:p-6"
          style={{ background: 'rgba(244,180,0,0.12)', border: `1.5px solid rgba(244,180,0,0.4)` }}>
          <p className="text-base md:text-lg font-bold leading-relaxed" style={{ color: GOLD }}>
            &ldquo;좋은 선생님 한 명에게 의존하지 않고,<br />
            좋은 수업이 반복될 수 있는 구조를 만듭니다.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── STEP 카드 공통 컴포넌트 ──────────────────────────────────────────────────

interface StepCardProps {
  step: number;
  title: string;
  items: string[];
  isDark?: boolean;
}

function StepCard({ step, title, items, isDark = false }: StepCardProps) {
  return (
    <div
      className="rounded-2xl p-5 h-full flex flex-col"
      style={{
        background: isDark ? 'rgba(255,255,255,0.06)' : 'white',
        border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e5e7eb',
        boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.07)',
      }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs"
          style={{ background: GOLD, color: NAVY }}>
          {step}
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-wider" style={{ color: isDark ? 'rgba(244,180,0,0.7)' : GOLD }}>STEP {step}</p>
          <p className={`font-bold text-sm leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</p>
        </div>
      </div>
      <ul className="space-y-1.5 flex-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs leading-relaxed"
            style={{ color: isDark ? 'rgba(255,255,255,0.65)' : '#6B7280' }}>
            <span className="flex-shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full"
              style={{ background: isDark ? 'rgba(244,180,0,0.6)' : GOLD, marginTop: '5px' }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── 섹션 4: Golden Key 1 — 원어민T ─────────────────────────────────────────

function NativeTeacherSection() {
  const steps = [
    {
      title: '아무나 함께하지 않습니다.',
      items: [
        '지정된 원어민 국가 출신의 대학 졸업자',
        'SMIS에서 요구하는 교사 자격 인증 가능자',
        '학교 및 교육기관 티칭 경험 보유자 우대',
      ],
    },
    {
      title: '서류로 끝내지 않습니다.',
      items: [
        '3단계 면접 진행',
        '원어민 매니저 → 운영 매니저 → 대표이사 검토',
        '레벨 및 연령대 경험, 커뮤니케이션 역량 확인',
        '"아이 중심 수업" 가능 여부 실제 사례로 검증',
      ],
    },
    {
      title: "수업은 '가이드'로 표준화합니다.",
      items: [
        'SMIS Lesson Plan Guide 제공',
        '레벨별, 교재별 운영 기준 제공',
        '어떤 원어민 수업이든 동일한 퀄리티 유지',
      ],
    },
    {
      title: '실전 리허설로 검증합니다.',
      items: [
        'Lesson Plan 작성 후 피드백',
        '3단계 보완 작업 진행',
        '진행력, 발문, 시간 운영 체크',
        '실제 수업 전 문제점 수정',
      ],
    },
    {
      title: '합격 후가 진짜 시작입니다.',
      items: [
        '최종 합격 후 온라인 오리엔테이션 및 교육 진행',
        'SMIS 수업 기준 및 교실 운영 규칙 전달',
        '현장에서 바로 적용 가능한 형태로 교육',
      ],
    },
    {
      title: '수업은 디테일에서 완성됩니다.',
      items: [
        '수업 운영 방안 최종 공유',
        '반별, 학생별 특이사항 숙지',
        '학생 대응 방식 교육',
        '수업별 세부 지침 체크 후 캠프 투입',
      ],
    },
  ];

  return (
    <section id="native-teacher" className="py-16 md:py-20 px-5" style={{ background: NAVY }}>
      <div className="max-w-3xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-xs font-black tracking-widest"
            style={{ background: GOLD, color: NAVY }}>
            ✦ GOLDEN KEY 1
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
            &apos;깐깐한&apos; 원어민T<br />
            채용 및 교육 시스템
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            SMIS의 원어민 선생님은 영어를 잘한다는 이유만으로 함께하지 않습니다.
            아이를 가르칠 수 있는 사람인지, SMIS의 수업 기준을 따라올 수 있는지,
            실제 수업 상황에서 안정적으로 운영할 수 있는지를 단계별로 검증합니다.
          </p>
        </div>

        {/* STEP 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <StepCard key={i} step={i + 1} title={s.title} items={s.items} isDark />
          ))}
        </div>

        {/* 핵심 문장 */}
        <div className="mt-8 rounded-2xl p-5 text-center"
          style={{ background: 'rgba(244,180,0,0.1)', border: `1px solid rgba(244,180,0,0.3)` }}>
          <p className="text-sm md:text-base font-bold text-white leading-relaxed">
            SMIS의 원어민 수업은 선생님의 개인 스타일에만 맡기지 않습니다.<br />
            <span style={{ color: GOLD }}>SMIS의 기준 안에서 준비되고, 검증되고, 운영됩니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 5: Golden Key 2 — 한국T ────────────────────────────────────────────

function KoreanTeacherSection() {
  const steps = [
    {
      title: '아무에게나 맡기지 않습니다.',
      items: [
        '4년제 대학교 재학 및 졸업자 중심 선발',
        '멘토링, 교육봉사, 학생 지도 경험 보유자 우대',
        '아이를 존중하는 태도와 책임감 확인',
      ],
    },
    {
      title: "\"좋은 사람\"만 뽑지 않습니다.",
      items: [
        '자기소개서로 태도와 커뮤니케이션 능력 1차 확인',
        '면접에서 돌발 상황 대응력 확인',
        '협업 역량과 성실성을 기준으로 선발',
      ],
    },
    {
      title: '역할을 정확히 훈련합니다.',
      items: [
        '담임 멘토의 핵심 역할 표준화 자료 전달',
        '학생 관리 원칙을 실제 사례로 연습',
        '캠프 운영 시스템 공통 교육',
        '아이와 학부모를 대하는 기준 공유',
      ],
    },
    {
      title: '수업은 리허설로 증명합니다.',
      items: [
        'SMIS 독자 기획·개발 수업자료 전달',
        '수업자료 기반 모의수업 준비',
        '학생 수준별 지도법 훈련',
        '실제 수업 상황처럼 리허설 진행',
      ],
    },
    {
      title: "완전히 '한 팀'이 됩니다.",
      items: [
        '캠프 전 대면 교육 총 120시간 진행',
        '반 운영 목표, 분위기, 규칙, 관리 방식 공유',
        '1:1 코칭과 피드백으로 개인별 약점 보완',
      ],
    },
    {
      title: "\"세부 준비\"로 마무리합니다.",
      items: [
        '학생별 성향, 주의사항, 학습 포인트 사전 숙지',
        '학부모 커뮤니케이션 기준 교육',
        '수업 및 학생관리 세부 지침 최종 체크',
        '캠프 투입 전 최종 점검',
      ],
    },
  ];

  return (
    <section className="py-16 md:py-20 px-5" style={{ background: LIGHT_BLUE }}>
      <div className="max-w-3xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-xs font-black tracking-widest"
            style={{ background: NAVY, color: GOLD }}>
            ✦ GOLDEN KEY 2
          </div>
          <h2 className="text-2xl md:text-3xl font-black leading-tight mb-3" style={{ color: NAVY }}>
            &apos;깐깐한&apos; 한국T<br />
            채용 및 교육 시스템
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            한국인 선생님은 아이들의 생활, 학습, 정서, 안전을 가장 가까이에서 함께하는 핵심 인력입니다.
            SMIS는 한국T를 단순 보조 인력으로 보지 않습니다.
            아이의 하루를 함께 설계하는 <strong>교육 파트너</strong>로 봅니다.
          </p>
        </div>

        {/* STEP 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <StepCard key={i} step={i + 1} title={s.title} items={s.items} isDark={false} />
          ))}
        </div>

        {/* 핵심 문장 */}
        <div className="mt-8 rounded-2xl p-5 text-center"
          style={{ background: NAVY }}>
          <p className="text-sm md:text-base font-bold text-white leading-relaxed">
            SMIS의 한국T는 단순한 인솔자가 아닙니다.<br />
            <span style={{ color: GOLD }}>아이의 하루를 가장 가까이에서 관찰하고, 돕고, 성장시키는 담임 멘토입니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 6: 자체 개발 플랫폼 ────────────────────────────────────────────────

function IntegratedPlatformSection() {
  const cards = [
    {
      icon: '📋',
      title: '지원자 통합 관리',
      desc: '채용 진행 상태가 한눈에 정리되어 누락 없이 선발합니다.',
      detail: '관리자는 지원자의 서류, 면접, 과제, 합격 여부를 단계별로 확인할 수 있습니다.',
    },
    {
      icon: '📊',
      title: '단계별 트래킹',
      desc: '서류→면접→과제→합격 과정을 실시간으로 관리합니다.',
      detail: '지원자가 어느 단계에서 어떤 평가를 받았는지 기록하고, 운영진이 같은 기준으로 확인합니다.',
    },
    {
      icon: '🎯',
      title: '1:1 밀착 교육',
      desc: '자료 업로드와 피드백을 즉각적으로 진행하며 개인별로 코칭합니다.',
      detail: '선생님별로 필요한 수업자료를 배정하고, 피드백을 관리하여 캠프 전까지 준비도를 높입니다.',
    },
  ];

  return (
    <section className="py-16 md:py-20 px-5 bg-white">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-widest mb-3" style={{ color: GOLD }}>INTEGRATED SYSTEM</p>
        <h2 className="text-2xl md:text-3xl font-black leading-tight mb-4" style={{ color: NAVY }}>
          SMIS는 자체 개발<br />
          채용·교육 통합 시스템을<br />
          운영합니다.
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-10">
          좋은 교사진은 엑셀과 감으로 관리되지 않습니다.
          SMIS는 지원자 선발부터 수업자료 배정, 피드백, 교육 이력까지
          한눈에 관리할 수 있는 시스템을 직접 개발해 운영합니다.
        </p>

        {/* 폰 Mockup placeholder 3개 */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {['지원자 관리', '단계 트래킹', '수업 배정'].map((label) => (
            <div key={label} className="rounded-2xl overflow-hidden aspect-[9/16] relative flex flex-col"
              style={{ background: 'linear-gradient(160deg, #f0f4ff 0%, #e8eeff 100%)', border: '1px solid #dde3f0' }}>
              <div className="flex-1 flex items-center justify-center p-2">
                <div className="w-full h-full rounded-xl flex flex-col gap-1.5 p-1.5"
                  style={{ background: 'rgba(7,27,58,0.06)' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="rounded-md h-3"
                      style={{ background: i === 0 ? GOLD : 'rgba(7,27,58,0.1)', opacity: i === 0 ? 0.8 : 1 }} />
                  ))}
                </div>
              </div>
              <div className="pb-2 px-2">
                <p className="text-[10px] font-bold text-center" style={{ color: NAVY }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 카드 3개 */}
        <div className="grid grid-cols-1 gap-4">
          {cards.map((c, i) => (
            <div key={i} className="flex gap-4 rounded-2xl p-5 border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ background: `rgba(244,180,0,0.12)` }}>
                {c.icon}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm mb-1">{c.title}</p>
                <p className="text-xs font-medium mb-1" style={{ color: NAVY }}>{c.desc}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 강조 문구 */}
        <div className="mt-8 rounded-2xl p-5 text-center"
          style={{ background: NAVY }}>
          <p className="text-sm font-bold text-white leading-relaxed">
            선생님 한 명 한 명의 준비 상태를 확인할 수 있어야<br />
            <span style={{ color: GOLD }}>아이 한 명 한 명의 캠프도 안정적으로 운영될 수 있습니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 7: Lesson Plan 표준화 ─────────────────────────────────────────────

function LessonPlanSection() {
  const items = [
    'Lesson Plan Guide 제공',
    '레벨별 수업 운영 기준 제공',
    '교재별 수업 흐름 정리',
    '수업자료 사전 업로드',
    '운영진 피드백',
    '리허설 후 최종 수정',
    '캠프 전 최종 자료 공유',
  ];

  return (
    <section className="py-16 md:py-20 px-5" style={{ background: IVORY }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-widest mb-3" style={{ color: GOLD }}>STANDARDIZED CURRICULUM</p>
        <h2 className="text-2xl md:text-3xl font-black leading-tight mb-4" style={{ color: NAVY }}>
          선생님마다 다른 수업이 아니라,<br />
          SMIS 기준에 맞춘 수업을<br />
          제공합니다.
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          캠프 수업에서 가장 위험한 것은 선생님 개인 역량에 따라 수업 퀄리티가 크게 달라지는 것입니다.
          SMIS는 이 문제를 줄이기 위해 수업자료, Lesson Plan, 운영 가이드, 피드백 기준을 표준화합니다.
        </p>

        <div className="space-y-3 mb-10">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: GOLD }}>
                <Check className="w-3.5 h-3.5" style={{ color: NAVY }} strokeWidth={3} />
              </div>
              <span className="text-sm text-gray-800 font-medium">{item}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-5" style={{ background: NAVY }}>
          <p className="text-sm font-bold text-white leading-relaxed text-center">
            SMIS의 수업은 &apos;좋은 선생님이 알아서 잘하는 수업&apos;이 아니라,<br />
            <span style={{ color: GOLD }}>좋은 선생님이 더 잘할 수 있도록 설계된 수업입니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 8: 리허설 & 피드백 ─────────────────────────────────────────────────

function RehearsalSection() {
  const checks = [
    '아이의 눈높이에 맞게 설명하는가',
    '질문을 잘 던지는가',
    '수업 흐름을 놓치지 않는가',
    '시간이 밀렸을 때 조정할 수 있는가',
    '아이가 집중하지 못할 때 대응할 수 있는가',
    '반 분위기를 안정적으로 이끌 수 있는가',
  ];

  return (
    <section className="py-16 md:py-20 px-5 bg-white">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-widest mb-3" style={{ color: GOLD }}>REHEARSAL & FEEDBACK</p>
        <h2 className="text-2xl md:text-3xl font-black leading-tight mb-4" style={{ color: NAVY }}>
          실제 아이를 만나기 전,<br />
          먼저 수업을 검증합니다.
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          SMIS는 선생님이 캠프 현장에 들어가기 전 수업자료만 전달하고 끝내지 않습니다.
          수업 계획을 작성하게 하고, 운영진이 피드백하고, 필요한 부분을 보완하고, 실제 수업처럼 리허설합니다.
        </p>

        <div className="rounded-2xl p-5 mb-8"
          style={{ background: LIGHT_BLUE, border: `1px solid #c7d7f0` }}>
          <p className="text-xs font-bold mb-4" style={{ color: NAVY }}>리허설에서 확인하는 것</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {checks.map((c, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: NAVY }}>
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span className="text-xs text-gray-700 leading-relaxed">{c}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: NAVY }}>
          <p className="text-sm md:text-base font-bold text-white leading-relaxed text-center">
            아이 앞에서 처음 해보는 수업은 없습니다.<br />
            <span style={{ color: GOLD }}>SMIS의 수업은 캠프 전에 이미 한 번 검증됩니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 9: 현장 운영 ────────────────────────────────────────────────────────

function FieldOperationSection() {
  const cards = [
    {
      icon: '👁️',
      title: '생활 관찰',
      desc: '아이의 컨디션, 관계, 태도를 가까이에서 살핍니다.',
    },
    {
      icon: '📚',
      title: '학습 관리',
      desc: '수업 참여도와 과제 수행을 확인하고 필요한 도움을 줍니다.',
    },
    {
      icon: '💬',
      title: '정서 케어',
      desc: '아이가 낯선 환경에 적응할 수 있도록 대화하고 격려합니다.',
    },
    {
      icon: '📱',
      title: '학부모 소통',
      desc: '필요한 내용은 운영 기준에 맞춰 정확하게 전달합니다.',
    },
  ];

  return (
    <section className="py-16 md:py-20 px-5" style={{ background: IVORY }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-widest mb-3" style={{ color: GOLD }}>FIELD OPERATION</p>
        <h2 className="text-2xl md:text-3xl font-black leading-tight mb-4" style={{ color: NAVY }}>
          좋은 선생님은<br />
          수업 시간에만 좋은 사람이 아닙니다.
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-10">
          캠프에서 선생님의 역할은 수업에만 있지 않습니다.
          아이의 표정, 친구 관계, 식사와 생활 태도, 피곤함, 불안함, 작은 갈등까지.
          캠프 현장에서는 교사가 아이의 하루 전체를 봐야 합니다.<br /><br />
          그래서 SMIS는 선생님에게 수업만 교육하지 않습니다.
          아이를 대하는 방식, 반 운영 기준, 상황별 대응 방식, 학부모 커뮤니케이션 기준까지 함께 교육합니다.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {cards.map((c, i) => (
            <div key={i} className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                style={{ background: `rgba(244,180,0,0.12)` }}>
                {c.icon}
              </div>
              <p className="font-bold text-gray-900 text-sm mb-1.5">{c.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 10: 최종 CTA ────────────────────────────────────────────────────────

function FinalCTASection({ client }: { client: string }) {
  return (
    <section className="py-16 md:py-20 px-5" style={{ background: NAVY }}>
      <div className="max-w-lg mx-auto text-center text-white">
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: 'rgba(244,180,0,0.15)', border: `1px solid ${GOLD}`, color: GOLD }}>
          ✦ 지금 확인하세요
        </div>

        <h2 className="text-2xl md:text-3xl font-black leading-tight mb-4">
          아이를 맡길 선생님,<br />
          <span style={{ color: GOLD }}>기준까지 확인해보세요.</span>
        </h2>

        <p className="text-blue-200 text-sm leading-relaxed mb-10">
          SMIS는 선생님을 소개하는 데서 끝나지 않습니다.
          선생님이 어떤 기준으로 선발되고, 어떻게 교육되며,
          어떤 준비를 마치고 아이 앞에 서는지 보여드립니다.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href={`/${client}/camp/je`}
            className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02]"
            style={{ background: GOLD, color: NAVY }}
          >
            <ArrowRight className="w-4 h-4" />
            캠프 프로그램 보기
          </Link>
          <a
            href="https://pf.kakao.com/_Axafxcb/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 text-white transition-all duration-200 hover:bg-white/10"
            style={{ borderColor: 'rgba(255,255,255,0.35)' }}
          >
            <MessageCircle className="w-4 h-4" />
            설명회 신청하기
          </a>
          <a
            href="tel:010-6711-7933"
            className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:bg-white/5"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)' }}
          >
            <Phone className="w-4 h-4" />
            상담 신청하기
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ client }: { client: string }) {
  return (
    <footer className="py-12 px-5" style={{ background: '#050f1f' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/logo-circle-blue.png" alt="SMIS" width={36} height={36} className="w-9 h-9 object-contain" />
          <div>
            <p className="font-bold text-white text-sm">SMIS</p>
            <p className="text-xs text-gray-500">English Camp</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 text-sm text-gray-400">
          <div>
            <h3 className="text-white font-bold text-sm mb-3">빠른 이동</h3>
            <ul className="space-y-1.5">
              <li><Link href={`/${client}/brand`} className="hover:text-white transition-colors">브랜드 스토리</Link></li>
              <li><Link href={`/${client}/teachers`} className="hover:text-white transition-colors" style={{ color: GOLD }}>최고의 강사진</Link></li>
              <li><Link href={`/${client}/camp/je`} className="hover:text-white transition-colors">제주캠프</Link></li>
              <li><Link href={`/${client}/camp/s`} className="hover:text-white transition-colors">싱가포르&말레이시아</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm mb-3">문의</h3>
            <ul className="space-y-1.5">
              <li><a href="tel:010-6711-7933" className="hover:text-white transition-colors">010-6711-7933</a></li>
              <li>
                <a href="https://pf.kakao.com/_Axafxcb/chat" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  카카오톡 채널 <span className="text-xs">↗</span>
                </a>
              </li>
              <li>
                <a href="https://www.smisedu.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  공식 홈페이지 <span className="text-xs">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-5 text-xs text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} (주)에스엠아이에스. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function TeachersPage({ params }: { params: Promise<{ client: string }> }) {
  const { client } = use(params);
  const { clients, loading } = useClients();
  const [clientInfo, setClientInfo] = useState<Client | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading && clients.length > 0) {
      const info = clients.find(c => c.clientId === client);
      if (info && info.clientId !== 'common') {
        setClientInfo(info);
      }
      setIsChecking(false);
    }
  }, [clients, client, loading]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: NAVY }}>
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 animate-pulse"
            style={{ background: `rgba(244,180,0,0.2)` }}
          >
            <span className="text-xl">✦</span>
          </div>
          <p className="text-sm text-blue-300">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!clientInfo) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <TeachersHeader client={client} />
      <HeroSection client={client} />
      <ParentConcernSection />
      <SMISAnswerSection />
      <NativeTeacherSection />
      <KoreanTeacherSection />
      <IntegratedPlatformSection />
      <LessonPlanSection />
      <RehearsalSection />
      <FieldOperationSection />
      <FinalCTASection client={client} />
      <Footer client={client} />
      <StickyBottomBar clientId={client} />
    </div>
  );
}
