'use client';

import { use } from 'react';
import { LOCATIONS } from '@/lib/types';
import { notFound } from 'next/navigation';
import AdaptiveBottomBar from '@/components/AdaptiveBottomBar';
import { useClients } from '@/lib/hooks/useClients';
import { useState, useEffect } from 'react';
import CampHeader from '@/components/camp/CampHeader';
import CampHeroSection from '@/components/camp/CampHeroSection';
import Link from 'next/link';

export default function ClientCampDetailPage({ 
  params 
}: { 
  params: Promise<{ client: string; id: string }> 
}) {
  const { client, id } = use(params);
  const { clients, loading } = useClients();
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  const camp = LOCATIONS.find(loc => loc.id === id && loc.id !== 'common');

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

  // 거래처나 캠프를 찾지 못했을 때
  if (!clientInfo || !camp) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Speak 스타일 헤더 (로고 + + 버튼 + 상담 신청) */}
      <CampHeader
        clientId={client}
        campId={id}
        campName={camp.name}
        contactPhone={clientInfo?.contactPhone}
      />

      {/* 캠프 Hero 섹션 */}
      <CampHeroSection camp={camp} clientId={client} />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-5xl mx-auto px-8 pt-10 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-base mb-3">회사 정보</h3>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-white">회사명: (주)에스엠아이에스</p>
                <p>대표: 김선희</p>
                <p>법인사업자 등록번호: 427-88-03423</p>
                <p>주소: 경기 성남시 분당구 장미로 78 SMIS 312호</p>
                {clientInfo?.customTexts?.contactInfo && (
                  <p>{clientInfo.customTexts.contactInfo}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-base mb-3">법률 문서</h3>
              <ul className="space-y-1.5 text-sm">
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

            <div>
              <h3 className="text-white font-bold text-base mb-3">소셜 링크</h3>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <a href="https://www.youtube.com/@smiscamp" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                    <span>유튜브 채널</span>
                    <span className="text-xs">↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://pf.kakao.com/_Axafxcb/chat" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                    <span>카카오톡 채널</span>
                    <span className="text-xs">↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.smisedu.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                    <span>공식 홈페이지</span>
                    <span className="text-xs">↗</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} (주)에스엠아이에스. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Adaptive Bottom Bar */}
      <AdaptiveBottomBar clientId={client} />
    </div>
  );
}
