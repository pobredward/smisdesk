'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ScheduleItem {
  time: string;
  basic: string;
  growing: string;
  academy: string;
  detailId?: string;
}

const ScheduleTab = ({ campId = 'je' }: { campId?: string }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'basic' | 'growing' | 'academy'>('basic');

  // 시간표 데이터
  const scheduleData: ScheduleItem[] = [
    { time: "08:00-08:20", basic: "기상 및 아침 운동", growing: "기상 및 아침 운동", academy: "기상 및 아침 운동", detailId: "morning-exercise" },
    { time: "08:20-09:20", basic: "아침 식사", growing: "아침 식사", academy: "아침 식사", detailId: "breakfast" },
    { time: "09:20-10:00", basic: "원어민 Speaking 프로그램 1", growing: "창의융합 STEAM 프로그램 1", academy: "프린트 점핑", detailId: "program-1" },
    { time: "10:10-10:50", basic: "원어민 Speaking 프로그램 2", growing: "(Science 중점 part 1)", academy: "레티버시 창소 사진고육", detailId: "program-2" },
    { time: "11:00-11:40", basic: "스피크업 프로젝트 (영어 빼킹)", growing: "창의융합 STEAM 프로그램 2", academy: "점심 식사", detailId: "project-1" },
    { time: "11:50-12:30", basic: "수학 멘토링", growing: "(Science 중점 part 2)", academy: "", detailId: "mentoring-1" },
    { time: "12:30-13:30", basic: "점심 식사", growing: "점심 식사", academy: "어학 에더버터 (with 원어민 선생님)", detailId: "lunch" },
    { time: "13:30-14:10", basic: "원어민 Reading 프로그램 1", growing: "창의융합 STEAM 프로그램 3", academy: "", detailId: "reading-1" },
    { time: "12:30-16:40", basic: "", growing: "", academy: "창작우수학물원 - 현대미 & 박물관운 집어치기 - 소수점 터미널카 & 액자 소게비카", detailId: "special-activity" },
    { time: "14:20-15:00", basic: "원어민 Reading 프로그램 2", growing: "(Technology 중점)", academy: "", detailId: "reading-2" },
    { time: "15:10-16:30", basic: "P.E (체육 활동) / 사회", growing: "창의융합 STEAM 프로그램 4", academy: "※ 활동 장소 방문가능", detailId: "pe-social" },
    { time: "16:00-16:40", basic: "", growing: "(Engineering 중점)", academy: "", detailId: "engineering" },
    { time: "16:40-17:20", basic: "원어민 Writing 프로그램 1", growing: "", academy: "", detailId: "writing-1" },
    { time: "16:50-18:20", basic: "", growing: "창지학적 연구 및 리허설", academy: "사회 및 지역 탐방", detailId: "research" },
    { time: "17:30-18:20", basic: "원어민 Writing 프로그램 2", growing: "", academy: "", detailId: "writing-2" },
    { time: "18:30-19:30", basic: "저녁 식사", growing: "저녁 식사", academy: "저녁 식사", detailId: "dinner" },
    { time: "18:30-19:30", basic: "Paper Trip ver 8 (데미카 스토리텔링 이동식)", growing: "", academy: "", detailId: "paper-trip" },
    { time: "19:30-20:10", basic: "", growing: "드림 팩토링 프로그램 (지기 원활 & 개별, 저녁 심포토)", academy: "Week Ending Snack Party & 졸업식과 총회", detailId: "dream-factory" },
    { time: "19:30-21:00", basic: "", growing: "", academy: "", detailId: "evening-activity" },
    { time: "20:20-21:00", basic: "", growing: "", academy: "", detailId: "night-program" },
    { time: "21:00-21:30", basic: "개인정리 & 휴식", growing: "사회 및 개인정리 & 휴식", academy: "개인정리 & 휴식", detailId: "personal-time" }
  ];

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch(`/api/images?campId=${campId}&section=schedule`);
        if (response.ok) {
          const data = await response.json();
          const sortedImages = data.images.sort((a: string, b: string) => {
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
          });
          setImages(sortedImages);
        }
      } catch (error) {
        console.error('이미지 로딩 오류:', error);
      }
      
      setLoading(false);
    };

    loadImages();
  }, [campId]);

  const handleCellClick = (detailId: string, program: string) => {
    // 실제 API에서 프로그램 ID를 가져와서 라우팅
    // 현재는 detailId로 라우팅 (추후 API 연동 시 수정)
    window.location.href = `/smis/camp/${campId}/schedule/${detailId}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-lg text-gray-600">이미지를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 데스크탑용 HTML 시간표 */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="bg-purple-100 p-4 text-center">
          <h2 className="text-xl font-bold text-purple-800">WEEKLY SCHEDULE ( For Example )</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            {/* 헤더 */}
            <thead>
              <tr>
                <th className="bg-gray-100 border border-gray-300 p-2 font-bold text-gray-800 min-w-[100px]">시간</th>
                <th className="bg-purple-100 border border-gray-300 p-2 font-bold text-purple-800 min-w-[250px]">
                  집중 프로그램 (총 5일)
                </th>
                <th className="bg-red-100 border border-gray-300 p-2 font-bold text-red-800 min-w-[250px]">
                  Growing (STEAM) 프로그램 (총 1일)
                </th>
                <th className="bg-green-100 border border-gray-300 p-2 font-bold text-green-800 min-w-[250px]">
                  외식아카데미 프로그램 (총 1일)
                </th>
              </tr>
            </thead>

            {/* 바디 */}
            <tbody>
              {scheduleData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-medium text-center bg-gray-50">
                    {item.time}
                  </td>
                  <td 
                    className={`border border-gray-300 p-2 cursor-pointer transition-colors ${
                      item.basic ? 'hover:bg-purple-50 text-gray-800' : 'bg-gray-100'
                    }`}
                    onClick={() => item.basic && item.detailId && handleCellClick(item.detailId, item.basic)}
                  >
                    {item.basic && (
                      <div className="flex items-center justify-between">
                        <span>{item.basic}</span>
                        {item.basic && <span className="text-purple-600 opacity-50">→</span>}
                      </div>
                    )}
                  </td>
                  <td 
                    className={`border border-gray-300 p-2 cursor-pointer transition-colors ${
                      item.growing ? 'hover:bg-red-50 text-gray-800' : 'bg-gray-100'
                    }`}
                    onClick={() => item.growing && item.detailId && handleCellClick(item.detailId, item.growing)}
                  >
                    {item.growing && (
                      <div className="flex items-center justify-between">
                        <span>{item.growing}</span>
                        {item.growing && <span className="text-red-600 opacity-50">→</span>}
                      </div>
                    )}
                  </td>
                  <td 
                    className={`border border-gray-300 p-2 cursor-pointer transition-colors ${
                      item.academy ? 'hover:bg-green-50 text-gray-800' : 'bg-gray-100'
                    }`}
                    onClick={() => item.academy && item.detailId && handleCellClick(item.detailId, item.academy)}
                  >
                    {item.academy && (
                      <div className="flex items-center justify-between">
                        <span>{item.academy}</span>
                        {item.academy && <span className="text-green-600 opacity-50">→</span>}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-red-50 p-2 text-center">
          <p className="text-red-600 text-sm">※ 참가자별 시간표는 여기 그룹별로 상이합니다.</p>
        </div>
      </div>

      {/* 모바일용 카드형 시간표 */}
      <div className="md:hidden space-y-4">
        <div className="bg-purple-100 p-4 text-center rounded-lg">
          <h2 className="text-lg font-bold text-purple-800">주간 시간표</h2>
        </div>

        {/* 프로그램별 탭 */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button 
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'basic' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:text-purple-600'
            }`}
            onClick={() => setActiveTab('basic')}
          >
            집중 프로그램
          </button>
          <button 
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'growing' ? 'bg-red-500 text-white' : 'text-gray-600 hover:text-red-600'
            }`}
            onClick={() => setActiveTab('growing')}
          >
            STEAM
          </button>
          <button 
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'academy' ? 'bg-green-500 text-white' : 'text-gray-600 hover:text-green-600'
            }`}
            onClick={() => setActiveTab('academy')}
          >
            외식아카데미
          </button>
        </div>

        {/* 선택된 프로그램의 시간표 - 컴팩트한 표 형식 */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {scheduleData
            .filter(item => {
              if (activeTab === 'basic') return item.basic;
              if (activeTab === 'growing') return item.growing;
              if (activeTab === 'academy') return item.academy;
              return false;
            })
            .map((item, index) => {
              const program = activeTab === 'basic' ? item.basic : 
                             activeTab === 'growing' ? item.growing : item.academy;
              const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
              const hoverClass = activeTab === 'basic' ? 'hover:bg-purple-50' :
                                activeTab === 'growing' ? 'hover:bg-red-50' :
                                'hover:bg-green-50';
              
              return (
                <div 
                  key={index}
                  className={`${bgClass} ${hoverClass} border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors`}
                  onClick={() => item.detailId && handleCellClick(item.detailId, program)}
                >
                  <div className="flex items-center px-3 py-2">
                    <div className="w-24 flex-shrink-0">
                      <span className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded text-center block">
                        {item.time}
                      </span>
                    </div>
                    <div className="flex-1 px-3">
                      <span className="text-sm text-gray-800">
                        {program}
                      </span>
                    </div>
                    <div className={`w-6 text-right ${
                      activeTab === 'basic' ? 'text-purple-400' :
                      activeTab === 'growing' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      →
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="bg-red-50 p-3 text-center rounded-lg">
          <p className="text-red-600 text-sm">※ 참가자별 시간표는 그룹별로 상이합니다.</p>
        </div>
      </div>

      {/* 기존 이미지들 */}
      {images.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-t pt-4">참고 자료</h3>
          {images.map((imageSrc, index) => (
            <div key={index} className="w-full">
              <Image
                src={imageSrc}
                alt={`일정표 이미지 ${index + 1}`}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg shadow-sm"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          추가 일정표 이미지가 준비 중입니다.
        </div>
      )}
    </div>
  );
};

export default ScheduleTab;