'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, writeBatch, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLOR_PALETTE, LocationType } from '@/lib/types';

export interface Category {
  id: string;
  name: string;
  color: string;
  order: number;
  location: LocationType;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function useCategories(selectedLocation?: LocationType | 'all') {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, [selectedLocation]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      let q;
      
      if (selectedLocation && selectedLocation !== 'all') {
        // 선택된 캠프의 카테고리만 로드 (인덱스 없이)
        q = query(
          collection(db, 'categories'),
          where('location', '==', selectedLocation)
        );
      } else {
        // 모든 카테고리 로드 (인덱스 없이)
        q = collection(db, 'categories');
      }

      const snapshot = await getDocs(q);
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];

      // 클라이언트에서 order로 정렬
      const sortedCategories = categoriesData.sort((a, b) => a.order - b.order);
      
      setCategories(sortedCategories);
    } catch (error) {
      console.error('카테고리 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name: string, location: LocationType) => {
    try {
      // 같은 location의 카테고리 개수로 색상과 순서 결정
      const sameLocationCategories = categories.filter(c => c.location === location);
      const colorIndex = sameLocationCategories.length % COLOR_PALETTE.length;
      const color = COLOR_PALETTE[colorIndex];
      const order = sameLocationCategories.length;

      await addDoc(collection(db, 'categories'), {
        name,
        color,
        order,
        location,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      await loadCategories();
      return true;
    } catch (error) {
      console.error('카테고리 추가 오류:', error);
      return false;
    }
  };

  const updateCategory = async (id: string, name: string, color: string) => {
    try {
      const docRef = doc(db, 'categories', id);
      await updateDoc(docRef, {
        name,
        color,
        updatedAt: Timestamp.now(),
      });

      await loadCategories();
      return true;
    } catch (error) {
      console.error('카테고리 수정 오류:', error);
      return false;
    }
  };

  const deleteCategory = async (id: string, categoryName: string, location: LocationType) => {
    try {
      // 해당 카테고리를 사용하는 FAQ 확인 (같은 location만)
      const faqsSnapshot = await getDocs(
        query(
          collection(db, 'faqs'),
          where('category', '==', categoryName),
          where('location', '==', location)
        )
      );

      if (!faqsSnapshot.empty) {
        alert(`"${categoryName}" 카테고리를 사용 중인 FAQ가 ${faqsSnapshot.size}개 있습니다. 먼저 해당 FAQ들의 카테고리를 변경해주세요.`);
        return false;
      }

      await deleteDoc(doc(db, 'categories', id));
      await loadCategories();
      return true;
    } catch (error) {
      console.error('카테고리 삭제 오류:', error);
      return false;
    }
  };

  const renameCategoryInFAQs = async (oldName: string, newName: string, location: LocationType) => {
    try {
      // 같은 location의 FAQ만 업데이트
      const faqsSnapshot = await getDocs(
        query(
          collection(db, 'faqs'),
          where('category', '==', oldName),
          where('location', '==', location)
        )
      );

      if (faqsSnapshot.empty) return true;

      const batch = writeBatch(db);
      faqsSnapshot.docs.forEach((faqDoc) => {
        batch.update(faqDoc.ref, {
          category: newName,
          updatedAt: Timestamp.now(),
        });
      });

      await batch.commit();
      return true;
    } catch (error) {
      console.error('FAQ 카테고리 변경 오류:', error);
      return false;
    }
  };

  const reorderCategories = async (newOrder: Category[]) => {
    try {
      const batch = writeBatch(db);
      newOrder.forEach((category, index) => {
        const docRef = doc(db, 'categories', category.id);
        batch.update(docRef, {
          order: index,
          updatedAt: Timestamp.now(),
        });
      });

      await batch.commit();
      await loadCategories();
      return true;
    } catch (error) {
      console.error('카테고리 순서 변경 오류:', error);
      return false;
    }
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    renameCategoryInFAQs,
    reorderCategories,
    reload: loadCategories,
  };
}
