'use client';

import { use } from 'react';
import { LOCATIONS } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, Users, MapPin, Phone, Mail } from 'lucide-react';
import { notFound } from 'next/navigation';
import FloatingActions from '@/components/FloatingActions';
import { useClients } from '@/lib/hooks/useClients';
import { useState, useEffect } from 'react';

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
            <Users className="w-8 h-8 text-blue-600" />
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href={`/${client}`} 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>SMIS 데스크로 돌아가기</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-8xl mb-6">{camp.emoji}</div>
            <h1 className="text-5xl font-bold mb-4">{camp.name}</h1>
            <p className="text-xl text-blue-100 mb-2">{camp.description}</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Info */}
        <section className="mb-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-lg">대상</h3>
            </div>
            <p className="text-gray-600">초등학생 ~ 중학생</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-lg">기간</h3>
            </div>
            <p className="text-gray-600">2주 ~ 4주</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-6 h-6 text-red-600" />
              <h3 className="font-semibold text-lg">위치</h3>
            </div>
            <p className="text-gray-600">{camp.name.split('SMIS ')[1]}</p>
          </div>
        </section>

        {/* Category Sections */}
        <section className="space-y-12">
          {/* 등록 */}
          <div id="registration" className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">등록 안내</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {camp.name} 등록에 관한 자세한 정보를 확인하세요. 
                등록 절차, 필요 서류, 비용 등에 대한 안내를 제공합니다.
              </p>
            </div>
          </div>

          {/* 프로그램 */}
          <div id="program" className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">프로그램</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                원어민 수업, 영어 패턴, 인문학, STEAM 등 다양한 프로그램을 운영합니다.
              </p>
            </div>
          </div>

          {/* 숙소 */}
          <div id="accommodation" className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">생활 & 숙소</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                안전하고 쾌적한 숙소에서 생활합니다. 방 배정, 식사, 세탁 등 생활 전반에 대한 정보를 확인하세요.
              </p>
            </div>
          </div>
        </section>

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
                  <p>
                    {clientInfo.customTexts.contactInfo}
                  </p>
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
