'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import RichEditor from '@/components/admin/RichEditor';
import { ScheduleProgram, CreateProgramRequest } from '@/lib/schedule-types';

export default function ScheduleAdminPage() {
  const [programs, setPrograms] = useState<ScheduleProgram[]>([]);
  const [selectedCamp, setSelectedCamp] = useState<'je' | 's' | 'f'>('je');
  const [selectedType, setSelectedType] = useState<'basic' | 'growing' | 'academy' | 'all'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 새 프로그램 폼 상태
  const [newProgram, setNewProgram] = useState<CreateProgramRequest>({
    campId: selectedCamp,
    programType: 'basic',
    timeSlot: '',
    title: '',
    description: '',
    content: ''
  });

  // 프로그램 목록 로드
  const loadPrograms = async () => {
    setLoading(true);
    try {
      const typeParam = selectedType === 'all' ? '' : `&programType=${selectedType}`;
      const response = await fetch(`/api/schedule?campId=${selectedCamp}${typeParam}`);
      const data = await response.json();
      setPrograms(data.programs || []);
    } catch (error) {
      console.error('프로그램 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, [selectedCamp, selectedType]);

  // 새 프로그램 생성
  const handleCreateProgram = async () => {
    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProgram, campId: selectedCamp })
      });

      if (response.ok) {
        setIsCreating(false);
        setNewProgram({
          campId: selectedCamp,
          programType: 'basic',
          timeSlot: '',
          title: '',
          description: '',
          content: ''
        });
        loadPrograms();
      }
    } catch (error) {
      console.error('프로그램 생성 오류:', error);
    }
  };

  // 프로그램 업데이트
  const handleUpdateProgram = async (program: ScheduleProgram) => {
    try {
      const response = await fetch(`/api/schedule/${program.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(program)
      });

      if (response.ok) {
        setEditingId(null);
        loadPrograms();
      }
    } catch (error) {
      console.error('프로그램 업데이트 오류:', error);
    }
  };

  // 프로그램 삭제
  const handleDeleteProgram = async (id: string) => {
    if (!confirm('정말로 이 프로그램을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/schedule/${id}?campId=${selectedCamp}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadPrograms();
      }
    } catch (error) {
      console.error('프로그램 삭제 오류:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">스케줄 관리</h1>
          
          {/* 필터 */}
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">캠프 선택</label>
              <select
                value={selectedCamp}
                onChange={(e) => setSelectedCamp(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="je">제주캠프</option>
                <option value="s">서울캠프</option>
                <option value="f">필리핀캠프</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">프로그램 타입</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="all">전체</option>
                <option value="basic">집중 프로그램</option>
                <option value="growing">Growing (STEAM)</option>
                <option value="academy">외식아카데미</option>
              </select>
            </div>
          </div>

          {/* 새 프로그램 추가 버튼 */}
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            새 프로그램 추가
          </button>
        </div>

        {/* 새 프로그램 생성 폼 */}
        {isCreating && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">새 프로그램 추가</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">프로그램 타입</label>
                <select
                  value={newProgram.programType}
                  onChange={(e) => setNewProgram({ ...newProgram, programType: e.target.value as any })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="basic">집중 프로그램</option>
                  <option value="growing">Growing (STEAM)</option>
                  <option value="academy">외식아카데미</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">시간</label>
                <input
                  type="text"
                  placeholder="08:00-08:20"
                  value={newProgram.timeSlot}
                  onChange={(e) => setNewProgram({ ...newProgram, timeSlot: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">제목</label>
                <input
                  type="text"
                  placeholder="프로그램 제목"
                  value={newProgram.title}
                  onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">간단 설명</label>
                <input
                  type="text"
                  placeholder="프로그램 간단 설명"
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">상세 내용</label>
              <RichEditor
                value={newProgram.content}
                onChange={(content) => setNewProgram({ ...newProgram, content })}
                placeholder="프로그램 상세 내용을 작성하세요..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateProgram}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                저장
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                취소
              </button>
            </div>
          </div>
        )}

        {/* 프로그램 목록 */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : programs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">프로그램이 없습니다.</div>
          ) : (
            programs.map(program => (
              <div key={program.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{program.title}</h3>
                    <p className="text-sm text-gray-600">
                      {program.timeSlot} | {program.programType} | {program.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(program.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(program.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: program.content }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}