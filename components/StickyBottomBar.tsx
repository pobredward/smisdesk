'use client';

import { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';
import { useClients, Client } from '@/lib/hooks/useClients';
import { Phone, MessageCircle } from 'lucide-react';

interface StickyBottomBarProps {
  clientId: string;
}

export default function StickyBottomBar({ clientId }: StickyBottomBarProps) {
  const { clients } = useClients();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);

  useEffect(() => {
    const client = clients.find(c => c.clientId === clientId);
    setCurrentClient(client || null);
  }, [clients, clientId]);

  const handleCall = () => {
    const phoneNumber = currentClient?.contactPhone || '010-3179-4282'; // 기본 번호
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse-soft {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
            transform: scale(1.02);
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        .pulse-animation {
          animation: pulse-soft 2s infinite;
        }
        
        .ripple-effect {
          position: relative;
          overflow: hidden;
        }
        
        .ripple-effect::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: ripple 0.6s linear;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
      `}</style>

      {/* Sticky 하단 바 */}
      <div className="sticky bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t border-gray-200 shadow-2xl z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          {/* 안내 멘트 - 모바일에서 더 컴팩트 */}
          <div className="text-center mb-2 sm:mb-3">
            {/* 데스크탑용 */}
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700 font-medium">
                캠프에 관해 궁금한 것이 있으시면 <span className="text-green-600 font-semibold">지금 바로</span> 문의주세요!
              </p>
            </div>
            
            {/* 모바일용 - 더 간결하게 */}
            <div className="block sm:hidden">
              <p className="text-xs text-gray-600 font-medium">
                <span className="text-green-600 font-semibold">지금</span> 문의하세요!
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 sm:gap-3 justify-center">
            {/* 전화 문의 버튼 - 펄싱 효과와 그라데이션 */}
            <button
              onClick={handleCall}
              className="flex-[2] max-w-md bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 sm:gap-3 font-medium pulse-animation ripple-effect"
              aria-label="전화 문의"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <div className="flex flex-col items-start">
                <span className="text-sm sm:text-base font-bold leading-tight">
                  전화 문의
                </span>
                <span className="text-xs sm:text-sm opacity-90 leading-tight">
                  {currentClient?.contactPhone || '010-3179-4282'}
                </span>
                {currentClient?.callMessage && (
                  <span className="text-xs opacity-75 leading-tight hidden sm:block">
                    {currentClient.callMessage}
                  </span>
                )}
              </div>
              {/* 온라인 상태 표시 점 */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </button>

            {/* AI 챗봇 버튼 - 그라데이션과 향상된 피드백 */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`flex-[1] max-w-xs py-3 sm:py-4 px-3 sm:px-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 font-medium ripple-effect relative ${
                isChatOpen
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }`}
              aria-label={isChatOpen ? 'AI 챗봇 닫기' : 'AI 챗봇 열기'}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <div className="flex flex-col items-center">
                <span className="text-sm sm:text-base font-bold leading-tight">
                  {isChatOpen ? '챗봇 닫기' : 'AI 챗봇'}
                </span>
                {!isChatOpen && (
                  <span className="text-xs opacity-90 leading-tight">즉시 답변</span>
                )}
              </div>
              {/* AI 상태 표시등 */}
              {!isChatOpen && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </button>
          </div>
          
          {/* 추가 정보 - 데스크탑에만 표시 */}
          <div className="hidden sm:flex justify-center mt-2 text-xs text-gray-500">
            <span>전화 문의 및 AI 챗봇 상담 가능</span>
          </div>
        </div>
      </div>

      {/* AI 챗봇 모달 */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsChatOpen(false)}
          ></div>

          {/* 챗봇 위젯 */}
          <div className="relative w-full max-w-4xl z-10">
            <ChatWidget clientId={clientId} onClose={handleCloseChat} />
          </div>
        </div>
      )}
    </>
  );
}