'use client';

import { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';
import { useClients, Client } from '@/lib/hooks/useClients';

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
      {/* Sticky 하단 바 */}
      <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2">
          {/* 공통 안내 멘트 */}
          <div className="text-center mb-2 sm:mb-3">
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              캠프에 관해 궁금한 것이 있으시면 언제든 문의주세요!
            </p>
          </div>
          
          <div className="flex gap-1.5 sm:gap-2 justify-center">
            {/* 전화 문의 버튼 (2/3 너비) */}
            <button
              onClick={handleCall}
              className="flex-[2] max-w-md bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex flex-col items-center justify-center font-medium"
              aria-label="전화 문의"
            >
              <span className="text-xs sm:text-sm font-semibold">
                문의: {currentClient?.contactPhone || '010-3179-4282'}
              </span>
              {currentClient?.callMessage && (
                <span className="text-xs opacity-90 mt-0.5 text-center leading-tight">
                  {currentClient.callMessage}
                </span>
              )}
            </button>

            {/* AI 챗봇 버튼 (1/3 너비) */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`flex-[1] max-w-xs py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex flex-col items-center justify-center font-medium ${
                isChatOpen
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              aria-label={isChatOpen ? 'AI 챗봇 닫기' : 'AI 챗봇 열기'}
            >
              <span className="text-xs sm:text-sm font-semibold">
                {isChatOpen ? '챗봇 닫기' : 'AI 챗봇'}
              </span>
              {!isChatOpen && (
                <span className="text-xs opacity-90 mt-0.5">(즉시 답변)</span>
              )}
            </button>
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