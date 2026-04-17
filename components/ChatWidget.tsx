'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import { Send, Bot, User, Loader2, Sparkles, MapPin, X } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCategories } from '@/lib/hooks/useCategories';
import { LOCATIONS, LocationType } from '@/lib/types';

import { useClients } from '@/lib/hooks/useClients';

interface ChatWidgetProps {
  clientId: string;
  onClose?: () => void;
}

export default function ChatWidget({ clientId, onClose }: ChatWidgetProps) {
  const { clients, loading } = useClients();
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [availableCamps, setAvailableCamps] = useState<(typeof LOCATIONS)[number][]>([]);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! SMIS 캠프 FAQ 챗봇입니다. 캠프를 선택하고 카테고리를 선택하거나 직접 질문해주세요!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationType>('je');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { categories } = useCategories(selectedLocation);

  // clientInfo와 availableCamps 설정
  useEffect(() => {
    if (!loading && clients.length > 0) {
      const info = clients.find(c => c.clientId === clientId);
      setClientInfo(info);
      
      // 사용 가능한 캠프 설정
      const allCamps = LOCATIONS.filter(loc => loc.id !== 'common');
      
      if (info?.availableLocations && info.availableLocations.length > 0) {
        const filtered = allCamps.filter(camp => info.availableLocations!.includes(camp.id));
        setAvailableCamps(filtered);
        // 첫 번째 사용 가능한 캠프로 자동 선택
        if (filtered.length > 0) {
          setSelectedLocation(filtered[0].id as LocationType);
        }
      } else {
        setAvailableCamps(allCamps);
      }
    }
  }, [clients, clientId, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadSuggestedQuestions = async () => {
      if (selectedCategory === 'all') {
        setSuggestedQuestions([]);
        return;
      }

      try {
        const faqsSnapshot = await getDocs(collection(db, 'faqs'));
        const categoryFaqs = faqsSnapshot.docs
          .map(doc => doc.data())
          .filter(faq => {
            // 카테고리 필터
            if (faq.category !== selectedCategory) return false;
            
            // 위치 필터
            const locationMatch = faq.location === selectedLocation || faq.location === 'common';
            
            // 거래처별 사용 가능한 캠프 필터링
            if (clientInfo?.availableLocations && clientInfo.availableLocations.length > 0) {
              if (faq.location !== 'common' && !clientInfo.availableLocations!.includes(faq.location)) {
                return false;
              }
            }
            
            // 거래처 필터
            const clientMatch = faq.clients?.includes(clientId) || faq.clients?.includes('common');
            
            return locationMatch && clientMatch;
          })
          .map(faq => faq.question)
          .slice(0, 4);
        
        setSuggestedQuestions(categoryFaqs);
      } catch (error) {
        console.error('추천 질문 로드 오류:', error);
      }
    };

    loadSuggestedQuestions();
  }, [selectedCategory, selectedLocation, clientId, clientInfo]);

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || 'bg-blue-100 text-blue-700';
  };

  const handleSend = async (questionText?: string) => {
    const query = questionText || input.trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      location: LOCATIONS.find(l => l.id === selectedLocation)?.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const faqsSnapshot = await getDocs(collection(db, 'faqs'));
      let faqs = faqsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          question: data.question,
          answer: data.answer,
          category: data.category || '일반',
          location: data.location || 'je',
          clients: data.clients || ['common'],
        };
      });

      // 거래처 필터링 (선택한 거래처 + 공통)
      faqs = faqs.filter((faq: any) =>
        faq.clients.includes(clientId) || faq.clients.includes('common')
      );

      // 위치 필터링 (선택한 캠프 + 공통 + 거래처별 사용 가능한 캠프)
      faqs = faqs.filter((faq: any) => {
        // 공통은 항상 포함
        if (faq.location === 'common') return true;
        
        // 선택한 위치와 일치
        if (faq.location === selectedLocation) {
          // 거래처별 사용 가능한 캠프 확인
          if (clientInfo?.availableLocations && clientInfo.availableLocations.length > 0) {
            return clientInfo.availableLocations!.includes(faq.location);
          }
          return true;
        }
        
        return false;
      });

      // 카테고리 필터링
      if (selectedCategory !== 'all') {
        faqs = faqs.filter((faq: any) => faq.category === selectedCategory);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, faqs }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '응답을 받는데 실패했습니다.');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        sources: data.sources,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        location: LOCATIONS.find(l => l.id === selectedLocation)?.name,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 오류가 발생했습니다. Firestore에 FAQ 데이터가 있는지 확인해주세요.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-white font-bold text-sm sm:text-base hidden sm:block">SMIS 캠프 FAQ</h2>
              <p className="text-blue-100 text-xs hidden sm:block">무엇이든 물어보세요</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 캠프 선택 드롭다운 */}
            <div className="flex items-center gap-1 sm:gap-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white hidden sm:block" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value as LocationType)}
                className="bg-white/20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm border border-white/30"
              >
                {availableCamps.length > 0 ? (
                  availableCamps.map((loc) => (
                    <option key={loc.id} value={loc.id} className="text-gray-900">
                      {loc.emoji} {loc.name}
                    </option>
                  ))
                ) : (
                  <option value="je" className="text-gray-900">로딩 중...</option>
                )}
              </select>
            </div>
            
            {/* 닫기 버튼 */}
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="닫기"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-blue-50 to-white px-4 py-3 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <p className="text-xs font-medium text-gray-700">카테고리 선택</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.name
                  ? cat.color + ' shadow-md ring-2 ring-blue-400'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          )          )}
        </div>
      </div>

      {selectedCategory !== 'all' && suggestedQuestions.length > 0 && (
        <div className="px-4 py-3 bg-white border-b">
          <p className="text-xs font-medium text-gray-700 mb-2">💡 추천 질문</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(question)}
                disabled={isLoading}
                className="text-left px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md text-xs text-gray-700 transition-colors border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed line-clamp-2"
              >
                <span className="text-blue-600 font-medium">Q.</span> {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 sm:gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-blue-600'
                  : 'bg-gray-300'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              )}
            </div>

            <div
              className={`flex flex-col max-w-[75%] ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {message.category && (
                <span className={`text-xs px-2 py-0.5 rounded mb-1 ${getCategoryColor(message.category)}`}>
                  {message.category}
                </span>
              )}
              <div
                className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 rounded-tl-none shadow-md border border-gray-200'
                }`}
              >
                <p className="whitespace-pre-wrap break-words leading-relaxed text-sm">
                  {message.content}
                </p>
              </div>

              <span className="text-xs text-gray-400 mt-1 px-2">
                {message.timestamp.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gray-300">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </div>
            <div className="bg-white px-3 py-2 sm:px-4 sm:py-3 rounded-2xl rounded-tl-none shadow-md border border-gray-200">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-3 sm:p-4 bg-white">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={selectedCategory === 'all' ? `${LOCATIONS.find(l => l.id === selectedLocation)?.name}에 대해 질문하세요...` : `${selectedCategory}에 대해 질문하세요...`}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">전송</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center hidden sm:block">
          Enter로 전송 | Shift+Enter로 줄바꿈 | 카테고리 선택 시 추천 질문 표시
        </p>
      </div>
    </div>
  );
}
