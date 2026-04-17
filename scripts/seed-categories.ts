import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';

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

const DEFAULT_CATEGORIES = [
  { name: '등록', color: 'bg-blue-100 text-blue-700', order: 0, location: 'je' },
  { name: '프로그램(수업)', color: 'bg-green-100 text-green-700', order: 1, location: 'je' },
  { name: '야외활동', color: 'bg-yellow-100 text-yellow-700', order: 2, location: 'je' },
  { name: '반배정', color: 'bg-purple-100 text-purple-700', order: 3, location: 'je' },
  { name: '환자', color: 'bg-red-100 text-red-700', order: 4, location: 'je' },
  { name: '원어민 선생님', color: 'bg-indigo-100 text-indigo-700', order: 5, location: 'je' },
  { name: '멘토 선생님', color: 'bg-pink-100 text-pink-700', order: 6, location: 'je' },
  { name: '생활&숙소', color: 'bg-orange-100 text-orange-700', order: 7, location: 'je' },
  { name: '식단', color: 'bg-teal-100 text-teal-700', order: 8, location: 'je' },
];

async function seedCategories() {
  try {
    console.log('🌱 제주캠프 카테고리 시딩 시작...\n');

    // 기존 카테고리 확인
    const existingCategories = await getDocs(collection(db, 'categories'));
    
    if (!existingCategories.empty) {
      console.log(`⚠️  이미 ${existingCategories.size}개의 카테고리가 존재합니다.`);
      console.log('기존 카테고리를 확인하세요.\n');
      
      existingCategories.forEach(doc => {
        const data = doc.data();
        console.log(`  - ${data.name} (location: ${data.location || '없음'})`);
      });
      return;
    }

    // 카테고리 추가
    for (const category of DEFAULT_CATEGORIES) {
      await addDoc(collection(db, 'categories'), {
        ...category,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`✅ 추가됨: ${category.name} (제주캠프)`);
    }

    console.log('\n============================');
    console.log('🎉 제주캠프 카테고리 시딩 완료!');
    console.log(`총 ${DEFAULT_CATEGORIES.length}개의 카테고리가 추가되었습니다.`);
    console.log('============================\n');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

seedCategories()
  .then(() => {
    console.log('✨ 스크립트 실행 완료');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 스크립트 실행 실패:', error);
    process.exit(1);
  });
