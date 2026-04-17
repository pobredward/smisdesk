import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5TliL4ejc6gmIYEeWxTOouitp3wwdoQw",
  authDomain: "smisdesk.firebaseapp.com", 
  projectId: "smisdesk",
  storageBucket: "smisdesk.appspot.com",
  messagingSenderId: "1043020628225",
  appId: "1:1043020628225:web:1ee0924072859cf8005b00"
};

async function setYouTubeVideo() {
  try {
    console.log('🎬 YouTube 영상 URL 직접 설정 중...\n');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'smisdesk');
    
    // 새로운 YouTube URL (자동재생 최적화)
    // 기본 임베드 URL만 저장 (파라미터는 컴포넌트에서 동적으로 추가)
    const newDesktopVideoUrl = 'https://www.youtube.com/embed/yXfPANNFugw&t=4';
    const newMobileVideoUrl = ''; // 모바일용은 비워둠 (데스크탑 영상 사용)
    
    console.log('📝 설정할 URL:');
    console.log('  데스크탑:', newDesktopVideoUrl);
    console.log('  모바일:', newMobileVideoUrl || '(데스크탑 영상 사용)');
    console.log('');
    
    // 기존 settings 문서 찾기
    const settingsSnapshot = await getDocs(collection(db, 'settings'));
    
    if (settingsSnapshot.empty) {
      console.log('❌ Settings 문서가 없습니다.');
      return;
    }
    
    // 첫 번째 settings 문서 업데이트
    const settingsDoc = settingsSnapshot.docs[0];
    console.log('📄 업데이트할 문서 ID:', settingsDoc.id);
    
    await updateDoc(doc(db, 'settings', settingsDoc.id), {
      desktopVideoUrl: newDesktopVideoUrl,
      mobileVideoUrl: newMobileVideoUrl,
      heroVideoUrl: newDesktopVideoUrl, // 이전 버전 호환성
      updatedAt: Timestamp.now(),
    });
    
    console.log('✅ 영상 URL 업데이트 완료!');
    
    // 확인: 업데이트된 데이터 조회
    console.log('\n📊 업데이트 결과 확인:');
    console.log('==================');
    
    const updatedSnapshot = await getDocs(collection(db, 'settings'));
    updatedSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`📄 문서 ID: ${doc.id}`);
      console.log('  - desktopVideoUrl:', data.desktopVideoUrl);
      console.log('  - mobileVideoUrl:', data.mobileVideoUrl || '(없음)');
      console.log('  - heroVideoUrl:', data.heroVideoUrl);
      console.log('  - updatedAt:', data.updatedAt?.toDate());
      console.log('');
    });
    
    console.log('🎉 완료! 이제 브라우저에서 확인해보세요:');
    console.log('   - http://localhost:3000/main');
    console.log('   - http://localhost:3000/visang');
    
  } catch (error) {
    console.error('❌ 오류:', error);
  }
}

setYouTubeVideo();