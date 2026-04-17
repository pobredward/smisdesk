'use client';

import { LocationType } from '@/lib/types';

interface CampHeroCardProps {
  camp: {
    id: LocationType;
    name: string;
    emoji: string;
    subtitle: string;
    description: string;
    target: string;
    location: string;
    period: string;
    price: string;
  };
}

export default function CampHeroCard({ camp }: CampHeroCardProps) {
  // 정적 이미지 맵핑 (성능 최적화)
  const getMainImage = () => {
    const imageMap: Record<LocationType, string> = {
      je: '/images/camps/je/overview/1.png',
      s: '/images/camps/s/overview/main.png', 
      f: '/images/camps/f/overview/main.png',
      common: ''
    };
    
    return imageMap[camp.id] || '';
  };

  const mainImage = getMainImage();

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Camp Info */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <div className="text-6xl md:text-7xl">{camp.emoji}</div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                  {camp.name}
                </h1>
                <p className="text-lg md:text-xl text-blue-100">
                  {camp.subtitle}
                </p>
              </div>
            </div>
            
            <p className="text-base md:text-lg text-blue-200 mb-8 leading-relaxed">
              {camp.description}
            </p>

            {/* Camp Details Grid */}
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="font-semibold text-blue-100 mb-1">대상</div>
                <div className="text-white">{camp.target}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="font-semibold text-blue-100 mb-1">위치</div>
                <div className="text-white">{camp.location}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="font-semibold text-blue-100 mb-1">기간</div>
                <div className="text-white whitespace-pre-line">{camp.period}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="font-semibold text-blue-100 mb-1">비용</div>
                <div className="text-white font-bold whitespace-pre-line">{camp.price}</div>
              </div>
            </div>
          </div>

          {/* Right: Camp Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              {mainImage ? (
                <div className="aspect-video rounded-xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm">
                  <img
                    src={mainImage}
                    alt={`${camp.name} 대표 이미지`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{camp.emoji}</div>
                    <div className="text-white/70">대표 이미지 준비중</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}