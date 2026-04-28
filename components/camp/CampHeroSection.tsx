'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CheckCircle2, Calendar, Home, Camera, ChevronRight } from 'lucide-react';
import { LOCATIONS } from '@/lib/types';

interface CampHeroSectionProps {
  camp: typeof LOCATIONS[number];
  clientId?: string;
}

const CAMP_HIGHLIGHTS: Record<string, string[]> = {
  je: [
    '영어·인문학(한국사)·STEAM 통합 교육 커리큘럼',
    '원어민 교사와 함께하는 생활 밀착형 영어',
    '24시간 담임제 안전 생활 관리',
  ],
  s: [
    '싱가포르·말레이시아 글로벌 영어 노출 환경',
    '영어·인문학(세계사)·IB 통합 교육 커리큘럼',
    '5성급 포레스트 시티 프리미엄 리조트',
  ],
  f: [
    '숙박/식사/청소/세탁 All IN ONE SYSTEM',
    '말레이시아 가족캠프 유일 영미권 원어민 수업',
    '부모님들을 힐링을 위한 양질의 프로그램 안내',
  ],
};

export default function CampHeroSection({ camp, clientId }: CampHeroSectionProps) {
  const highlights = CAMP_HIGHLIGHTS[camp.id] ?? [];

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="grid gap-6 items-start">
          {/* 캠프 이미지 */}
          <div className="relative">
            <div className="relative aspect-[2/1] rounded-2xl overflow-hidden shadow-xl bg-gray-200">
              <CampHeroImage campId={camp.id} campName={camp.name} campEmoji={camp.emoji} />
            </div>
          </div>

          {/* 캠프 정보 */}
          <div className="space-y-5">
            {/* 헤더 */}
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight mb-1">{camp.name}</h1>
              <p className="text-sm md:text-base text-blue-600 font-medium">{camp.subtitle}</p>
            </div>

            {/* 프로그램 핵심 포인트 */}
            {highlights.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                {highlights.map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-800 leading-snug">{point}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 섹션 퀵링크 */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'schedule',    label: '일정표',   icon: <Calendar className="w-5 h-5" />,  color: 'text-orange-500', bg: 'bg-orange-50' },
                { id: 'environment', label: '시설환경', icon: <Home className="w-5 h-5" />,      color: 'text-teal-500',   bg: 'bg-teal-50'   },
                { id: 'gallery',     label: '활동사진', icon: <Camera className="w-5 h-5" />,    color: 'text-yellow-500', bg: 'bg-yellow-50' },
              ].map(({ id, label, icon, color, bg }) => (
                <Link
                  key={id}
                  href={clientId ? `/${clientId}/camp/${camp.id}/${id}` : `/camp/${camp.id}/${id}`}
                  className="flex flex-col items-center gap-2 py-4 px-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 active:scale-95 transition-all duration-150"
                >
                  <div className={`${bg} ${color} rounded-lg p-2`}>
                    {icon}
                  </div>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-gray-800">
                    {label}
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  </span>
                </Link>
              ))}
            </div>

            {/* 캠프 기본 정보 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">참가 대상</div>
                <div className="font-semibold text-gray-900 text-sm">{camp.target}</div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">캠프 장소</div>
                <div className="font-semibold text-gray-900 text-sm leading-tight">{camp.location}</div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">진행 기간</div>
                <div className="font-semibold text-gray-900 text-sm whitespace-pre-line">{camp.period}</div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">참가비</div>
                <div className="font-semibold text-gray-900 text-sm whitespace-pre-line">{camp.price}</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// 캠프 대표 이미지 컴포넌트 (루트페이지와 동일한 로직)
function CampHeroImage({ campId, campName, campEmoji }: { 
  campId: string; 
  campName: string; 
  campEmoji: string; 
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  
  // 이미지 형식 우선순위: png, jpg, jpeg
  const imageFormats = ['png', 'jpg', 'jpeg'];
  
  useEffect(() => {
    const tryLoadImage = async () => {
      for (const format of imageFormats) {
        try {
          const src = `/images/camps/${campId}.${format}`;
          // 이미지 존재 여부 확인
          const response = await fetch(src, { method: 'HEAD' });
          if (response.ok) {
            setImageSrc(src);
            return;
          }
        } catch (error) {
          // 계속해서 다음 형식 시도
        }
      }
      // 모든 형식 실패 시 에러 처리
      setImageError(true);
    };
    
    tryLoadImage();
  }, [campId]);
  
  return (
    <>
      {imageSrc && !imageError ? (
        <Image
          src={imageSrc}
          alt={`${campName} 캠프 이미지`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-4xl md:text-6xl">{campEmoji}</span>
        </div>
      )}
    </>
  );
}