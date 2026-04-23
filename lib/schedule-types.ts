// 시간표 및 프로그램 관련 타입 정의

export interface ScheduleProgram {
  id: string;
  campId: string; // je, s, f
  programType: 'basic' | 'growing' | 'academy';
  timeSlot: string; // "08:00-08:20"
  title: string;
  description?: string;
  content: string; // 리치 에디터 HTML 내용
  images: string[]; // 이미지 URL 배열
  duration?: string;
  location?: string;
  materials?: string[]; // 준비물
  objectives?: string[]; // 목표
  activities?: string[]; // 활동 내용
  isActive: boolean;
  order: number; // 정렬 순서
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleTemplate {
  id: string;
  campId: string;
  name: string; // "제주캠프 기본 시간표"
  description?: string;
  scheduleItems: ScheduleItem[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleItem {
  id: string;
  timeSlot: string;
  basicProgram?: string; // 프로그램 ID 참조
  growingProgram?: string;
  academyProgram?: string;
  order: number;
}

export interface EditorContent {
  type: 'text' | 'image' | 'video' | 'list' | 'quote';
  content: string;
  metadata?: {
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
  };
}

// API 요청/응답 타입
export interface CreateProgramRequest {
  campId: string;
  programType: 'basic' | 'growing' | 'academy';
  timeSlot: string;
  title: string;
  description?: string;
  content: string;
}

export interface UpdateProgramRequest extends Partial<CreateProgramRequest> {
  id: string;
}

export interface ProgramListResponse {
  programs: ScheduleProgram[];
  total: number;
  page: number;
  limit: number;
}