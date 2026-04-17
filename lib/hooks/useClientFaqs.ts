import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FAQ, LocationType } from '@/lib/types';

export function useClientFaqs(clientId: string, location?: LocationType) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchFaqs = async () => {
      try {
        const faqsRef = collection(db, 'faqs');
        
        let q;
        if (location && location !== 'common') {
          q = query(faqsRef);
        } else {
          q = query(faqsRef);
        }

        const snapshot = await getDocs(q);
        
        const allFaqs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FAQ[];

        const filteredFaqs = allFaqs.filter(faq => {
          const hasClientAccess = 
            faq.clients?.includes(clientId) || 
            faq.clients?.includes('common');
          
          if (!hasClientAccess) return false;

          if (location && location !== 'common') {
            return faq.location === location || faq.location === 'common';
          }
          
          return true;
        });

        const sortedFaqs = filteredFaqs.sort((a, b) => {
          if (a.category < b.category) return -1;
          if (a.category > b.category) return 1;
          return 0;
        });

        setFaqs(sortedFaqs);
        setLoading(false);
      } catch (err) {
        console.error('FAQ 로드 오류:', err);
        setError('FAQ를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [clientId, location]);

  return { faqs, loading, error };
}

export function useClientCategories(clientId: string, location?: LocationType) {
  const [categories, setCategories] = useState<Array<{ id: string; name: string; color: string; order: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchCategories = async () => {
      try {
        const categoriesRef = collection(db, 'categories');
        
        const snapshot = await getDocs(categoriesRef);
        
        const allCategories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Array<{ id: string; name: string; color: string; order: number; location: LocationType }>;

        const filteredCategories = allCategories.filter(cat => {
          if (location && location !== 'common') {
            return cat.location === location || cat.location === 'common';
          }
          return true;
        });

        const sortedCategories = filteredCategories.sort((a, b) => a.order - b.order);

        setCategories(sortedCategories);
        setLoading(false);
      } catch (err) {
        console.error('카테고리 로드 오류:', err);
        setError('카테고리를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchCategories();
  }, [clientId, location]);

  return { categories, loading, error };
}
