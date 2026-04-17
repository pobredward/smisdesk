'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, GripVertical, Check, MapPin } from 'lucide-react';
import { useCategories } from '@/lib/hooks/useCategories';
import { COLOR_PALETTE, LOCATIONS, LocationType } from '@/lib/types';

export default function CategoryManager() {
  const [selectedLocation, setSelectedLocation] = useState<LocationType>('je');
  
  const { 
    categories, 
    loading,
    addCategory, 
    updateCategory, 
    deleteCategory,
    renameCategoryInFAQs,
    reorderCategories
  } = useCategories(selectedLocation);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState({ name: '', color: '' });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }

    const success = await addCategory(newCategoryName.trim(), selectedLocation);
    if (success) {
      alert('카테고리가 추가되었습니다.');
      setNewCategoryName('');
      setIsAddingCategory(false);
    } else {
      alert('카테고리 추가에 실패했습니다.');
    }
  };

  const startEdit = (id: string, name: string, color: string) => {
    setEditingCategoryId(id);
    setEditingData({ name, color });
  };

  const handleUpdateCategory = async (id: string, oldName: string) => {
    if (!editingData.name.trim()) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }

    const nameChanged = oldName !== editingData.name;
    if (nameChanged) {
      const confirmUpdate = window.confirm(
        `카테고리 이름을 "${oldName}"에서 "${editingData.name}"(으)로 변경하시겠습니까?\n\n이 카테고리를 사용하는 모든 FAQ의 카테고리도 함께 변경됩니다.`
      );
      if (!confirmUpdate) return;

      await renameCategoryInFAQs(oldName, editingData.name, selectedLocation);
    }

    const success = await updateCategory(id, editingData.name, editingData.color);
    if (success) {
      alert('카테고리가 수정되었습니다.');
      setEditingCategoryId(null);
    } else {
      alert('카테고리 수정에 실패했습니다.');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`"${name}" 카테고리를 삭제하시겠습니까?`);
    if (!confirmDelete) return;

    const success = await deleteCategory(id, name, selectedLocation);
    if (success) {
      alert('카테고리가 삭제되었습니다.');
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCategories = [...categories];
    const draggedItem = newCategories[draggedIndex];
    newCategories.splice(draggedIndex, 1);
    newCategories.splice(index, 0, draggedItem);

    setDraggedIndex(index);
  };

  const handleDrop = async () => {
    if (draggedIndex === null) return;

    const newOrder = categories.map((cat, index) => ({
      ...cat,
      order: index,
    }));

    await reorderCategories(newOrder);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-center text-gray-500">카테고리 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">카테고리 관리</h2>
        
        {/* 캠프 선택 */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value as LocationType)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LOCATIONS.filter(loc => loc.id !== 'common').map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.emoji} {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        💡 각 캠프마다 독립적인 카테고리를 설정할 수 있습니다. 드래그하여 순서를 변경하세요.
      </p>

      {/* 카테고리 추가 */}
      {!isAddingCategory ? (
        <button
          onClick={() => setIsAddingCategory(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors mb-4"
        >
          <Plus className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">새 카테고리 추가</span>
        </button>
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            placeholder="카테고리 이름 입력"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setIsAddingCategory(false);
                setNewCategoryName('');
              }}
              className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded"
            >
              취소
            </button>
            <button
              onClick={handleAddCategory}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              추가
            </button>
          </div>
        </div>
      )}

      {/* 카테고리 목록 */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>"{LOCATIONS.find(l => l.id === selectedLocation)?.emoji} {LOCATIONS.find(l => l.id === selectedLocation)?.name}" 캠프의</p>
            <p>등록된 카테고리가 없습니다.</p>
            <p className="text-sm mt-2">위 버튼을 눌러 카테고리를 추가하세요.</p>
          </div>
        ) : (
          categories.map((category, index) => (
            <div
              key={category.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow ${
                draggedIndex === index ? 'opacity-50' : ''
              }`}
            >
              <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />

              {editingCategoryId === category.id ? (
                <>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editingData.name}
                      onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    {/* 색상 선택 */}
                    <div className="flex gap-1">
                      {COLOR_PALETTE.map((color) => (
                        <button
                          key={color}
                          onClick={() => setEditingData({ ...editingData, color })}
                          className={`w-8 h-8 rounded-lg border-2 ${color} ${
                            editingData.color === color
                              ? 'border-blue-600 ring-2 ring-blue-300'
                              : 'border-gray-300'
                          } hover:scale-110 transition-transform flex items-center justify-center`}
                          title={color}
                        >
                          {editingData.color === color && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateCategory(category.id, category.name)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="저장"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setEditingCategoryId(null)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="취소"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className={`px-4 py-2 rounded-lg font-medium ${category.color}`}>
                    {category.name}
                  </span>
                  <div className="flex-1"></div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(category.id, category.name, category.color)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="수정"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="삭제"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t text-sm text-gray-600">
        <p>💡 팁:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>카테고리는 FAQ 검색과 분류에 사용됩니다</li>
          <li>카테고리 이름을 변경하면 연결된 FAQ도 자동 업데이트됩니다</li>
          <li>카테고리를 삭제하려면 먼저 해당 카테고리의 FAQ를 모두 제거하세요</li>
          <li>각 캠프는 독립적인 카테고리를 가질 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
}
