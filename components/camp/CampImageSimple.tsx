'use client';

import { useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

interface CampImageSimpleProps {
  images: string[];
  title: string;
  maxImages?: number;
  onImageClick?: (imageSrc: string) => void;
}

export default function CampImageSimple({ 
  images, 
  title,
  maxImages = 8,
  onImageClick
}: CampImageSimpleProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  console.log('CampImageSimple - title:', title, 'images:', images);

  const handleImageError = (imageSrc: string) => {
    setImageErrors(prev => new Set(prev).add(imageSrc));
  };

  if (images.length === 0) return null;

  return (
    <div className="space-y-6 mb-6">
      {images.slice(0, maxImages).map((imageSrc, index) => (
        <div
          key={index}
          className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 group w-full max-w-4xl mx-auto"
          onClick={() => onImageClick ? onImageClick(imageSrc) : window.open(imageSrc, '_blank')}
        >
          {!imageErrors.has(imageSrc) ? (
            <img
              src={imageSrc}
              alt={`${title} 이미지 ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => handleImageError(imageSrc)}
              loading={index < 2 ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-center">
                <div className="text-4xl mb-2">📷</div>
                <div className="text-gray-500">이미지를 불러올 수 없습니다</div>
                <div className="text-xs text-gray-400 mt-1">{imageSrc}</div>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <ExternalLink className="w-6 h-6 md:w-8 md:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      ))}
      {images.length > maxImages && (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            + {images.length - maxImages}개 더 보기
          </p>
        </div>
      )}
    </div>
  );
}