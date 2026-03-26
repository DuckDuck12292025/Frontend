# DuckDuck 프론트엔드 가이드

> 프론트엔드 실행 방법, 프로젝트 구조, 백엔드 연동 방법, 응답 규격을 안내합니다.

---

## 목차

1. [프론트엔드 실행](#1-프론트엔드-실행)
2. [프로젝트 구조](#2-프로젝트-구조)
3. [현재 동작 방식 (Mock)](#3-현재-동작-방식-mock)
4. [백엔드 연동 방법](#4-백엔드-연동-방법)
5. [응답 규격 (프론트엔드 기준)](#5-응답-규격-프론트엔드-기준)
6. [엔드포인트 전체 목록](#6-엔드포인트-전체-목록)
7. [화면별 사용 API 요약](#7-화면별-사용-api-요약)

---

## 1. 프론트엔드 실행

### 요구사항

- Node.js 20 이상
- npm

### 실행

```bash
git clone https://github.com/DuckDuck12292025/Frontend.git
cd Frontend

npm install
npm run dev
```

`http://localhost:3000` 에서 확인 가능합니다.
백엔드 없이 **mock 데이터로 모든 화면이 동작**합니다.

### 환경 변수

```bash
cp .env.example .env.local
```

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api   # 백엔드 연결 시
NEXT_PUBLIC_APP_NAME=DuckDuck
```

---

## 2. 프로젝트 구조

```
src/
├── app/                    # 페이지 (Next.js App Router)
│   ├── page.tsx            # 홈 피드 (/)
│   ├── login/              # 로그인
│   ├── signup/             # 회원가입
│   ├── compose/            # 글쓰기
│   ├── ping/[id]/          # 게시글 상세
│   ├── user/[username]/    # 유저 프로필
│   ├── category/[slug]/    # 카테고리 상세
│   ├── settings/           # 설정 (10개 하위 페이지)
│   ├── admin/              # 관리자 (6개 하위 페이지)
│   └── ...                 # 총 45개 페이지
│
├── lib/api/
│   ├── client.ts           # Axios 인스턴스 (인터셉터, 토큰 갱신)
│   ├── endpoints.ts        # API 경로 상수
│   └── services.ts         # API 호출 함수 + 응답 타입 정의
│
├── hooks/
│   └── queries.ts          # React Query 훅 (30개+)
│
├── stores/
│   ├── auth.ts             # Zustand 인증 스토어
│   ├── block.ts            # 차단 유저 관리
│   └── mute.ts             # 뮤트 유저 관리
│
├── mocks/
│   └── data.ts             # Mock 데이터 (백엔드 연결 후 제거 예정)
│
├── types/
│   └── index.ts            # TypeScript 전체 타입 정의
│
└── components/
    ├── ui/                 # 공통 UI (Button, Modal, Avatar 등)
    ├── features/           # 기능 컴포넌트 (PingCard, RepostModal 등)
    └── layout/             # 레이아웃 (MainLayout, Header, Sidebar 등)
```

---

## 3. 현재 동작 방식 (Mock)

모든 페이지에서 `src/mocks/data.ts`의 mock 데이터를 사용합니다.

```typescript
// 현재 패턴 (예: src/app/page.tsx)
import { mockPosts } from '@/mocks/data';
import { useHomeFeed } from '@/hooks/queries';

const { data } = useHomeFeed();  // API 호출 시도
const posts = apiPosts.length > 0 ? apiPosts : mockPosts;  // 실패 시 mock fallback
```

**React Query 훅은 이미 실제 API를 호출하도록 구현**되어 있습니다.
백엔드가 응답하면 자동으로 실제 데이터를 사용합니다.

---

## 4. 백엔드 연동 방법

### 4-1. 연결 조건

프론트엔드가 백엔드에 연결되려면:

1. 백엔드가 `http://localhost:8080`에서 실행 중
2. CORS에 `http://localhost:3000` 허용
3. 응답이 아래 규격에 맞음

### 4-2. 현재 백엔드(dev 브랜치) 상태

백엔드는 **아직 프론트 규격과 맞지 않습니다.** 주요 불일치:

| 항목 | 프론트 기대 | 백엔드 현재 |
|------|-----------|-----------|
| 응답 래퍼 | `{ success, data, message }` | DTO 직접 반환 |
| 에러 형식 | `{ success, error: { code, message } }` | `{ status, message, timestamp }` |
| 회원가입 경로 | `POST /auth/signup` | `POST /users/register` |
| 프로필 경로 | `/users/*` | `/profiles/*` |
| 인증 방식 | 전체 `Bearer` 토큰 | PostController만 `X-User-Id` 헤더 |
| 페이지네이션 | `{ items, nextCursor, hasMore }` | Spring `Page<T>` |
| CORS | `localhost:3000` 필요 | `localhost:8080`만 허용 |

> 상세 불일치 및 수정 코드 예시: [`docs/BACKEND_INTEGRATION_GUIDE.md`](./BACKEND_INTEGRATION_GUIDE.md)
> 엔드포인트 대조표: [`docs/API_ENDPOINT_MAPPING.md`](./API_ENDPOINT_MAPPING.md)

### 4-3. mock 제거 방법 (백엔드 연결 후)

각 페이지에서 3단계로 전환합니다:

```typescript
// 1. mock import 제거
- import { mockPosts } from '@/mocks/data';

// 2. fallback 로직 제거
- const posts = apiPosts.length > 0 ? apiPosts : mockPosts;
+ const posts = apiPosts;

// 3. 로딩/에러/빈 상태 UI 추가
+ if (isLoading) return <LoadingSpinner />;
+ if (posts.length === 0) return <EmptyState />;
```

---

## 5. 응답 규격 (프론트엔드 기준)

**백엔드가 이 형식에 맞춰야 프론트가 동작합니다.**

### 5-1. 공통 응답 래퍼

모든 API는 아래 형식으로 응답해야 합니다.

```json
// 성공
{
  "success": true,
  "data": { ... },
  "message": "OK"
}

// 에러
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다."
  }
}
```

> `client.ts`에서 `response.data`를 반환하므로 훅에서는 `{ success, data }` 객체를 받습니다.
> `data` 안에 실제 응답 내용이 들어갑니다.

### 5-2. 인증

#### 로그인 요청/응답

```
POST /auth/login
```

```json
// Request
{ "email": "user@example.com", "password": "..." }

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "handle": "duckking",
      "nickname": "오리왕",
      "status": "ACTIVE",
      "role": "USER",
      "isVerified": true,
      "isBlueChecked": false,
      "profile": {
        "profileImageUrl": null,
        "backgroundImageUrl": null,
        "bio": "",
        "followerCount": 0,
        "followingCount": 0,
        "postCount": 0,
        "hasMembership": false
      },
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresIn": 1800
    }
  }
}
```

#### 회원가입 — 로그인과 동일한 응답

```
POST /auth/signup
Request: { "email": "...", "password": "...", "nickname": "..." }
Response: AuthResponse (로그인과 동일)
```

#### 토큰 갱신

```
POST /auth/refresh
Request: { "refreshToken": "eyJ..." }
Response: { "success": true, "data": { "accessToken": "...", "refreshToken": "..." } }
```

#### 내 정보 조회

```
GET /auth/me
Headers: Authorization: Bearer {accessToken}
Response: { "success": true, "data": UserResponse }
```

### 5-3. 유저/프로필

```typescript
// UserWithProfileResponse
{
  "id": 1,
  "email": "user@example.com",
  "handle": "duckking",
  "nickname": "오리왕",
  "status": "ACTIVE",           // ACTIVE | INACTIVE | SUSPENDED
  "role": "USER",               // USER | PREMIUM | ADMIN
  "isVerified": true,
  "isBlueChecked": false,
  "profile": {
    "profileImageUrl": "https://...",
    "backgroundImageUrl": null,
    "bio": "안녕하세요",
    "followerCount": 150,
    "followingCount": 89,
    "postCount": 42,
    "hasMembership": false
  },
  "isFollowing": false,         // 내가 이 유저를 팔로우 중인지 (null = 비로그인)
  "isFollowedBy": false,        // 이 유저가 나를 팔로우 중인지
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 5-4. 게시글

```typescript
// PostWithAuthorResponse
{
  "id": 1,
  "userId": 1,
  "categoryId": 3,
  "content": "글 내용...",
  "visibility": "PUBLIC",       // PUBLIC | FOLLOWERS | SUBSCRIBERS | PRIVATE
  "isPinned": false,
  "likeCount": 42,
  "commentCount": 5,
  "repostCount": 3,
  "viewCount": 200,
  "bookmarkCount": 8,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "author": { ... },            // UserWithProfileResponse (위 참고)
  "media": [                    // 첨부 미디어 배열
    {
      "id": 1,
      "postId": 1,
      "mediaType": "IMAGE",     // IMAGE | VIDEO | GIF
      "mediaUrl": "https://...",
      "thumbnailUrl": null,
      "width": 1200,
      "height": 800,
      "duration": null,
      "orderIndex": 0,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "category": {                 // CategoryResponse (null 가능)
    "id": 3,
    "name": "게임",
    "slug": "game",
    ...
  },
  "isLiked": false,             // 내가 좋아요 했는지 (null = 비로그인)
  "isBookmarked": false,
  "isReposted": false,
  "quotedPost": null            // 인용한 원글 (PostWithAuthorResponse, null 가능)
}
```

### 5-5. 댓글

```typescript
// CommentWithAuthorResponse
{
  "id": 1,
  "postId": 1,
  "userId": 2,
  "parentId": null,             // 대댓글이면 부모 댓글 ID
  "content": "댓글 내용",
  "likeCount": 5,
  "replyCount": 2,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "author": { ... },            // UserWithProfileResponse
  "replies": [ ... ],           // CommentWithAuthorResponse[] (대댓글)
  "isLiked": false
}
```

### 5-6. 카테고리

```typescript
// CategoryResponse
{
  "id": 1,
  "name": "애니메이션",
  "slug": "anime",
  "description": "애니메이션 관련 게시판",
  "coverImageUrl": null,
  "status": "ACTIVE",
  "visibility": "PUBLIC",
  "postCount": 150,
  "subscriberCount": 500,
  "createdBy": null,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "isSubscribed": false         // 내가 구독 중인지 (null = 비로그인)
}
```

### 5-7. 페이지네이션

프론트엔드는 두 가지 페이지네이션을 사용합니다.

#### 커서 기반 (피드, 무한 스크롤)

```
GET /feed/home?cursor=abc123&limit=20
```

```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "nextCursor": "eyJpZCI6MTB9",
    "hasMore": true
  }
}
```

사용하는 곳: 홈 피드, 팔로잉 피드, 카테고리 피드, 유저 게시글, 북마크, 알림

#### 오프셋 기반 (목록)

```
GET /users/1/followers?page=0&pageSize=20
```

```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "total": 150,
    "page": 0,
    "pageSize": 20,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

사용하는 곳: 팔로워/팔로잉 목록, 댓글

### 5-8. 상호작용 응답 (좋아요, 팔로우, 북마크 등)

```json
// POST /posts/:id/like → 좋아요
{ "success": true, "data": { "liked": true, "likeCount": 43 } }

// DELETE /posts/:id/like → 좋아요 취소
{ "success": true, "data": { "liked": false, "likeCount": 42 } }

// POST /users/:id/follow → 팔로우
{ "success": true, "data": { "followed": true } }

// POST /posts/:id/bookmark → 북마크
{ "success": true, "data": { "bookmarked": true } }

// POST /posts/:id/repost → 리포스트
{ "success": true, "data": { "reposted": true } }

// DELETE /posts/:id → 게시글 삭제
{ "success": true, "data": { "deleted": true } }
```

### 5-9. 필드 네이밍 규칙

프론트엔드는 **camelCase**를 사용합니다. 백엔드도 동일하게 맞춰주세요.

```
✅ likeCount, createdAt, profileImageUrl, isVerified, isBlueChecked
❌ like_count, created_at, profile_image_url, is_verified
```

---

## 6. 엔드포인트 전체 목록

> `src/lib/api/endpoints.ts`에 정의된 전체 경로입니다.
> 모든 경로 앞에 `NEXT_PUBLIC_API_URL` (`http://localhost:8080/api`)이 붙습니다.

### 인증

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/auth/login` | 로그인 |
| POST | `/auth/signup` | 회원가입 |
| POST | `/auth/logout` | 로그아웃 |
| POST | `/auth/refresh` | 토큰 갱신 |
| GET | `/auth/me` | 내 정보 |
| POST | `/auth/change-password` | 비밀번호 변경 |
| GET | `/auth/sessions` | 로그인 세션 목록 |
| DELETE | `/auth/sessions/:id` | 세션 삭제 |
| DELETE | `/auth/account` | 계정 삭제 |

### 유저

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/users/me` | 내 프로필 |
| PATCH | `/users/me/profile` | 프로필 수정 |
| GET | `/users/:id` | ID로 유저 조회 |
| GET | `/users/nickname/:nickname` | 닉네임으로 조회 |
| GET | `/users/handle/:handle` | 핸들로 조회 |
| GET | `/users/:id/followers` | 팔로워 목록 |
| GET | `/users/:id/following` | 팔로잉 목록 |
| POST | `/users/:id/follow` | 팔로우 |
| DELETE | `/users/:id/follow` | 언팔로우 |
| POST | `/users/:id/block` | 차단 |
| DELETE | `/users/:id/block` | 차단 해제 |
| POST | `/users/:id/mute` | 뮤트 |
| DELETE | `/users/:id/mute` | 뮤트 해제 |
| GET | `/users/settings` | 설정 조회 |
| PATCH | `/users/settings` | 설정 수정 |

### 게시글

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/posts` | 게시글 작성 |
| GET | `/posts/:id` | 게시글 조회 |
| PATCH | `/posts/:id` | 게시글 수정 |
| DELETE | `/posts/:id` | 게시글 삭제 |
| POST | `/posts/:id/like` | 좋아요 |
| DELETE | `/posts/:id/like` | 좋아요 취소 |
| POST | `/posts/:id/bookmark` | 북마크 |
| POST | `/posts/:id/repost` | 리포스트 |

### 피드

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/feed/home` | 홈 피드 (커서) |
| GET | `/feed/following` | 팔로잉 피드 (커서) |
| GET | `/feed/category/:id` | 카테고리 피드 (커서) |
| GET | `/users/:id/posts` | 유저 게시글 (커서) |

### 댓글

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/comments/post/:postId` | 게시글 댓글 (오프셋) |
| POST | `/comments` | 댓글 작성 |
| PATCH | `/comments/:id` | 댓글 수정 |
| DELETE | `/comments/:id` | 댓글 삭제 |
| POST | `/comments/:id/like` | 댓글 좋아요 |
| DELETE | `/comments/:id/like` | 댓글 좋아요 취소 |

### 카테고리

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/categories` | 카테고리 목록 |
| GET | `/categories/:id` | 카테고리 상세 |
| POST | `/categories/:id/subscribe` | 구독 |
| DELETE | `/categories/:id/subscribe` | 구독 해제 |

### 검색

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/search?q=keyword` | 통합 검색 |
| GET | `/search/trending` | 트렌딩 키워드 |

### 북마크

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/bookmarks` | 북마크 목록 |
| POST | `/bookmarks` | 북마크 추가 |
| DELETE | `/bookmarks/:postId` | 북마크 제거 |

### 알림

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/notifications` | 알림 목록 |
| POST | `/notifications/:id/read` | 읽음 처리 |
| POST | `/notifications/read-all` | 전체 읽음 |
| GET | `/notifications/unread-count` | 미읽음 개수 |

### 메시지

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/messages/conversations` | 대화 목록 |
| POST | `/messages` | 메시지 전송 |
| GET | `/messages/:id` | 메시지 상세 |
| DELETE | `/messages/:id` | 메시지 삭제 |
| GET | `/messages/unread-count` | 미읽음 개수 |

### 파일

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/files` | 파일 업로드 |
| POST | `/files/multiple` | 다중 업로드 |
| GET | `/files/:filename` | 파일 다운로드 |

### 프리미엄 / 팬 구독 / 고객지원 / 관리자

> `src/lib/api/endpoints.ts` 파일에서 전체 경로를 확인할 수 있습니다.

---

## 7. 화면별 사용 API 요약

> 각 페이지 파일 상단에 주석으로 상세 API 목록이 있습니다.

### 핵심 화면

| 화면 | 경로 | 사용 API |
|------|------|---------|
| 홈 피드 | `/` | `GET /feed/home`, 좋아요, 북마크, 삭제 |
| 로그인 | `/login` | `POST /auth/login` |
| 회원가입 | `/signup` | `POST /auth/signup` |
| 글쓰기 | `/compose` | `POST /posts`, `GET /categories` |
| 게시글 상세 | `/ping/:id` | `GET /posts/:id`, 댓글 CRUD, 좋아요/북마크/리포스트 |
| 유저 프로필 | `/user/:username` | `GET /users/nickname/:nickname`, `GET /users/:id/posts` |
| 검색 | `/search` | `GET /search` |
| 카테고리 | `/categories` | `GET /categories` |

### Mock만 사용 중인 화면 (백엔드 API 훅 추가 필요)

| 화면 | 경로 | 필요한 API |
|------|------|-----------|
| 알림 | `/notifications` | `GET /notifications` |
| 북마크 | `/bookmarks` | `GET /bookmarks` |
| 메시지 | `/messages` | `GET /messages/*` |
| 좋아요 | `/likes` | `GET /users/:id/liked-posts` |
| 설정 | `/settings/*` | `GET/PATCH /users/settings` |
| 관리자 | `/admin/*` | `GET /admin/*` |

---

## 참고 문서

| 문서 | 내용 |
|------|------|
| [`docs/BACKEND_INTEGRATION_GUIDE.md`](./BACKEND_INTEGRATION_GUIDE.md) | 백엔드 수정 가이드 (코드 예시 포함) |
| [`docs/API_ENDPOINT_MAPPING.md`](./API_ENDPOINT_MAPPING.md) | 프론트 ↔ 백엔드 엔드포인트 대조표 |
| `src/lib/api/services.ts` | 응답 타입 정의 원본 (TypeScript) |
| `src/lib/api/endpoints.ts` | 엔드포인트 경로 원본 |
| `src/lib/api/client.ts` | Axios 설정, 토큰 갱신 로직 |
