/**
 * 기존 FAQ 데이터에 clients 필드를 추가하는 마이그레이션 스크립트
 * 
 * 사용법:
 * 1. Firebase 프로젝트 설정 확인
 * 2. npm install (firebase-admin 패키지 필요)
 * 3. npx ts-node scripts/migrate-add-clients-field.ts
 * 
 * 기본값: 모든 FAQ에 clients: ['common'] 추가
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount as any),
  });
}

const db = getFirestore();
db.settings({ databaseId: 'smisdesk' });

async function migrateFaqs() {
  console.log('🚀 FAQ 마이그레이션 시작...');
  
  try {
    const faqsRef = db.collection('faqs');
    const snapshot = await faqsRef.get();
    
    console.log(`📊 총 ${snapshot.size}개의 FAQ 발견`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    const batch = db.batch();
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // 이미 clients 필드가 있으면 스킵
      if (data.clients && Array.isArray(data.clients)) {
        console.log(`⏭️  스킵: "${data.question}" (이미 clients 필드 존재)`);
        skippedCount++;
        continue;
      }
      
      // clients 필드 추가 (기본값: ['common'])
      batch.update(doc.ref, {
        clients: ['common'],
        updatedAt: new Date(),
      });
      
      console.log(`✅ 업데이트 예정: "${data.question}"`);
      updatedCount++;
    }
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`\n✨ 마이그레이션 완료!`);
      console.log(`   - 업데이트: ${updatedCount}개`);
      console.log(`   - 스킵: ${skippedCount}개`);
    } else {
      console.log(`\n✨ 마이그레이션할 FAQ가 없습니다.`);
      console.log(`   - 스킵: ${skippedCount}개`);
    }
    
  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error);
    throw error;
  }
}

// 스크립트 실행
if (require.main === module) {
  migrateFaqs()
    .then(() => {
      console.log('\n✅ 프로세스 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 프로세스 실패:', error);
      process.exit(1);
    });
}

export { migrateFaqs };
