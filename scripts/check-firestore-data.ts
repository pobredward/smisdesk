import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5TliL4ejc6gmIYEeWxTOouitp3wwdoQw",
  authDomain: "smisdesk.firebaseapp.com", 
  projectId: "smisdesk",
  storageBucket: "smisdesk.appspot.com",
  messagingSenderId: "1043020628225",
  appId: "1:1043020628225:web:1ee0924072859cf8005b00"
};

async function checkFirestoreData() {
  try {
    console.log('🔍 Firestore 데이터 확인 중...\n');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'smisdesk');
    
    // settings 컬렉션 확인
    console.log('📂 Settings 컬렉션:');
    console.log('==================');
    const settingsSnapshot = await getDocs(collection(db, 'settings'));
    
    if (settingsSnapshot.empty) {
      console.log('❌ Settings 컬렉션이 비어있습니다.');
    } else {
      settingsSnapshot.forEach((doc, index) => {
        const data = doc.data();
        console.log(`📄 문서 #${index + 1} (ID: ${doc.id}):`);
        console.log('  - desktopVideoUrl:', data.desktopVideoUrl || '(없음)');
        console.log('  - mobileVideoUrl:', data.mobileVideoUrl || '(없음)');
        console.log('  - heroVideoUrl:', data.heroVideoUrl || '(없음)');
        console.log('  - createdAt:', data.createdAt?.toDate() || '(없음)');
        console.log('  - updatedAt:', data.updatedAt?.toDate() || '(없음)');
        console.log('');
      });
    }
    
    // clients 컬렉션 확인
    console.log('👥 Clients 컬렉션:');
    console.log('================');
    const clientsSnapshot = await getDocs(collection(db, 'clients'));
    
    if (clientsSnapshot.empty) {
      console.log('❌ Clients 컬렉션이 비어있습니다.');
    } else {
      clientsSnapshot.forEach((doc, index) => {
        const data = doc.data();
        console.log(`👤 클라이언트 #${index + 1} (ID: ${doc.id}):`);
        console.log('  - clientId:', data.clientId || '(없음)');
        console.log('  - name:', data.name || '(없음)');
        console.log('  - availableLocations:', data.availableLocations || '(없음)');
        console.log('');
      });
    }
    
    console.log('✅ 데이터 확인 완료!');
    
  } catch (error) {
    console.error('❌ 오류:', error);
  }
}

checkFirestoreData();