'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Users, Building2, ExternalLink } from 'lucide-react';
import { useClients, Client } from '@/lib/hooks/useClients';
import { LOCATIONS } from '@/lib/types';
import Link from 'next/link';

export default function ClientManager() {
  const { clients, loading, addClient, updateClient, deleteClient } = useClients();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clientId: '',
    name: '',
    description: '',
    availableLocations: [] as ('je' | 's' | 'f')[],
    heroTitle: '',
    heroSubtitle: '',
    welcomeMessage: '',
    contactInfo: '',
    contactPerson: '',
    contactPhone: '',
    callMessage: '',
  });

  const campLocations = LOCATIONS.filter(loc => loc.id !== 'common');

  const resetForm = () => {
    setFormData({ 
      clientId: '', 
      name: '', 
      description: '',
      availableLocations: [],
      heroTitle: '',
      heroSubtitle: '',
      welcomeMessage: '',
      contactInfo: '',
      contactPerson: '',
      contactPhone: '',
      callMessage: '',
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.clientId || !formData.name) {
      alert('거래처 ID와 이름은 필수입니다.');
      return;
    }

    // clientId 유효성 검사 (영문, 숫자, 하이픈만 허용)
    if (!/^[a-zA-Z0-9-]+$/.test(formData.clientId)) {
      alert('거래처 ID는 영문, 숫자, 하이픈(-)만 사용 가능합니다.');
      return;
    }

    const result = await addClient(formData);
    if (result.success) {
      alert('거래처가 추가되었습니다.');
      resetForm();
    } else {
      alert(`거래처 추가 실패: ${result.error}`);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name) {
      alert('거래처 이름은 필수입니다.');
      return;
    }

    const result = await updateClient(id, {
      name: formData.name,
      description: formData.description,
      availableLocations: formData.availableLocations,
      contactPerson: formData.contactPerson,
      contactPhone: formData.contactPhone,
      callMessage: formData.callMessage,
      customTexts: {
        heroTitle: formData.heroTitle,
        heroSubtitle: formData.heroSubtitle,
        welcomeMessage: formData.welcomeMessage,
        contactInfo: formData.contactInfo,
      },
    });

    if (result.success) {
      alert('거래처가 수정되었습니다.');
      resetForm();
    } else {
      alert(`거래처 수정 실패: ${result.error}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" 거래처를 삭제하시겠습니까?\n\n⚠️ 이 거래처와 연결된 FAQ도 함께 수정해야 합니다.`)) {
      return;
    }

    const result = await deleteClient(id);
    if (result.success) {
      alert('거래처가 삭제되었습니다.');
    } else {
      alert(`거래처 삭제 실패: ${result.error}`);
    }
  };

  const startEdit = (client: Client) => {
    setFormData({
      clientId: client.clientId,
      name: client.name,
      description: client.description,
      availableLocations: client.availableLocations || [],
      heroTitle: client.customTexts?.heroTitle || '',
      heroSubtitle: client.customTexts?.heroSubtitle || '',
      welcomeMessage: client.customTexts?.welcomeMessage || '',
      contactInfo: client.customTexts?.contactInfo || '',
      contactPerson: client.contactPerson || '',
      contactPhone: client.contactPhone || '',
      callMessage: client.callMessage || '',
    });
    setEditingId(client.id);
    setIsAdding(false);
  };

  const handleLocationToggle = (locationId: 'je' | 's' | 'f') => {
    setFormData(prev => ({
      ...prev,
      availableLocations: prev.availableLocations.includes(locationId)
        ? prev.availableLocations.filter(id => id !== locationId)
        : [...prev.availableLocations, locationId]
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center text-gray-500">로딩 중...</div>
      </div>
    );
  }

  const editableClients = clients.filter(c => c.clientId !== 'common');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">거래처 관리</h2>
              <p className="text-sm text-purple-100">거래처를 추가하면 해당 URL로 전용 페이지가 생성됩니다</p>
            </div>
          </div>
          {!isAdding && !editingId && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              거래처 추가
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* 추가/수정 폼 */}
        {(isAdding || editingId) && (
          <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-purple-600" />
              {editingId ? '거래처 수정' : '새 거래처 추가'}
            </h3>
            
            <div className="space-y-6">
              {/* 기본 정보 섹션 */}
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-purple-600">📋</span>
                  기본 정보
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      거래처 ID * {editingId && <span className="text-xs text-gray-500">(수정 불가)</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value.toLowerCase() })}
                      disabled={!!editingId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      placeholder="예: hansol, daekyo, jaeneung"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL: www.smisdesk.com/<span className="font-semibold">{formData.clientId || '{id}'}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      거래처 이름 *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="예: 한솔교육, 대교"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      설명
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="예: 한솔교육 전용 페이지"
                    />
                  </div>

                  {/* 담당자 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        담당자 이름
                      </label>
                      <input
                        type="text"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="예: 김담당"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        담당자 전화번호
                      </label>
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="예: 010-1234-5678"
                      />
                    </div>
                  </div>

                  {/* 통화 안내 메시지 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      고객 통화 안내 메시지
                    </label>
                    <input
                      type="text"
                      value={formData.callMessage}
                      onChange={(e) => setFormData({ ...formData, callMessage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="예: SMIS 캠프 홈페이지 보고 전화드렸는데요를 언급해주세요"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      고객이 전화할 때 참고할 수 있도록 하단 버튼에 표시됩니다
                    </p>
                  </div>
                </div>
              </div>

              {/* 캠프 선택 섹션 */}
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-green-600">🏕️</span>
                  표시할 캠프 선택 (선택사항)
                </h4>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-3">
                    선택하지 않으면 모든 캠프가 표시됩니다. 특정 캠프만 보여주려면 체크하세요.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {campLocations.map((camp) => (
                      <label
                        key={camp.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200"
                      >
                        <input
                          type="checkbox"
                          checked={formData.availableLocations.includes(camp.id as 'je' | 's' | 'f')}
                          onChange={() => handleLocationToggle(camp.id as 'je' | 's' | 'f')}
                          className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                        />
                        <span className="text-2xl">{camp.emoji}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{camp.name}</div>
                          <div className="text-xs text-gray-500">{camp.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {formData.availableLocations.length > 0 && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700">
                        ✓ 선택된 캠프: {formData.availableLocations.length}개
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 페이지 텍스트 커스터마이징 섹션 */}
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">✏️</span>
                  페이지 텍스트 커스터마이징 (선택사항)
                </h4>
                <div className="space-y-4">
                  {/* 히어로 섹션 */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
                      <span>🎯</span>
                      히어로 섹션 (메인 상단)
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          메인 타이틀
                        </label>
                        <input
                          type="text"
                          value={formData.heroTitle}
                          onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="기본값: SMIS 데스크"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          서브타이틀
                        </label>
                        <input
                          type="text"
                          value={formData.heroSubtitle}
                          onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="기본값: SMIS 캠프의 모든 정보를 한곳에서"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 환영 메시지 */}
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
                      <span>👋</span>
                      환영 메시지
                    </h5>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        캠프 선택 섹션 설명
                      </label>
                      <textarea
                        value={formData.welcomeMessage}
                        onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="기본값: 원하시는 캠프를 선택하여 자세한 정보를 확인하세요"
                      />
                    </div>
                  </div>

                  {/* 연락처 정보 */}
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
                      <span>📞</span>
                      연락처 정보
                    </h5>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        담당자 정보 (푸터에 표시)
                      </label>
                      <textarea
                        value={formData.contactInfo}
                        onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="예: 상담 문의: 홍길동 (010-0000-0000)"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">
                      💡 텍스트 커스터마이징 필드는 모두 선택사항입니다. 비워두면 기본 템플릿 텍스트가 표시됩니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={resetForm}
                  className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  취소
                </button>
                <button
                  onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? '수정 완료' : '추가'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 거래처 목록 */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 mb-3">등록된 거래처 ({editableClients.length}개)</h3>
          
          {editableClients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              등록된 거래처가 없습니다. 거래처를 추가해보세요!
            </div>
          ) : (
            editableClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{client.name}</span>
                      <span className="px-2 py-0.5 text-xs font-mono bg-purple-100 text-purple-700 rounded">
                        /{client.clientId}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{client.description}</p>
                    {(client.contactPerson || client.contactPhone || client.callMessage) && (
                      <div className="text-sm text-gray-500 mt-1 space-y-1">
                        {(client.contactPerson || client.contactPhone) && (
                          <div>
                            {client.contactPerson && <span>담당자: {client.contactPerson}</span>}
                            {client.contactPerson && client.contactPhone && <span> • </span>}
                            {client.contactPhone && <span>📞 {client.contactPhone}</span>}
                          </div>
                        )}
                        {client.callMessage && (
                          <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            안내: {client.callMessage}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/${client.clientId}`}
                    target="_blank"
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="페이지 보기"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => startEdit(client)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="수정"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id, client.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
