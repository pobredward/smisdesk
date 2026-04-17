'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

interface ResponsiveHeroVideoProps {
  desktopVideoUrl: string;
  mobileVideoUrl: string;
}

export default function ResponsiveHeroVideo({ desktopVideoUrl, mobileVideoUrl }: ResponsiveHeroVideoProps) {
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // YouTube는 자동재생으로 시작
  const [isMuted, setIsMuted] = useState(true);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopIframeRef = useRef<HTMLIFrameElement>(null);
  const mobileIframeRef = useRef<HTMLIFrameElement>(null);

  // 사용할 비디오 URL 결정 (모바일용이 없으면 데스크탑용 사용)
  const currentMobileVideo = mobileVideoUrl || desktopVideoUrl;

  useEffect(() => {
    const tryAutoplay = async (videoElement: HTMLVideoElement | null) => {
      if (!videoElement) return;

      try {
        // 비디오 로드 완료 대기
        if (videoElement.readyState >= 2) {
          await videoElement.play();
          setIsPlaying(true);
          setIsLoaded(true);
        } else {
          videoElement.addEventListener('canplay', async () => {
            try {
              await videoElement.play();
              setIsPlaying(true);
              setIsLoaded(true);
            } catch (error) {
              console.warn('자동재생 실패:', error);
              setAutoplayFailed(true);
              setIsLoaded(true);
            }
          }, { once: true });
          
          videoElement.addEventListener('loadedmetadata', () => {
            setIsLoaded(true);
          }, { once: true });
        }
      } catch (error) {
        console.warn('자동재생 실패:', error);
        setAutoplayFailed(true);
        setIsLoaded(true);
      }
    };

    // 상태 초기화
    setIsLoaded(false);
    setAutoplayFailed(false);

    // 페이지 로드 후 자동재생 시도
    const timer = setTimeout(() => {
      tryAutoplay(desktopVideoRef.current);
      tryAutoplay(mobileVideoRef.current);
    }, 1000);

    return () => clearTimeout(timer);
  }, [desktopVideoUrl, mobileVideoUrl]);

  // YouTube API 메시지 리스너
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'video-progress') {
          // 재생 상태 업데이트 가능
        }
      } catch (error) {
        // JSON 파싱 에러 무시
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);


  const processVideoUrl = (url: string) => {
    if (!url) return url;
    
    // Firebase Storage URL인 경우 CORS 헤더 추가
    if (url.includes('firebasestorage.googleapis.com')) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('alt', 'media');
      return urlObj.toString();
    }
    
    return url;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return url;
    
    try {
      const urlObj = new URL(url);
      
      // 자동재생 및 반복을 위한 필수 파라미터 설정
      urlObj.searchParams.set('autoplay', '1');        // 자동재생
      urlObj.searchParams.set('mute', '1');            // 음소거 (자동재생 필수)
      urlObj.searchParams.set('loop', '1');            // 반복재생
      urlObj.searchParams.set('controls', '0');        // 컨트롤 숨김 (깔끔한 배경)
      urlObj.searchParams.set('rel', '0');             // 관련 동영상 숨김
      urlObj.searchParams.set('showinfo', '0');        // 정보 숨김
      urlObj.searchParams.set('iv_load_policy', '3');  // 어노테이션 숨김
      urlObj.searchParams.set('modestbranding', '1');  // YouTube 로고 최소화
      urlObj.searchParams.set('enablejsapi', '1');     // JavaScript API 활성화
      urlObj.searchParams.set('playsinline', '1');     // 모바일 인라인 재생
      urlObj.searchParams.set('start', '0');           // 처음부터 시작
      urlObj.searchParams.set('disablekb', '1');       // 키보드 컨트롤 비활성화
      urlObj.searchParams.set('fs', '0');              // 전체화면 버튼 숨김
      urlObj.searchParams.set('cc_load_policy', '0');  // 자막 숨김
      
      // 반복재생을 위한 playlist 파라미터 (비디오 ID로 설정)
      const videoId = urlObj.pathname.split('/embed/')[1];
      if (videoId) {
        urlObj.searchParams.set('playlist', videoId);
      }
      
      return urlObj.toString();
    } catch (error) {
      console.error('YouTube URL 처리 오류:', error);
      return url;
    }
  };

  const renderVideo = (videoUrl: string, isMobile = false) => {
    if (!videoUrl) return null;

    const processedUrl = processVideoUrl(videoUrl);

    if (videoUrl.includes('youtube.com/embed/')) {
      const youtubeUrl = getYouTubeEmbedUrl(videoUrl);
      
      return (
        <div 
          className="absolute inset-0 w-full h-full" 
          style={{ 
            zIndex: 10,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <iframe
            ref={isMobile ? mobileIframeRef : desktopIframeRef}
            src={youtubeUrl}
            title={`Hero video ${isMobile ? 'mobile' : 'desktop'}`}
            className="absolute inset-0 w-full h-full border-0"
            style={{ 
              objectFit: 'cover',
              pointerEvents: 'none', // iframe 클릭 비활성화
              touchAction: 'none',   // 터치 이벤트 방지
              userSelect: 'none',    // 텍스트 선택 방지
              ...(isMobile ? {
                // 모바일에서 세로 영상 최적화
                width: '100%',
                height: '100%'
              } : {
                // 데스크탑에서 가로 영상 최적화 (1920x1080 = 16:9)
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center'
              })
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="eager"
            onLoad={() => setIsLoaded(true)}
          />
          {/* 투명한 오버레이로 YouTube 링크 클릭 방지 */}
          <div 
            className="absolute inset-0 w-full h-full bg-transparent cursor-default" 
            style={{ 
              zIndex: 15,
              pointerEvents: 'auto',
              touchAction: 'none',
              userSelect: 'none'
            }} 
            onMouseOver={(e) => e.preventDefault()}
            onClick={(e) => e.preventDefault()}
          />
        </div>
      );
    } else {
      return (
        <video
          ref={isMobile ? mobileVideoRef : desktopVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full"
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center center',
            backgroundColor: 'transparent',
            zIndex: 1,
            ...(isMobile ? {
              // 모바일 세로 영상 (1080x1920) 최적화
              width: '100%',
              height: '100%',
              maxWidth: '100vw',
              maxHeight: '100vh'
            } : {
              // 데스크탑 가로 영상 (1920x1080) 최적화
              aspectRatio: '16/9',
              width: '100%',
              height: '100%'
            })
          }}
          onLoadedData={() => setIsLoaded(true)}
          onCanPlay={() => setIsLoaded(true)}
          onError={(e) => {
            console.error('Video error:', e.currentTarget.error);
            console.error('Failed video URL:', processedUrl);
            setAutoplayFailed(true);
            setIsLoaded(true);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          key={processedUrl}
        >
          <source src={processedUrl} type="video/mp4" />
          <source src={processedUrl} type="video/webm" />
          <source src={processedUrl} type="video/mov" />
          <p className="text-white">브라우저가 비디오를 지원하지 않습니다.</p>
        </video>
      );
    }
  };

  const handlePlayClick = () => {
    const currentVideo = window.innerWidth >= 768 ? desktopVideoRef.current : mobileVideoRef.current;
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause();
        setIsPlaying(false);
      } else {
        currentVideo.play();
        setIsPlaying(true);
      }
    }
  };

  // YouTube iframe 컨트롤 함수들
  const handleYouTubePlayPause = () => {
    const currentIframe = window.innerWidth >= 768 ? desktopIframeRef.current : mobileIframeRef.current;
    if (currentIframe && currentIframe.contentWindow) {
      if (isPlaying) {
        // 일시정지 명령
        currentIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        setIsPlaying(false);
      } else {
        // 재생 명령  
        currentIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        setIsPlaying(true);
      }
    }
  };

  const handleYouTubeMute = () => {
    const currentIframe = window.innerWidth >= 768 ? desktopIframeRef.current : mobileIframeRef.current;
    if (currentIframe && currentIframe.contentWindow) {
      if (isMuted) {
        // 음소거 해제
        currentIframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
        setIsMuted(false);
      } else {
        // 음소거
        currentIframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
        setIsMuted(true);
      }
    }
  };

  const handleMuteClick = () => {
    const currentVideo = window.innerWidth >= 768 ? desktopVideoRef.current : mobileVideoRef.current;
    if (currentVideo) {
      currentVideo.muted = !currentVideo.muted;
      setIsMuted(currentVideo.muted);
    }
  };

  const renderControls = () => {
    const isYouTube = desktopVideoUrl.includes('youtube.com/embed/') || currentMobileVideo.includes('youtube.com/embed/');
    
    return (
      <div className="absolute bottom-6 right-6 flex gap-3" style={{ zIndex: 30 }}>
        {/* 재생/일시정지 버튼 */}
        <button
          onClick={isYouTube ? handleYouTubePlayPause : handlePlayClick}
          className="group bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 hover:text-blue-600 p-3 md:p-2.5 rounded-full transition-all duration-200 touch-manipulation shadow-xl hover:shadow-2xl transform hover:scale-105"
          title={isPlaying ? "일시정지" : "재생"}
        >
          {isPlaying ? (
            <svg className="w-7 h-7 md:w-6 md:h-6 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <Play className="w-7 h-7 md:w-6 md:h-6 transition-colors" />
          )}
        </button>

        {/* 음소거 버튼 */}
        <button
          onClick={isYouTube ? handleYouTubeMute : handleMuteClick}
          className="group bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 hover:text-blue-600 p-3 md:p-2.5 rounded-full transition-all duration-200 touch-manipulation shadow-xl hover:shadow-2xl transform hover:scale-105"
          title={isMuted ? "음소거 해제" : "음소거"}
        >
          {isMuted ? (
            <VolumeX className="w-7 h-7 md:w-6 md:h-6 transition-colors" />
          ) : (
            <Volume2 className="w-7 h-7 md:w-6 md:h-6 transition-colors" />
          )}
        </button>
      </div>
    );
  };

  const renderFallback = () => (
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      {autoplayFailed && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs px-3 py-2 rounded">
          자동재생이 차단되었습니다. 우측 버튼을 클릭하여 재생하세요.
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 로딩 상태 */}
      {!isLoaded && (desktopVideoUrl || mobileVideoUrl) && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center z-20">
          <div className="text-white text-lg animate-pulse">영상 로딩 중...</div>
        </div>
      )}

      {/* 데스크탑 영상 (md 이상 화면에서 표시) - 1920x1080 (16:9) 비율 */}
      <div className="hidden md:block absolute inset-0 w-full h-full" style={{ aspectRatio: '16/9' }}>
        {desktopVideoUrl ? renderVideo(desktopVideoUrl, false) : renderFallback()}
      </div>
      
      {/* 모바일 영상 (md 미만 화면에서 표시) - 1080x1920 최적화 */}
      <div className="block md:hidden absolute inset-0 w-full h-full">
        {currentMobileVideo ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {renderVideo(currentMobileVideo, true)}
          </div>
        ) : (
          renderFallback()
        )}
      </div>

      {/* 비디오 컨트롤 */}
      {isLoaded && (desktopVideoUrl || currentMobileVideo) && renderControls()}
    </>
  );
}