'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, DollarSign } from 'lucide-react';
import { LOCATIONS } from '@/lib/types';

interface CampHeroSectionProps {
  camp: typeof LOCATIONS[number];
}

export default function CampHeroSection({ camp }: CampHeroSectionProps) {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* 캠프 정보 */}
          <div className="space-y-6">
            {/* 헤더 */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl md:text-6xl">{camp.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900">{camp.name}</h1>
                  <p className="text-lg md:text-xl text-gray-600 mt-1">{camp.subtitle}</p>
                </div>
              </div>
            </div>
            
            {/* 설명 */}
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              {camp.description}
            </p>

            {/* 캠프 기본 정보 - 심플한 디자인 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-500">참가 대상</div>
                    <div className="font-semibold text-gray-900">{camp.target}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-500">캠프 장소</div>
                    <div className="font-semibold text-gray-900">{camp.location}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-500">진행 기간</div>
                    <div className="font-semibold text-gray-900 text-sm whitespace-pre-line">{camp.period}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-500">참가비</div>
                    <div className="font-semibold text-gray-900 text-sm whitespace-pre-line">{camp.price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 캠프 이미지 - 심플한 디자인 */}
          <div className="relative order-first lg:order-last">
            <div className="relative aspect-[16/10] md:aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-gray-200">
              <CampHeroImage campId={camp.id} campName={camp.name} campEmoji={camp.emoji} />
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