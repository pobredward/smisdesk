'use client';

import { use } from 'react';
import { LOCATIONS } from '@/lib/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdaptiveBottomBar from '@/components/AdaptiveBottomBar';
import { useClients } from '@/lib/hooks/useClients';
import { useState, useEffect } from 'react';
import { CAMP_SECTIONS } from '@/components/camp/CampSectionButtons';
import CampHeader from '@/components/camp/CampHeader';

// 탭 컴포넌트들을 동적 import
import dynamic from 'next/dynamic';

const RegistrationTab = dynamic(() => import('@/components/camp/tabs/RegistrationTab'));
const OverviewTab = dynamic(() => import('@/components/camp/tabs/OverviewTab'));
const MentorsTab = dynamic(() => import('@/components/camp/tabs/MentorsTab'));
const ScheduleTab = dynamic(() => import('@/components/camp/tabs/ScheduleTab'));
const EnvironmentTab = dynamic(() => import('@/components/camp/tabs/EnvironmentTab'));
const ManagementTab = dynamic(() => import('@/components/camp/tabs/ManagementTab'));
const ExtracurricularTab = dynamic(() => import('@/components/camp/tabs/ExtracurricularTab'));
const GalleryTab = dynamic(() => import('@/components/camp/tabs/GalleryTab'));

export default function ClientCampSectionPage({ 
  params 
}: { 
  params: Promise<{ client: string; id: string; section: string }> 
}) {
  const { client, id, section } = use(params);
  const { clients, loading } = useClients();
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  const camp = LOCATIONS.find(loc => loc.id === id && loc.id !== 'common');
  const sectionInfo = CAMP_SECTIONS.find(s => s.id === section);

  useEffect(() => {
    if (!loading && clients.length > 0) {
      const info = clients.find(c => c.clientId === client);
      if (info && info.clientId !== 'common') {
        setClientInfo(info);
      }
      setIsChecking(false);
    }
  }, [clients, client, loading]);

  // 로딩 중일 때
  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 animate-pulse">
            <div className="w-8 h-8 bg-blue-600 rounded-full" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">페이지 로딩 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  // 거래처나 캠프, 섹션을 찾지 못했을 때
  if (!clientInfo || !camp || !sectionInfo) {
    notFound();
  }

  // 섹션별 컴포넌트 렌더링
  const renderSectionContent = () => {
    const commonProps = { campId: id };

    switch (section) {
      case 'registration':
        return <RegistrationTab {...commonProps} />;
      case 'overview':
        return <OverviewTab {...commonProps} />;
      case 'mentors':
        return <MentorsTab {...commonProps} />;
      case 'schedule':
        return <ScheduleTab {...commonProps} clientId={client} />;
      case 'environment':
        return <EnvironmentTab {...commonProps} />;
      case 'management':
        return <ManagementTab {...commonProps} />;
      case 'extracurricular':
        return <ExtracurricularTab {...commonProps} />;
      case 'gallery':
        return <GalleryTab {...commonProps} />;
      default:
        notFound();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <CampHeader
        clientId={client}
        campId={id}
        campName={camp.name}
        contactPhone={clientInfo?.contactPhone}
      />


      {/* 섹션 콘텐츠 */}
      <main className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6 py-4">
        {renderSectionContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            {/* 회사 정보 */}
            <div>
              <h3 className="text-white font-bold text-base mb-3">회사 정보</h3>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-white">회사명: (주)에스엠아이에스</p>
                <p>대표: 김선희</p>
                <p>법인사업자 등록번호: 427-88-03423</p>
                <p>주소: 경기 성남시 분당구 장미로 78 SMIS 312호</p>
                {clientInfo?.customTexts?.contactInfo && (
                  <p>{clientInfo.customTexts.contactInfo}</p>
                )}
              </div>
            </div>

            {/* 법률 문서 */}
            <div>
              <h3 className="text-white font-bold text-base mb-3">법률 문서</h3>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    서비스 이용약관
                  </Link>
                </li>
              </ul>
            </div>

            {/* 소셜 링크 */}
            <div>
              <h3 className="text-white font-bold text-base mb-3">소셜 링크</h3>
              <ul className="space-y-1 text-xs">
                <li>
                  <a 
                    href="https://www.youtube.com/@smiscamp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>유튜브 채널</span>
                    <span className="text-xs">↗</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://pf.kakao.com/_Axafxcb/chat" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>카카오톡 채널</span>
                    <span className="text-xs">↗</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.smisedu.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>공식 홈페이지</span>
                    <span className="text-xs">↗</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-xs border-t border-gray-800 pt-6">
            <p>&copy; {new Date().getFullYear()} (주)에스엠아이에스. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Adaptive Bottom Bar */}
      <AdaptiveBottomBar clientId={client} />
    </div>
  );
}