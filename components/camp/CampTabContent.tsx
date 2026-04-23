'use client';

import { Suspense } from 'react';
import { LOCATIONS } from '@/lib/types';
import dynamic from 'next/dynamic';

// 탭 컴포넌트들을 동적 import로 lazy loading
const RegistrationTab = dynamic(() => import('./tabs/RegistrationTab'), {
  loading: () => <TabLoadingSkeleton />
});

const OverviewTab = dynamic(() => import('./tabs/OverviewTab'), {
  loading: () => <TabLoadingSkeleton />
});

const MentorsTab = dynamic(() => import('./tabs/MentorsTab'), {
  loading: () => <TabLoadingSkeleton />
});

const ScheduleTab = dynamic(() => import('./tabs/ScheduleTab'), {
  loading: () => <TabLoadingSkeleton />
});

const EnvironmentTab = dynamic(() => import('./tabs/EnvironmentTab'), {
  loading: () => <TabLoadingSkeleton />
});

const ManagementTab = dynamic(() => import('./tabs/ManagementTab'), {
  loading: () => <TabLoadingSkeleton />
});

const ExtracurricularTab = dynamic(() => import('./tabs/ExtracurricularTab'), {
  loading: () => <TabLoadingSkeleton />
});

const GalleryTab = dynamic(() => import('./tabs/GalleryTab'), {
  loading: () => <TabLoadingSkeleton />
});

// 로딩 스켈레톤 컴포넌트
function TabLoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animate-pulse">
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

interface CampTabContentProps {
  activeTab: string;
  camp: typeof LOCATIONS[number];
  clientId: string;
}

export default function CampTabContent({ activeTab, camp, clientId }: CampTabContentProps) {
  const renderTabContent = () => {
    const commonProps = {
      campId: camp.id,
      clientId
    };

    switch (activeTab) {
      case 'registration':
        return <RegistrationTab {...commonProps} />;
      case 'overview':
        return <OverviewTab {...commonProps} />;
      case 'mentors':
        return <MentorsTab {...commonProps} />;
      case 'schedule':
        return <ScheduleTab {...commonProps} />;
      case 'environment':
        return <EnvironmentTab {...commonProps} />;
      case 'management':
        return <ManagementTab {...commonProps} />;
      case 'extracurricular':
        return <ExtracurricularTab {...commonProps} />;
      case 'gallery':
        return <GalleryTab {...commonProps} />;
      default:
        return <OverviewTab {...commonProps} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<TabLoadingSkeleton />}>
        {renderTabContent()}
      </Suspense>
    </div>
  );
}