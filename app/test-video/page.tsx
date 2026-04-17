'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ResponsiveHeroVideo from '@/components/ResponsiveHeroVideo';

export default function TestVideoPage() {
  const [desktopVideoUrl, setDesktopVideoUrl] = useState<string>('');
  const [mobileVideoUrl, setMobileVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideoUrls = async () => {
      try {
        const settingsSnapshot = await getDocs(collection(db, 'settings'));
        
        if (!settingsSnapshot.empty) {
          const settings = settingsSnapshot.docs[0].data();
          setDesktopVideoUrl(settings.desktopVideoUrl || '');
          setMobileVideoUrl(settings.mobileVideoUrl || '');
          console.log('로드된 비디오 URL:', {
            desktop: settings.desktopVideoUrl,
            mobile: settings.mobileVideoUrl
          });
        }
      } catch (error) {
        console.error('비디오 URL 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideoUrls();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-2xl font-bold text-gray-600 mb-4">
            비디오 로딩 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎬 YouTube 영상 테스트</h1>
          <p className="text-gray-600">코드로 직접 설정한 YouTube 영상이 올바르게 표시되는지 테스트합니다</p>
        </div>
      </div>

      {/* 데스크탑 영상 섹션 */}
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        
        {/* URL 정보 표시 */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 현재 설정된 URL</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">데스크탑 URL:</span>
              <div className="mt-1 p-2 bg-gray-50 rounded border break-all">
                {desktopVideoUrl || '설정되지 않음'}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">모바일 URL:</span>
              <div className="mt-1 p-2 bg-gray-50 rounded border break-all">
                {mobileVideoUrl || '데스크탑 URL 사용'}
              </div>
            </div>
          </div>
        </div>

        {/* 데스크탑 미리보기 */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🖥️ 데스크탑 미리보기</h2>
          {desktopVideoUrl ? (
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={desktopVideoUrl + (desktopVideoUrl.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&loop=1&controls=1&rel=0&modestbranding=1'}
                title="Desktop YouTube Preview"
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="bg-gray-200 aspect-video rounded-lg flex items-center justify-center">
              <p className="text-gray-500">데스크탑 영상이 설정되지 않았습니다</p>
            </div>
          )}
        </div>

        {/* 모바일 미리보기 */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📱 모바일 미리보기</h2>
          <div className="flex justify-center">
            <div className="w-80">
              {(mobileVideoUrl || desktopVideoUrl) ? (
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src={(mobileVideoUrl || desktopVideoUrl) + ((mobileVideoUrl || desktopVideoUrl).includes('?') ? '&' : '?') + 'autoplay=1&mute=1&loop=1&controls=1&rel=0&modestbranding=1'}
                    title="Mobile YouTube Preview"
                    className="w-full aspect-[9/16]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="bg-gray-200 aspect-[9/16] rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-center px-4">모바일 영상이 설정되지 않았습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ResponsiveHeroVideo 컴포넌트 테스트 */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 ResponsiveHeroVideo 컴포넌트</h2>
          <p className="text-gray-600 mb-4">실제 클라이언트 페이지에서 사용되는 컴포넌트입니다</p>
          
          <div className="bg-black rounded-lg overflow-hidden relative w-full aspect-video">
            {(desktopVideoUrl || mobileVideoUrl) ? (
              <ResponsiveHeroVideo 
                desktopVideoUrl={desktopVideoUrl} 
                mobileVideoUrl={mobileVideoUrl}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                <p className="text-white text-xl">영상이 설정되지 않았습니다</p>
              </div>
            )}
          </div>
        </div>

        {/* 브라우저 테스트 링크 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">🔗 실제 페이지에서 확인하기</h3>
          <div className="space-y-2">
            <div>
              <a 
                href="/main" 
                target="_blank"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                메인 클라이언트 페이지 ↗
              </a>
            </div>
            <div>
              <a 
                href="/visang" 
                target="_blank"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                비상교육 클라이언트 페이지 ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}