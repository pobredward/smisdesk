import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5TliL4ejc6gmIYEeWxTOouitp3wwdoQw",
  authDomain: "smisdesk.firebaseapp.com", 
  projectId: "smisdesk",
  storageBucket: "smisdesk.appspot.com",
  messagingSenderId: "1043020628225",
  appId: "1:1043020628225:web:1ee0924072859cf8005b00"
};

async function migrateToSmisdeskDb() {
  try {
    console.log('🔄 기본 데이터베이스에서 smisdesk 데이터베이스로 이동 중...\n');
    
    const app = initializeApp(firebaseConfig);
    const defaultDb = getFirestore(app); // 기본 데이터베이스
    const smisdeskDb = getFirestore(app, 'smisdesk'); // smisdesk 데이터베이스
    
    // 기본 데이터베이스에서 settings 읽기
    console.log('📖 기본 데이터베이스에서 settings 읽는 중...');
    const defaultSettingsSnapshot = await getDocs(collection(defaultDb, 'settings'));
    
    if (defaultSettingsSnapshot.empty) {
      console.log('❌ 기본 데이터베이스에 settings가 없습니다.');
    } else {
      console.log(`✅ ${defaultSettingsSnapshot.size}개의 settings 문서를 찾았습니다.`);
      
      // smisdesk 데이터베이스로 복사
      for (const doc of defaultSettingsSnapshot.docs) {
        const data = doc.data();
        console.log('📝 복사할 데이터:', {
          desktopVideoUrl: data.desktopVideoUrl || '(없음)',
          mobileVideoUrl: data.mobileVideoUrl || '(없음)',
          heroVideoUrl: data.heroVideoUrl || '(없음)'
        });
        
        // smisdesk 데이터베이스에 추가
        const docRef = await addDoc(collection(smisdeskDb, 'settings'), {
          desktopVideoUrl: data.desktopVideoUrl || '',
          mobileVideoUrl: data.mobileVideoUrl || '',
          heroVideoUrl: data.heroVideoUrl || data.desktopVideoUrl || '',
          createdAt: data.createdAt || Timestamp.now(),
          updatedAt: Timestamp.now(),
          migratedAt: Timestamp.now()
        });
        
        console.log('✅ smisdesk 데이터베이스에 복사 완료 - 문서 ID:', docRef.id);
      }
    }
    
    // 확인: smisdesk 데이터베이스의 현재 상태
    console.log('\n📊 smisdesk 데이터베이스 최종 상태:');
    console.log('================================');
    
    const smisdeskSettingsSnapshot = await getDocs(collection(smisdeskDb, 'settings'));
    smisdeskSettingsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`📄 설정 문서 #${index + 1} (ID: ${doc.id}):`);
      console.log('  - desktopVideoUrl:', data.desktopVideoUrl || '(없음)');
      console.log('  - mobileVideoUrl:', data.mobileVideoUrl || '(없음)');
      console.log('  - heroVideoUrl:', data.heroVideoUrl || '(없음)');
      console.log('');
    });
    
    const smisdeskClientsSnapshot = await getDocs(collection(smisdeskDb, 'clients'));
    smisdeskClientsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`👤 클라이언트 #${index + 1} (ID: ${doc.id}):`);
      console.log('  - clientId:', data.clientId || '(없음)');
      console.log('  - name:', data.name || '(없음)');
      console.log('');
    });
    
    console.log('✅ 마이그레이션 완료!');
    
  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error);
  }
}

migrateToSmisdeskDb();