import { LocationType } from './types';

export interface CampSectionData {
  id: string;
  title: string;
  description: string;
  detailContent: string;
  images: string[];
  iconBgColor: string;
}

export const CAMP_SECTIONS: Record<string, CampSectionData> = {
  overview: {
    id: 'overview',
    title: '개요 (인트로)',
    description: '캠프의 목표와 특징, 교육 철학을 소개합니다.',
    detailContent: '우리 캠프는 학생들의 영어 실력 향상과 함께 글로벌 마인드를 기를 수 있도록 설계되었습니다. 원어민 선생님들과의 자연스러운 소통을 통해 살아있는 영어를 배우고, 다양한 문화 체험을 통해 국제적 감각을 기를 수 있습니다.',
    images: [],
    iconBgColor: 'bg-blue-100'
  },
  schedule: {
    id: 'schedule',
    title: '일정표 및 프로그램',
    description: '하루 일과와 주간 프로그램 스케줄을 확인하세요.',
    detailContent: '매일 오전에는 원어민 선생님과의 회화 수업, 오후에는 다양한 액티비티와 프로젝트 수업이 진행됩니다. 저녁에는 멘토 선생님과의 학습 정리 시간과 자유 활동 시간이 마련되어 있습니다.',
    images: [],
    iconBgColor: 'bg-green-100'
  },
  mentors: {
    id: 'mentors',
    title: '원어민 & 한국인 멘토 선생님',
    description: '경험이 풍부한 원어민 강사진과 한국인 멘토들을 소개합니다.',
    detailContent: '모든 원어민 선생님들은 교육 경험이 풍부하고 아이들을 사랑하는 마음으로 수업에 임합니다. 한국인 멘토 선생님들은 학생들의 생활 관리와 학습 멘토링을 담당하여 24시간 안전하고 체계적인 관리를 제공합니다.',
    images: [],
    iconBgColor: 'bg-purple-100'
  },
  management: {
    id: 'management',
    title: '꼼꼼한 관리 시스템',
    description: '안전하고 체계적인 학생 관리 시스템을 소개합니다.',
    detailContent: '24시간 전담 관리 선생님이 상주하며, 학생들의 건강 상태와 생활 패턴을 꼼꼼히 체크합니다. 응급상황 대비 의료진과의 핫라인, 정기적인 부모님 연락, 개인별 맞춤 케어 등 안전하고 체계적인 관리 시스템을 운영합니다.',
    images: [],
    iconBgColor: 'bg-red-100'
  },
  environment: {
    id: 'environment',
    title: '캠프 환경 및 식단',
    description: '쾌적한 숙소 환경과 영양 만점 식단을 확인하세요.',
    detailContent: '깨끗하고 안전한 숙소에서 생활하며, 영양사가 직접 관리하는 균형 잡힌 식단을 제공합니다. 지역 특산물을 활용한 신선한 재료로 만든 맛있고 건강한 음식을 즐길 수 있으며, 알레르기나 특별한 식단이 필요한 학생들을 위한 개별 대응도 가능합니다.',
    images: [],
    iconBgColor: 'bg-orange-100'
  },
  activities: {
    id: 'activities',
    title: '활동 사진',
    description: '생생한 캠프 활동 모습을 사진으로 만나보세요.',
    detailContent: '수업 시간, 액티비티, 식사 시간, 자유 활동 등 캠프에서 일어나는 모든 순간들을 사진으로 기록하고 있습니다. 아이들의 즐거운 표정과 진지한 학습 모습, 친구들과의 소중한 추억들을 확인하실 수 있습니다.',
    images: [],
    iconBgColor: 'bg-yellow-100'
  }
};

// 캠프별 이미지 경로 생성 함수
export function getCampSectionImages(campId: LocationType, sectionId: string): string[] {
  if (campId === 'common') return [];
  
  // 정적 이미지 목록 사용 (플레이스홀더 제거)
  const actualImages = getCampSectionImagePaths(campId, sectionId);
  
  return actualImages; // 빈 배열이어도 플레이스홀더를 반환하지 않음
}

// 정적 이미지 목록 - 실제 존재하는 파일만 포함
function getCampSectionImagePaths(campId: LocationType, sectionId: string): string[] {
  const basePath = `/images/camps/${campId}/${sectionId}`;
  
  // 실제 존재하는 이미지 파일들만 나열
  const imageMap: Record<string, Record<string, string[]>> = {
    je: {
      overview: [
        `${basePath}/1.png`
        // 새 이미지를 추가할 때는 여기에 경로를 직접 추가하세요
        // 예: `${basePath}/2.png`,
      ],
      schedule: [
        `${basePath}/14.png`,
        `${basePath}/15.png`
      ],
      mentors: [
        // 멘토 이미지가 있으면 여기에 추가
      ],
      management: [
        // 관리 시스템 이미지가 있으면 여기에 추가
      ],
      environment: [
        // 환경 이미지가 있으면 여기에 추가
      ],
      activities: [
        // 활동 사진이 있으면 여기에 추가
      ]
    },
    s: {
      overview: [`${basePath}/main.png`],
      schedule: [],
      mentors: [],
      management: [],
      environment: [],
      activities: []
    },
    f: {
      overview: [`${basePath}/main.png`],
      schedule: [],
      mentors: [],
      management: [],
      environment: [],
      activities: []
    }
  };

  return imageMap[campId]?.[sectionId] || [];
}

// 캠프 섹션 데이터와 이미지를 합쳐서 반환하는 함수
export function getCampSectionData(campId: LocationType, sectionId: string): CampSectionData {
  const baseSection = CAMP_SECTIONS[sectionId];
  if (!baseSection) {
    throw new Error(`Unknown section: ${sectionId}`);
  }

  return {
    ...baseSection,
    images: getCampSectionImages(campId, sectionId)
  };
}

// 모든 섹션 데이터를 반환하는 함수
export function getAllCampSections(campId: LocationType): CampSectionData[] {
  return Object.keys(CAMP_SECTIONS).map(sectionId => 
    getCampSectionData(campId, sectionId)
  );
}