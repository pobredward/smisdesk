'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Home, 
  Settings, 
  Sparkles, 
  Camera 
} from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export const CAMP_TABS: TabItem[] = [
  {
    id: 'registration',
    label: '등록 & 결제',
    icon: <CreditCard className="w-5 h-5" />,
    color: 'text-green-600',
    description: '캠프 등록 절차와 결제 정보'
  },
  {
    id: 'overview',
    label: '프로그램 개요',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'text-blue-600',
    description: '캠프의 목표와 교육 철학'
  },
  {
    id: 'mentors',
    label: '원어민 & 강사진',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'text-purple-600',
    description: '우수한 원어민 및 한국인 멘토진'
  },
  {
    id: 'schedule',
    label: '일정 & 커리큘럼',
    icon: <Calendar className="w-5 h-5" />,
    color: 'text-orange-600',
    description: '상세한 일정표와 프로그램 구성'
  },
  {
    id: 'environment',
    label: '캠프 환경',
    icon: <Home className="w-5 h-5" />,
    color: 'text-teal-600',
    description: '시설 및 식단 정보'
  },
  {
    id: 'management',
    label: '학생 관리',
    icon: <Settings className="w-5 h-5" />,
    color: 'text-red-600',
    description: '체계적인 학생 관리 시스템'
  },
  {
    id: 'extracurricular',
    label: '비교과 프로그램',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'text-pink-600',
    description: '특별 활동 및 이벤트'
  },
  {
    id: 'gallery',
    label: '활동 갤러리',
    icon: <Camera className="w-5 h-5" />,
    color: 'text-yellow-600',
    description: '캠프 활동 사진'
  }
];

interface CampTabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function CampTabNavigation({ activeTab, onTabChange }: CampTabNavigationProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
          >
            {CAMP_TABS.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto scrollbar-hide">
          {CAMP_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 whitespace-nowrap border-b-2 transition-all duration-200 hover:bg-gray-50 ${
                  isActive
                    ? `border-blue-500 ${tab.color} bg-blue-50/50`
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className={isActive ? tab.color : 'text-gray-400'}>
                  {tab.icon}
                </span>
                <div className="text-left">
                  <div className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                    {tab.label}
                  </div>
                  <div className="text-xs text-gray-500 hidden lg:block">
                    {tab.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}