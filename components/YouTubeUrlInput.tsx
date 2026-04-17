'use client';

import { useState, useEffect } from 'react';
import { Play, Check, X, AlertCircle } from 'lucide-react';

interface YouTubeUrlInputProps {
  onUrlChange: (url: string) => void;
  currentUrl?: string;
}

export default function YouTubeUrlInput({ onUrlChange, currentUrl = '' }: YouTubeUrlInputProps) {
  const [inputUrl, setInputUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState(currentUrl);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    setEmbedUrl(currentUrl);
    setInputUrl(currentUrl ? convertToWatchUrl(currentUrl) : '');
  }, [currentUrl]);

  const convertToWatchUrl = (embedUrl: string) => {
    if (embedUrl.includes('youtube.com/embed/')) {
      const videoId = embedUrl.match(/\/embed\/([^?]+)/)?.[1];
      return videoId ? `https://www.youtube.com/watch?v=${videoId}` : embedUrl;
    }
    return embedUrl;
  };

  const convertToEmbedUrl = (watchUrl: string) => {
    // YouTube URL에서 비디오 ID 추출
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\s]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?\s]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?\s]+)/,
    ];

    for (const pattern of patterns) {
      const match = watchUrl.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    
    return null;
  };

  const validateAndConvert = (url: string) => {
    if (!url.trim()) {
      setError('');
      setIsValid(false);
      setEmbedUrl('');
      return;
    }

    const embedUrl = convertToEmbedUrl(url);
    console.log('Original URL:', url);
    console.log('Converted Embed URL:', embedUrl);
    
    if (embedUrl) {
      setError('');
      setIsValid(true);
      setEmbedUrl(embedUrl);
    } else {
      setError('올바른 YouTube URL을 입력해주세요');
      setIsValid(false);
      setEmbedUrl('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setInputUrl(url);
    validateAndConvert(url);
  };

  const handleApply = () => {
    console.log('Apply clicked - isValid:', isValid, 'embedUrl:', embedUrl);
    if (isValid && embedUrl) {
      console.log('Calling onUrlChange with:', embedUrl);
      onUrlChange(embedUrl);
      setApplied(true);
      // 입력 필드 초기화 (적용 후)
      setInputUrl('');
      setIsValid(false);
      setEmbedUrl('');
      
      // 3초 후 성공 메시지 제거
      setTimeout(() => setApplied(false), 3000);
    } else {
      console.log('Apply failed - not valid or no embed URL');
      alert('올바른 YouTube URL을 입력해주세요.');
    }
  };

  const handleRemove = () => {
    setInputUrl('');
    setEmbedUrl('');
    setIsValid(false);
    setError('');
    onUrlChange('');
  };

  return (
    <div className="space-y-4">
      {/* 현재 설정된 YouTube 영상 */}
      {currentUrl && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-green-700">
              <Check className="w-5 h-5" />
              <span className="font-medium">현재 설정된 YouTube 영상</span>
            </div>
            <button
              onClick={handleRemove}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="YouTube 영상 제거"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
            <iframe
              src={currentUrl + '?rel=0&modestbranding=1'}
              title="현재 YouTube 영상"
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* URL 입력 영역 */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-medium text-red-900 mb-1">YouTube URL 입력</h3>
            <p className="text-sm text-red-700">
              YouTube 영상 링크를 입력하면 자동으로 임베드 URL로 변환됩니다
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube URL
            </label>
            <input
              type="url"
              value={inputUrl}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID 또는 https://youtu.be/VIDEO_ID"
              className={`
                w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                ${error 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : isValid 
                    ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
            />
            
            {/* 상태 메시지 */}
            {error && (
              <div className="flex items-center gap-2 mt-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            {isValid && !error && (
              <div className="flex items-center gap-2 mt-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm">올바른 YouTube URL입니다</span>
              </div>
            )}
          </div>

          {/* 미리보기 */}
          {isValid && embedUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                미리보기
              </label>
              <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                <iframe
                  src={embedUrl + '?rel=0&modestbranding=1'}
                  title="YouTube 미리보기"
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* 성공 메시지 */}
          {applied && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                <span className="font-medium">YouTube 영상이 적용되었습니다!</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                이제 "저장" 버튼을 클릭하여 설정을 완료해주세요.
              </p>
            </div>
          )}

          {/* 적용 버튼 */}
          <button
            onClick={handleApply}
            disabled={!isValid || !embedUrl}
            className={`
              w-full py-3 px-4 rounded-lg font-medium transition-colors
              ${isValid && embedUrl
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            YouTube 영상 적용
          </button>
        </div>
      </div>

      {/* 사용법 안내 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Play className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">YouTube URL 사용법</p>
            <ul className="text-xs space-y-1 text-blue-600">
              <li>• 일반 YouTube 링크: youtube.com/watch?v=VIDEO_ID</li>
              <li>• 단축 링크: youtu.be/VIDEO_ID</li>
              <li>• 임베드 링크: youtube.com/embed/VIDEO_ID</li>
              <li>• 자동으로 임베드 URL로 변환됩니다</li>
              <li>• 무료이며 별도 저장공간이 필요없습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}