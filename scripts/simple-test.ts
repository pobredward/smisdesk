import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5TliL4ejc6gmIYEeWxTOouitp3wwdoQw",
  authDomain: "smisdesk.firebaseapp.com", 
  projectId: "smisdesk",
  storageBucket: "smisdesk.appspot.com",
  messagingSenderId: "1043020628225",
  appId: "1:1043020628225:web:1ee0924072859cf8005b00"
};

async function simpleTest() {
  try {
    console.log('간단한 Firebase 연결 테스트...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'smisdesk');
    
    // 기본 데이터베이스에 연결 시도
    const settingsSnapshot = await getDocs(collection(db, 'settings'));
    console.log('기본 DB Settings 문서 수:', settingsSnapshot.size);
    
    settingsSnapshot.forEach((doc) => {
      console.log('문서 ID:', doc.id);
      console.log('문서 데이터:', doc.data());
    });
    
  } catch (error) {
    console.error('연결 오류:', error);
  }
}

simpleTest();