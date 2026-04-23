'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Home, 
  Settings, 
  Sparkles, 
  Camera,
  ArrowRight
} from 'lucide-react';

export interface SectionButton {
  id: string;
  label: string;
  icon: React.ReactElement;
  color: string;
  bgColor: string;
  description: string;
}

export const CAMP_SECTIONS: SectionButton[] = [
  {
    id: 'registration',
    label: '등록결제',
    icon: <CreditCard />,
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100 border-green-200',
    description: '캠프 등록 절차와 결제 정보'
  },
  {
    id: 'overview', 
    label: '프로그램',
    icon: <BookOpen  />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    description: '캠프의 목표와 교육 철학'
  },
  {
    id: 'mentors',
    label: '강사진',
    icon: <GraduationCap  />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    description: '우수한 원어민 및 한국인 멘토진'
  },
  {
    id: 'schedule',
    label: '일정표',
    icon: <Calendar  />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    description: '상세한 일정표와 프로그램 구성'
  },
  {
    id: 'environment',
    label: '시설환경',
    icon: <Home  />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 hover:bg-teal-100 border-teal-200',
    description: '시설 및 식단 정보'
  },
  {
    id: 'management',
    label: '학생관리',
    icon: <Settings  />,
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100 border-red-200',
    description: '체계적인 학생 관리 시스템'
  },
  {
    id: 'extracurricular',
    label: '특별활동',
    icon: <Sparkles  />,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
    description: '특별 활동 및 이벤트'
  },
  {
    id: 'gallery',
    label: '활동사진',
    icon: <Camera  />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
    description: '캠프 활동 사진'
  }
];

interface CampSectionButtonsProps {
  campId: string;
  clientId: string;
}

export default function CampSectionButtons({ campId, clientId }: CampSectionButtonsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          캠프 상세 정보
        </h2>
        <p className="text-gray-600 text-lg">
          궁금한 정보를 선택해서 자세히 알아보세요
        </p>
      </div>

      {/* 모바일: 3-3-2 배치, 데스크탑: 4-4 배치 */}
      <div className="md:hidden">
        {/* 모바일 전용 레이아웃 */}
        {/* 첫 번째 행: 3개 버튼 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {CAMP_SECTIONS.slice(0, 3).map((section) => (
            <Link
              key={section.id}
              href={`/${clientId}/camp/${campId}/${section.id}`}
              className={`group ${section.bgColor} border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 block min-h-[90px]`}
            >
              <div className="flex flex-col items-center text-center justify-center h-full space-y-2">
                <div className={`${section.color} group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-5 h-5">{section.icon}</div>
                </div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight">
                  {section.label}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* 두 번째 행: 3개 버튼 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {CAMP_SECTIONS.slice(3, 6).map((section) => (
            <Link
              key={section.id}
              href={`/${clientId}/camp/${campId}/${section.id}`}
              className={`group ${section.bgColor} border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 block min-h-[90px]`}
            >
              <div className="flex flex-col items-center text-center justify-center h-full space-y-2">
                <div className={`${section.color} group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-5 h-5">{section.icon}</div>
                </div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight">
                  {section.label}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* 세 번째 행: 2개 버튼 (왼쪽 정렬) */}
        <div className="flex gap-3">
          {CAMP_SECTIONS.slice(6, 8).map((section) => (
            <Link
              key={section.id}
              href={`/${clientId}/camp/${campId}/${section.id}`}
              className={`group ${section.bgColor} border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 block min-h-[90px] flex-1`}
              style={{ maxWidth: 'calc((100% - 12px) / 3)' }}
            >
              <div className="flex flex-col items-center text-center justify-center h-full space-y-2">
                <div className={`${section.color} group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-5 h-5">{section.icon}</div>
                </div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight">
                  {section.label}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 데스크탑 전용 레이아웃 */}
      <div className="hidden md:block space-y-6">
        {/* 첫 번째 행: 4개 버튼 */}
        <div className="grid grid-cols-4 gap-4">
          {CAMP_SECTIONS.slice(0, 4).map((section) => (
            <Link
              key={section.id}
              href={`/${clientId}/camp/${campId}/${section.id}`}
              className={`group ${section.bgColor} border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 block min-h-[120px]`}
            >
              <div className="flex flex-col items-center text-center justify-center h-full space-y-4">
                <div className={`${section.color} group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-8 h-8">{section.icon}</div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  {section.label}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {section.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  <span>자세히 보기</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 두 번째 행: 4개 버튼 */}
        <div className="grid grid-cols-4 gap-4">
          {CAMP_SECTIONS.slice(4, 8).map((section) => (
            <Link
              key={section.id}
              href={`/${clientId}/camp/${campId}/${section.id}`}
              className={`group ${section.bgColor} border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 block min-h-[120px]`}
            >
              <div className="flex flex-col items-center text-center justify-center h-full space-y-4">
                <div className={`${section.color} group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-8 h-8">{section.icon}</div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  {section.label}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {section.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  <span>자세히 보기</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}