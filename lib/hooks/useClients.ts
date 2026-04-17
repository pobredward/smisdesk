import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Client {
  id: string;
  clientId: string;  // 'A', 'B', 'hansol' 등 실제 식별자
  name: string;
  description: string;
  order: number;
  availableLocations?: ('je' | 's' | 'f')[]; // 이 거래처에서 볼 수 있는 캠프들
  contactPerson?: string;    // 담당자 이름
  contactPhone?: string;     // 담당자 전화번호
  callMessage?: string;      // 고객 통화 안내 메시지
  customTexts?: {
    heroTitle?: string;        // 히어로 섹션 타이틀
    heroSubtitle?: string;     // 히어로 섹션 서브타이틀
    welcomeMessage?: string;   // 환영 메시지
    footerMessage?: string;    // 푸터 추가 메시지
    contactInfo?: string;      // 연락처 정보
  };
  createdAt: Date;
  updatedAt: Date;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'clients'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Client[];

      // 'common'은 항상 포함
      const commonClient: Client = {
        id: 'common',
        clientId: 'common',
        name: '공통',
        description: '모든 거래처에 공통으로 표시',
        order: 9999,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setClients([...clientsData, commonClient]);
      setLoading(false);
    } catch (err) {
      console.error('거래처 로드 오류:', err);
      setError('거래처를 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const addClient = async (data: { 
    clientId: string; 
    name: string; 
    description: string; 
    availableLocations?: ('je' | 's' | 'f')[]; 
    contactPerson?: string; 
    contactPhone?: string; 
    callMessage?: string;
  }) => {
    try {
      // clientId 중복 체크
      const existing = clients.find(c => c.clientId === data.clientId);
      if (existing) {
        throw new Error('이미 존재하는 거래처 ID입니다.');
      }

      const maxOrder = Math.max(...clients.filter(c => c.clientId !== 'common').map(c => c.order), 0);
      
      const newClientData: any = {
        clientId: data.clientId,
        name: data.name,
        description: data.description,
        order: maxOrder + 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (data.contactPerson) {
        newClientData.contactPerson = data.contactPerson;
      }

      if (data.contactPhone) {
        newClientData.contactPhone = data.contactPhone;
      }

      if (data.callMessage) {
        newClientData.callMessage = data.callMessage;
      }

      if (data.availableLocations && data.availableLocations.length > 0) {
        newClientData.availableLocations = data.availableLocations;
      }
      
      await addDoc(collection(db, 'clients'), newClientData);

      await loadClients();
      return { success: true };
    } catch (err: any) {
      console.error('거래처 추가 오류:', err);
      return { success: false, error: err.message };
    }
  };

  const updateClient = async (id: string, data: { 
    name: string; 
    description: string; 
    availableLocations?: ('je' | 's' | 'f')[]; 
    customTexts?: any; 
    contactPerson?: string; 
    contactPhone?: string; 
    callMessage?: string;
  }) => {
    try {
      const docRef = doc(db, 'clients', id);
      const updateData: any = {
        name: data.name,
        description: data.description,
        updatedAt: Timestamp.now(),
      };

      if (data.availableLocations !== undefined) {
        if (data.availableLocations.length > 0) {
          updateData.availableLocations = data.availableLocations;
        } else {
          // 빈 배열이면 필드 삭제 (모든 캠프 표시)
          updateData.availableLocations = null;
        }
      }

      if (data.contactPerson !== undefined) {
        updateData.contactPerson = data.contactPerson;
      }

      if (data.contactPhone !== undefined) {
        updateData.contactPhone = data.contactPhone;
      }

      if (data.callMessage !== undefined) {
        updateData.callMessage = data.callMessage;
      }

      if (data.customTexts) {
        updateData.customTexts = data.customTexts;
      }

      await updateDoc(docRef, updateData);

      await loadClients();
      return { success: true };
    } catch (err: any) {
      console.error('거래처 수정 오류:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'clients', id));
      await loadClients();
      return { success: true };
    } catch (err: any) {
      console.error('거래처 삭제 오류:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    reload: loadClients,
  };
}
