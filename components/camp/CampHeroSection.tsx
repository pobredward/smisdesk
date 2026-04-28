'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, DollarSign, Phone, CheckCircle2 } from 'lucide-react';
import { LOCATIONS } from '@/lib/types';

interface CampHeroSectionProps {
  camp: typeof LOCATIONS[number];
  clientId?: string;
}

const CAMP_HIGHLIGHTS: Record<string, string[]> = {
  je: [
    '영어·인문학·STEAM 통합 교육 커리큘럼',
    '원어민 교사와 함께하는 생활 밀착형 영어',
    '24시간 담임제 안전 생활 관리',
  ],
  s: [
    '싱가포르·말레이시아 현지 글로벌 환경',
    '영어·STEAM·드림멘토링 통합 프로그램',
    '포레스트 시티 리조트 프리미엄 숙소',
  ],
  f: [
    '온 가족이 함께하는 한 달 살기 경험',
    '아이·부모 분리 운영으로 각자 성장',
    '라마다 호텔 숙박 · 가족 단위 케어',
  ],
};

export default function CampHeroSection({ camp, clientId }: CampHeroSectionProps) {
  const highlights = CAMP_HIGHLIGHTS[camp.id] ?? [];

  const handleConsultClick = () => {
    const phoneNumber = '010-3179-4282';
    window.location.href = `tel:${phoneNumber}`;
  };

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
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{camp.emoji}</span>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">{camp.name}</h1>
                  <p className="text-sm md:text-base text-blue-600 font-medium mt-0.5">{camp.subtitle}</p>
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">{camp.description}</p>
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

            {/* 캠프 기본 정보 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">참가 대상</div>
                    <div className="font-semibold text-gray-900 text-sm">{camp.target}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">캠프 장소</div>
                    <div className="font-semibold text-gray-900 text-sm leading-tight">{camp.location}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">진행 기간</div>
                    <div className="font-semibold text-gray-900 text-sm whitespace-pre-line">{camp.period}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">참가비</div>
                    <div className="font-semibold text-gray-900 text-sm whitespace-pre-line">{camp.price}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 상담 신청 CTA */}
            <button
              onClick={handleConsultClick}
              className="w-full flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-base"
            >
              <Phone className="w-4 h-4" />
              지금 바로 상담 신청하기
            </button>
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