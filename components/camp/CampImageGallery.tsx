'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, Loader2 } from 'lucide-react';
import { useCampImages } from '@/lib/hooks/useCampImages';
import { LocationType } from '@/lib/types';

interface CampImageGalleryProps {
  campId?: LocationType;
  sectionId?: string;
  images?: string[];
  title?: string;
  className?: string;
}

export default function CampImageGallery({ 
  campId,
  sectionId,
  images: providedImages,
  title = "활동 사진", 
  className = "" 
}: CampImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  // 제공된 이미지만 사용 (동적 로딩 비활성화)
  const images = providedImages || [];
  const loading = false;

  const handleImageError = useCallback((imageSrc: string) => {
    setImageErrors(prev => new Set(prev).add(imageSrc));
  }, []);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    setSelectedImage(prev => 
      prev !== null ? (prev > 0 ? prev - 1 : images.length - 1) : null
    );
  };

  const goToNext = () => {
    setSelectedImage(prev => 
      prev !== null ? (prev < images.length - 1 ? prev + 1 : 0) : null
    );
  };

  const downloadImage = (imageSrc: string) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = imageSrc.split('/').pop() || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <div className="text-gray-600">이미지를 불러오는 중...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 text-lg">아직 등록된 사진이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      )}
      
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-4">
        {images.map((imageSrc, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 group"
            onClick={() => openLightbox(index)}
          >
            {!imageErrors.has(imageSrc) ? (
              <Image
                src={imageSrc}
                alt={`${title} ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, (max-width: 1536px) 16vw, 12.5vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => handleImageError(imageSrc)}
                quality={85}
                priority={index < 6}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Image
                  src="/images/camps/placeholder.svg"
                  alt="이미지 준비중"
                  width={60}
                  height={60}
                  className="opacity-50"
                />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="w-6 h-6 md:w-8 md:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Download Button */}
            <button
              onClick={() => downloadImage(images[selectedImage])}
              className="absolute bottom-4 right-4 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
            >
              <Download className="w-6 h-6 text-white" />
            </button>

            {/* Main Image */}
            <div className="relative max-w-full max-h-full">
              {!imageErrors.has(images[selectedImage]) ? (
                <Image
                  src={images[selectedImage]}
                  alt={`${title} ${selectedImage + 1}`}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                  onError={() => handleImageError(images[selectedImage])}
                />
              ) : (
                <div className="w-96 h-72 flex items-center justify-center bg-gray-700 rounded">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <div>이미지를 불러올 수 없습니다</div>
                  </div>
                </div>
              )}
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-full">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}