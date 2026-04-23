'use client';

import { use, useState, useEffect } from 'react';
import { LOCATIONS } from '@/lib/types';
import { ArrowRight, MapPin, Users, Calendar, Award, Clock, DollarSign, Menu, X, Home, Phone } from 'lucide-react';
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

// 모바일 헤더 컴포넌트
function MobileHeader({ 
  clientInfo, 
  client, 
  displayCamps 
}: { 
  clientInfo: any; 
  client: string; 
  displayCamps: Array<typeof LOCATIONS[number]>; 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* 모바일 헤더 */}
      <header className="block md:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* 로고/브랜드 */}
          <Link href={`/${client}`} className="flex items-center gap-2">
            <Image
              src="/logo-circle-blue.png"
              alt="SMIS 로고"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-tight">
                {clientInfo?.customTexts?.heroTitle?.split(' ')[0] || 'SMIS'}
              </h1>
              <p className="text-xs text-gray-500 leading-tight">인포데스크</p>
            </div>
          </Link>

          {/* 메뉴 버튼 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="메뉴 열기"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </header>

      {/* 데스크탑 헤더 */}
      <header className="hidden md:block sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* 로고/브랜드 */}
            <Link href={`/${client}`} className="flex items-center gap-3">
              <Image
                src="/logo-circle-blue.png"
                alt="SMIS 로고"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="font-bold text-gray-900 text-lg leading-tight">
                  {clientInfo?.customTexts?.heroTitle?.split(' ')[0] || 'SMIS'}
                </h1>
                <p className="text-sm text-gray-500 leading-tight">인포데스크</p>
              </div>
            </Link>

            {/* 데스크탑 네비게이션 */}
            <nav className="flex items-center space-x-6">
              {/* 캠프 메뉴 */}
              {displayCamps.length > 0 && (
                <div className="flex items-center space-x-4">
                  {displayCamps.map((camp) => (
                    <Link
                      key={camp.id}
                      href={`/${client}/camp/${camp.id}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <span className="text-base">{camp.emoji}</span>
                      <span>{camp.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* 연락처 버튼 */}
              {clientInfo?.customTexts?.contactInfo && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  <span>연락처</span>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 오버레이 */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* 배경 오버레이 */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* 메뉴 패널 */}
          <div className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl">
            <div className="flex flex-col h-full">
              {/* 메뉴 헤더 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">메뉴</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* 메뉴 내용 */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* 홈 링크 */}
                <Link
                  href={`/${client}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors mb-2"
                >
                  <Home className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">홈</span>
                </Link>

                {/* 캠프 목록 */}
                {displayCamps.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 px-3">캠프</h3>
                    <div className="space-y-1">
                      {displayCamps.map((camp) => (
                        <Link
                          key={camp.id}
                          href={`/${client}/camp/${camp.id}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-lg">{camp.emoji}</span>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{camp.name}</div>
                            <div className="text-xs text-gray-500">{camp.target}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 연락처 정보 */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-3 px-3">연락처</h3>
                  {clientInfo?.customTexts?.contactInfo && (
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                      <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {clientInfo.customTexts.contactInfo}
                      </div>
                    </div>
                  )}
                </div>

                {/* 소셜 링크 */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-3 px-3">소셜 링크</h3>
                  <div className="space-y-2">
                    <a
                      href="https://www.youtube.com/@smiscamp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Y</span>
                      </div>
                      <span className="text-sm text-gray-900">유튜브 채널</span>
                      <span className="ml-auto text-xs text-gray-500">↗</span>
                    </a>
                    <a
                      href="https://pf.kakao.com/_Axafxcb/chat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-yellow-50 transition-colors"
                    >
                      <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center">
                        <span className="text-black text-xs font-bold">K</span>
                      </div>
                      <span className="text-sm text-gray-900">카카오톡 채널</span>
                      <span className="ml-auto text-xs text-gray-500">↗</span>
                    </a>
                    <a
                      href="https://www.smisedu.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      <Image
                        src="/logo-circle-blue.png"
                        alt="SMIS 로고"
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                      <span className="text-sm text-gray-900">공식 홈페이지</span>
                      <span className="ml-auto text-xs text-gray-500">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      {/* 모바일 헤더 */}
      <MobileHeader 
        clientInfo={clientInfo} 
        client={client} 
        displayCamps={displayCamps} 
      />
      {/* 데스크탑 Hero Section - 텍스트만 */}
      <section className="hidden md:block relative bg-gradient-to-b from-blue-50 to-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900">
            {clientInfo?.customTexts?.heroTitle || 'SMIS 인포데스크'}
          </h1>
          
          {/* 데스크탑용 4개 뱃지 - 가로 배치 */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="group flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-gray-900">6,000+</div>
                <div className="text-sm text-gray-600">학생 수료</div>
              </div>
            </div>
            
            <div className="group flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="p-2 bg-green-100 rounded-full">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-gray-900">40% 이상</div>
                <div className="text-sm text-gray-600">재등록 비율</div>
              </div>
            </div>
            
            <div className="group flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="p-2 bg-purple-100 rounded-full">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-gray-900">업계 최초</div>
                <div className="text-sm text-gray-600">교육특허 출원</div>
              </div>
            </div>
            
            <div className="group flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="p-2 bg-orange-100 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-gray-900">17년</div>
                <div className="text-sm text-gray-600">전통과 노하우</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모바일 Hero Section - 텍스트만 */}
      <div className="block md:hidden">
        {/* 모바일 간단한 헤더와 뱃지 섹션 */}
        <section className="relative bg-white py-6 px-4 pt-">
          <div className="relative text-center max-w-5xl mx-auto z-10">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">
              {clientInfo?.customTexts?.heroTitle || 'SMIS 인포데스크'}
            </h1>
            
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
                    
                    {/* 비용 - 루트 페이지에서는 숨김 */}
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

      {/* 비디오 섹션 - Footer 위 */}
      
      {/* 데스크탑 비디오 섹션 */}
      <section className="hidden md:block py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 데스크탑 비디오 프레임 (16:9) */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl p-4 transform transition-transform duration-300 hover:scale-[1.02]">
              <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: '16/9' }}>
                {(desktopVideoUrl || mobileVideoUrl) ? (
                  <ResponsiveHeroVideo 
                    desktopVideoUrl={desktopVideoUrl} 
                    mobileVideoUrl={mobileVideoUrl}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🎬</div>
                      <h3 className="text-2xl font-bold mb-2">영상 준비중</h3>
                      <p className="text-blue-100">곧 멋진 캠프 영상을 공개할 예정입니다</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* 장식 요소들 */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-purple-500 rounded-full opacity-15 blur-xl"></div>
            <div className="absolute top-1/2 -left-4 w-8 h-8 bg-green-500 rounded-full opacity-25 blur-lg"></div>
          </div>
        </div>
      </section>

      {/* 모바일 비디오 섹션 */}
      <section className="block md:hidden py-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto px-3">
          {/* 모바일 비디오 프레임 (9:16 세로) */}
          <div className="relative max-w-xs mx-auto">
            <div className="relative bg-white rounded-2xl shadow-xl p-2">
              <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '9/16' }}>
                {(desktopVideoUrl || mobileVideoUrl) ? (
                  <ResponsiveHeroVideo 
                    desktopVideoUrl={desktopVideoUrl} 
                    mobileVideoUrl={mobileVideoUrl}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <div className="text-4xl mb-3">🎬</div>
                      <h3 className="text-lg font-bold mb-2">영상 준비중</h3>
                      <p className="text-xs text-blue-100 leading-relaxed">곧 캠프 영상을 공개할 예정입니다</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* 모바일 장식 요소들 */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-blue-500 rounded-full opacity-30 blur-sm"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-purple-500 rounded-full opacity-20 blur-md"></div>
          </div>
        </div>
      </section>

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
