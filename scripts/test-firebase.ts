import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function testFirestore() {
  try {
    console.log('Firestore 연결 테스트 중...');
    
    // settings 컬렉션 읽기 테스트
    const settingsSnapshot = await getDocs(collection(db, 'settings'));
    console.log('Settings 컬렉션 문서 수:', settingsSnapshot.size);
    
    settingsSnapshot.forEach((doc) => {
      console.log('Settings 문서 ID:', doc.id);
      console.log('Settings 데이터:', doc.data());
    });
    
    // clients 컬렉션 읽기 테스트
    const clientsSnapshot = await getDocs(collection(db, 'clients'));
    console.log('Clients 컬렉션 문서 수:', clientsSnapshot.size);
    
    clientsSnapshot.forEach((doc) => {
      console.log('Client 문서 ID:', doc.id);
      console.log('Client 데이터:', doc.data());
    });
    
    console.log('✅ Firestore 연결 성공');
    
  } catch (error) {
    console.error('❌ Firestore 연결 오류:', error);
  }
}

testFirestore();