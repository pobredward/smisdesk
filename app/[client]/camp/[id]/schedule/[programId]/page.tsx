'use client';

import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Target } from 'lucide-react';
import { ScheduleProgram } from '@/lib/schedule-types';
import AdaptiveBottomBar from '@/components/AdaptiveBottomBar';

export default function ProgramDetailPage({
  params
}: {
  params: Promise<{ client: string; id: string; programId: string }>
}) {
  const { client, id, programId } = use(params);
  const [program, setProgram] = useState<ScheduleProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgram = async () => {
      try {
        const response = await fetch(`/api/schedule/${programId}?campId=${id}`);
        if (response.ok) {
          const data = await response.json();
          setProgram(data);
        } else if (response.status === 404) {
          notFound();
        }
      } catch (error) {
        console.error('프로그램 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgram();
  }, [programId, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">프로그램 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (!program) {
    notFound();
  }

  const programTypeNames = {
    basic: '집중 프로그램',
    growing: 'Growing (STEAM) 프로그램',
    academy: '외식아카데미 프로그램'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6 py-4">
          <Link 
            href={`/${client}/camp/${id}/schedule`} 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>시간표로 돌아가기</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              program.programType === 'basic' ? 'bg-purple-100 text-purple-800' :
              program.programType === 'growing' ? 'bg-red-100 text-red-800' :
              'bg-green-100 text-green-800'
            }`}>
              {programTypeNames[program.programType]}
            </span>
            <span className="text-sm text-gray-600">{program.timeSlot}</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            {program.title}
          </h1>
          
          {program.description && (
            <p className="text-lg text-gray-600 leading-relaxed">
              {program.description}
            </p>
          )}
        </div>

        {/* 메타 정보 */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {program.duration && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-500">소요 시간</div>
                <div className="font-medium text-gray-900">{program.duration}</div>
              </div>
            </div>
          )}
          
          {program.location && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-500">장소</div>
                <div className="font-medium text-gray-900">{program.location}</div>
              </div>
            </div>
          )}
          
          {program.objectives && program.objectives.length > 0 && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg sm:col-span-2 md:col-span-1">
              <Target className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">목표</div>
                <div className="font-medium text-gray-900">
                  {program.objectives.slice(0, 2).join(', ')}
                  {program.objectives.length > 2 && '...'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 준비물 */}
        {program.materials && program.materials.length > 0 && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">준비물</h2>
            <ul className="space-y-1">
              {program.materials.map((material, index) => (
                <li key={index} className="text-blue-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                  {material}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 주요 내용 */}
        <div className="mb-8">
          <div 
            className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-blockquote:text-gray-600 prose-blockquote:border-gray-300"
            dangerouslySetInnerHTML={{ __html: program.content }}
          />
        </div>

        {/* 활동 내용 */}
        {program.activities && program.activities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">주요 활동</h2>
            <div className="grid gap-3">
              {program.activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{activity}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 이미지 갤러리 */}
        {program.images && program.images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">관련 이미지</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {program.images.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={image}
                    alt={`${program.title} 이미지 ${index + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 목표 상세 */}
        {program.objectives && program.objectives.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">학습 목표</h2>
            <div className="space-y-3">
              {program.objectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{objective}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Adaptive Bottom Bar */}
      <AdaptiveBottomBar clientId={client} />
    </div>
  );
}