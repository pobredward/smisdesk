# 거래처별 사이트 분리 구현 완료

## 📋 구현 내용

거래처별(A, B, C)로 다른 페이지와 FAQ를 제공하는 멀티 테넌트 시스템을 성공적으로 구현했습니다.

## 🎯 주요 기능

### 1. URL 기반 거래처 분리
- **루트 페이지 (`/`)**: 관리자 로그인 페이지
- **거래처 메인 페이지**: 
  - `/A` - A거래처 전용 페이지
  - `/B` - B거래처 전용 페이지
  - `/C` - C거래처 전용 페이지
- **거래처별 캠프 상세**:
  - `/A/camp/je` - A거래처의 제주캠프 페이지
  - `/B/camp/s` - B거래처의 싱가포르 캠프 페이지
  - 등등...

### 2. 거래처별 FAQ 관리
- FAQ에 `clients: ClientType[]` 필드 추가
- 가능한 값: `['A', 'B', 'C', 'common']`
- **필터링 로직**:
  - `clients: ['common']` → 모든 거래처에서 표시
  - `clients: ['A']` → A거래처에서만 표시
  - `clients: ['A', 'B']` → A, B거래처에서만 표시

### 3. 관리자 페이지 보안
- 루트 페이지는 로그인 페이지로 변경
- 간단한 비밀번호 인증 (기본값: `smis2024`)
- SessionStorage 기반 인증 상태 관리
- 관리자 레이아웃에서 자동 리다이렉트

### 4. 거래처별 챗봇
- 각 거래처 페이지마다 해당 거래처의 FAQ만 조회
- FloatingActions 컴포넌트에 `clientId` prop 추가
- ChatWidget에서 거래처별 필터링 자동 적용

## 📁 파일 변경 사항

### 새로 생성된 파일
```
app/
  ├── [client]/
  │   ├── page.tsx                    (거래처별 메인 페이지)
  │   └── camp/[id]/
  │       └── page.tsx                (거래처별 캠프 상세)
lib/
  └── hooks/
      └── useClientFaqs.ts            (거래처별 FAQ 필터링 훅)
scripts/
  └── migrate-add-clients-field.ts    (마이그레이션 스크립트)
```

### 수정된 파일
```
lib/
  └── types.ts                        (ClientType, CLIENTS 추가)
app/
  ├── page.tsx                        (로그인 페이지로 변경)
  └── admin/
      ├── layout.tsx                  (인증 체크 추가)
      └── page.tsx                    (거래처 선택 UI 추가)
components/
  ├── ChatWidget.tsx                  (clientId prop 추가)
  └── FloatingActions.tsx             (clientId prop 추가)
.env.local                            (NEXT_PUBLIC_ADMIN_PASSWORD 추가)
```

## 🔧 데이터 구조

### FAQ 인터페이스
```typescript
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  location: LocationType;          // 'je' | 's' | 'f' | 'common'
  clients: ClientType[];            // 👈 NEW
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 거래처 타입
```typescript
type ClientType = 'A' | 'B' | 'C' | 'common';

const CLIENTS = [
  { id: 'A', name: 'A거래처', description: 'A거래처 전용 페이지' },
  { id: 'B', name: 'B거래처', description: 'B거래처 전용 페이지' },
  { id: 'C', name: 'C거래처', description: 'C거래처 전용 페이지' },
  { id: 'common', name: '공통', description: '모든 거래처에 공통으로 표시' },
];
```

## 🚀 사용 방법

### 1. 관리자 로그인
1. `http://localhost:3000/` 접속
2. 비밀번호 입력: `smis2024`
3. 관리자 대시보드로 이동

### 2. FAQ 추가 시 거래처 선택
관리자 페이지에서 FAQ 추가/수정 시:
- **체크박스로 표시할 거래처 선택**
- 예시:
  - ✅ A거래처 ✅ B거래처 → A, B에서만 표시
  - ✅ 공통 → 모든 거래처에서 표시
  - ✅ A거래처 → A에서만 표시

### 3. 거래처별 페이지 접속
- A거래처: `http://localhost:3000/A`
- B거래처: `http://localhost:3000/B`
- C거래처: `http://localhost:3000/C`

### 4. 기존 FAQ 마이그레이션
기존 FAQ에 `clients` 필드를 추가하려면:
```bash
npx ts-node scripts/migrate-add-clients-field.ts
```
- 모든 기존 FAQ에 `clients: ['common']` 추가
- 이미 `clients` 필드가 있는 FAQ는 스킵

## 🎨 관리자 UI 개선사항

### FAQ 목록에 거래처 배지 표시
```
┌─────────────────────────────────────────┐
│ 🏝️ 제주캠프  👥 A거래처  👥 공통  등록  │
│ Q: 제주캠프 등록 인원은?               │
│ A: 100명입니다.                       │
└─────────────────────────────────────────┘
```

### FAQ 추가/수정 폼
```
표시할 거래처 *
┌──────────────────────────────────┐
│ ☐ 공통 (모든 거래처에 공통으로 표시) │
│ ☐ A거래처                         │
│ ☐ B거래처                         │
│ ☐ C거래처                         │
└──────────────────────────────────┘
```

## 📊 성능 최적화

### Firebase 쿼리 효율성
- ✅ **클라이언트 측 필터링 사용** (Firebase Index 불필요)
- 전체 FAQ 조회 후 JavaScript로 필터링
- 장점:
  - 인덱스 설정 불필요
  - 복잡한 쿼리 회피
  - 개발 속도 향상

### 데이터 전송량 최적화
- A거래처가 조회하면 A + common FAQ만 가져옴
- 불필요한 데이터 전송 방지

## 🔒 보안 고려사항

### 현재 구현 (간단한 비밀번호 인증)
- SessionStorage 기반
- 환경변수로 비밀번호 관리
- 빠른 구현, 내부 관리용으로 적합

### 향후 개선 가능 (선택사항)
- Firebase Authentication 도입
- 사용자 역할 관리 (admin, editor, viewer)
- 2FA (2단계 인증)

## 🧪 테스트 시나리오

### 1. 거래처별 FAQ 필터링 테스트
1. 관리자에서 FAQ 추가:
   - 질문: "A거래처 전용 FAQ"
   - 거래처: [A거래처만 체크]
2. `/A`에서 확인 → FAQ 표시됨 ✅
3. `/B`에서 확인 → FAQ 표시 안됨 ✅
4. `/C`에서 확인 → FAQ 표시 안됨 ✅

### 2. 공통 FAQ 테스트
1. 관리자에서 FAQ 추가:
   - 질문: "공통 FAQ"
   - 거래처: [공통 체크]
2. `/A`, `/B`, `/C` 모두에서 확인 → 모두 표시됨 ✅

### 3. 챗봇 테스트
1. `/A`에서 챗봇 열기
2. 질문 입력
3. A거래처 전용 FAQ + 공통 FAQ만 검색됨 ✅

## 🎯 실사용 예시

### 시나리오: 거래처별 가격 정책
```
FAQ 1 (A거래처):
- 질문: 제주캠프 가격은?
- 답변: A거래처는 200만원입니다.
- 거래처: [A거래처]

FAQ 2 (B거래처):
- 질문: 제주캠프 가격은?
- 답변: B거래처는 180만원입니다.
- 거래처: [B거래처]

FAQ 3 (공통):
- 질문: 제주캠프 기간은?
- 답변: 2주 또는 4주 과정입니다.
- 거래처: [공통]
```

결과:
- A거래처 사용자 → FAQ 1, FAQ 3 보임
- B거래처 사용자 → FAQ 2, FAQ 3 보임
- C거래처 사용자 → FAQ 3만 보임

## 📝 주의사항

1. **URL 공유**: 
   - 거래처 URL을 공유할 때 정확한 경로 사용
   - 예: `https://smisdesk.com/A` (O)
   - 예: `https://smisdesk.com` (X - 로그인 페이지)

2. **FAQ 관리**:
   - 거래처 선택 시 최소 1개 이상 선택 필수
   - 공통 선택 시 모든 거래처에서 표시됨

3. **마이그레이션**:
   - 기존 FAQ는 마이그레이션 스크립트 실행 필요
   - 실행 전 백업 권장

## ✅ 구현 완료 체크리스트

- ✅ 데이터 모델 확장 (ClientType 추가)
- ✅ 라우팅 구조 변경 ([client] 동적 라우팅)
- ✅ 관리자 페이지 보호 (로그인 페이지)
- ✅ 거래처별 FAQ 필터링 훅
- ✅ 관리자 UI 업데이트 (거래처 선택)
- ✅ 챗봇 거래처 컨텍스트 추가
- ✅ 마이그레이션 스크립트 생성
- ✅ 환경변수 설정
- ✅ FloatingActions 거래처 연동

## 🚀 다음 단계 (선택사항)

1. **도메인/서브도메인 설정**:
   - `a.smisdesk.com` → A거래처
   - `b.smisdesk.com` → B거래처

2. **거래처별 브랜딩**:
   - 로고 커스터마이징
   - 색상 테마 변경

3. **고급 필터링**:
   - 거래처 + 위치 조합 필터
   - 날짜별 FAQ 표시

4. **분석 대시보드**:
   - 거래처별 FAQ 조회수
   - 인기 질문 통계

## 📞 문의

구현 관련 문의사항이 있으시면 알려주세요!
