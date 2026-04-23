'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const MentorsTab = ({ campId = 'je' }: { campId?: string }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch(`/api/images?campId=${campId}&section=mentors`);
        if (response.ok) {
          const data = await response.json();
          const sortedImages = data.images.sort((a: string, b: string) => {
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
          });
          setImages(sortedImages);
        }
      } catch (error) {
        console.error('이미지 로딩 오류:', error);
      }
      
      setLoading(false);
    };

    loadImages();
  }, [campId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-lg text-gray-600">이미지를 불러오는 중...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-lg text-gray-600">강사진 정보 이미지가 준비 중입니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {images.map((imageSrc, index) => (
        <div key={index} className="w-full">
          <Image
            src={imageSrc}
            alt={`강사진 정보 이미지 ${index + 1}`}
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg shadow-sm"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
    </div>
  );
};

export default MentorsTab;