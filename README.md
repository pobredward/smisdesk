# SMIS 제주 여름캠프 - AI 챗봇 FAQ

Next.js + Firebase + Genkit + Gemini AI 기반의 캠프 FAQ 챗봇 시스템입니다.

## ✨ 주요 기능

- 🤖 **AI 기반 FAQ 챗봇**: Gemini AI와 RAG(검색 증강 생성) 기술 활용
- 📂 **동적 카테고리 관리**: 관리자가 직접 카테고리를 추가/수정/삭제 가능
- 🎨 **세련된 UI/UX**: 반응형 디자인 (데스크톱/모바일)
- ⚡ **실시간 FAQ 관리**: 관리자 페이지에서 즉시 추가/수정/삭제
- 📤 **일괄 FAQ 추가**: 텍스트로 여러 FAQ를 한 번에 추가
- 🔍 **스마트 검색**: 키워드 및 카테고리 기반 검색

## 🏗️ 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI/ML**: Firebase Genkit, Google Gemini API (gemini-2.5-flash)
- **Database**: Firebase Firestore
- **Deployment**: Vercel

## 📦 설치 및 실행

### 1. 저장소 클론 및 의존성 설치

```bash
git clone <repository-url>
cd smisdesk
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력:

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Gemini API Key
GOOGLE_GENAI_API_KEY=your-gemini-api-key
```

### 3. Firestore 데이터베이스 설정

1. Firebase Console에서 Firestore 생성
2. 데이터베이스 이름: `smisdesk`
3. Security Rules 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### 4. 초기 카테고리 생성

```bash
npm run seed:categories
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 📚 사용 가이드

### 관리자 페이지

#### 접속 방법
```
URL: http://localhost:3000/admin
비밀번호: smis2024
```

#### 주요 기능

1. **카테고리 관리**
   - 카테고리 추가/수정/삭제
   - 카테고리 이름 변경 시 FAQ 자동 업데이트
   - 자세한 내용: [CATEGORY_MANAGEMENT_GUIDE.md](./CATEGORY_MANAGEMENT_GUIDE.md)

2. **FAQ 개별 추가**
   - "개별 FAQ 추가" 클릭
   - 질문, 답변, 카테고리, 키워드 입력
   - "추가" 클릭

3. **FAQ 일괄 추가**
   - "텍스트 일괄 추가" 클릭
   - 카테고리 선택
   - 다음 형식으로 텍스트 입력:
   ```
   질문1
   답변1

   질문2
   답변2
   ```
   - "일괄 추가" 클릭

4. **FAQ 수정/삭제**
   - FAQ 목록에서 연필 아이콘(수정) 또는 휴지통 아이콘(삭제) 클릭

5. **카테고리별 필터링**
   - 상단 드롭다운에서 카테고리 선택
   - 또는 카테고리 버튼 클릭

자세한 내용은 다음 가이드를 참조하세요:
- [CATEGORY_MANAGEMENT_GUIDE.md](./CATEGORY_MANAGEMENT_GUIDE.md) - 카테고리 관리
- [CATEGORY_TEMPLATES.md](./CATEGORY_TEMPLATES.md) - FAQ 템플릿
- [ADMIN_PAGE_GUIDE.md](./ADMIN_PAGE_GUIDE.md) - 관리자 페이지 상세 가이드

### 사용자 챗봇

1. 홈페이지(`http://localhost:3000`)에서 챗봇 위젯 사용
2. 질문 입력 후 Enter 또는 "전송" 버튼 클릭
3. AI가 FAQ를 검색하여 답변 생성
4. 답변 하단에 참조된 FAQ 목록 표시

## 🗂️ 프로젝트 구조

```
smisdesk/
├── app/
│   ├── admin/
│   │   └── page.tsx          # 관리자 페이지
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # 챗봇 API
│   ├── layout.tsx
│   └── page.tsx              # 메인 홈페이지
├── components/
│   ├── CategoryManager.tsx   # 카테고리 관리 컴포넌트
│   └── ChatWidget.tsx        # 챗봇 위젯
├── lib/
│   ├── genkit/
│   │   ├── config.ts         # Genkit 설정
│   │   └── flows.ts          # RAG Flow
│   ├── hooks/
│   │   └── useCategories.ts  # 카테고리 훅
│   ├── firebase.ts           # Firebase 초기화
│   └── types.ts              # TypeScript 타입
├── scripts/
│   └── seed-categories.ts    # 카테고리 초기 생성 스크립트
└── public/
```

## 🎯 주요 기능 상세

### 1. RAG (검색 증강 생성)

`lib/genkit/flows.ts`에서 구현:

1. **텍스트 청킹**: 500자 이상의 긴 답변을 자동으로 분할
2. **키워드 스코어링**: 질문과 FAQ의 키워드 매칭 점수 계산
3. **카테고리 가중치**: 카테고리가 일치하면 +30점 보너스
4. **상위 5개 FAQ 선택**: 가장 관련성 높은 FAQ만 Gemini에 전달
5. **AI 답변 생성**: Gemini가 자연스러운 한국어로 답변 생성

### 2. 동적 카테고리 시스템

- **Firestore 기반**: `categories` 컬렉션에 카테고리 저장
- **실시간 동기화**: 카테고리 변경 시 자동 반영
- **일괄 업데이트**: 카테고리명 변경 시 FAQ 자동 업데이트
- **삭제 보호**: 사용 중인 카테고리는 삭제 불가

### 3. 자동 키워드 추출

`app/admin/page.tsx`의 `extractKeywords` 함수:

1. 텍스트 정제 (특수문자 제거)
2. 불용어 필터링 (이, 그, 저, 것 등)
3. 단어 빈도 계산
4. 상위 5개 키워드 추출

## 🔐 보안

### 개발 환경
- Firestore Rules: `allow read, write: if true`
- 관리자 비밀번호: `smis2024` (localStorage 기반)

### 프로덕션 환경 (권장)
1. Firestore Security Rules 강화:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /faqs/{faq} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /categories/{category} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

2. Firebase Authentication 사용
3. API 키를 서버 환경 변수로 관리
4. CORS 설정

## 📊 Firestore 데이터 구조

### `categories` 컬렉션
```typescript
{
  id: string;           // 자동 생성
  name: string;         // 카테고리 이름
  color: string;        // Tailwind 클래스
  order: number;        // 정렬 순서
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `faqs` 컬렉션
```typescript
{
  id: string;
  question: string;
  answer: string;
  category: string;     // categories.name과 매칭
  keywords: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🚀 배포

### Vercel 배포

1. Vercel에 프로젝트 연결
2. 환경 변수 설정 (`.env.local`과 동일)
3. 배포 완료!

```bash
npm run build
vercel deploy
```

### 환경 변수 확인

```bash
# .env.local 내용을 Vercel 환경 변수로 복사
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
GOOGLE_GENAI_API_KEY=...
```

## 🛠️ 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# Lint 체크
npm run lint

# 카테고리 초기 생성
npm run seed:categories
```

## 📖 추가 문서

- [CATEGORY_MANAGEMENT_GUIDE.md](./CATEGORY_MANAGEMENT_GUIDE.md) - 카테고리 관리 상세 가이드
- [CATEGORY_TEMPLATES.md](./CATEGORY_TEMPLATES.md) - 카테고리별 FAQ 템플릿
- [ADMIN_PAGE_GUIDE.md](./ADMIN_PAGE_GUIDE.md) - 관리자 페이지 사용 가이드
- [BULK_TEXT_GUIDE.md](./BULK_TEXT_GUIDE.md) - 일괄 추가 기능 가이드
- [FIRESTORE_RULES_GUIDE.md](./FIRESTORE_RULES_GUIDE.md) - Firestore 보안 규칙 가이드

## 🤝 기여

이슈 및 PR은 언제든지 환영합니다!

## 📝 라이센스

MIT License

---

**개발자**: SMIS Team  
**프로젝트 시작일**: 2026-04-13  
**버전**: 1.0.0
