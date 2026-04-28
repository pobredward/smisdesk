'use client';

/**
 * 학생관리 페이지 컬러 팔레트 (브랜드 스토리 통일 — 파란색 계열)
 * Primary  : #3f39c4  (딥 인디고)
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
import { X, Plus, Phone, ArrowRight, Check, Shield, Users, Moon, Heart, AlertCircle, Clock } from 'lucide-react';
import { useClients, Client } from '@/lib/hooks/useClients';
import StickyBottomBar from '@/components/StickyBottomBar';

// ─── 헤더 ───────────────────────────────────────────────────────────────────

function ManagementHeader({ client }: { client: string }) {
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
        { label: '브랜드 스토리', href: 'brand' },
        { label: '최고의 강사진', href: 'teachers' },
        { label: '빈틈없는 학생 관리', href: 'management' },
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
                        <li key={'href' in link ? link.href : link.section}>
                          <Link
                            href={'href' in link ? `/${client}/${link.href}` : `/${client}/camp/${group.campId ?? 'je'}/${link.section}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-sm text-gray-700 hover:text-blue-600 transition-colors py-0.5 leading-tight"
                          >
                            {'label' in link ? link.label : ''}
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
        .fade-up-delay-4 { animation-delay: 0.5s; }
      `}</style>
    </>
  );
}

// ─── 섹션 1: Hero ─────────────────────────────────────────────────────────────

function HeroSection({ client }: { client: string }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1e1a6e 0%, #3f39c4 55%, #2d28a0 100%)', minHeight: '100svh' }}
    >
      {/* 배경 광원 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #818cf8 0%, transparent 70%)', transform: 'translate(20%, -20%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, #a5b4fc 0%, transparent 70%)', transform: 'translate(-20%, 20%)' }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-20 pb-32 flex flex-col justify-center min-h-screen">
        {/* 배지 */}
        <div className="fade-up mb-6">
          <span
            className="inline-block text-xs font-bold tracking-widest px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#c7d2fe', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            STUDENT MANAGEMENT
          </span>
        </div>

        {/* 페이지 서브타이틀 */}
        <p className="fade-up fade-up-delay-1 text-sm font-semibold mb-3" style={{ color: 'rgba(199,210,254,0.7)', letterSpacing: '0.05em' }}>
          빈틈없는 학생관리
        </p>

        {/* 메인 카피 */}
        <h1
          className="fade-up fade-up-delay-1 text-white font-extrabold leading-tight mb-6"
          style={{ fontSize: 'clamp(1.875rem, 7vw, 3.25rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
        >
          즐거움이<br />
          안전하려면,<br />
          <span style={{ color: '#fbbf24' }}>관리가<br />먼저입니다.</span>
        </h1>

        {/* 서브 카피 */}
        <p className="fade-up fade-up-delay-2 text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
          아무리 좋은 프로그램도 운영이 흔들리면 무너집니다.<br />
          SMIS는 학생 케어의 빈틈을 최소화하기 위해<br />
          반 운영, 생활관리, 취침점검, 건강대응까지<br />
          체계적으로 설계합니다.
        </p>

        {/* 보조 문구 */}
        <p className="fade-up fade-up-delay-3 text-xs mb-8" style={{ color: 'rgba(199,210,254,0.55)' }}>
          아이가 잘 배우는 것만큼, 잘 지내고 있는지도 중요하니까요.
        </p>

        {/* CTA 버튼 */}
        <div className="fade-up fade-up-delay-4 flex flex-col sm:flex-row gap-3">
          <a
            href="#class-operation"
            className="inline-flex items-center justify-center gap-2 font-bold px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-105 text-sm"
            style={{ background: '#fbbf24', color: '#1e1a6e' }}
          >
            학생관리 시스템 보기
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href={`/${client}`}
            className="inline-flex items-center justify-center gap-2 font-bold px-7 py-3.5 rounded-full transition-all duration-200 text-sm"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            상담 신청하기
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

// ─── 섹션 2: 부모 불안 공감 ──────────────────────────────────────────────────

function ParentConcernSection() {
  const concerns = [
    {
      icon: <Users className="w-5 h-5" />,
      text: '인원이 많으면 결국 놓치는 아이가 생기지 않을까?',
    },
    {
      icon: <Moon className="w-5 h-5" />,
      text: '밤에는 누가 아이들을 챙기지?',
    },
    {
      icon: <Heart className="w-5 h-5" />,
      text: '우리 아이가 아프면 어떻게 대응하지?',
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      text: '아이 상태가 생기면 부모에게 바로 알려줄까?',
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>01 · 부모의 마음</p>

        <h2
          className="font-extrabold leading-tight mb-5"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 2.1rem)', color: '#111827', letterSpacing: '-0.02em' }}
        >
          학부모님이 안심하고 싶은 건<br />
          결국 <span style={{ color: '#3f39c4' }}>'아이를 놓치지 않는 구조'</span>입니다.
        </h2>

        <p className="text-sm leading-relaxed mb-8" style={{ color: '#6b7280' }}>
          캠프를 선택할 때 부모가 가장 중요하게 보는 건<br />
          화려한 일정이 아니라 아이를 얼마나 세심하게 관리하느냐입니다.
        </p>

        <div className="flex flex-col gap-3 mb-10">
          {concerns.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl px-5 py-4"
              style={{ background: '#EEF2FF', boxShadow: '0 2px 8px rgba(63,57,196,0.08)' }}
            >
              <div
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: '#c7d2fe', color: '#3f39c4' }}
              >
                {item.icon}
              </div>
              <p className="text-sm leading-relaxed font-medium" style={{ color: '#374151' }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* 강조 박스 */}
        <div
          className="rounded-3xl px-6 py-7"
          style={{ background: '#1e1a6e', boxShadow: '0 4px 20px rgba(30,26,110,0.2)' }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(199,210,254,0.9)' }}>
            이런 질문들은 모두
          </p>
          <p className="text-base font-bold mt-2 leading-snug" style={{ color: '#fbbf24' }}>
            "누가 책임지고, 어떤 구조로,<br />얼마나 촘촘하게 보느냐"에 달려 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 3: SMIS 관리 철학 ───────────────────────────────────────────────────

function SMISAnswerSection() {
  const points = [
    '누가 누구를 맡는지',
    '몇 명을 관리하는지',
    '어떤 시간에 무엇을 점검하는지',
    '이상 상황이 생기면 누구에게 공유되는지',
  ];

  return (
    <section className="py-20 px-6" style={{ background: '#EEF2FF' }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>02 · SMIS의 답</p>

        <h2
          className="font-extrabold leading-tight mb-7"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 2.1rem)', color: '#111827', letterSpacing: '-0.02em' }}
        >
          SMIS는 <span style={{ color: '#3f39c4' }}>'많이 신경 씁니다'</span>가 아니라,<br />
          신경 쓸 수밖에 없는<br />구조를 만듭니다.
        </h2>

        <p className="text-sm leading-relaxed mb-8" style={{ color: '#374151' }}>
          SMIS의 학생관리는 선생님의 개인적인 성실함에만 기대지 않습니다.
        </p>

        <div className="flex flex-col gap-3 mb-8">
          {points.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5"
              style={{ background: 'white', boxShadow: '0 1px 8px rgba(63,57,196,0.08)' }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#c7d2fe' }}
              >
                <Check className="w-3.5 h-3.5" style={{ color: '#3f39c4' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#111827' }}>{item}</p>
            </div>
          ))}
        </div>

        <p className="text-sm leading-relaxed mb-7" style={{ color: '#374151' }}>
          SMIS는 <strong style={{ color: '#111827' }}>"관리해 주세요"가 아니라</strong><br />
          "관리되도록 운영 구조를 만든다"는 점이 핵심입니다.
        </p>

        {/* 강조 문구 */}
        <div
          className="rounded-3xl px-6 py-6"
          style={{ background: '#fbbf24' }}
        >
          <p className="text-base font-bold leading-relaxed" style={{ color: '#1e1a6e' }}>
            좋은 관리는 마음만으로 되지 않습니다.<br />
            <span className="text-sm font-medium" style={{ color: 'rgba(30,26,110,0.75)' }}>책임 구조, 동선, 보고 체계가 있어야 완성됩니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 4: Golden Key 2 – 반 운영 시스템 ───────────────────────────────────

function ClassOperationSection() {
  const roles = [
    {
      title: 'Group 매니저',
      badge: 'MANAGER',
      description: 'Group 멘토 관리 및 학생 총괄 관리',
      details: ['그룹 단위 운영 총괄', '그룹 내 담임 멘토 관리', '학생 전반 이슈 파악', '운영진과의 빠른 연결'],
      color: '#1e1a6e',
      badgeColor: '#fbbf24',
    },
    {
      title: '반 담임선생님',
      badge: 'CLASS TEACHER',
      description: '10명 내외 학생 전담 케어',
      details: ['생활, 태도, 적응, 분위기 관리', '아이 상태를 가장 가까이서 확인', '학부모 연결 시 1차 창구'],
      color: '#3f39c4',
      badgeColor: '#c7d2fe',
    },
    {
      title: '수업 멘토',
      badge: 'CLASS MENTOR',
      description: '그룹별 영어 수업 진행',
      details: ['수업 참여도·집중도·태도 확인', '필요 사항을 반 운영에 연결'],
      color: '#4f46e5',
      badgeColor: '#e0e7ff',
    },
  ];

  return (
    <section id="class-operation" className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Golden Key 배지 */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full" style={{ background: '#1e1a6e' }}>
          <span className="text-lg">🔑</span>
          <span className="text-xs font-bold tracking-widest" style={{ color: '#fbbf24' }}>GOLDEN KEY 2</span>
        </div>

        <h2
          className="font-extrabold leading-tight mb-4"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 2.1rem)', color: '#111827', letterSpacing: '-0.02em' }}
        >
          '체계적인'<br />
          반 운영 &amp; 관리 시스템
        </h2>

        <p className="text-sm leading-relaxed mb-10" style={{ color: '#6b7280' }}>
          학생이 많아질수록 중요한 것은 더 많은 관리가 아니라<br />
          더 명확한 책임 구조입니다.<br />
          SMIS는 그룹 단위, 반 단위, 멘토 단위로 역할을 나누어<br />
          학생관리의 빈틈을 줄입니다.
        </p>

        {/* 역할 카드 */}
        <div className="flex flex-col gap-4 mb-8">
          {roles.map((role, i) => (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 16px rgba(63,57,196,0.12)' }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ background: role.color }}>
                <div>
                  <span className="text-xs font-bold tracking-widest px-2 py-0.5 rounded-full mr-2" style={{ background: role.badgeColor, color: role.color }}>{role.badge}</span>
                  <span className="text-base font-bold text-white mt-1 block">{role.title}</span>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="px-5 py-4 bg-white">
                <p className="text-sm font-semibold mb-3" style={{ color: '#374151' }}>{role.description}</p>
                <ul className="space-y-1.5">
                  {role.details.map((d, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm" style={{ color: '#6b7280' }}>
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: '#fbbf24' }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 핵심 문구 */}
        <div
          className="rounded-2xl px-5 py-5"
          style={{ background: '#EEF2FF', border: '1px solid #e0e7ff' }}
        >
          <p className="text-sm leading-relaxed font-medium" style={{ color: '#1e1a6e' }}>
            각 학생은 단순히 "전체 학생 중 한 명"으로 존재하지 않습니다.<br />
            SMIS에서는 <strong>그룹 → 반 → 담임 → 수업멘토</strong>로 이어지는<br />
            구조 안에서 관리됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 5: Group 구조 ───────────────────────────────────────────────────────

function GroupStructureSection() {
  const groups = [
    { name: 'Group 1', classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4'] },
    { name: 'Group 2', classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4'] },
    { name: 'Group 3', classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4'] },
  ];

  return (
    <section className="py-20 px-6" style={{ background: '#1e1a6e' }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#fbbf24' }}>03 · 그룹 구성</p>

        <h2
          className="font-extrabold leading-tight mb-5"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 2.1rem)', color: 'white', letterSpacing: '-0.02em' }}
        >
          학생이 많아도,<br />
          <span style={{ color: '#fbbf24' }}>관리의 기준은<br />더 촘촘해집니다.</span>
        </h2>

        <p className="text-sm leading-relaxed mb-10" style={{ color: 'rgba(199,210,254,0.75)' }}>
          각 Group마다 Group 매니저가 배치되고, 그 아래 Class 1~4가 구성됩니다.<br />
          각 반은 약 10명 내외 학생과 담임선생님 1명으로 운영되며,<br />
          Group마다 영어 수업멘토가 함께합니다.
        </p>

        {/* Group 카드 */}
        <div className="flex flex-col gap-4 mb-8">
          {groups.map((group, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              {/* Group 헤더 */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ background: '#fbbf24' }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-base" style={{ color: '#1e1a6e' }}>{group.name}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(30,26,110,0.15)', color: '#1e1a6e' }}>매니저 1명</span>
                </div>
                <span className="text-xs font-semibold" style={{ color: 'rgba(30,26,110,0.6)' }}>영어 수업멘토 배치</span>
              </div>
              {/* Class 목록 */}
              <div
                className="px-5 py-4 grid grid-cols-2 gap-2"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                {group.classes.map((cls, j) => (
                  <div
                    key={j}
                    className="rounded-lg px-3 py-2.5 flex items-center gap-2"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#fbbf24' }} />
                    <div>
                      <p className="text-xs font-bold text-white">{cls}</p>
                      <p className="text-xs" style={{ color: 'rgba(199,210,254,0.55)' }}>약 10명 · 담임 1명</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 강조 문구 */}
        <div
          className="rounded-2xl px-5 py-5"
          style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)' }}
        >
          <p className="text-xs font-bold mb-1" style={{ color: '#fbbf24' }}>그룹 배정 기준</p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            입소 전 사전 설문조사, 입소 후 레벨테스트 결과,<br />
            성별, 나이를 종합적으로 고려해 이루어집니다.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 6: Golden Key 3 – 방 관리 시스템 ───────────────────────────────────

function DormitorySection() {
  const roomInfo = [
    { label: '학생 방', value: '3~4인 1실', icon: '🛏️' },
    { label: '교사 방', value: '2인 1실', icon: '👨‍🏫' },
    { label: '선생님 담당', value: '약 8명의 방 학생 관리', icon: '👁️' },
    { label: '복도 당번', value: '22:30까지 상주', icon: '🌙' },
  ];

  return (
    <section className="py-20 px-6" style={{ background: '#f8f8ff' }}>
      <div className="max-w-2xl mx-auto">
        {/* Golden Key 배지 */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full" style={{ background: '#1e1a6e' }}>
          <span className="text-lg">🔑</span>
          <span className="text-xs font-bold tracking-widest" style={{ color: '#fbbf24' }}>GOLDEN KEY 3</span>
        </div>

        <h2
          className="font-extrabold leading-tight mb-4"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 2.1rem)', color: '#111827', letterSpacing: '-0.02em' }}
        >
          '빈틈없는'<br />
          방 관리 시스템
        </h2>

        <p className="text-sm leading-relaxed mb-10" style={{ color: '#6b7280' }}>
          학생관리는 수업 시간에만 끝나지 않습니다.<br />
          SMIS는 기숙·생활 공간에서도 아이들이 안정적으로<br />
          생활할 수 있도록 방 배치와 취침 점검까지 체계적으로 운영합니다.
        </p>

        {/* 방 구조 카드 */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {roomInfo.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl px-4 py-5 flex flex-col gap-2"
              style={{ background: '#1e1a6e', boxShadow: '0 4px 16px rgba(30,26,110,0.2)' }}
            >
              <span className="text-2xl">{item.icon}</span>
              <p className="text-xs font-semibold" style={{ color: 'rgba(199,210,254,0.6)' }}>{item.label}</p>
              <p className="text-sm font-bold text-white leading-tight">{item.value}</p>
            </div>
          ))}
        </div>

        {/* 강조 문구 */}
        <div
          className="rounded-3xl px-6 py-6"
          style={{ background: '#fbbf24' }}
        >
          <p className="text-sm font-bold leading-relaxed" style={{ color: '#1e1a6e' }}>
            기숙 생활은 자유롭게, 관리는 촘촘하게 운영합니다.<br />
            <span className="font-medium text-xs" style={{ color: 'rgba(30,26,110,0.7)' }}>밤 시간이야말로 관리의 진짜 실력이 드러나는 시간입니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 7: 취침 점검 ────────────────────────────────────────────────────────

function NightCheckSection() {
  const checks = [
    {
      step: '1차 점검',
      time: '09:00 ~ 09:40',
      items: ['방별 기본 위생점검', '건강 및 전반적 상태 확인'],
    },
    {
      step: '2차 점검',
      time: '10:00 ~ 10:40',
      items: ['최종 취침점검 및 확인', '개별 학습 수행 학생들 취침 여부 확인'],
    },
    {
      step: '3차 점검',
      time: '11:00 ~ 11:15',
      items: ['최종 온도 점검 및 안전관리'],
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: '#EEF2FF' }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>04 · 취침 관리</p>

        <h2
          className="font-extrabold leading-tight mb-5"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 2.1rem)', color: '#111827', letterSpacing: '-0.02em' }}
        >
          아이의 하루는<br />
          취침 점검까지 관리됩니다.
        </h2>

        <p className="text-sm leading-relaxed mb-10" style={{ color: '#374151' }}>
          SMIS는 3단계 취침 점검 시스템으로<br />
          아이들이 안전하게 잠들 수 있도록 확인합니다.
        </p>

        {/* 취침 점검 타임라인 */}
        <div className="relative flex flex-col gap-0 mb-8">
          {checks.map((check, i) => (
            <div key={i} className="relative flex gap-4">
              {/* 타임라인 세로선 + 원 */}
              <div className="flex flex-col items-center flex-shrink-0 w-8">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs flex-shrink-0 z-10"
                  style={{ background: '#3f39c4', color: 'white' }}
                >
                  {i + 1}
                </div>
                {i < checks.length - 1 && (
                  <div className="w-0.5 flex-1 my-1" style={{ background: 'rgba(63,57,196,0.2)', minHeight: '24px' }} />
                )}
              </div>
              {/* 카드 */}
              <div
                className="flex-1 rounded-2xl px-5 py-4 mb-4"
                style={{ background: 'white', boxShadow: '0 2px 12px rgba(63,57,196,0.08)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-extrabold" style={{ color: '#1e1a6e' }}>{check.step}</p>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                    style={{ background: '#1e1a6e', color: '#fbbf24' }}
                  >
                    <Clock className="w-3 h-3" />
                    {check.time}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {check.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm" style={{ color: '#374151' }}>
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: '#fbbf24' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 강조 */}
        <div
          className="rounded-2xl px-5 py-5"
          style={{ background: '#1e1a6e' }}
        >
          <p className="text-sm font-bold leading-relaxed text-white">
            SMIS의 관리는 수업실에서 끝나지 않고,<br />
            <span style={{ color: '#fbbf24' }}>아이가 잠드는 순간까지 이어집니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 8: 건강/환자 관리 ───────────────────────────────────────────────────

function HealthManagementSection() {
  const symptoms = [
    {
      icon: '🤧',
      title: '감기 / 발열',
      subtitle: '콧물, 인후통, 기침',
      steps: [
        '체온 체크 및 증상 확인',
        '증상 약 복용',
        '반나절 이상 차도 없을 시 병원 내원',
      ],
    },
    {
      icon: '🤢',
      title: '설사 및 복통',
      subtitle: '소화기 증상',
      steps: [
        '해당 증상 약 복용',
        '반나절 이상 차도 없을 시 병원 내원',
      ],
    },
    {
      icon: '🦴',
      title: '정형외과 증상',
      subtitle: '뼈·근육 이상',
      steps: [
        '파스, 근육이완제 처방',
        '반나절 이상 차도 없을 시 내원',
        '운영진 판단 시 즉시 병원 내원',
      ],
    },
    {
      icon: '🏥',
      title: '기타',
      subtitle: '치과 · 안과 · 피부과',
      steps: [
        '부모님과 상의 후 내원 여부 결정',
      ],
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>05 · 건강 관리</p>

        <h2
          className="font-extrabold leading-tight mb-4"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 2.1rem)', color: '#111827', letterSpacing: '-0.02em' }}
        >
          아프면 더 빨리,<br />
          더 정확하게 대응합니다.
        </h2>

        <p className="text-sm leading-relaxed mb-10" style={{ color: '#6b7280' }}>
          캠프 기간 중 아이의 건강 이상은<br />
          감이 아니라 프로토콜로 대응해야 합니다.<br />
          SMIS는 증상별 대응 기준과 보고 절차를 마련해<br />
          빠르고 일관되게 관리합니다.
        </p>

        <div className="flex flex-col gap-4 mb-8">
          {symptoms.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 2px 12px rgba(63,57,196,0.08)' }}
            >
              <div
                className="flex items-center gap-3 px-5 py-3"
                style={{ background: '#3f39c4' }}
              >
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{s.title}</p>
                  <p className="text-xs" style={{ color: 'rgba(199,210,254,0.7)' }}>{s.subtitle}</p>
                </div>
              </div>
              <div className="px-5 py-4 bg-white">
                <ul className="space-y-2">
                  {s.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm" style={{ color: '#374151' }}>
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                        style={{ background: '#EEF2FF', color: '#3f39c4' }}
                      >
                        {j + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 상비약 신뢰 문구 */}
        <div
          className="rounded-2xl px-5 py-5"
          style={{ background: '#f8f8ff', border: '1px solid #e0e7ff' }}
        >
          <p className="text-xs font-bold mb-2" style={{ color: '#3f39c4' }}>상비약 &amp; 보호자 안내</p>
          <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
            각 증상별 상비약은 캠프 측에 구비되어 있으며,<br />
            병원 내원 후에는 부모님께 진료 결과 및<br />
            의사 소견을 <strong style={{ color: '#111827' }}>개별 안내</strong>드립니다.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 9: 환자 관리 4단계 프로세스 ────────────────────────────────────────

function HealthProcessSection() {
  const steps = [
    {
      num: '01',
      title: '병원 내원 및 진료 결과 안내',
      desc: '병원 내원 후 진료 결과와 처방 내용을 학부모님께 개별 안내',
    },
    {
      num: '02',
      title: '복용법 전달',
      desc: '담당 선생님이 처방 약의 복용 방법과 일정을 학생에게 전달',
    },
    {
      num: '03',
      title: '시간대별 약 복용 후 보고',
      desc: '시간대별 약 복용 여부를 환자 관리 톡에 보고하여 공유',
    },
    {
      num: '04',
      title: '체온 체크 및 경과 보고',
      desc: '필요 시 1시간 간격으로 체온 체크 후 경과 상황을 보고',
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: '#1e1a6e' }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#fbbf24' }}>06 · 대응 절차</p>

        <h2
          className="font-extrabold leading-tight mb-10"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 2.1rem)', color: 'white', letterSpacing: '-0.02em' }}
        >
          이상 상황이 생기면,<br />
          <span style={{ color: '#fbbf24' }}>이렇게 관리합니다.</span>
        </h2>

        {/* 4단계 프로세스 */}
        <div className="flex flex-col gap-3 mb-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="rounded-2xl px-5 py-5 flex items-start gap-4"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(199,210,254,0.15)' }}
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm"
                style={{ background: '#fbbf24', color: '#1e1a6e' }}
              >
                {step.num}
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">{step.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(199,210,254,0.65)' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 보조 설명 */}
        <div
          className="rounded-2xl px-5 py-5"
          style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)' }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            일과 후 환자 관리는 필요 시 담당 방 멘토 선생님이<br />
            시간대별로 관리하며, 처방약 복용 후에는<br />
            환자 관리 특방에 완료 보고합니다.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 10: 실시간 공유 체계 ───────────────────────────────────────────────

function RealtimeSharingSection() {
  const cards = [
    {
      icon: '📋',
      title: '체계적인 시스템화',
      items: [
        '상황별 대처방안 정리',
        '환자 대처 방안 문서화',
        '증상에 따른 대응 기준 명확화',
        '복약, 경과, 보고 흐름 정리',
      ],
    },
    {
      icon: '📡',
      title: '실시간 현황 공유',
      items: [
        '현재 상태 실시간 공유',
        '약 복용 여부 보고',
        '회복 경과 공유',
        '복귀 가능 여부 판단',
      ],
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: '#EEF2FF' }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>07 · 공유 체계</p>

        <h2
          className="font-extrabold leading-tight mb-5"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 2.1rem)', color: '#111827', letterSpacing: '-0.02em' }}
        >
          학생 상태는 한 사람만<br />
          아는 것이 아니라,<br />
          필요한 사람이 함께 공유합니다.
        </h2>

        <p className="text-sm leading-relaxed mb-8" style={{ color: '#374151' }}>
          학생 건강 이슈는 놓치지 않기 위해<br />
          보고 체계와 공유 체계가 동시에 작동해야 합니다.<br />
          SMIS는 개별 선생님의 기억에 맡기지 않고<br />
          운영진과 담당자가 함께 확인할 수 있도록 시스템화합니다.
        </p>

        <div className="flex flex-col gap-4 mb-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 2px 12px rgba(63,57,196,0.1)' }}
            >
              <div className="flex items-center gap-3 px-5 py-3" style={{ background: '#3f39c4' }}>
                <span className="text-xl">{card.icon}</span>
                <p className="text-sm font-bold text-white">{card.title}</p>
              </div>
              <div className="px-5 py-4 bg-white">
                <ul className="space-y-1.5">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm" style={{ color: '#374151' }}>
                      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: '#fbbf24' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 강조 문구 */}
        <div
          className="rounded-2xl px-5 py-5"
          style={{ background: '#1e1a6e', boxShadow: '0 2px 16px rgba(63,57,196,0.2)' }}
        >
          <p className="text-sm font-bold text-white leading-relaxed">
            "괜찮아 보입니다"가 아니라,<br />
            <span style={{ color: '#fbbf24' }}>언제 어떤 약을 복용했고 현재 상태가 어떤지까지 공유합니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 11: 학생관리 실제 범위 ─────────────────────────────────────────────

function StudentCareScopeSection() {
  const scopes = [
    {
      icon: '🏃',
      title: '생활 관리',
      items: ['기상, 이동, 식사, 생활 태도', '방 정리와 기본 생활 습관', '시간 준수와 공동생활 규칙'],
    },
    {
      icon: '📚',
      title: '반 운영 관리',
      items: ['담임 중심 반 분위기 운영', '학생 적응도 확인', '친구 관계, 분위기, 참여 태도 파악'],
    },
    {
      icon: '🌙',
      title: '방 관리',
      items: ['취침 전 점검', '컨디션 및 위생 상태 확인', '야간 생활 안정 관리'],
    },
    {
      icon: '💊',
      title: '건강 관리',
      items: ['증상별 대응', '상비약 및 병원 내원 프로토콜', '부모 안내 및 실시간 공유'],
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#3f39c4' }}>08 · 관리 범위</p>

        <h2
          className="font-extrabold leading-tight mb-5"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 2.1rem)', color: '#111827', letterSpacing: '-0.02em' }}
        >
          SMIS의 학생관리는<br />
          단순 인솔이 아니라<br />
          <span style={{ color: '#3f39c4' }}>하루 전체를 보는 일</span>입니다.
        </h2>

        <p className="text-sm leading-relaxed mb-10" style={{ color: '#6b7280' }}>
          수업 시간만 관리하는 캠프가 아니라, 하루 전체를 살피는 캠프입니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scopes.map((scope, i) => (
            <div
              key={i}
              className="rounded-2xl px-5 py-5"
              style={{
                background: i % 2 === 0 ? '#f8f8ff' : '#EEF2FF',
                border: '1px solid #e0e7ff',
                boxShadow: '0 2px 12px rgba(63,57,196,0.06)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{scope.icon}</span>
                <p className="text-sm font-extrabold" style={{ color: '#1e1a6e' }}>{scope.title}</p>
              </div>
              <ul className="space-y-1.5">
                {scope.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs" style={{ color: '#6b7280' }}>
                    <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: '#fbbf24' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 12: 최종 CTA ────────────────────────────────────────────────────────

function FinalCTASection({ client }: { client: string }) {
  return (
    <section
      className="py-24 px-6"
      style={{ background: 'linear-gradient(160deg, #1e1a6e 0%, #3f39c4 55%, #2d28a0 100%)' }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest"
          style={{ background: 'rgba(255,255,255,0.12)', color: '#c7d2fe', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          SMIS STUDENT MANAGEMENT
        </div>

        <h2
          className="font-extrabold leading-tight mb-5 text-white"
          style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', letterSpacing: '-0.02em' }}
        >
          우리 아이를 맡기는 일,<br />
          <span style={{ color: '#fbbf24' }}>관리 시스템까지<br />확인해보세요.</span>
        </h2>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
          SMIS는 학생을 많이 관리한다고 말하지 않습니다.<br />
          누가, 어떻게, 언제, 어떤 기준으로 아이를 살피는지 보여드립니다.
        </p>

        <p className="text-xs mb-10" style={{ color: 'rgba(199,210,254,0.5)' }}>
          SMIS의 학생관리는 '잘 챙기겠습니다'라는 말이 아니라,<br />
          놓치지 않도록 설계된 운영 시스템입니다.
        </p>

        <div className="flex flex-col gap-3 items-center">
          <Link
            href={`/${client}`}
            className="w-full max-w-sm inline-flex items-center justify-center gap-2 font-bold px-7 py-4 rounded-full transition-all duration-200 hover:scale-105 text-sm"
            style={{ background: '#fbbf24', color: '#1e1a6e' }}
          >
            캠프 프로그램 보기
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://pf.kakao.com/_Axafxcb/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-sm inline-flex items-center justify-center gap-2 font-bold px-7 py-4 rounded-full transition-all duration-200 text-sm"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            카카오톡 문의
          </a>
          <a
            href="tel:010-6711-7933"
            className="w-full max-w-sm inline-flex items-center justify-center gap-2 font-bold px-7 py-4 rounded-full transition-all duration-200 text-sm"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <Phone className="w-4 h-4" />
            전화 상담
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── 푸터 ─────────────────────────────────────────────────────────────────────

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

export default function ManagementPage({ params }: { params: Promise<{ client: string }> }) {
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
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 animate-pulse"
            style={{ background: '#c7d2fe' }}
          >
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
      <ManagementHeader client={client} />
      <HeroSection client={client} />
      <ParentConcernSection />
      <SMISAnswerSection />
      <ClassOperationSection />
      <GroupStructureSection />
      <DormitorySection />
      <NightCheckSection />
      <HealthManagementSection />
      <HealthProcessSection />
      <RealtimeSharingSection />
      <StudentCareScopeSection />
      <FinalCTASection client={client} />
      <Footer client={client} />
      <StickyBottomBar clientId={client} />
    </div>
  );
}
