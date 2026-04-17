import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5TliL4ejc6gmIYEeWxTOouitp3wwdoQw",
  authDomain: "smisdesk.firebaseapp.com", 
  projectId: "smisdesk",
  storageBucket: "smisdesk.appspot.com",
  messagingSenderId: "1043020628225",
  appId: "1:1043020628225:web:1ee0924072859cf8005b00"
};

async function addBasicSettings() {
  try {
    console.log('기본 설정 추가 중...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'smisdesk');
    
    // 기본 설정 추가
    const settingsRef = await addDoc(collection(db, 'settings'), {
      desktopVideoUrl: '',
      mobileVideoUrl: '',
      heroVideoUrl: '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('✅ 설정 문서 생성됨:', settingsRef.id);
    
    // 기본 클라이언트 추가
    const clientRef = await addDoc(collection(db, 'clients'), {
      clientId: 'main',
      name: '메인 클라이언트',
      availableLocations: ['je', 'se'],
      createdAt: Timestamp.now()
    });
    
    console.log('✅ 클라이언트 문서 생성됨:', clientRef.id);
    
  } catch (error) {
    console.error('오류:', error);
  }
}

addBasicSettings();