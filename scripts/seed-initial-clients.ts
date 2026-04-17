/**
 * Firestore에 기본 거래처 데이터를 추가하는 스크립트
 * 
 * 사용법:
 * npx ts-node scripts/seed-initial-clients.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

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

const initialClients = [
  {
    clientId: 'A',
    name: 'A거래처',
    description: 'A거래처 전용 페이지',
    order: 1,
  },
  {
    clientId: 'B',
    name: 'B거래처',
    description: 'B거래처 전용 페이지',
    order: 2,
  },
  {
    clientId: 'C',
    name: 'C거래처',
    description: 'C거래처 전용 페이지',
    order: 3,
  },
];

async function seedClients() {
  console.log('🚀 거래처 데이터 시드 시작...');
  
  try {
    const clientsRef = db.collection('clients');
    const snapshot = await clientsRef.get();
    
    if (!snapshot.empty) {
      console.log(`⚠️  이미 ${snapshot.size}개의 거래처가 존재합니다.`);
      console.log('   기존 데이터를 삭제하고 다시 시도하시겠습니까? (수동으로 처리해주세요)');
      return;
    }
    
    for (const client of initialClients) {
      await clientsRef.add({
        ...client,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`✅ ${client.name} 추가 완료`);
    }
    
    console.log('\n✨ 거래처 시드 완료!');
    console.log(`   - 총 ${initialClients.length}개의 거래처 추가됨`);
    console.log(`   - 이제 관리자 페이지에서 거래처를 추가/수정/삭제할 수 있습니다.`);
    
  } catch (error) {
    console.error('❌ 거래처 시드 오류:', error);
    throw error;
  }
}

if (require.main === module) {
  seedClients()
    .then(() => {
      console.log('\n✅ 프로세스 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 프로세스 실패:', error);
      process.exit(1);
    });
}

export { seedClients };
