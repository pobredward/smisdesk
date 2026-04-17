# 🔧 로컬 개발 환경 수정 완료

## 변경 사항

Firebase Admin SDK를 제거하고 클라이언트 사이드 Firebase SDK로 변경했습니다.

### 수정한 이유
- 로컬 개발 환경에서 Firebase Admin SDK는 서비스 계정 키가 필요
- 클라이언트 SDK를 사용하면 별도 인증 없이 바로 사용 가능
- Firestore Security Rules로 보안 관리

### 변경된 파일

1. **app/api/chat/route.ts**
   - Firebase Admin SDK 제거
   - 클라이언트에서 전달받은 FAQ 데이터 사용

2. **components/ChatWidget.tsx**
   - Firestore에서 직접 FAQ 데이터 가져오기
   - 클라이언트 사이드에서 데이터 조회 후 API 호출

3. **lib/firebase.ts**
   - 서버/클라이언트 구분 제거
   - 간단한 Firebase 초기화

## 다음 단계

### 1. Firestore에 FAQ 데이터 추가

`SETUP_FIRESTORE.md` 파일을 참고하여 Firebase 콘솔에서 FAQ 데이터를 추가하세요:

1. https://console.firebase.google.com/ 접속
2. `smisdesk` 프로젝트 선택
3. Firestore Database로 이동
4. `faqs` 컬렉션 생성
5. 샘플 FAQ 10개 추가

**최소 1개의 FAQ만 추가해도 테스트 가능합니다:**

```
컬렉션: faqs
문서 ID: (자동 생성)
필드:
  - question (string): "SMIS 데스크란 무엇인가요?"
  - answer (string): "SMIS 데스크는 AI 기반의 고객 지원 플랫폼입니다."
  - category (string): "서비스 소개"
  - keywords (array): ["smis", "데스크", "소개"]
  - createdAt (timestamp): 현재 시간
  - updatedAt (timestamp): 현재 시간
```

### 2. Firestore Security Rules 설정

Firebase 콘솔 > Firestore Database > Rules 탭에서:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /faqs/{faqId} {
      allow read: if true;  // 모든 사용자 읽기 가능
      allow write: if false;  // 쓰기는 Firebase 콘솔에서만
    }
  }
}
```

**중요**: "게시" 버튼을 눌러야 적용됩니다!

### 3. 테스트

개발 서버가 실행 중입니다:
```
http://localhost:3000
```

브라우저에서 접속 후:
1. 챗봇에 "SMIS 데스크가 뭐야?" 입력
2. AI 답변 확인
3. 참조 FAQ 출처 확인

## 장점

✅ **로컬 개발 환경에서 바로 작동**: 서비스 계정 키 불필요
✅ **Vercel 배포 간편**: 환경 변수만 설정하면 됨
✅ **보안**: Firestore Rules로 관리
✅ **비용 절감**: Admin SDK 호출 없음

## 프로덕션 배포 시

Vercel에 배포할 때도 동일하게 작동합니다:
1. 환경 변수 설정
2. `vercel` 명령어로 배포
3. 완료!
