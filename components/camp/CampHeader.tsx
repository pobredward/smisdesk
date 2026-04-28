'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Plus, X, Phone } from 'lucide-react';
import { CAMP_SECTIONS } from '@/components/camp/CampSectionButtons';

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
    window.location.href = `tel:${contactPhone || '010-3179-4282'}`;
  };

  // 캠프명 짧게 표기 (모바일)
  const shortName = campName.replace('SMIS ', '').replace(' 주니어캠프', '').replace('캠프', '').trim();

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <span className="hidden sm:block font-bold text-gray-900 text-sm md:text-base leading-tight truncate">
                  {campName}
                </span>
                <span className="block sm:hidden font-bold text-gray-900 text-sm leading-tight truncate">
                  {shortName}
                </span>
                <span className="text-xs text-gray-400 leading-tight hidden sm:block">SMIS 캠프</span>
              </div>
            </Link>

            {/* 우측: + 버튼 + 상담 신청 CTA */}
            <div className="flex items-center gap-2">
              {/* + / X 토글 버튼 */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-gray-300 hover:border-blue-500 flex items-center justify-center transition-all duration-200 text-gray-700 hover:text-blue-600"
              >
                {isMenuOpen
                  ? <X className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                  : <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                }
              </button>

              {/* CTA — 상담 신청 */}
              <button
                onClick={handleConsult}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm px-4 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="hidden sm:inline">상담 신청</span>
                <span className="inline sm:hidden">상담</span>
                <span className="text-xs">→</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 드로어 오버레이 */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* 배경 딤 */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* 드로어 패널 — 하단에서 슬라이드업 */}
          <div
            className="relative bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto"
            style={{ animation: 'slideUpDrawer 0.25s ease-out' }}
          >
            {/* 드래그 핸들 */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* 드로어 헤더 */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">상세 정보 바로가기</h2>
                <p className="text-xs text-gray-500 mt-0.5">궁금한 항목을 선택하세요</p>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="닫기"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* 섹션 리스트 */}
            <div className="p-4 pb-10">
              <div className="grid grid-cols-2 gap-2.5">
                {CAMP_SECTIONS.map((section) => (
                  <Link
                    key={section.id}
                    href={`/${clientId}/camp/${campId}/${section.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 ${section.bgColor} border rounded-xl p-3.5 transition-all duration-200 hover:shadow-md active:scale-95`}
                  >
                    <div className={`${section.color} flex-shrink-0`}>
                      <div className="w-5 h-5">{section.icon}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm leading-tight">{section.label}</div>
                      <div className="text-xs text-gray-500 leading-tight mt-0.5 line-clamp-1">{section.description}</div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 드로어 내 상담 신청 버튼 */}
              <button
                onClick={() => { setIsMenuOpen(false); handleConsult(); }}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-md"
              >
                <Phone className="w-4 h-4" />
                지금 바로 상담 신청하기
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUpDrawer {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
