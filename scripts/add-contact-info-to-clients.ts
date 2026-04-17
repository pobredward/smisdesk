import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * 기존 거래처들에 담당자 정보를 추가하는 스크립트
 * 예시 데이터로 설정하며, 실제 운영 시에는 수동으로 수정해야 합니다.
 */

const contactData: { [clientId: string]: { contactPerson: string; contactPhone: string } } = {
  'hansol': {
    contactPerson: '김담당',
    contactPhone: '010-1234-5678'
  },
  'daekyo': {
    contactPerson: '이담당', 
    contactPhone: '010-2345-6789'
  },
  'A': {
    contactPerson: 'A사 담당자',
    contactPhone: '010-3456-7890'
  },
  'B': {
    contactPerson: 'B사 담당자',
    contactPhone: '010-4567-8901'
  }
};

async function addContactInfoToClients() {
  try {
    console.log('기존 거래처들에 담당자 정보 추가 시작...');
    
    // 모든 클라이언트 가져오기
    const clientsCollection = collection(db, 'clients');
    const clientsSnapshot = await getDocs(clientsCollection);
    
    let updatedCount = 0;
    
    for (const clientDoc of clientsSnapshot.docs) {
      const clientData = clientDoc.data();
      const clientId = clientData.clientId;
      
      console.log(`처리 중: ${clientId} (${clientData.name})`);
      
      // 이미 담당자 정보가 있으면 스킵
      if (clientData.contactPerson || clientData.contactPhone) {
        console.log(`  이미 담당자 정보가 있음 - 스킵`);
        continue;
      }
      
      // 담당자 정보가 있으면 업데이트
      if (contactData[clientId]) {
        const { contactPerson, contactPhone } = contactData[clientId];
        
        await updateDoc(doc(db, 'clients', clientDoc.id), {
          contactPerson,
          contactPhone,
          updatedAt: new Date()
        });
        
        console.log(`  담당자 정보 추가: ${contactPerson} (${contactPhone})`);
        updatedCount++;
      } else {
        console.log(`  담당자 정보 없음 - 수동으로 추가 필요`);
      }
    }
    
    console.log(`\n완료! 총 ${updatedCount}개 거래처에 담당자 정보 추가됨`);
    console.log('나머지 거래처는 관리자 페이지에서 수동으로 추가해주세요.');
    
  } catch (error) {
    console.error('담당자 정보 추가 실패:', error);
  }
}

// 스크립트 실행
if (require.main === module) {
  addContactInfoToClients()
    .then(() => {
      console.log('스크립트 실행 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('스크립트 실행 실패:', error);
      process.exit(1);
    });
}

export { addContactInfoToClients };