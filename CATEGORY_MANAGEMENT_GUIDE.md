# 📂 카테고리 관리 가이드

관리자 페이지에서 FAQ 카테고리를 직접 추가, 수정, 삭제할 수 있습니다.

---

## 🚀 빠른 시작

### 1. 초기 카테고리 설정 (최초 1회)

```bash
npm run seed:categories
```

이 명령어는 Firestore에 기본 9개 카테고리를 자동으로 생성합니다:
- 등록
- 프로그램(수업)
- 야외활동
- 반배정
- 환자
- 원어민 선생님
- 멘토 선생님
- 생활&숙소
- 식단

### 2. 관리자 페이지 접속

```
http://localhost:3000/admin
비밀번호: smis2024
```

### 3. 카테고리 관리 열기

우측 상단의 **"카테고리 관리"** 버튼 클릭

---

## 📋 주요 기능

### ✅ 카테고리 추가

1. "새 카테고리" 버튼 클릭
2. 카테고리 이름 입력 (예: "기타", "이벤트")
3. "추가" 클릭
4. 색상은 자동으로 할당됩니다

**특징:**
- 추가된 순서대로 자동 정렬
- 12가지 색상 팔레트에서 자동 선택
- 즉시 FAQ 추가/편집 시 사용 가능

### ✏️ 카테고리 수정

1. 카테고리 옆 "연필" 아이콘 클릭
2. 이름 또는 색상 변경
3. "저장" 클릭

**중요:**
- **카테고리 이름 변경 시**: 해당 카테고리를 사용하는 모든 FAQ가 자동으로 업데이트됩니다
- 확인 메시지가 표시되며, 승인 후 일괄 업데이트됩니다

**예시:**
```
"생활&숙소" → "숙소 및 생활"로 변경
→ 이 카테고리를 사용하는 16개 FAQ가 모두 자동 업데이트됨
```

### 🗑️ 카테고리 삭제

1. 카테고리 옆 "휴지통" 아이콘 클릭
2. 확인 메시지에서 "확인"

**주의:**
- 해당 카테고리를 사용하는 FAQ가 있으면 삭제할 수 없습니다
- 먼저 FAQ를 다른 카테고리로 변경하거나 삭제해야 합니다

**에러 예시:**
```
❌ 이 카테고리를 사용하는 FAQ가 16개 있습니다.
   먼저 FAQ를 삭제하거나 다른 카테고리로 변경해주세요.
```

---

## 🎨 색상 선택

총 12가지 색상 팔레트 제공:

| 색상 | Tailwind 클래스 |
|------|-----------------|
| 파란색 | `bg-blue-100 text-blue-700` |
| 보라색 | `bg-purple-100 text-purple-700` |
| 초록색 | `bg-green-100 text-green-700` |
| 주황색 | `bg-orange-100 text-orange-700` |
| 빨간색 | `bg-red-100 text-red-700` |
| 남색 | `bg-indigo-100 text-indigo-700` |
| 분홍색 | `bg-pink-100 text-pink-700` |
| 노란색 | `bg-yellow-100 text-yellow-700` |
| 청록색 | `bg-teal-100 text-teal-700` |
| 하늘색 | `bg-cyan-100 text-cyan-700` |
| 연두색 | `bg-lime-100 text-lime-700` |
| 호박색 | `bg-amber-100 text-amber-700` |

---

## 🔄 Firestore 데이터 구조

### `categories` 컬렉션

```typescript
{
  id: string;           // 자동 생성 (Firestore Document ID)
  name: string;         // 카테고리 이름 (예: "등록")
  color: string;        // Tailwind 클래스 (예: "bg-blue-100 text-blue-700")
  order: number;        // 정렬 순서 (0부터 시작)
  createdAt: Timestamp; // 생성 시간
  updatedAt: Timestamp; // 수정 시간
}
```

### `faqs` 컬렉션

```typescript
{
  id: string;
  question: string;
  answer: string;
  category: string;     // 카테고리 이름 (categories.name과 매칭)
  keywords: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## ⚙️ 동작 원리

### 카테고리 이름 변경 시

1. **사용자 확인**
   ```
   "생활&숙소"에서 "숙소 및 생활"(으)로 변경하면,
   이 카테고리를 사용하는 모든 FAQ도 업데이트됩니다.
   계속하시겠습니까?
   ```

2. **FAQ 일괄 업데이트**
   ```typescript
   // 1. 해당 카테고리를 사용하는 모든 FAQ 검색
   const faqsToUpdate = faqs.filter(faq => faq.category === "생활&숙소");
   
   // 2. Batch Update (효율적인 일괄 업데이트)
   const batch = writeBatch(db);
   faqsToUpdate.forEach(faq => {
     batch.update(faq.ref, { 
       category: "숙소 및 생활",
       updatedAt: Timestamp.now()
     });
   });
   await batch.commit();
   ```

3. **카테고리 업데이트**
   ```typescript
   await updateDoc(categoryRef, {
     name: "숙소 및 생활",
     updatedAt: Timestamp.now()
   });
   ```

4. **결과 통보**
   ```
   ✅ 카테고리가 수정되었습니다.
   16개의 FAQ가 업데이트되었습니다.
   ```

### 카테고리 삭제 시

1. **사용 여부 확인**
   ```typescript
   const faqsWithCategory = await getDocs(
     query(collection(db, 'faqs'), 
           where('category', '==', categoryName))
   );
   
   if (faqsWithCategory.length > 0) {
     return error("이 카테고리를 사용하는 FAQ가 있습니다");
   }
   ```

2. **삭제 실행**
   ```typescript
   await deleteDoc(doc(db, 'categories', categoryId));
   ```

---

## 🎯 실전 예시

### 시나리오 1: 새 카테고리 추가

**상황:** "이벤트" 카테고리를 추가하고 싶어요.

**절차:**
1. "카테고리 관리" → "새 카테고리"
2. 이름: `이벤트` 입력
3. "추가" 클릭
4. FAQ 추가 시 "이벤트" 카테고리 선택 가능

### 시나리오 2: 카테고리 이름 수정

**상황:** "생활&숙소"를 "숙소"로 간단하게 변경하고 싶어요.

**절차:**
1. "생활&숙소" 옆 연필 아이콘 클릭
2. 이름: `숙소`로 변경
3. 확인 메시지 승인
4. 16개 FAQ가 자동으로 "숙소" 카테고리로 변경됨

### 시나리오 3: 카테고리 정리

**상황:** "테스트" 카테고리를 삭제하고 싶어요.

**절차:**
1. "테스트" 카테고리를 사용하는 FAQ 확인
2. 해당 FAQ들을 다른 카테고리로 변경 또는 삭제
3. "테스트" 카테고리 휴지통 아이콘 클릭
4. 삭제 완료

---

## 📊 카테고리 통계

관리자 페이지 하단의 카테고리 버튼에서 각 카테고리별 FAQ 개수를 실시간으로 확인할 수 있습니다.

```
[등록 (2)] [프로그램(수업) (11)] [야외활동 (2)] [반배정 (3)]
[환자 (3)] [원어민 선생님 (1)] [멘토 선생님 (1)] [생활&숙소 (16)] [식단 (1)]
```

---

## 💡 팁

1. **카테고리 이름은 간결하게**: 버튼에 표시되므로 3-8자가 적당합니다
2. **색상은 구분하기 쉽게**: 비슷한 카테고리는 비슷한 색상으로
3. **자주 사용하는 카테고리는 앞으로**: order 순서 조정 (향후 기능)
4. **카테고리는 적절한 개수로**: 너무 많으면(15개 이상) 관리가 어려워집니다
5. **카테고리 통합 시**: 이름 변경 기능을 활용하면 FAQ를 자동으로 이관할 수 있습니다

---

## 🔧 트러블슈팅

### Q: 카테고리 추가가 안 돼요
**A:** 
- Firebase Console에서 `categories` 컬렉션 권한 확인
- Firestore Rules에서 `allow write: if true;` 설정 확인

### Q: FAQ 개수가 안 맞아요
**A:**
- 페이지 새로고침
- Firestore Console에서 직접 FAQ 개수 확인

### Q: 카테고리 이름 변경 후 챗봇에서 인식이 안 돼요
**A:**
- 챗봇은 자동으로 새 카테고리명을 사용합니다
- `lib/genkit/flows.ts`의 `categoryKeywords` 매핑은 수동 업데이트 필요

### Q: 카테고리를 삭제했는데 복구하고 싶어요
**A:**
- Firestore Console → `categories` 컬렉션 → 문서 추가
- 또는 `npm run seed:categories` 재실행 (전체 초기화)

---

## 🎓 고급 기능 (향후 추가 예정)

- [ ] 카테고리 순서 드래그 앤 드롭
- [ ] 카테고리 아이콘 설정
- [ ] 카테고리별 키워드 자동 매핑
- [ ] 카테고리 사용 통계 및 분석
- [ ] 카테고리 템플릿 저장/불러오기

---

**마지막 업데이트:** 2026-04-13  
**버전:** 1.0.0
