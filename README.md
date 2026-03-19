# DuckDuck Frontend

DuckDuck 소셜 플랫폼의 프론트엔드 프로젝트입니다. 트위터와 유사한 한국어 커뮤니티 서비스로, 게시글(Ping) 작성, 팔로우, 구독, 메시지, 알림 등의 기능을 제공합니다.

백엔드 저장소: [DuckDuck12292025/Backend](https://github.com/DuckDuck12292025/Backend) (Java Spring Boot)

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript 5 |
| 스타일링 | Tailwind CSS 4 |
| 상태 관리 | Zustand 5 |
| 서버 상태 | TanStack React Query 5 |
| HTTP 클라이언트 | Axios |
| 런타임 | Node.js 20 |

---

## 빠른 시작 (로컬 개발)

### 1. 저장소 클론

```bash
git clone https://github.com/DuckDuck12292025/Frontend.git duckduck-frontend
cd duckduck-frontend
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.local` 파일을 프로젝트 루트에 생성합니다.

```bash
cp .env.example .env.local   # .env.example이 있는 경우
```

또는 직접 생성:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다. 백엔드가 `localhost:8080`에서 실행 중이어야 API 요청이 정상 동작합니다.

---

## Docker로 실행

### Dockerfile

멀티스테이지 빌드로 구성되어 있습니다.

1. **deps** - `npm ci`로 의존성 설치
2. **build** - Next.js 프로덕션 빌드 (`standalone` 출력)
3. **runner** - 경량 Node.js Alpine 이미지로 실행

### 단독 빌드 및 실행

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://backend:8080/api \
  -t duckduck-frontend .

docker run -p 3000:3000 duckduck-frontend
```

### 백엔드 docker-compose에 프론트엔드 서비스 추가

백엔드 팀의 `docker-compose.yml`에 아래 서비스를 추가합니다.

```yaml
services:
  # ... 기존 backend, db 등 서비스 ...

  frontend:
    build:
      context: ../duckduck-frontend   # 프론트엔드 저장소 경로
      args:
        NEXT_PUBLIC_API_URL: http://backend:8080/api
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

---

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx            # 메인 피드
│   ├── login/              # 로그인
│   ├── signup/             # 회원가입
│   ├── ping/[id]/          # 게시글 상세/수정
│   ├── user/[username]/    # 유저 프로필, 팔로워/팔로잉
│   ├── settings/           # 설정 (계정, 프로필, 알림 등)
│   ├── admin/              # 관리자 페이지
│   └── ...
├── components/
│   ├── ui/                 # 공통 UI (Button, Input, Modal, Card 등)
│   ├── layout/             # 레이아웃 (Header, Sidebar, MainLayout 등)
│   ├── features/           # 기능별 컴포넌트 (PingCard, CommentInput 등)
│   └── providers/          # Provider 컴포넌트 (AuthGuard, Providers)
├── hooks/
│   └── queries.ts          # TanStack React Query 커스텀 훅
├── lib/
│   └── api/                # API 연동 (아래 상세 설명)
├── stores/                 # Zustand 스토어 (auth, block, mute)
├── types/
│   └── index.ts            # 공통 타입 정의
└── mocks/
    └── data.ts             # 목업 데이터 (개발용)
```

---

## API 연동 가이드

API 관련 코드는 `src/lib/api/` 디렉토리에 집중되어 있습니다.

### 파일별 역할

| 파일 | 역할 |
|------|------|
| `client.ts` | Axios 인스턴스 생성, 인터셉터(토큰 자동 첨부, 401 시 토큰 갱신), 공통 헬퍼 함수(`api.get`, `api.post` 등) |
| `endpoints.ts` | 모든 API 엔드포인트 경로를 `ENDPOINTS` 객체로 관리 |
| `services.ts` | 도메인별 API 호출 함수 (인증, 유저, 게시글, 피드, 댓글 등) |
| `index.ts` | 바럴 파일 (re-export) |

### 엔드포인트 수정 방법

백엔드 API 경로가 변경되면 `src/lib/api/endpoints.ts`만 수정하면 됩니다.

```typescript
// endpoints.ts 예시
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',    // 이 경로를 백엔드에 맞게 수정
    SIGNUP: '/auth/signup',
    // ...
  },
  // ...
};
```

### 기본 URL 변경

기본 API URL은 환경변수 `NEXT_PUBLIC_API_URL`로 설정합니다. 미설정 시 `http://localhost:8080/api`가 기본값으로 사용됩니다.

### 상세 가이드

API 연동에 대한 자세한 내용은 [docs/BACKEND_INTEGRATION_GUIDE.md](docs/BACKEND_INTEGRATION_GUIDE.md)를 참조하세요.

---

## 환경변수

| 변수 | 필수 | 기본값 | 설명 |
|------|------|--------|------|
| `NEXT_PUBLIC_API_URL` | 아니오 | `http://localhost:8080/api` | 백엔드 API 기본 URL |

> `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트 번들에 포함됩니다. 민감한 정보(시크릿 키 등)는 이 접두사 없이 서버 전용으로 관리하세요.

---

## 주요 스크립트

```bash
npm run dev      # 개발 서버 실행 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```
