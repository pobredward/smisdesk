'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Plus, X, Phone } from 'lucide-react';

const DRAWER_MENU = [
  {
    title: 'SMIS란',
    campId: null,
    links: [
      { label: '브랜드 스토리', section: 'brand', href: 'brand' as const },
      { label: '최고의 강사진', section: 'teachers', href: 'teachers' as const },
      { label: '빈틈없는 학생 관리', section: 'management', href: 'management' as const },
    ],
  },
  {
    title: '프리미엄 제주캠프',
    campId: 'je',
    links: [
      { label: '일정표 + 프로그램', section: 'schedule' },
      { label: '시설 + 환경 소개', section: 'environment' },
      { label: '사진 및 영상', section: 'gallery' },
    ],
  },
  {
    title: '싱가포르&말레이시아 주니어 캠프',
    campId: 's',
    links: [
      { label: '일정표 + 프로그램', section: 'schedule' },
      { label: '시설 + 환경 소개', section: 'environment' },
      { label: '사진 및 영상', section: 'gallery' },
    ],
  },
  {
    title: '말레이시아 가족캠프',
    campId: 'f',
    links: [
      { label: '일정표 + 프로그램', section: 'schedule' },
      { label: '시설 + 환경 소개', section: 'environment' },
      { label: '사진 및 영상', section: 'gallery' },
    ],
  },
];

interface CampHeaderProps {
  clientId: string;
  campId: string;
  campName: string;
  contactPhone?: string;
}

export default function CampHeader({ clientId, campId, campName, contactPhone }: CampHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 드로어 열릴 때 body 스크롤 잠금
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleConsult = () => {
    window.location.href = `tel:${contactPhone || '010-6711-7933'}`;
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">

            {/* 좌측: 로고 + 캠프명 */}
            <Link
              href={`/${clientId}`}
              className="flex items-center gap-2.5 min-w-0"
            >
              <Image
                src="/logo-circle-blue.png"
                alt="SMIS 로고"
                width={32}
                height={32}
                className="w-8 h-8 flex-shrink-0 object-contain"
              />
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm leading-tight">SMIS</p>
                <p className="text-xs text-gray-400 leading-tight truncate">
                  {campId === 'je' ? '프리미엄 제주캠프'
                    : campId === 's' ? '싱가포르&말레이시아 주니어 캠프'
                    : campId === 'f' ? '말레이시아 가족캠프'
                    : campName.replace('SMIS ', '')}
                </p>
              </div>
            </Link>

            {/* 우측: 메뉴 토글 버튼 */}
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

        {/* 드롭다운 패널 — 헤더 바로 아래 */}
        {isMenuOpen && (
          <div
            className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl rounded-b-2xl overflow-y-auto"
            style={{ maxHeight: 'calc(100dvh - 56px)', animation: 'dropDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className="max-w-lg mx-auto px-4 py-5">
              <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                {DRAWER_MENU.map((group) => {
                  const resolvedCampId = group.campId ?? campId;
                  return (
                    <div key={group.title}>
                      <p className="text-xs font-semibold text-gray-400 mb-2 leading-tight">{group.title}</p>
                      <div className="border-t border-gray-100 mb-2" />
                      <ul className="space-y-2">
                        {group.links.map((link) => (
                          <li key={link.section}>
                            <Link
                              href={'href' in link ? `/${clientId}/${link.href}` : `/${clientId}/camp/${resolvedCampId}/${link.section}`}
                              onClick={() => setIsMenuOpen(false)}
                              className="block text-sm text-gray-700 hover:text-blue-600 transition-colors py-0.5 leading-tight"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* 상담 신청 버튼 */}
              {/* <button
                onClick={() => { setIsMenuOpen(false); handleConsult(); }}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-md"
              >
                <Phone className="w-4 h-4" />
                지금 바로 상담 신청하기
              </button> */}
            </div>
          </div>
        )}
      </nav>

      {/* 외부 클릭 닫기 레이어 */}
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
      `}</style>
    </>
  );
}
