'use client';

import Link from 'next/link';
import { ArrowLeft, Save, Upload, Video, Monitor, Smartphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import VideoUpload from '@/components/VideoUpload';
import YouTubeUrlInput from '@/components/YouTubeUrlInput';

export default function VideoSettingsPage() {
  const [desktopVideoUrl, setDesktopVideoUrl] = useState('');
  const [mobileVideoUrl, setMobileVideoUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');
  const [desktopVideoType, setDesktopVideoType] = useState<'upload' | 'youtube'>('upload');
  const [mobileVideoType, setMobileVideoType] = useState<'upload' | 'youtube'>('upload');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideoSettings();
  }, []);

  const loadVideoSettings = async () => {
    try {
      const settingsSnapshot = await getDocs(collection(db, 'settings'));
      if (!settingsSnapshot.empty) {
        const settings = settingsSnapshot.docs[0].data();
        
        // 데스크탑 영상 설정
        const desktopUrl = settings.desktopVideoUrl || settings.heroVideoUrl || '';
        setDesktopVideoUrl(desktopUrl);
        if (desktopUrl.includes('youtube.com/embed/')) {
          setDesktopVideoType('youtube');
        } else {
          setDesktopVideoType('upload');
        }
        
        // 모바일 영상 설정
        const mobileUrl = settings.mobileVideoUrl || '';
        setMobileVideoUrl(mobileUrl);
        if (mobileUrl.includes('youtube.com/embed/')) {
          setMobileVideoType('youtube');
        } else {
          setMobileVideoType('upload');
        }
      }
    } catch (error) {
      console.error('영상 설정 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveVideoSettings = async () => {
    try {
      const settingsSnapshot = await getDocs(collection(db, 'settings'));
      
      const videoSettings = {
        desktopVideoUrl,
        mobileVideoUrl,
        // 이전 버전과의 호환성을 위해 heroVideoUrl도 유지
        heroVideoUrl: desktopVideoUrl,
        updatedAt: Timestamp.now(),
      };
      
      if (settingsSnapshot.empty) {
        await addDoc(collection(db, 'settings'), videoSettings);
      } else {
        const docRef = doc(db, 'settings', settingsSnapshot.docs[0].id);
        await updateDoc(docRef, videoSettings);
      }
      
      alert('영상 설정이 저장되었습니다.');
    } catch (error) {
      console.error('영상 설정 저장 오류:', error);
      alert('영상 설정 저장에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              대시보드로 돌아가기
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">영상 설정</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">홈페이지 영상 설정</h2>
          <p className="text-sm text-gray-600 mb-6">
            거래처 페이지 상단 히어로 섹션에 표시될 영상을 설정하세요. 데스크탑과 모바일에서 각각 다른 영상을 표시할 수 있습니다.
          </p>

          {loading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : (
            <div className="space-y-8">
              {/* 데스크탑/모바일 탭 선택 */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setActiveTab('desktop')}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all
                    ${activeTab === 'desktop' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Monitor className="w-4 h-4" />
                  데스크탑 (가로영상)
                </button>
                <button
                  onClick={() => setActiveTab('mobile')}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all
                    ${activeTab === 'mobile' 
                      ? 'bg-white text-green-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Smartphone className="w-4 h-4" />
                  모바일 (세로영상)
                </button>
              </div>

              {activeTab === 'desktop' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-blue-900">데스크탑 영상 설정</h3>
                    </div>
                    <p className="text-sm text-blue-700">
                      PC 및 태블릿 가로모드에서 표시되는 영상입니다. 1920x1080 (16:9 비율) 가로영상을 권장합니다.
                    </p>
                  </div>

                  {/* 데스크탑 영상 타입 선택 */}
                  <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
                    <button
                      onClick={() => setDesktopVideoType('upload')}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all
                        ${desktopVideoType === 'upload' 
                          ? 'bg-white text-indigo-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                        }
                      `}
                    >
                      <Upload className="w-4 h-4" />
                      파일 업로드
                    </button>
                    <button
                      onClick={() => setDesktopVideoType('youtube')}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all
                        ${desktopVideoType === 'youtube' 
                          ? 'bg-white text-red-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                        }
                      `}
                    >
                      <Video className="w-4 h-4" />
                      YouTube URL
                    </button>
                  </div>

                  {/* 데스크탑 영상 업로드/URL 입력 */}
                  {desktopVideoType === 'upload' ? (
                    <VideoUpload
                      onUploadSuccess={setDesktopVideoUrl}
                      currentUrl={desktopVideoUrl && !desktopVideoUrl.includes('youtube.com/embed/') ? desktopVideoUrl : ''}
                      onRemove={() => setDesktopVideoUrl('')}
                      isMobile={false}
                    />
                  ) : (
                    <YouTubeUrlInput
                      onUrlChange={setDesktopVideoUrl}
                      currentUrl={desktopVideoUrl.includes('youtube.com/embed/') ? desktopVideoUrl : ''}
                    />
                  )}
                </div>
              )}

              {activeTab === 'mobile' && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="w-5 h-5 text-green-600" />
                      <h3 className="font-medium text-green-900">모바일 영상 설정</h3>
                    </div>
                    <p className="text-sm text-green-700">
                      모바일 세로모드에서 표시되는 영상입니다. 9:16 비율의 세로영상을 권장합니다. 설정하지 않으면 데스크탑 영상이 사용됩니다.
                    </p>
                  </div>

                  {/* 모바일 영상 타입 선택 */}
                  <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
                    <button
                      onClick={() => setMobileVideoType('upload')}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all
                        ${mobileVideoType === 'upload' 
                          ? 'bg-white text-indigo-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                        }
                      `}
                    >
                      <Upload className="w-4 h-4" />
                      파일 업로드
                    </button>
                    <button
                      onClick={() => setMobileVideoType('youtube')}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all
                        ${mobileVideoType === 'youtube' 
                          ? 'bg-white text-red-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                        }
                      `}
                    >
                      <Video className="w-4 h-4" />
                      YouTube URL
                    </button>
                  </div>

                  {/* 모바일 영상 업로드/URL 입력 */}
                  {mobileVideoType === 'upload' ? (
                    <VideoUpload
                      onUploadSuccess={setMobileVideoUrl}
                      currentUrl={mobileVideoUrl && !mobileVideoUrl.includes('youtube.com/embed/') ? mobileVideoUrl : ''}
                      onRemove={() => setMobileVideoUrl('')}
                      isMobile={true}
                    />
                  ) : (
                    <YouTubeUrlInput
                      onUrlChange={setMobileVideoUrl}
                      currentUrl={mobileVideoUrl.includes('youtube.com/embed/') ? mobileVideoUrl : ''}
                    />
                  )}
                </div>
              )}

              {/* 미리보기 섹션 */}
              {(desktopVideoUrl || mobileVideoUrl) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    미리보기
                  </label>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* 데스크탑 미리보기 */}
                    {desktopVideoUrl && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Monitor className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">데스크탑 (1920x1080)</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border">
                          {desktopVideoUrl.includes('youtube.com/embed/') ? (
                            <iframe
                              src={desktopVideoUrl + '?rel=0&modestbranding=1'}
                              title="Desktop video preview"
                              className="w-full aspect-video rounded border border-gray-300"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="relative">
                              <video
                                src={desktopVideoUrl}
                                controls
                                className="w-full aspect-video rounded border border-gray-300 object-cover"
                                onError={(e) => {
                                  console.error('데스크탑 비디오 로드 오류:', e);
                                  const video = e.target as HTMLVideoElement;
                                  video.style.display = 'none';
                                  const errorDiv = video.nextElementSibling as HTMLDivElement;
                                  if (errorDiv) errorDiv.style.display = 'block';
                                }}
                              >
                                영상을 로드할 수 없습니다.
                              </video>
                              <div 
                                className="hidden bg-red-50 border border-red-200 rounded p-4 text-center"
                                style={{ display: 'none' }}
                              >
                                <p className="text-red-600 text-sm">⚠️ 데스크탑 영상을 로드할 수 없습니다.</p>
                                <p className="text-red-500 text-xs mt-1">새로운 영상을 업로드해주세요.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 모바일 미리보기 */}
                    {mobileVideoUrl && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Smartphone className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">모바일 (1080x1920)</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border w-48 mx-auto">
                          {mobileVideoUrl.includes('youtube.com/embed/') ? (
                            <iframe
                              src={mobileVideoUrl + '?rel=0&modestbranding=1'}
                              title="Mobile video preview"
                              className="w-full aspect-[9/16] rounded border border-gray-300"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="relative">
                              <video
                                src={mobileVideoUrl}
                                controls
                                className="w-full aspect-[9/16] rounded border border-gray-300 object-cover"
                                onError={(e) => {
                                  console.error('모바일 비디오 로드 오류:', e);
                                  const video = e.target as HTMLVideoElement;
                                  video.style.display = 'none';
                                  const errorDiv = video.nextElementSibling as HTMLDivElement;
                                  if (errorDiv) errorDiv.style.display = 'block';
                                }}
                              >
                                영상을 로드할 수 없습니다.
                              </video>
                              <div 
                                className="hidden bg-red-50 border border-red-200 rounded p-2 text-center"
                                style={{ display: 'none' }}
                              >
                                <p className="text-red-600 text-xs">⚠️ 모바일 영상을 로드할 수 없습니다.</p>
                                <p className="text-red-500 text-xs mt-1">새로운 영상을 업로드해주세요.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </Link>
                <button
                  onClick={saveVideoSettings}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  저장
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
