'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { LocationType } from '@/lib/types';
import { getCampSectionData } from '@/lib/camp-content';
import CampImageDirect from './CampImageDirect';

interface CampSectionProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  campId: LocationType;
  clientId?: string;
  detailContent?: string;
  iconBgColor?: string;
}

export default function CampSection({
  id,
  title,
  description,
  icon,
  campId,
  clientId,
  detailContent,
  iconBgColor = 'bg-blue-100'
}: CampSectionProps) {
  // 정적 이미지 목록 사용 (빠른 로딩)
  const sectionData = getCampSectionData(campId, id);
  const images = sectionData.images;

  const getDetailUrl = () => {
    return clientId ? `/${clientId}/camp/${campId}/${id}` : `/camp/${campId}/${id}`;
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <p className="text-gray-600 leading-relaxed text-lg mb-6">
          {description}
        </p>
      </div>

      {/* Images Grid */}
      <div className="px-4 md:px-8">        
        <CampImageDirect 
          images={images}
          title={title}
        />
      </div>

      {/* Detail Content Preview */}
      {detailContent && (
        <div className="px-8 pb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 text-sm line-clamp-3">
              {detailContent}
            </p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="px-8 pb-8">
        <Link
          href={getDetailUrl()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium group"
        >
          <span>자세히 보기</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}