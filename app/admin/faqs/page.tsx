'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Edit2, Trash2, Save, X, Filter, MapPin, Users, ArrowLeft } from 'lucide-react';
import { useCategories } from '@/lib/hooks/useCategories';
import { LOCATIONS, LocationType } from '@/lib/types';
import { useClients } from '@/lib/hooks/useClients';
import Link from 'next/link';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  location: 'je' | 's' | 'f' | 'common';
  clients: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function FAQManagementPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<LocationType | 'all'>('all');
  
  const { categories: allCategories } = useCategories(selectedLocation === 'all' ? undefined : selectedLocation);
  const { clients } = useClients();
  
  // 카테고리 중복 제거 (같은 이름이면 하나만 표시)
  const categories = allCategories.reduce((unique, cat) => {
    if (!unique.find(c => c.name === cat.name)) {
      unique.push(cat);
    }
    return unique;
  }, [] as typeof allCategories);
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    location: 'je' as LocationType,
    clients: ['common'] as string[],
  });

  const ADMIN_PASSWORD = 'smis2024';

  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      const firstCategory = categories[0].name;
      setFormData(prev => ({ ...prev, category: firstCategory }));
    }
  }, [categories]);

  useEffect(() => {
    loadFAQs();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all' && selectedLocation === 'all') {
      setFilteredFaqs(faqs);
    } else if (selectedCategory === 'all') {
      setFilteredFaqs(faqs.filter(faq => 
        faq.location === selectedLocation || faq.location === 'common'
      ));
    } else if (selectedLocation === 'all') {
      setFilteredFaqs(faqs.filter(faq => faq.category === selectedCategory));
    } else {
      setFilteredFaqs(faqs.filter(faq => 
        faq.category === selectedCategory && 
        (faq.location === selectedLocation || faq.location === 'common')
      ));
    }
  }, [faqs, selectedCategory, selectedLocation]);

  const loadFAQs = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, 'faqs'));
      const faqData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as FAQ[];
      
      setFaqs(faqData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('FAQ 로드 오류:', error);
      alert('FAQ 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryCount = (category: string) => {
    return faqs.filter(faq => faq.category === category).length;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || 'bg-gray-100 text-gray-700';
  };

  // 키워드 자동 추출 함수
  const extractKeywords = (text: string): string[] => {
    const cleanText = text.replace(/[^\w\s가-힣]/g, ' ').toLowerCase();
    const words = cleanText.split(/\s+/).filter(word => word.length > 1);
    
    const stopWords = ['이', '그', '저', '것', '수', '등', '및', '또는', '하는', '있는', '되는', '하고', '있고', '되고', '입니다', '합니다', '있습니다'];
    const filteredWords = words.filter(word => !stopWords.includes(word));
    
    const wordCount: Record<string, number> = {};
    filteredWords.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  };

  const handleAdd = async () => {
    if (!formData.question || !formData.answer) {
      alert('질문과 답변은 필수입니다.');
      return;
    }

    if (formData.clients.length === 0) {
      alert('최소 하나의 거래처를 선택해주세요.');
      return;
    }

    try {
      const autoKeywords = extractKeywords(formData.question + ' ' + formData.answer);
      
      await addDoc(collection(db, 'faqs'), {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        location: formData.location,
        clients: formData.clients,
        keywords: autoKeywords,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      alert('FAQ가 추가되었습니다.');
      resetForm();
      loadFAQs();
    } catch (error) {
      console.error('FAQ 추가 오류:', error);
      alert('FAQ 추가에 실패했습니다.');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.question || !formData.answer) {
      alert('질문과 답변은 필수입니다.');
      return;
    }

    if (formData.clients.length === 0) {
      alert('최소 하나의 거래처를 선택해주세요.');
      return;
    }

    try {
      const autoKeywords = extractKeywords(formData.question + ' ' + formData.answer);
      
      const docRef = doc(db, 'faqs', id);
      await updateDoc(docRef, {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        location: formData.location,
        clients: formData.clients,
        keywords: autoKeywords,
        updatedAt: Timestamp.now(),
      });

      alert('FAQ가 수정되었습니다.');
      resetForm();
      loadFAQs();
    } catch (error) {
      console.error('FAQ 수정 오류:', error);
      alert('FAQ 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말로 이 FAQ를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'faqs', id));
      alert('FAQ가 삭제되었습니다.');
      loadFAQs();
    } catch (error) {
      console.error('FAQ 삭제 오류:', error);
      alert('FAQ 삭제에 실패했습니다.');
    }
  };

  const startEdit = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      location: faq.location,
      clients: faq.clients || ['common'],
    });
    setEditingId(faq.id);
    setIsAdding(false);
  };

  const resetForm = () => {
    setFormData({ 
      question: '', 
      answer: '', 
      category: categories.length > 0 ? categories[0].name : '',
      location: 'je',
      clients: ['common'],
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin');
    localStorage.removeItem('admin_auth');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                대시보드
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FAQ 관리</h1>
                <p className="text-sm text-gray-600">총 {faqs.length}개</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* 추가/수정 폼 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {editingId ? 'FAQ 수정' : isAdding ? 'FAQ 추가' : 'FAQ 관리'}
            </h2>
            {!isAdding && !editingId && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                FAQ 추가
              </button>
            )}
          </div>

          {(isAdding || editingId) && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  질문 *
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 캠프 인원이 몇 명인가요?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  답변 *
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="상세한 답변을 입력하세요..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리 *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  캠프 위치 *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value as LocationType })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.emoji} {loc.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  💡 "공통"을 선택하면 모든 캠프에서 표시됩니다
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    표시할 거래처 *
                  </div>
                </label>
                <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {clients.map((client) => (
                    <label
                      key={client.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.clients.includes(client.clientId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              clients: [...formData.clients, client.clientId]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              clients: formData.clients.filter(c => c !== client.clientId)
                            });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {client.name}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 "공통"을 선택하면 모든 거래처에서 표시됩니다. 특정 거래처만 선택하면 해당 거래처에서만 보입니다.
                </p>
              </div>

              <p className="text-xs text-gray-500">
                💡 키워드는 질문과 답변에서 자동으로 추출됩니다
              </p>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={resetForm}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  취소
                </button>
                <button
                  onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? '수정' : '추가'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FAQ 목록 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                FAQ 목록 ({selectedCategory === 'all' && selectedLocation === 'all' ? faqs.length : filteredFaqs.length}개)
              </h2>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value as LocationType | 'all')}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">모든 캠프 ({faqs.length})</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.emoji} {loc.name} ({faqs.filter(f => f.location === loc.id || f.location === 'common').length})
                    </option>
                  ))}
                </select>
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">전체 카테고리 ({faqs.length})</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name} ({getCategoryCount(cat.name)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 카테고리 요약 */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {categories.map((cat) => {
                const count = getCategoryCount(cat.name);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat.name
                        ? cat.color + ' ring-2 ring-offset-2 ring-blue-500'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                    <span className="ml-1 text-xs opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              로딩 중...
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {selectedCategory === 'all' 
                ? '등록된 FAQ가 없습니다. 새 FAQ를 추가해보세요!'
                : `"${selectedCategory}" 카테고리에 FAQ가 없습니다.`}
            </div>
          ) : (
            <div className="divide-y">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {/* 위치 배지 */}
                        <span className={`px-2 py-1 text-xs rounded font-medium ${
                          faq.location === 'je' ? 'bg-blue-100 text-blue-700' :
                          faq.location === 's' ? 'bg-green-100 text-green-700' :
                          faq.location === 'f' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {LOCATIONS.find(l => l.id === faq.location)?.emoji} {' '}
                          {LOCATIONS.find(l => l.id === faq.location)?.name}
                        </span>
                        {/* 거래처 배지 */}
                        <div className="flex gap-1 flex-wrap">
                          {(Array.isArray(faq.clients) ? faq.clients : ['common']).map((clientId) => {
                            const client = clients.find(c => c.clientId === clientId);
                            return (
                              <span
                                key={clientId}
                                className="px-2 py-1 text-xs rounded font-medium bg-orange-100 text-orange-700"
                                title={client?.description}
                              >
                                <Users className="w-3 h-3 inline mr-1" />
                                {client?.name || clientId}
                              </span>
                            );
                          })}
                        </div>
                        {/* 카테고리 선택 드롭다운 */}
                        <select
                          value={faq.category}
                          onChange={async (e) => {
                            const newCategory = e.target.value;
                            const confirmChange = window.confirm(
                              `"${faq.question}"\n\n이 FAQ의 카테고리를 "${faq.category}"에서 "${newCategory}"(으)로 변경하시겠습니까?`
                            );
                            
                            if (!confirmChange) {
                              e.target.value = faq.category;
                              return;
                            }

                            try {
                              const docRef = doc(db, 'faqs', faq.id);
                              await updateDoc(docRef, {
                                category: newCategory,
                                updatedAt: Timestamp.now(),
                              });
                              alert('카테고리가 변경되었습니다.');
                              loadFAQs();
                            } catch (error) {
                              console.error('카테고리 변경 오류:', error);
                              alert('카테고리 변경에 실패했습니다.');
                              e.target.value = faq.category;
                            }
                          }}
                          className={`px-2 py-1 text-xs rounded cursor-pointer border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getCategoryColor(faq.category)}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <span className="text-xs text-gray-500">
                          {faq.updatedAt.toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-700 mb-2 whitespace-pre-wrap">
                        {faq.answer.length > 200
                          ? faq.answer.substring(0, 200) + '...'
                          : faq.answer}
                      </p>
                      {faq.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {faq.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              #{keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(faq)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="수정"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="삭제"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
