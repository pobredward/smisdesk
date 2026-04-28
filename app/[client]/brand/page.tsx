'use client';

/**
 * 브랜드 컬러 팔레트 (파란색 계열)
 * Primary  : #3f39c4  (딥 인디고 — 기존 사이트 메인컬러)
 * Dark     : #1e1a6e  (다크 네이비)
 * Light bg : #EEF2FF  (라벤더 화이트)
 * Soft     : #c7d2fe  (소프트 인디고)
 * Accent   : #fbbf24  (앰버 옐로우 — 포인트)
 * Text     : #111827  (딥 다크)
 */

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { X, Plus, Phone, ArrowRight, Check, MessageCircle } from 'lucide-react';
import { useClients, Client } from '@/lib/hooks/useClients';
import StickyBottomBar from '@/components/StickyBottomBar';

// ─── 헤더 ───────────────────────────────────────────────────────────────────

function BrandHeader({ client }: { client: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const menuGroups = [
    {
      title: 'SMIS란',
      campId: null as string | null,
      links: [
        { label: '브랜드 스토리', section: 'brand', href: 'brand' },
        { label: '최고의 강사진', section: 'teachers', href: 'teachers' as const },
        { label: '빈틈없는 학생 관리', section: 'management', href: 'management' },
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
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <style jsx global>{`
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .fade-up-delay-1 { animation-delay: 0.1s; }
        .fade-up-delay-2 { animation-delay: 0.2s; }
        .fade-up-delay-3 { animation-delay: 0.35s; }
      `}</style>
    </>
  );
}

// ─── 섹션 1: Hero ────────────────────────────────────────────────────────────

function HeroSection({ client }: { client: string }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1e1a6e 0%, #3f39c4 55%, #2d28a0 100%)', minHeight: '100svh' }}
    >
      {/* 배경 광원 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #818cf8 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, #a5b4fc 0%, transparent 70%)', transform: 'translate(-20%, 20%)' }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-20 pb-32 flex flex-col justify-center min-h-screen">
        {/* 배지 */}
        <div className="fade-up mb-8">
          <span
            className="inline-block text-xs font-semibold tracking-widest px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#c7d2fe', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            BRAND STORY
          </span>
        </div>

        {/* 메인 카피 */}
        <h1 className="fade-up fade-up-delay-1 text-white font-extrabold leading-tight mb-6"
          style={{ fontSize: 'clamp(1.75rem, 6vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
        >
          처음부터 캠프를<br />
          만들고 싶었던 건<br />
          아니었습니다.
          <br />
          <span style={{ color: '#fbbf24' }}>
            아이들이 다시 스스로<br />
            움직이게 만들고<br />
            싶었습니다.
          </span>
        </h1>

        {/* 서브 카피 */}
        <p className="fade-up fade-up-delay-2 text-base leading-relaxed mb-10"
          style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}
        >
          AI가 정답을 대신 찾아주는 시대,<br />
          아이에게 필요한 것은 더 많은 문제집이 아니라<br />
          스스로 질문하고, 선택하고, 끝까지 해내는 힘입니다.<br />
          <br />
          SMIS는 그 힘을 깨우기 위해 시작되었습니다.
        </p>

        {/* CTA 버튼 */}
        <div className="fade-up fade-up-delay-3 flex flex-col sm:flex-row gap-3">
          <a
            href="#origin"
            className="inline-flex items-center justify-center gap-2 font-bold px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-105 text-sm"
            style={{ background: '#fbbf24', color: '#1e1a6e' }}
          >
            SMIS가 시작된 이유 보기
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href={`/${client}`}
            className="inline-flex items-center justify-center gap-2 font-bold px-7 py-3.5 rounded-full transition-all duration-200 text-sm"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            캠프 프로그램 보기
          </Link>
        </div>
      </div>

      {/* 하단 스크롤 유도 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-0.5 h-8 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
      </div>
    </section>
  );
}

// ─── 섹션 2: 문제 공감 ──────────────────────────────────────────────────────

function ProblemEmpathySection() {
  const quotes = [
    { text: '"우리 아이가 머리가 나쁜 건 아닌데, 의욕이 없어요."', icon: '😔' },
    { text: '"시키면 하긴 하는데, 스스로 하지는 않아요."', icon: '😶' },
    { text: '"학원은 다니는데, 아이가 왜 하는지 모르는 것 같아요."', icon: '😕' },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>01 · 문제 공감</p>

        <h2 className="font-extrabold leading-tight mb-6" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', color: '#111827', letterSpacing: '-0.02em' }}>
          아이들이 공부를<br />
          못하는 게 아닙니다.<br />
          <span style={{ color: '#3f39c4' }}>공부해야 할 이유를<br />잃어버린 겁니다.</span>
        </h2>

        <p className="text-sm leading-relaxed mb-10" style={{ color: '#6b7280' }}>
          많은 부모님들이 이렇게 말합니다.
        </p>

        {/* 인용 카드 */}
        <div className="flex flex-col gap-4 mb-12">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="rounded-2xl px-5 py-4 flex items-start gap-4"
              style={{ background: '#EEF2FF', boxShadow: '0 2px 12px rgba(63,57,196,0.08)' }}
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{q.icon}</span>
              <p className="text-sm leading-relaxed font-medium" style={{ color: '#374151' }}>{q.text}</p>
            </div>
          ))}
        </div>

        {/* 설명 */}
        <div className="rounded-3xl px-6 py-7" style={{ background: '#f8f8ff', boxShadow: '0 2px 16px rgba(63,57,196,0.08)', border: '1px solid #e0e7ff' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
            SMIS가 주목한 문제는 <strong style={{ color: '#111827' }}>성적표가 아니었습니다.</strong> 그보다 더 근본적인 문제였습니다.
          </p>
          <ul className="mt-4 space-y-2">
            {[
              '아이들이 점점 목표 없이 공부하고',
              '비교 속에서 지치고',
              '실패를 경험하기 전에 포기하는 것.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#6b7280' }}>
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: '#3f39c4' }} />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed font-medium" style={{ color: '#111827' }}>
            아이에게 필요한 것은 새로운 문제집이 아니라,<br />
            <span style={{ color: '#3f39c4' }}>다시 움직이게 만드는 경험이었습니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 3: AI 시대 ─────────────────────────────────────────────────────────

function AIEraSection() {
  const abilities = [
    '모르는 것을 질문으로 바꾸는 힘',
    '주어진 답을 그대로 믿지 않고 검증하는 힘',
    '스스로 계획하고 실행하는 힘',
    '실패해도 다시 시도하는 힘',
    '사람과 협업하고 생각을 표현하는 힘',
  ];

  return (
    <section className="py-20 px-6" style={{ background: '#EEF2FF' }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>02 · 시대 변화</p>

        <h2 className="font-extrabold leading-tight mb-8" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', color: '#111827', letterSpacing: '-0.02em' }}>
          정답을 잘 찾는 아이보다,<br />
          <span style={{ color: '#3f39c4' }}>좋은 질문을 던지는<br />아이가 앞서갑니다.</span>
        </h2>

        <p className="text-sm leading-relaxed mb-8" style={{ color: '#374151' }}>
          AI는 이미 아이들의 공부 방식을 바꾸고 있습니다. 이제 단순 암기, 반복 문제풀이, 정보 검색 능력만으로는 충분하지 않습니다.
        </p>

        <p className="text-sm font-semibold mb-5" style={{ color: '#111827' }}>앞으로의 아이들에게 더 중요해지는 것</p>

        <div className="flex flex-col gap-3 mb-10">
          {abilities.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: 'white', boxShadow: '0 1px 8px rgba(63,57,196,0.08)' }}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#c7d2fe' }}>
                <Check className="w-3.5 h-3.5" style={{ color: '#3f39c4' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#111827' }}>{item}</p>
            </div>
          ))}
        </div>

        {/* 강조 박스 */}
        <div className="rounded-3xl px-6 py-7" style={{ background: '#fbbf24' }}>
          <p className="text-base font-bold leading-relaxed" style={{ color: '#1e1a6e' }}>
            AI가 답을 대신 주는 시대일수록,<br />
            아이에게는 <span style={{ color: '#7c3aed' }}>'나만의 방향'</span>이 필요합니다.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: '#1e1a6e', opacity: 0.8 }}>
            SMIS는 이 변화에 맞춰 만들어졌습니다. 단순히 영어를 배우고, 체험을 하고, 숙소에서 지내는 캠프가 아니라 아이들이 AI 시대에 필요한 태도와 사고방식을 경험하게 하는 캠프입니다.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 4: 탄생 스토리 ─────────────────────────────────────────────────────

function OriginStorySection() {
  return (
    <section id="origin" className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>03 · SMIS의 시작</p>

        <h2 className="font-extrabold leading-tight mb-8" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', color: '#111827', letterSpacing: '-0.02em' }}>
          SMIS는 한 가지 문제의식에서<br />
          시작되었습니다.<br />
          <span style={{ color: '#3f39c4' }}>"아이들은 왜 점점<br />스스로 움직이지 않을까?"</span>
        </h2>

        <div className="rounded-3xl px-6 py-7 mb-8" style={{ background: '#f8f8ff', boxShadow: '0 2px 16px rgba(63,57,196,0.08)', border: '1px solid #e0e7ff' }}>
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#374151' }}>
            SMIS는 처음부터 멋진 캠프 상품을 만들기 위해 시작된 브랜드가 아닙니다.
          </p>
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#374151' }}>
            학부모 상담을 하며, 아이들의 학습 태도를 보며, 멘토링 현장에서 학생들의 변화를 지켜보며 우리는 한 가지 사실을 반복해서 확인했습니다.
          </p>
          <p className="text-sm font-semibold leading-relaxed mb-5" style={{ color: '#111827' }}>
            아이들은 생각보다 많은 가능성을 가지고 있습니다.<br />
            다만 그 가능성이 꺼져 있는 경우가 많았습니다.
          </p>
          <ul className="space-y-2">
            {[
              '누군가는 계속 비교를 당해서',
              '누군가는 실패가 두려워서',
              '누군가는 공부가 자기 삶과 연결되지 않아서',
              '누군가는 부모의 기대를 부담으로만 느껴서.',
            ].map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#6b7280' }}>
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: '#9ca3af' }} />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed" style={{ color: '#374151' }}>
            그래서 SMIS는 아이를 억지로 끌고 가는 방식이 아니라,<br />
            <strong style={{ color: '#3f39c4' }}>아이가 자기 안에서 다시 출발점을 찾게 하는 방식</strong>을 고민했습니다.
          </p>
        </div>

        {/* 핵심 문장 카드 */}
        <div
          className="rounded-3xl px-6 py-7 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3f39c4 0%, #1e1a6e 100%)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
            style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10"
            style={{ background: '#a5b4fc', transform: 'translate(-20%, 20%)' }} />
          <p className="text-base font-bold leading-relaxed relative z-10" style={{ color: 'white' }}>
            SMIS는 아이를 바꾸겠다는 약속보다,<br />
            아이가 바뀔 수 있는 <span style={{ color: '#fbbf24' }}>조건을 설계하겠다는 약속</span>에서<br />
            시작되었습니다.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 5: 교육 철학 ──────────────────────────────────────────────────────

function PhilosophySection() {
  const cards = [
    {
      icon: '🎯',
      title: '몰입 환경',
      desc: '아이는 환경이 바뀌면 행동이 바뀝니다. SMIS는 방해 요소에서 벗어나 정해진 루틴과 목표 안에서 자연스럽게 몰입하도록 설계합니다.',
      accent: '#EEF2FF',
    },
    {
      icon: '🤝',
      title: '좋은 멘토',
      desc: '아이에게 필요한 것은 잔소리가 아니라 방향을 잡아주는 대화입니다. SMIS의 멘토는 지시보다 질문을, 비교보다 가능성을 전달합니다.',
      accent: '#ede9fe',
    },
    {
      icon: '📋',
      title: '자기주도 루틴',
      desc: '자기주도학습은 말로 생기지 않습니다. 아이가 직접 계획하고 실행하고 돌아보는 경험을 반복해야 생깁니다.',
      accent: '#fef9c3',
    },
    {
      icon: '🚀',
      title: 'AI 시대 역량',
      desc: 'AI 시대에는 정답 암기보다 생각하는 방식이 중요합니다. SMIS는 질문하고, 표현하고, 협업하고, 스스로 방향을 잡는 경험을 제공합니다.',
      accent: '#dbeafe',
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: '#EEF2FF' }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>04 · 교육 철학</p>

        <h2 className="font-extrabold leading-tight mb-12" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', color: '#111827', letterSpacing: '-0.02em' }}>
          SMIS는 아이의 변화를<br />
          <span style={{ color: '#3f39c4' }}>네 가지로 설계합니다.</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map((card, i) => (
            <div
              key={i}
              className="rounded-3xl p-6 bg-white"
              style={{ boxShadow: '0 2px 16px rgba(63,57,196,0.1)' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: card.accent }}
              >
                {card.icon}
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: '#111827' }}>{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 6: 왜 제주인가 ─────────────────────────────────────────────────────

function WhyJejuSection() {
  const changes = [
    '"나도 할 수 있네."',
    '"생각보다 내가 괜찮은 사람이네."',
    '"공부가 그냥 시켜서 하는 게 아닐 수도 있겠네."',
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>05 · 제주를 선택한 이유</p>

        <h2 className="font-extrabold leading-tight mb-8" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', color: '#111827', letterSpacing: '-0.02em' }}>
          아이를 바꾸려면,<br />
          먼저 아이가 머무는<br />
          <span style={{ color: '#3f39c4' }}>환경이 달라져야 합니다.</span>
        </h2>

        {/* 이미지 placeholder */}
        <div
          className="w-full rounded-3xl overflow-hidden mb-10 relative"
          style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #3f39c4 0%, #818cf8 100%)' }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-4xl mb-3">🏝️</p>
            <p className="font-bold text-white text-lg">제주 캠프 사진</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>실제 캠프 이미지로 교체 예정</p>
          </div>
        </div>

        <div className="rounded-3xl px-6 py-7 mb-8" style={{ background: '#f8f8ff', boxShadow: '0 2px 16px rgba(63,57,196,0.08)', border: '1px solid #e0e7ff' }}>
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#374151' }}>
            집에서는 아이가 익숙한 패턴으로 돌아가기 쉽습니다. 침대, 스마트폰, 학원 루틴, 부모의 잔소리, 반복되는 일상.
          </p>
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#374151' }}>
            제주는 단순한 여행지가 아닙니다. 아이에게는 일상에서 잠시 떨어져 자기 자신을 다시 바라볼 수 있는 공간입니다.
          </p>
          <p className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>
            낯선 환경에서 아이는 자신에 대해 다시 생각하기 시작합니다.
          </p>
          <div className="flex flex-col gap-2">
            {changes.map((item, i) => (
              <div
                key={i}
                className="rounded-xl px-4 py-3 text-sm font-medium"
                style={{ background: '#EEF2FF', color: '#3f39c4' }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl px-6 py-6" style={{ background: 'linear-gradient(135deg, #3f39c4 0%, #1e1a6e 100%)' }}>
          <p className="text-sm font-bold leading-relaxed text-white">
            SMIS가 제주를 선택한 이유는 멋진 풍경 때문만이 아닙니다.
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            아이의 일상을 끊고, 새로운 태도를 시작하게 만드는 힘이 있기 때문입니다.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 7: 드림멘토링 ──────────────────────────────────────────────────────

function MentoringSection() {
  const questions = [
    { text: '"너는 어떤 사람이 되고 싶어?"', color: '#EEF2FF', textColor: '#3f39c4' },
    { text: '"요즘 가장 어려운 건 뭐야?"', color: '#ede9fe', textColor: '#5b21b6' },
    { text: '"네가 진짜 잘하고 싶은 건 뭐야?"', color: '#dbeafe', textColor: '#1e40af' },
    { text: '"캠프가 끝났을 때 어떤 모습이면 좋겠어?"', color: '#c7d2fe', textColor: '#1e1a6e' },
  ];

  return (
    <section className="py-20 px-6" style={{ background: '#EEF2FF' }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>06 · 드림멘토링</p>

        <h2 className="font-extrabold leading-tight mb-6" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', color: '#111827', letterSpacing: '-0.02em' }}>
          아이의 변화는<br />
          <span style={{ color: '#3f39c4' }}>좋은 질문에서 시작됩니다.</span>
        </h2>

        <p className="text-sm leading-relaxed mb-10" style={{ color: '#6b7280' }}>
          SMIS의 멘토링은 아이에게 정답을 주는 시간이 아닙니다. 대신 이런 질문을 던집니다.
        </p>

        {/* 말풍선 UI */}
        <div className="flex flex-col gap-4 mb-12">
          {questions.map((q, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className="max-w-xs px-5 py-4 text-sm font-semibold leading-relaxed"
                style={{
                  background: q.color,
                  color: q.textColor,
                  borderRadius: i % 2 === 0
                    ? '4px 24px 24px 24px'
                    : '24px 4px 24px 24px',
                }}
              >
                {q.text}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl px-6 py-7 bg-white" style={{ boxShadow: '0 2px 16px rgba(63,57,196,0.1)' }}>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#374151' }}>
            아이들은 평소에 이런 질문을 받을 기회가 많지 않습니다. 성적, 숙제, 학원, 시험 이야기는 많지만 정작 자기 자신에 대해 생각할 시간은 부족합니다.
          </p>
          <p className="text-sm font-bold leading-relaxed" style={{ color: '#111827' }}>
            아이를 움직이는 건 잔소리가 아니라,<br />
            <span style={{ color: '#3f39c4' }}>자신을 믿게 만드는 한 번의 대화</span>일 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 8: 부모에게 ───────────────────────────────────────────────────────

function ParentMessageSection() {
  const wishes = [
    '아이가 조금 더 자신감을 갖는 것.',
    '공부를 자기 일로 받아들이는 것.',
    '좋은 사람들과 어울리며 자극받는 것.',
    '부모가 말하지 않아도 스스로 해보려는 마음을 갖는 것.',
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>07 · 부모님께</p>

        <h2 className="font-extrabold leading-tight mb-8" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', color: '#111827', letterSpacing: '-0.02em' }}>
          부모님이 원한 것은<br />
          단순한 캠프가<br />
          <span style={{ color: '#3f39c4' }}>아닐지도 모릅니다.</span>
        </h2>

        <div className="rounded-3xl px-6 py-7 mb-8" style={{ background: '#f8f8ff', boxShadow: '0 2px 16px rgba(63,57,196,0.08)', border: '1px solid #e0e7ff' }}>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#374151' }}>
            부모님이 진짜 바라는 것은 아이가 며칠 동안 즐겁게 지내고 오는 것만은 아닐 겁니다.
          </p>
          <div className="flex flex-col gap-3">
            {wishes.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: '#c7d2fe' }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: '#3f39c4' }} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl px-6 py-7 mb-8" style={{ background: '#f8f8ff', boxShadow: '0 2px 16px rgba(63,57,196,0.08)', border: '1px solid #e0e7ff' }}>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#374151' }}>
            SMIS는 그 마음을 알고 있습니다. 그래서 우리는 캠프를 단순한 일정표로 만들지 않았습니다.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#374151' }}>
            아침에 일어나는 순간부터, 수업을 듣고, 친구와 대화하고, 멘토와 마주하고, 하루를 돌아보는 시간까지. 모든 시간이 아이에게 하나의 메시지를 주도록 만들었습니다.
          </p>
          <p className="text-base font-bold leading-relaxed" style={{ color: '#3f39c4' }}>
            "너는 생각보다 훨씬 더 성장할 수 있는 아이야."
          </p>
        </div>

        <div className="rounded-3xl px-6 py-7" style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #dbeafe 100%)', border: '1px solid #c7d2fe' }}>
          <p className="text-sm leading-relaxed font-medium" style={{ color: '#1e1a6e' }}>
            부모님도 이미 충분히 애쓰고 있습니다.<br />
            다만 지금 아이에게는 부모의 노력만으로는 만들기 어려운<br />
            <strong>새로운 환경이 필요할 수 있습니다.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 9: SMIS 원칙 ──────────────────────────────────────────────────────

function PromiseSection() {
  const principles = [
    {
      icon: '👁️',
      title: '아이를 숫자로만 보지 않습니다',
      desc: '성적과 결과도 중요하지만, SMIS는 아이의 태도, 감정, 관계, 루틴을 함께 봅니다.',
    },
    {
      icon: '🤲',
      title: '무리한 약속을 하지 않습니다',
      desc: '"며칠 만에 완전히 바뀐다"는 말보다 아이 안에 변화의 계기를 만드는 데 집중합니다.',
    },
    {
      icon: '🛡️',
      title: '부모의 불안을 이용하지 않습니다',
      desc: '불안을 자극해 등록시키는 것이 아니라, 아이에게 실제로 필요한 환경인지 판단할 수 있게 돕습니다.',
    },
    {
      icon: '🌱',
      title: '캠프 이후를 생각합니다',
      desc: 'SMIS의 목표는 캠프 기간의 만족이 아니라, 집으로 돌아간 뒤에도 남는 변화입니다.',
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: '#EEF2FF' }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>08 · 브랜드 신뢰</p>

        <h2 className="font-extrabold leading-tight mb-12" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', color: '#111827', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#3f39c4' }}>SMIS가 지키는 원칙</span>
        </h2>

        <div className="flex flex-col gap-5">
          {principles.map((p, i) => (
            <div
              key={i}
              className="rounded-3xl px-6 py-6 flex items-start gap-4 bg-white"
              style={{ boxShadow: '0 2px 12px rgba(63,57,196,0.1)' }}
            >
              <span className="text-3xl flex-shrink-0">{p.icon}</span>
              <div>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#111827' }}>{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 10: 최종 CTA ──────────────────────────────────────────────────────

function FinalCTASection({ client }: { client: string }) {
  return (
    <section
      className="py-24 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1e1a6e 0%, #3f39c4 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: '#a5b4fc', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: '#818cf8', transform: 'translate(-30%, 30%)' }} />
      </div>

      <div className="max-w-2xl mx-auto relative z-10 text-center">
        <h2 className="font-extrabold leading-tight mb-6 text-white"
          style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', letterSpacing: '-0.02em' }}
        >
          아이의 변화는<br />
          어느 날 갑자기 오지 않습니다.<br />
          <span style={{ color: '#fbbf24' }}>
            하지만 좋은 환경을 만나는<br />
            순간, 시작될 수 있습니다.
          </span>
        </h2>

        <p className="text-sm leading-relaxed mb-12" style={{ color: 'rgba(255,255,255,0.75)' }}>
          SMIS는 아이를 억지로 바꾸려 하지 않습니다.<br />
          아이가 스스로 바뀔 수 있는 환경을 만듭니다.
        </p>

        <div className="flex flex-col gap-3 items-center">
          <Link
            href={`/${client}`}
            className="w-full max-w-xs inline-flex items-center justify-center gap-2 font-bold px-7 py-4 rounded-full transition-all duration-200 hover:scale-105 text-sm"
            style={{ background: '#fbbf24', color: '#1e1a6e' }}
          >
            캠프 프로그램 자세히 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="tel:010-6711-7933"
            className="w-full max-w-xs inline-flex items-center justify-center gap-2 font-bold px-7 py-4 rounded-full transition-all duration-200 text-sm"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <Phone className="w-4 h-4" />
            상담 신청하기
          </a>
          <a
            href="https://pf.kakao.com/_Axafxcb/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs inline-flex items-center justify-center gap-2 font-bold px-7 py-4 rounded-full transition-all duration-200 text-sm"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <MessageCircle className="w-4 h-4" />
            설명회 일정 확인하기
          </a>
        </div>

        {/* 마지막 포지셔닝 문장 */}
        <p className="mt-16 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
          SMIS는 캠프를 파는 브랜드가 아닙니다.<br />
          아이가 다시 스스로 움직일 수 있는 환경을 설계하는 교육 브랜드입니다.
        </p>
      </div>
    </section>
  );
}

// ─── 푸터 ────────────────────────────────────────────────────────────────────

function Footer({ client }: { client: string }) {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-5xl mx-auto px-8 pt-10 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-base mb-3">회사 정보</h3>
            <div className="space-y-1.5 text-sm">
              <p className="font-semibold text-white">회사명: (주)에스엠아이에스</p>
              <p>대표: 김선희</p>
              <p>법인사업자 등록번호: 427-88-03423</p>
              <p>주소: 경기 성남시 분당구 장미로 78 SMIS 312호</p>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-base mb-3">법률 문서</h3>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">서비스 이용약관</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-base mb-3">소셜 링크</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a href="https://www.youtube.com/@smiscamp" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>유튜브 채널</span><span className="text-xs">↗</span>
                </a>
              </li>
              <li>
                <a href="https://pf.kakao.com/_Axafxcb/chat" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>카카오톡 채널</span><span className="text-xs">↗</span>
                </a>
              </li>
              <li>
                <a href="https://www.smisedu.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>공식 홈페이지</span><span className="text-xs">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} (주)에스엠아이에스. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────

export default function BrandStoryPage({ params }: { params: Promise<{ client: string }> }) {
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#EEF2FF' }}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 animate-pulse"
            style={{ background: '#c7d2fe' }}>
            <span className="text-xl">✦</span>
          </div>
          <p className="text-sm" style={{ color: '#6b7280' }}>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!clientInfo) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <BrandHeader client={client} />
      <HeroSection client={client} />
      <ProblemEmpathySection />
      <AIEraSection />
      <OriginStorySection />
      <PhilosophySection />
      <WhyJejuSection />
      <MentoringSection />
      <ParentMessageSection />
      <PromiseSection />
      <FinalCTASection client={client} />
      <Footer client={client} />
      <StickyBottomBar clientId={client} />
    </div>
  );
}
