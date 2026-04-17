'use client';

import { useState, useEffect } from 'react';
import { LocationType } from '../types';

// 이미지 파일 확장자
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// 숫자 기반 정렬을 위한 함수
function naturalSort(a: string, b: string): number {
  const getNumber = (path: string) => {
    const match = path.match(/\/(\d+)\./);
    return match ? parseInt(match[1]) : 999999;
  };
  
  const aNum = getNumber(a);
  const bNum = getNumber(b);
  
  if (aNum !== bNum) {
    return aNum - bNum;
  }
  
  return a.localeCompare(b);
}

// 이미지 존재 여부 확인
async function checkImageExists(imagePath: string): Promise<boolean> {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// 가능한 이미지 파일명들을 생성 (1.png, 2.png, ... , 1.jpg, 2.jpg, ...)
function generatePossibleImagePaths(campId: LocationType, sectionId: string, maxCount = 20): string[] {
  const basePath = `/images/camps/${campId}/${sectionId}`;
  const paths: string[] = [];
  
  // 기본 파일들 (.png 우선)
  paths.push(`${basePath}/main.png`, `${basePath}/main.jpg`, `${basePath}/main.jpeg`);
  
  // 숫자 기반 파일들 (.png 우선, 효율성을 위해 더 적은 확장자만 체크)
  for (let i = 1; i <= maxCount; i++) {
    paths.push(`${basePath}/${i}.png`);
    paths.push(`${basePath}/${i}.jpg`);
    paths.push(`${basePath}/${i}.jpeg`);
  }
  
  return paths;
}

export function useCampImages(campId: LocationType, sectionId: string) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function scanImages() {
      if (campId === 'common') {
        setImages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // 가능한 모든 이미지 경로 생성
        const possiblePaths = generatePossibleImagePaths(campId, sectionId);
        
        // 병렬로 이미지 존재 여부 확인 (배치로 처리하여 성능 개선)
        const batchSize = 6;
        const existingImages: string[] = [];
        
        for (let i = 0; i < possiblePaths.length; i += batchSize) {
          const batch = possiblePaths.slice(i, i + batchSize);
          const results = await Promise.all(
            batch.map(async (path) => {
              const exists = await checkImageExists(path);
              return exists ? path : null;
            })
          );
          
          const validImages = results.filter(Boolean) as string[];
          existingImages.push(...validImages);
          
          // 컴포넌트가 언마운트되었으면 중단
          if (!isMounted) return;
          
          // 이미지를 찾았으면 조기 종료 (너무 많은 요청 방지)
          if (existingImages.length >= 12) break;
        }
        
        // 자연스러운 순서로 정렬
        const sortedImages = existingImages.sort(naturalSort);
        
        if (isMounted) {
          setImages(sortedImages.length > 0 ? sortedImages : ['/images/camps/placeholder.svg']);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error scanning camp images:', error);
        if (isMounted) {
          setImages(['/images/camps/placeholder.svg']);
          setLoading(false);
        }
      }
    }

    scanImages();

    return () => {
      isMounted = false;
    };
  }, [campId, sectionId]);

  return { images, loading };
}