'use client';

import { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import ChatWidget from './ChatWidget';

interface FloatingActionsProps {
  clientId: string;
}

export default function FloatingActions({ clientId }: FloatingActionsProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleCall = () => {
    window.location.href = 'tel:010-3179-4282';
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      {/* 플로팅 버튼들 */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {/* 전화 버튼 */}
        <button
          onClick={handleCall}
          className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
          aria-label="전화 문의"
        >
          <Phone className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* AI 챗봇 버튼 */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 ${
            isChatOpen
              ? 'bg-gray-600 hover:bg-gray-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group`}
          aria-label={isChatOpen ? 'AI 챗봇 닫기' : 'AI 챗봇 열기'}
        >
          {isChatOpen ? (
            <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
          ) : (
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* AI 챗봇 모달 */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 배경 오버레이 - 더 밝게 */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
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
