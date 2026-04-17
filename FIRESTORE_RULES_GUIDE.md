# Firestore Security Rules 설정 가이드

관리자 페이지에서 FAQ를 추가/수정/삭제하려면 Firestore Security Rules를 업데이트해야 합니다.

## 🚀 빠른 설정 (개발 환경)

### 1단계: Firebase 콘솔 접속
1. https://console.firebase.google.com/ 접속
2. `smisdesk` 프로젝트 선택
3. 왼쪽 메뉴에서 "Firestore Database" 클릭
4. 상단 탭에서 "Rules" 클릭

### 2단계: Rules 업데이트

기존 규칙을 다음으로 교체:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /faqs/{faqId} {
      allow read: if true;   // 모든 사용자 읽기 가능
      allow write: if true;  // 모든 사용자 쓰기 가능 (개발용)
    }
  }
}
```

### 3단계: 게시
1. "게시" 버튼 클릭
2. 확인 다이얼로그에서 "게시" 클릭

⚠️ **주의**: 이 규칙은 개발/테스트 환경에서만 사용하세요! 누구나 데이터를 수정할 수 있습니다.

---

## 🔒 프로덕션 배포 시 (권장)

### 옵션 1: IP 기반 제한 (간단)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /faqs/{faqId} {
      allow read: if true;
      allow write: if request.auth != null;  // 인증된 사용자만
    }
  }
}
```

### 옵션 2: Firebase Auth 연동 (가장 안전)

1. Firebase Authentication 활성화
2. 관리자 이메일 등록
3. Rules 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /faqs/{faqId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.email in [
                        'admin@smis.co.kr',
                        'manager@smis.co.kr'
                      ];
    }
  }
}
```

### 옵션 3: Custom Claims (대규모)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /faqs/{faqId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
  }
}
```

---

## 📝 Rules 설명

### `allow read: if true`
- 모든 사용자(로그인 안 한 사용자 포함)가 FAQ를 읽을 수 있음
- 챗봇이 FAQ 데이터에 접근하기 위해 필요

### `allow write: if true` (개발용)
- 모든 사용자가 FAQ를 추가/수정/삭제 가능
- **개발 환경에서만 사용**
- 빠르게 테스트하고 싶을 때 유용

### `allow write: if request.auth != null` (프로덕션)
- Firebase Authentication으로 로그인한 사용자만 쓰기 가능
- 가장 일반적인 보안 방식

### `allow write: if request.auth.token.email in [...]`
- 특정 이메일 주소만 쓰기 가능
- 관리자 이메일을 화이트리스트로 관리

---

## 🧪 테스트 방법

Rules 설정 후 테스트:

1. http://localhost:3000/admin 접속
2. 로그인 (비밀번호: `smis2024`)
3. "새 FAQ 추가" 클릭
4. 테스트 FAQ 작성:
   - 질문: "테스트 질문"
   - 답변: "테스트 답변"
   - 카테고리: "테스트"
5. "추가" 버튼 클릭

**성공 시**: "FAQ가 추가되었습니다." 메시지
**실패 시**: "FAQ 추가에 실패했습니다." 메시지

---

## 🐛 문제 해결

### "권한이 거부되었습니다" 오류
- Firestore Rules에서 `allow write: if true` 확인
- "게시" 버튼을 눌렀는지 확인
- 브라우저 콘솔(F12)에서 에러 로그 확인

### FAQ가 추가되지 않음
- 브라우저 콘솔(F12)에서 네트워크 탭 확인
- Firestore Rules가 제대로 적용되었는지 확인
- Firebase 프로젝트 ID가 맞는지 확인

### 로그인이 안 됨
- 비밀번호 `smis2024` 확인
- 브라우저 쿠키/로컬 스토리지 초기화 후 재시도

---

## 📚 추가 자료

- [Firestore Security Rules 공식 문서](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication 시작하기](https://firebase.google.com/docs/auth/web/start)

---

**준비 완료!** 이제 관리자 페이지를 사용할 수 있습니다! 🎉
