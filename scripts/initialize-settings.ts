import { db } from '../lib/firebase';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';

async function initializeSettings() {
  try {
    console.log('초기 설정을 생성하는 중...');
    
    // 기본 설정 문서 생성
    const settingsRef = doc(collection(db, 'settings'));
    
    await setDoc(settingsRef, {
      desktopVideoUrl: '',
      mobileVideoUrl: '',
      heroVideoUrl: '', // 이전 버전과의 호환성
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    console.log('✅ 설정 초기화 완료');
    console.log('Settings Document ID:', settingsRef.id);
    
    // 테스트 클라이언트도 생성
    const testClientRef = doc(collection(db, 'clients'));
    await setDoc(testClientRef, {
      clientId: 'main',
      name: '메인 클라이언트',
      availableLocations: ['je', 'se'],
      createdAt: Timestamp.now(),
    });
    
    console.log('✅ 테스트 클라이언트 생성 완료');
    
  } catch (error) {
    console.error('❌ 초기화 오류:', error);
  }
}

initializeSettings();