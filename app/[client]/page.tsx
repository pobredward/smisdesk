'use client';

import { use, useState, useEffect } from 'react';
import { LOCATIONS } from '@/lib/types';
import { ArrowRight, MapPin, Users, Calendar, Award, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import StickyBottomBar from '@/components/StickyBottomBar';
import ResponsiveHeroVideo from '@/components/ResponsiveHeroVideo';
import { useClients } from '@/lib/hooks/useClients';

// 캠프 이미지 컴포넌트 (다양한 형식 지원)
function CampImage({ campId, campName, campEmoji }: { 
  campId: string; 
  campName: string; 
  campEmoji: string; 
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  
  // 이미지 형식 우선순위: png, jpg, jpeg
  const imageFormats = ['png', 'jpg', 'jpeg'];
  
  useEffect(() => {
    const tryLoadImage = async () => {
      for (const format of imageFormats) {
        try {
          const src = `/images/camps/${campId}.${format}`;
          // 이미지 존재 여부 확인
          const response = await fetch(src, { method: 'HEAD' });
          if (response.ok) {
            setImageSrc(src);
            return;
          }
        } catch (error) {
          // 계속해서 다음 형식 시도
        }
      }
      // 모든 형식 실패 시 에러 처리
      setImageError(true);
    };
    
    tryLoadImage();
  }, [campId]);
  
  return (
    <>
      {imageSrc && !imageError ? (
        <>
          {/* 2:1 비율 이미지 */}
          <Image
            src={imageSrc}
            alt={`${campName} 캠프 이미지`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
          {/* 호버 오버레이 */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </>
      ) : (
        <>
          {/* 이미지 로드 실패 시 대체 배경 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-4xl">{campEmoji}</span>
          </div>
          {/* 호버 오버레이 */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </>
      )}
    </>
  );
}

export default function ClientPage({ params }: { params: Promise<{ client: string }> }) {
  const { client } = use(params);
  const { clients, loading } = useClients();
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [desktopVideoUrl, setDesktopVideoUrl] = useState<string>('');
  const [mobileVideoUrl, setMobileVideoUrl] = useState<string>('');
  
  // 거래처별 표시 가능한 캠프 필터링
  const [displayCamps, setDisplayCamps] = useState<Array<typeof LOCATIONS[number]>>([]);

  useEffect(() => {
    if (!loading && clients.length > 0) {
      const info = clients.find(c => c.clientId === client);
      if (info && info.clientId !== 'common') {
        setClientInfo(info);
        
        // 거래처별 표시 가능한 캠프 설정
        const allCamps = LOCATIONS.filter(loc => loc.id !== 'common');
        if (info.availableLocations && info.availableLocations.length > 0) {
          // 특정 캠프만 선택된 경우
          setDisplayCamps(allCamps.filter(camp => info.availableLocations?.includes(camp.id)));
        } else {
          // 선택 없으면 모든 캠프 표시
          setDisplayCamps([...allCamps]);
        }
      }
      setIsChecking(false);
    }
  }, [clients, client, loading]);

  useEffect(() => {
    const loadHeroVideos = async () => {
      try {
        const q = query(
          collection(db, 'settings'),
          limit(1)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const settings = snapshot.docs[0].data();
          // 데스크탑 영상 (이전 버전 호환성을 위해 heroVideoUrl도 확인)
          setDesktopVideoUrl(settings.desktopVideoUrl || settings.heroVideoUrl || '');
          // 모바일 영상
          setMobileVideoUrl(settings.mobileVideoUrl || '');
        }
      } catch (error) {
        console.error('영상 URL 로드 오류:', error);
      }
    };

    loadHeroVideos();
  }, []);

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

  // 거래처를 찾지 못했을 때
  if (!clientInfo) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* 데스크탑 Hero Section - 영상과 텍스트 함께 (16:9 비율) */}
      <section className="hero-video-desktop hidden md:block relative w-full overflow-hidden" style={{ aspectRatio: '16/9', maxHeight: 'calc(100vh - 100px)' }}>
        {(desktopVideoUrl || mobileVideoUrl) ? (
          <ResponsiveHeroVideo 
            desktopVideoUrl={desktopVideoUrl} 
            mobileVideoUrl={mobileVideoUrl}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700" />
        )}
        
        {/* Overlay - 하단 컨트롤 영역은 제외 */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-4 z-10 -mt-32 lg:-mt-100">
            <h1 className="text-6xl lg:text-7xl font-bold mb-6 drop-shadow-2xl">
              {clientInfo?.customTexts?.heroTitle || 'SMIS 데스크'}
            </h1>
            <p className="text-2xl lg:text-3xl mb-4 drop-shadow-lg">
              {clientInfo?.customTexts?.heroSubtitle || 'SMIS 캠프의 모든 정보를 한곳에서'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-base px-4">
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white">
                <div className="p-1.5 bg-white/20 rounded-full">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-semibold">6000명+ 수료</span>
              </div>
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white">
                <div className="p-1.5 bg-white/20 rounded-full">
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-semibold">재등록률 40%+</span>
              </div>
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white">
                <div className="p-1.5 bg-white/20 rounded-full">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-semibold">특허 출원</span>
              </div>
              <div className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white">
                <div className="p-1.5 bg-white/20 rounded-full">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-semibold">17년 전통</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모바일 Hero Section - 영상과 텍스트 분리 */}
      <div className="block md:hidden">
        {/* 모바일 비디오 섹션 */}
        <section className="relative w-full h-screen overflow-hidden">
          {(desktopVideoUrl || mobileVideoUrl) ? (
            <ResponsiveHeroVideo 
              desktopVideoUrl={desktopVideoUrl} 
              mobileVideoUrl={mobileVideoUrl}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700" />
          )}
          
          {/* 영상 위 가벼운 오버레이 */}
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          
          {/* 하단 그라디언트로 텍스트 섹션과 자연스럽게 연결 */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blue-900/80 to-transparent pointer-events-none"></div>
        </section>

        {/* 모바일 간단한 헤더와 뱃지 섹션 */}
        <section className="relative bg-white py-8 px-4">
          <div className="relative text-center max-w-5xl mx-auto z-10">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              {clientInfo?.customTexts?.heroTitle || 'SMIS 인포데스크'}
            </h1>
            <p className="text-lg mb-6 text-gray-600">
              {clientInfo?.customTexts?.heroSubtitle || 'SMIS 캠프의 모든 정보를 한곳에서'}
            </p>
            
            {/* 모바일용 4개 뱃지 - 2x2 컴팩트 그리드 */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="group flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-gray-800">
                <div className="p-1 bg-gray-200 rounded-full">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold">6,000+</div>
                  <div className="text-xs opacity-75">학생 수료</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-gray-800">
                <div className="p-1 bg-gray-200 rounded-full">
                  <Award className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold">40% 이상</div>
                  <div className="text-xs opacity-75">재등록 비율</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-gray-800">
                <div className="p-1 bg-gray-200 rounded-full">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">업계 최초 교육특허</div>
                  <div className="text-xs opacity-75">출원 완료</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-gray-800">
                <div className="p-1 bg-gray-200 rounded-full">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold">17년</div>
                  <div className="text-xs opacity-75">노하우</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-32">
        {/* Camp Cards */}
        <section className="mb-16">

          <div className="grid md:grid-cols-3 gap-8">
            {displayCamps.map((camp) => (
              <Link
                key={camp.id}
                href={`/${client}/camp/${camp.id}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-400"
              >
                {/* 이미지 섹션 - 높이 축소 */}
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '2/1' }}>
                  <CampImage 
                    campId={camp.id} 
                    campName={camp.name} 
                    campEmoji={camp.emoji} 
                  />
                  {/* 대상 연령 오버레이 */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-gray-800">
                    {camp.target}
                  </div>
                </div>
                
                <div className="p-4">
                  {/* 제목과 부제목 */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors leading-tight">
                      {camp.name}
                    </h3>
                    <p className="text-xs text-blue-600 font-medium leading-tight">
                      {camp.subtitle}
                    </p>
                  </div>
                  
                  {/* 정보 그리드 */}
                  <div className="space-y-2 mb-3">
                    {/* 장소 */}
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600 leading-tight">{camp.location}</span>
                    </div>
                    
                    {/* 기간 */}
                    <div className="flex items-start gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-gray-600 leading-tight whitespace-pre-line">{camp.period}</div>
                    </div>
                    
                    {/* 비용 */}
                    <div className="flex items-start gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs font-semibold text-gray-800 leading-tight whitespace-pre-line">{camp.price}</div>
                    </div>
                  </div>
                  
                  {/* 하단 액션 영역 */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">자세히 보기</span>
                    <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* 회사 정보 */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">회사 정보</h3>
              <div className="space-y-2 text-sm">
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
              <h3 className="text-white font-bold text-lg mb-4">법률 문서</h3>
              <ul className="space-y-2 text-sm">
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
              <h3 className="text-white font-bold text-lg mb-4">소셜 링크</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="https://www.youtube.com/@smiscamp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-2"
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
                    className="hover:text-white transition-colors flex items-center gap-2"
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
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>공식 홈페이지</span>
                    <span className="text-xs">↗</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            {clientInfo?.customTexts?.contactInfo && (
              <p className="mb-4 text-gray-300">
                {clientInfo.customTexts.contactInfo}
              </p>
            )}
            <p>&copy; {new Date().getFullYear()} (주)에스엠아이에스. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar clientId={client} />
    </div>
  );
}
