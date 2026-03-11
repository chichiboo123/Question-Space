# 🛰️ Question Space

> 우리들의 질문으로 만드는 우주
> *A universe made from our questions*

질문을 위성처럼 우주로 발사하고, 서로의 답변으로 채워가는 인터랙티브 질문 커뮤니티입니다.
교육뮤지컬 꿈꾸는 치수쌤이 만들었습니다.

---

## 주요 기능

### 질문 발사 (Question Launch)
- 닉네임과 질문을 입력하고 카테고리를 선택해 질문 위성을 발사
- **질문스페이스 규칙**: 질문 마지막에 반드시 `?` 포함
- 질문 300자 이내 제한
- 카테고리 복수 선택 가능, 직접 입력 기타 카테고리 지원

### 질문 탐험 (Explore)
- 전체 질문 목록 조회 및 카테고리 필터링

### 랜덤 질문 (Random)
- 무작위 질문을 뽑아 바로 답변할 수 있는 모드

### 답변 (Comments)
- 질문 상세 페이지에서 답변 작성
- **중복 답변 방지**: 동일한 내용의 답변은 등록 불가
- **쿨다운**: 답변 등록 후 20초간 재작성 대기
- **연속 클릭 방지**: 전송 중 버튼 비활성화

### 다국어 지원
- 한국어 / English / 日本語 언어 전환 지원

### 관리자 모드
- 비밀번호 인증 후 질문 삭제 및 수정 가능

---

## 카테고리

| 카테고리 | 설명 |
|----------|------|
| 💭 상상 | Imagination |
| 👫 사람 | People |
| 🌙 꿈 | Dreams |
| 📜 역사 | History |
| 🔬 과학·기술 | Science & Tech |
| 🌿 자연 | Nature |
| 💗 마음·감정 | Emotions |
| 🎨 예술 | Art |
| 🏫 학교 | School |
| 😔 고민 | Worries |
| ✨ 기타 | Other (직접 입력) |

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 18 + TypeScript |
| 번들러 | Vite |
| 스타일 | Tailwind CSS |
| UI 컴포넌트 | shadcn/ui + Radix UI |
| 애니메이션 | Framer Motion |
| 라우팅 | React Router v6 |
| 상태관리 | React Query (TanStack) |
| 알림 | Sonner |
| 테스트 | Vitest + Testing Library |

---

## 로컬 실행

```sh
# 1. 저장소 클론
git clone <YOUR_GIT_URL>
cd Question-Space

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 빌드
npm run build

# 5. 테스트
npm test
```

---

## 프로젝트 구조

```
src/
├── pages/
│   ├── Index.tsx          # 메인 홈 (질문 발사)
│   ├── Questions.tsx      # 질문 탐험
│   ├── QuestionDetail.tsx # 질문 상세 + 답변
│   ├── RandomQuestion.tsx # 랜덤 질문
│   └── Admin.tsx          # 관리자 모드
├── components/
│   ├── StarField.tsx      # 별 배경 애니메이션
│   ├── SatelliteIcon.tsx  # 위성 아이콘
│   ├── LangSwitcher.tsx   # 언어 전환
│   └── HelpButton.tsx     # 도움말
└── lib/
    ├── api.ts             # API 연동
    ├── i18n.tsx           # 다국어 지원
    └── questions.ts       # 카테고리 데이터
```

---

*created by. 교육뮤지컬 꿈꾸는 치수쌤*
