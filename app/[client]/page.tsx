'use client';

import { use, useState, useEffect, useRef } from 'react';
import { LOCATIONS } from '@/lib/types';
import { ArrowRight, MapPin, Users, Calendar, Award, X, Phone, ChevronDown, Star, Shield, Repeat, Plus } from 'lucide-react';
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

const DRAWER_MENU = [
  {
    title: 'SMIS란',
    campId: null as string | null,
    links: [
      { label: '브랜드 스토리', section: 'brand', href: 'brand' },
      { label: '최고의 강사진', section: 'teachers', href: 'teachers' },
      { label: '빈틈없는 학생 관리', section: 'management', href: 'management' },
    ],
  },
  {
    title: '프리미엄 제주캠프',
    campId: 'je',
    links: [
      { label: '일정표 및 프로그램', section: 'schedule' },
      { label: '시설 및 환경 소개', section: 'environment' },
      { label: '사진 및 영상', section: 'gallery' },
    ],
  },
  {
    title: '싱가포르&말레이시아 주니어 캠프',
    campId: 's',
    links: [
      { label: '일정표 및 프로그램', section: 'schedule' },
      { label: '시설 및 환경 소개', section: 'environment' },
      { label: '사진 및 영상', section: 'gallery' },
    ],
  },
  {
    title: '말레이시아 가족캠프',
    campId: 'f',
    links: [
      { label: '일정표 및 프로그램', section: 'schedule' },
      { label: '시설 및 환경 소개', section: 'environment' },
      { label: '사진 및 영상', section: 'gallery' },
    ],
  },
];

// 루트 페이지 헤더 (바텀 드로어 방식 — CampHeader와 통일)
function MobileHeader({ 
  clientInfo, 
  client, 
}: { 
  clientInfo: any; 
  client: string; 
  displayCamps: Array<typeof LOCATIONS[number]>; 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      {/* 헤더 바 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-between h-14">

            {/* 좌측: 로고 + 브랜드명 */}
            <Link href={`/${client}`} className="flex items-center gap-2.5" onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/logo-circle-blue.png"
                alt="SMIS 로고"
                width={32}
                height={32}
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <div>
                <p className="font-bold text-gray-900 text-sm leading-tight">SMIS</p>
                <p className="text-xs text-gray-400 leading-tight">인포데스크</p>
              </div>
            </Link>

            {/* 우측: 메뉴 토글 버튼 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              className="flex items-center gap-1.5 border-2 border-gray-300 hover:border-blue-500 rounded-full px-3.5 py-1.5 transition-all duration-200 text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen
                ? <X className="w-4 h-4" strokeWidth={2.5} />
                : <Plus className="w-4 h-4" strokeWidth={2.5} />
              }
              <span className="text-sm font-semibold leading-none">
                {isMenuOpen ? '닫기' : '메뉴'}
              </span>
            </button>
          </div>
        </div>

        {/* 드롭다운 패널 — 헤더 바로 아래 */}
        {isMenuOpen && (
          <div
            className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl rounded-b-2xl overflow-y-auto"
            style={{ maxHeight: 'calc(100dvh - 56px)', animation: 'dropDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className="max-w-lg mx-auto px-4 py-5">
              <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                {DRAWER_MENU.map((group) => (
                  <div key={group.title}>
                    <p className="text-xs font-semibold text-gray-400 mb-2 leading-tight">{group.title}</p>
                    <div className="border-t border-gray-100 mb-2" />
                    <ul className="space-y-2">
                      {group.links.map((link) => (
                        <li key={link.section}>
                          <Link
                            href={'href' in link ? `/${client}/${link.href}` : `/${client}/camp/${group.campId ?? 'je'}/${link.section}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-sm text-gray-700 hover:text-blue-600 transition-colors py-0.5 leading-tight"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* 상담 신청 버튼 */}
              {/* <a
                href={`tel:${clientInfo?.contactPhone || '010-6711-7933'}`}
                onClick={() => setIsMenuOpen(false)}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-md"
              >
                <Phone className="w-4 h-4" />
                지금 바로 상담 신청하기
              </a> */}
            </div>
          </div>
        )}
      </header>

      {/* 외부 클릭 닫기 레이어 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <style jsx global>{`
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
  const [displayCamps, setDisplayCamps] = useState<Array<typeof LOCATIONS[number]>>([]);
  const campsSectionRef = useRef<HTMLDivElement>(null);

  const scrollToCamps = () => {
    campsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <MobileHeader 
        clientInfo={clientInfo} 
        client={client} 
        displayCamps={displayCamps} 
      />

      {/* ── [1] HERO 이미지 + 텍스트 — 전체 너비 #3f39c4 배경 ── */}
      <div style={{ backgroundColor: '#3f39c4' }}>
        {/* 이미지 */}
        <div className="max-w-xl mx-auto">
          <Image
            src="/images/root-hero-1.svg"
            alt="SMIS 캠프 — 이번 방학만큼은 다르게"
            width={810}
            height={1012}
            className="w-full h-auto block"
            priority
          />
        </div>

        {/* 텍스트 섹션 */}
        <div className="max-w-xl mx-auto px-4 pt-8 pb-10 text-center text-white">
          {/* 배지 */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>17년 전통 프리미엄 교육 캠프</span>
          </div>

          {/* 메인 카피 */}
          <h1 className="text-3xl font-extrabold leading-tight mb-4 tracking-tight">
            {clientInfo?.customTexts?.heroTitle || (
              <>
                방학이 달라지면,<br />
                <span className="text-yellow-300">아이가 달라집니다</span>
              </>
            )}
          </h1>

          {/* 서브 카피 */}
          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {clientInfo?.customTexts?.heroSubtitle || '17년간 6,000명 이상의 학부모가 선택한 SMIS 캠프. 단순한 여행이 아닌, 아이의 진짜 성장을 경험하세요.'}
          </p>

          {/* 핵심 지표 뱃지 4개 */}
          <div className="flex flex-col items-center gap-2 mb-7">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-sm">
                <Users className="w-3.5 h-3.5 text-yellow-300" />
                <span className="font-bold text-yellow-300">6,000+</span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>학생 수료</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-sm">
                <Repeat className="w-3.5 h-3.5 text-green-300" />
                <span className="font-bold text-green-300">40%+</span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>학생 재등록</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-sm">
                <Shield className="w-3.5 h-3.5 text-purple-300" />
                <span className="font-bold text-purple-300">업계 최초</span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>교육 프로그램 특허</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-sm">
                <Award className="w-3.5 h-3.5 text-orange-300" />
                <span className="font-bold text-orange-300">17년</span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>운영 노하우</span>
              </div>
            </div>
          </div>

          {/* CTA 버튼 */}
          <button
            onClick={scrollToCamps}
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-base"
          >
            캠프 살펴보기
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── [2] 캠프 선택 카드 섹션 ── */}
      <section ref={campsSectionRef} className="bg-white">
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            우리 아이에게 맞는 캠프를 선택해 보세요
          </h2>
          <p className="text-gray-500 text-sm">캠프를 선택하면 상세 정보와 프로그램을 확인할 수 있습니다</p>
        </div>

        <div className="grid grid-cols-1 gap-4 pb-4">
          {displayCamps.map((camp) => (
            <Link
              key={camp.id}
              href={`/${client}/camp/${camp.id}`}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300 hover:-translate-y-1"
            >
              {/* 이미지 섹션 */}
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
                <div className="mb-3">
                  <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors leading-tight">
                    {camp.name}
                  </h3>
                  <p className="text-xs text-blue-600 font-medium leading-tight">
                    {camp.subtitle}
                  </p>
                </div>
                
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-600 leading-tight">{camp.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-gray-600 leading-tight whitespace-pre-line">{camp.period}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs font-medium text-blue-600">상세 정보 보기</span>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      </section>

      {/* ── [3] 영상 섹션 ── */}
      <div className="bg-gray-50">
        <div className="max-w-lg mx-auto px-4 py-10">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">SMIS 브랜드 필름</h2>
            <p className="text-gray-500 text-sm">SMIS의 교육 철학을 담은 브랜드 영상</p>
          </div>
          {/* 모바일: 9:16 세로 비율 / 데스크탑: 16:9 가로 비율 */}
          <div
            className="relative overflow-hidden rounded-2xl shadow-xl md:hidden"
            style={{ aspectRatio: '9/16' }}
          >
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
          </div>
          <div
            className="relative overflow-hidden rounded-2xl shadow-xl hidden md:block"
            style={{ aspectRatio: '16/9' }}
          >
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
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-5xl mx-auto px-8 pt-10 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-base mb-3">회사 정보</h3>
              <div className="space-y-1.5 text-sm">
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
            {clientInfo?.customTexts?.contactInfo && (
              <p className="mb-3 text-gray-300">{clientInfo.customTexts.contactInfo}</p>
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
