import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

async function migrateVideoSettings() {
  try {
    console.log('🔄 영상 설정 마이그레이션 시작...');
    
    const settingsSnapshot = await getDocs(collection(db, 'settings'));
    
    if (settingsSnapshot.empty) {
      console.log('❌ 설정 문서가 없습니다.');
      return;
    }

    for (const docSnapshot of settingsSnapshot.docs) {
      const data = docSnapshot.data();
      const docRef = doc(db, 'settings', docSnapshot.id);
      
      // 기존 heroVideoUrl을 desktopVideoUrl로 복사
      if (data.heroVideoUrl && !data.desktopVideoUrl) {
        await updateDoc(docRef, {
          desktopVideoUrl: data.heroVideoUrl,
          mobileVideoUrl: data.mobileVideoUrl || '', // 모바일 영상이 없으면 빈 문자열
        });
        
        console.log(`✅ 문서 ${docSnapshot.id} 마이그레이션 완료`);
        console.log(`   - 데스크탑 영상: ${data.heroVideoUrl}`);
        console.log(`   - 모바일 영상: ${data.mobileVideoUrl || '(없음)'}`);
      } else {
        console.log(`ℹ️  문서 ${docSnapshot.id}는 이미 마이그레이션되었습니다.`);
      }
    }
    
    console.log('🎉 마이그레이션 완료!');
  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error);
  }
}

// 스크립트 실행
if (require.main === module) {
  migrateVideoSettings()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default migrateVideoSettings;