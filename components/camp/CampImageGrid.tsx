'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface CampImageGridProps {
  images: string[];
  title: string;
  maxImages?: number;
  aspectRatio?: 'square' | 'video' | 'auto';
  onImageClick?: (imageSrc: string) => void;
}

export default function CampImageGrid({ 
  images, 
  title,
  maxImages = 8,
  aspectRatio = 'auto',
  onImageClick
}: CampImageGridProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const handleImageError = (imageSrc: string) => {
    console.error('Image failed to load:', imageSrc);
    setImageErrors(prev => new Set(prev).add(imageSrc));
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageSrc);
      return newSet;
    });
  };

  const handleImageLoad = (imageSrc: string) => {
    console.log('Image loaded successfully:', imageSrc);
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageSrc);
      return newSet;
    });
  };

  const handleImageLoadStart = (imageSrc: string) => {
    console.log('Image loading started:', imageSrc);
    setLoadingImages(prev => new Set(prev).add(imageSrc));
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'video': return 'aspect-video';
      default: return 'aspect-[4/3]';
    }
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className="space-y-6 mb-6">
        {images.slice(0, maxImages).map((imageSrc, index) => (
          <div
            key={index}
            className={`relative ${getAspectClass()} rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 group w-full max-w-4xl mx-auto`}
            onClick={() => onImageClick ? onImageClick(imageSrc) : window.open(imageSrc, '_blank')}
          >
            {!imageErrors.has(imageSrc) ? (
              <>
                <Image
                  src={imageSrc}
                  alt={`${title} 이미지 ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError(imageSrc)}
                  onLoad={() => handleImageLoad(imageSrc)}
                  onLoadStart={() => handleImageLoadStart(imageSrc)}
                  quality={85}
                  priority={index < 3}
                />
                {loadingImages.has(imageSrc) && (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-500">이미지 로딩 중...</div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Image
                  src="/images/camps/placeholder.svg"
                  alt="이미지 준비중"
                  width={120}
                  height={90}
                  className="opacity-50"
                />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <ExternalLink className="w-6 h-6 md:w-8 md:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>
      {images.length > maxImages && (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            + {images.length - maxImages}개 더 보기
          </p>
        </div>
      )}
    </>
  );
}