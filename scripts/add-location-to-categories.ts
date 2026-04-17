import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addLocationToCategories() {
  try {
    console.log('📌 Category에 location 필드 추가 시작...\n');

    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    
    if (categoriesSnapshot.empty) {
      console.log('⚠️  Category 데이터가 없습니다.');
      return;
    }

    let updatedCount = 0;
    let skippedCount = 0;

    for (const categoryDoc of categoriesSnapshot.docs) {
      const data = categoryDoc.data();
      
      // 이미 location 필드가 있으면 스킵
      if (data.location) {
        console.log(`⏭️  스킵: "${data.name}" (이미 location 필드 존재: ${data.location})`);
        skippedCount++;
        continue;
      }

      // location 필드가 없으면 기본값 'je' 추가
      const docRef = doc(db, 'categories', categoryDoc.id);
      await updateDoc(docRef, {
        location: 'je', // 기본값: 제주캠프
      });

      console.log(`✅ 업데이트: "${data.name}" → location: "je"`);
      updatedCount++;
    }

    console.log('\n============================');
    console.log(`🎉 마이그레이션 완료!`);
    console.log(`  - 업데이트된 Category: ${updatedCount}개`);
    console.log(`  - 스킵된 Category: ${skippedCount}개`);
    console.log(`  - 총 Category: ${categoriesSnapshot.size}개`);
    console.log('============================\n');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

addLocationToCategories()
  .then(() => {
    console.log('✨ 스크립트 실행 완료');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 스크립트 실행 실패:', error);
    process.exit(1);
  });
