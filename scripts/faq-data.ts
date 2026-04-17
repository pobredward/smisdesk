// FAQ 샘플 데이터를 직접 Firestore에 추가하는 스크립트
// Firebase 콘솔(https://console.firebase.google.com/)에서 직접 추가하거나
// 이 파일의 내용을 참고하여 수동으로 추가하세요

export const sampleFAQs = [
  {
    question: 'SMIS 데스크란 무엇인가요?',
    answer: 'SMIS 데스크는 AI 기반의 고객 지원 플랫폼입니다. 실시간으로 FAQ를 검색하여 정확한 답변을 제공하며, 24시간 언제든지 이용 가능합니다.',
    category: '서비스 소개',
    keywords: ['smis', '데스크', '소개', '서비스', 'ai', '고객지원'],
  },
  {
    question: '서비스 이용 요금은 어떻게 되나요?',
    answer: '현재 베타 서비스로 무료로 제공하고 있습니다. 정식 출시 후 요금제는 사용량에 따라 Basic(무료), Pro(월 29,000원), Enterprise(맞춤형) 플랜으로 제공될 예정입니다.',
    category: '요금',
    keywords: ['요금', '가격', '비용', '무료', '유료', '베타'],
  },
  {
    question: '챗봇은 24시간 이용 가능한가요?',
    answer: '네, 저희 AI 챗봇은 24시간 365일 언제든지 이용 가능합니다. 실시간으로 답변을 받아보실 수 있습니다.',
    category: '이용 방법',
    keywords: ['24시간', '운영시간', '이용시간', '가능', '실시간'],
  },
  {
    question: '회원가입이 필요한가요?',
    answer: '현재 베타 버전에서는 회원가입 없이 바로 사용하실 수 있습니다. 정식 출시 후 추가 기능 이용을 위해서는 회원가입이 필요할 수 있습니다.',
    category: '계정',
    keywords: ['회원가입', '가입', '계정', '로그인', '필요'],
  },
  {
    question: '어떤 종류의 질문에 답변할 수 있나요?',
    answer: '서비스 이용 방법, 요금 정책, 기술 지원, 계정 관리 등 SMIS 데스크와 관련된 모든 질문에 답변 가능합니다. FAQ에 없는 내용은 고객센터로 문의해주세요.',
    category: '이용 방법',
    keywords: ['질문', '답변', '가능', '종류', '내용'],
  },
  {
    question: '답변이 만족스럽지 않을 때는 어떻게 하나요?',
    answer: '챗봇 답변이 도움이 되지 않았다면 이메일(support@smisdesk.com)로 문의하시거나, 페이지 하단의 "고객센터로 문의하기"를 통해 상담원과 직접 대화하실 수 있습니다.',
    category: '고객 지원',
    keywords: ['만족', '불만족', '상담', '문의', '고객센터'],
  },
  {
    question: '데이터 보안은 어떻게 관리되나요?',
    answer: 'SMIS 데스크는 Firebase와 Google Cloud의 보안 인프라를 사용하여 데이터를 암호화하고 안전하게 저장합니다. 개인정보는 관련 법규를 준수하여 철저히 보호됩니다.',
    category: '보안',
    keywords: ['보안', '데이터', '개인정보', '암호화', '안전'],
  },
  {
    question: '모바일에서도 이용할 수 있나요?',
    answer: '네, SMIS 데스크는 반응형 웹으로 제작되어 PC, 태블릿, 스마트폰 등 모든 기기에서 최적화된 화면으로 이용하실 수 있습니다.',
    category: '이용 방법',
    keywords: ['모바일', '스마트폰', '태블릿', 'pc', '반응형'],
  },
  {
    question: 'AI는 어떤 모델을 사용하나요?',
    answer: 'Google의 최신 Gemini 2.0 Flash 모델을 사용하여 빠르고 정확한 한국어 답변을 제공합니다. RAG(검색 증강 생성) 기술로 FAQ 데이터베이스를 기반으로 답변합니다.',
    category: '기술',
    keywords: ['ai', '모델', 'gemini', 'rag', '기술'],
  },
  {
    question: '서비스 장애가 발생하면 어떻게 하나요?',
    answer: '서비스 장애 발생 시 즉시 복구 작업을 진행하며, 주요 장애는 홈페이지 공지사항을 통해 안내드립니다. 긴급 문의는 support@smisdesk.com으로 연락주세요.',
    category: '고객 지원',
    keywords: ['장애', '오류', '에러', '문제', '복구'],
  },
];

// Firebase 콘솔에서 직접 추가하는 방법:
// 1. https://console.firebase.google.com/ 접속
// 2. smisdesk 프로젝트 선택
// 3. Firestore Database 메뉴로 이동
// 4. "컬렉션 시작" 클릭
// 5. 컬렉션 ID: faqs
// 6. 위의 데이터를 각각 문서로 추가 (createdAt, updatedAt 필드는 Timestamp 타입으로 현재 시간 설정)
