'use client';

import { useState } from 'react';
import { Upload, X, Loader2, Video, Check } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, uploadBytesResumable } from 'firebase/storage';

interface VideoUploadProps {
  onUploadSuccess: (url: string) => void;
  currentUrl?: string;
  onRemove?: () => void;
  isMobile?: boolean;
}

export default function VideoUpload({ onUploadSuccess, currentUrl, onRemove, isMobile = false }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // 동영상 파일인지 확인
    if (!file.type.startsWith('video/')) {
      alert('동영상 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 확인 (환경변수에서 제한값 가져오기, 기본값: 300MB)
    const maxFileSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '314572800'); // 300MB in bytes
    if (file.size > maxFileSize) {
      const maxSizeMB = Math.floor(maxFileSize / (1024 * 1024));
      alert(`파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // 기존 파일이 있다면 먼저 삭제
      if (currentUrl && currentUrl.includes('firebasestorage.googleapis.com')) {
        try {
          const pathMatch = currentUrl.match(/\/o\/(.+?)\?/);
          if (pathMatch) {
            const filePath = decodeURIComponent(pathMatch[1]);
            const oldVideoRef = ref(storage, filePath);
            await deleteObject(oldVideoRef);
            console.log('기존 파일 삭제 완료');
          }
        } catch (error) {
          console.warn('기존 파일 삭제 실패 (파일이 존재하지 않을 수 있음):', error);
        }
      }

      // 고정된 파일명 사용 (타입별로 구분)
      const deviceType = isMobile ? 'mobile' : 'desktop';
      const fileExtension = file.name.split('.').pop() || 'mp4';
      const fileName = `hero-videos/${deviceType}-hero-video.${fileExtension}`;
      const videoRef = ref(storage, fileName);

      // 대용량 파일을 위한 resumable 업로드 사용
      const uploadTask = uploadBytesResumable(videoRef, file);

      // 업로드 진행률 모니터링
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error('업로드 오류:', error);
          alert('동영상 업로드에 실패했습니다.');
          setUploading(false);
          setUploadProgress(0);
        },
        async () => {
          // 업로드 완료
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadSuccess(downloadURL);
          alert('동영상이 성공적으로 업로드되었습니다.');
          setUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (error) {
      console.error('업로드 오류:', error);
      alert('동영상 업로드에 실패했습니다.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleRemove = async () => {
    if (!currentUrl || !onRemove) return;

    try {
      // Firebase Storage에서 파일 삭제
      if (currentUrl.includes('firebasestorage.googleapis.com')) {
        const pathMatch = currentUrl.match(/\/o\/(.+?)\?/);
        if (pathMatch) {
          const filePath = decodeURIComponent(pathMatch[1]);
          const videoRef = ref(storage, filePath);
          await deleteObject(videoRef);
        }
      }
      
      onRemove();
      alert('동영상이 삭제되었습니다.');
    } catch (error) {
      console.error('삭제 오류:', error);
      // 파일이 이미 삭제되었거나 존재하지 않는 경우에도 UI에서는 제거
      onRemove();
      alert('동영상이 제거되었습니다.');
    }
  };

  return (
    <div className="space-y-4">
      {/* 현재 동영상이 있는 경우 */}
      {currentUrl && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-green-700">
              <Check className="w-5 h-5" />
              <span className="font-medium">현재 설정된 동영상</span>
            </div>
            {onRemove && (
              <button
                onClick={handleRemove}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="동영상 제거"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="relative">
            <video
              src={currentUrl}
              controls
              className="w-full max-w-md rounded-lg border border-gray-300"
              onError={(e) => {
                console.error('비디오 로드 오류:', e);
                const video = e.target as HTMLVideoElement;
                video.style.display = 'none';
                const errorDiv = video.nextElementSibling as HTMLDivElement;
                if (errorDiv) errorDiv.style.display = 'block';
              }}
            >
              동영상을 로드할 수 없습니다.
            </video>
            <div 
              className="hidden bg-red-50 border border-red-200 rounded-lg p-4 text-center"
              style={{ display: 'none' }}
            >
              <p className="text-red-600 text-sm">
                ⚠️ 동영상을 로드할 수 없습니다. 파일이 손상되었거나 삭제되었을 수 있습니다.
              </p>
              <p className="text-red-500 text-xs mt-1">
                새로운 동영상을 업로드해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 업로드 영역 */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={handleDrop}
        onClick={() => document.getElementById('video-upload')?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm">동영상 업로드 중...</p>
                <span className="text-indigo-600 font-medium text-sm">{uploadProgress}%</span>
              </div>
              {/* 진행률 바 */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              {uploadProgress > 0 && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {uploadProgress < 100 ? '업로드 중...' : '처리 중...'}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-1">
                동영상 파일을 드래그하거나 클릭해서 업로드하세요
              </p>
              <p className="text-sm text-gray-500">
                지원 형식: MP4, WebM, AVI (최대 300MB)
              </p>
              {isMobile && (
                <p className="text-sm text-green-600 mt-1 font-medium">
                  📱 모바일용: 1080x1920 (9:16 비율) 세로영상을 권장합니다
                </p>
              )}
              {!isMobile && (
                <p className="text-sm text-blue-600 mt-1 font-medium">
                  🖥️ 데스크탑용: 1920x1080 (16:9 비율) 가로영상을 권장합니다
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <input
        id="video-upload"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      {/* 업로드 정보 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Video className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Firebase Storage 업로드</p>
            <ul className="text-xs space-y-1 text-blue-600">
              <li>• 안정적인 Google 인프라 사용</li>
              <li>• 자동 CDN 배포로 빠른 로딩</li>
              <li>• 월 5GB 저장 + 1GB/일 전송 무료</li>
              <li>• 최대 300MB 대용량 파일 지원</li>
              <li>• 자체 도메인에서 서비스</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}