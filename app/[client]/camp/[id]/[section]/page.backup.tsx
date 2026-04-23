'use client';

import { use } from 'react';
import { LOCATIONS } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { notFound } from 'next/navigation';
import FloatingActions from '@/components/FloatingActions';
import { useClients } from '@/lib/hooks/useClients';
import { useState, useEffect } from 'react';
import CampImageGallery from '@/components/camp/CampImageGallery';
import { getCampSectionData } from '@/lib/camp-content';

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

  let sectionData;
  try {
    sectionData = getCampSectionData(camp.id, section);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href={`/${client}/camp/${id}`} 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{camp.name}로 돌아가기</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <div className="text-4xl md:text-6xl mb-4 md:mb-6">{camp.emoji}</div>
            <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">{sectionData.title}</h1>
            <p className="text-lg md:text-xl text-blue-100 mb-2">{camp.name}</p>
            <p className="text-base md:text-lg text-blue-200 max-w-3xl mx-auto">{sectionData.description}</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Content Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="prose max-w-none">
              <div className="text-gray-700 text-lg leading-relaxed space-y-6">
                {sectionData.detailContent.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Images Gallery */}
        {sectionData.images.length > 0 && (
          <section className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <CampImageGallery 
                images={sectionData.images}
                title={`${sectionData.title} 사진`}
              />
            </div>
          </section>
        )}

        {/* Additional Content based on section type */}
        {section === 'schedule' && (
          <section className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">하루 일과표</h3>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-2 sm:px-4 py-3 text-left font-semibold text-sm sm:text-base">시간</th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-3 text-left font-semibold text-sm sm:text-base">활동</th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-3 text-left font-semibold text-sm sm:text-base">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">07:00 - 08:00</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">기상 및 개인정리</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">-</td></tr>
                    <tr className="bg-gray-50"><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">08:00 - 09:00</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">아침식사</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">-</td></tr>
                    <tr><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">09:00 - 10:30</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">원어민 회화수업</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">레벨별 수업</td></tr>
                    <tr className="bg-gray-50"><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">10:30 - 10:45</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">휴식시간</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">-</td></tr>
                    <tr><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">10:45 - 12:15</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">프로젝트 수업</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">STEAM 교육</td></tr>
                    <tr className="bg-gray-50"><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">12:15 - 13:15</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">점심식사</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">-</td></tr>
                    <tr><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">13:15 - 14:45</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">액티비티</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">야외활동/체험</td></tr>
                    <tr className="bg-gray-50"><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">14:45 - 15:00</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">휴식시간</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">-</td></tr>
                    <tr><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">15:00 - 16:30</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">원어민 수업</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">주제별 수업</td></tr>
                    <tr className="bg-gray-50"><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">16:30 - 17:00</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">간식시간</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">-</td></tr>
                    <tr><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">17:00 - 18:00</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">자유활동</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">개인시간</td></tr>
                    <tr className="bg-gray-50"><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">18:00 - 19:00</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">저녁식사</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">-</td></tr>
                    <tr><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">19:00 - 20:30</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">멘토 수업</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">학습정리</td></tr>
                    <tr className="bg-gray-50"><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">20:30 - 21:30</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">자유시간</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">휴식/개인활동</td></tr>
                    <tr><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">21:30 - 22:00</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">취침준비</td><td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">-</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">문의하기</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="tel:010-3179-4282"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all"
            >
              <Phone className="w-6 h-6" />
              <div>
                <div className="font-semibold">전화 문의</div>
                <div className="text-sm text-blue-100">010-3179-4282</div>
              </div>
            </a>
            <a
              href="mailto:camp@smis.co.kr"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all"
            >
              <Mail className="w-6 h-6" />
              <div>
                <div className="font-semibold">이메일 문의</div>
                <div className="text-sm text-blue-100">camp@smis.co.kr</div>
              </div>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-20">
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

      {/* Floating Actions */}
      <FloatingActions clientId={client} />
    </div>
  );
}