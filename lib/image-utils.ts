import { LocationType } from './types';
import fs from 'fs';
import path from 'path';

// 이미지 파일 확장자
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// 이미지 파일인지 확인
function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

// 숫자 기반 정렬을 위한 함수 (1.jpg, 2.jpg, 10.jpg 순서로 정렬)
function naturalSort(a: string, b: string): number {
  const aNum = parseInt(path.basename(a).match(/(\d+)/)?.[1] || '999999');
  const bNum = parseInt(path.basename(b).match(/(\d+)/)?.[1] || '999999');
  
  if (aNum !== bNum) {
    return aNum - bNum;
  }
  
  // 숫자가 같으면 알파벳 순서로 정렬
  return a.localeCompare(b);
}

// 서버사이드에서만 실행되는 함수 (빌드 타임에 사용)
export function getImagesFromDirectory(campId: LocationType, sectionId: string): string[] {
  if (typeof window !== 'undefined') {
    // 클라이언트에서는 미리 생성된 목록 사용
    return getClientSideImages(campId, sectionId);
  }

  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'camps', campId, sectionId);
    
    if (!fs.existsSync(imagesDir)) {
      return [];
    }

    const files = fs.readdirSync(imagesDir);
    const imageFiles = files
      .filter(isImageFile)
      .sort(naturalSort)
      .map(file => `/images/camps/${campId}/${sectionId}/${file}`);

    return imageFiles;
  } catch (error) {
    console.error(`Error reading images from ${campId}/${sectionId}:`, error);
    return [];
  }
}

// 클라이언트에서 사용할 이미지 목록 (빌드 시점에 생성됨)
function getClientSideImages(campId: LocationType, sectionId: string): string[] {
  // 이 부분은 빌드 시점에 실제 파일 목록으로 대체될 예정
  const basePath = `/images/camps/${campId}/${sectionId}`;
  
  // 현재는 샘플 데이터 - 실제로는 빌드 스크립트가 이를 실제 파일 목록으로 대체
  const imageMap: Record<string, Record<string, string[]>> = {
    je: {
      overview: [
        `${basePath}/1.png`,
        `${basePath}/main.png`
      ],
      schedule: [],
      mentors: [],
      management: [],
      environment: [],
      activities: []
    },
    s: {
      overview: [
        `${basePath}/main.png`
      ],
      schedule: [],
      mentors: [],
      management: [],
      environment: [],
      activities: []
    },
    f: {
      overview: [
        `${basePath}/main.png`
      ],
      schedule: [],
      mentors: [],
      management: [],
      environment: [],
      activities: []
    }
  };

  return imageMap[campId]?.[sectionId] || [];
}

// 동적으로 이미지 존재 여부를 확인하는 함수
export async function checkImageExists(imagePath: string): Promise<boolean> {
  if (typeof window === 'undefined') {
    // 서버사이드
    try {
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      return fs.existsSync(fullPath);
    } catch {
      return false;
    }
  } else {
    // 클라이언트사이드 - HEAD 요청으로 확인
    try {
      const response = await fetch(imagePath, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// 이미지 경로 생성 및 검증
export function getCampSectionImagePaths(campId: LocationType, sectionId: string): string[] {
  if (campId === 'common') return [];
  
  // 빌드 타임에는 실제 파일 스캔, 런타임에는 미리 생성된 목록 사용
  return getImagesFromDirectory(campId, sectionId);
}