# DuckDuck 백엔드 연결 가이드

## 목차

1. [현재 아키텍처 요약](#1-현재-아키텍처-요약)
2. [연결 전 체크리스트](#2-연결-전-체크리스트)
3. [Phase 1: 환경 설정](#3-phase-1-환경-설정)
4. [Phase 2: 인증 연결](#4-phase-2-인증-연결)
5. [Phase 3: 피드 & 게시글 연결](#5-phase-3-피드--게시글-연결)
6. [Phase 4: 댓글 연결](#6-phase-4-댓글-연결)
7. [Phase 5: 유저 & 프로필 연결](#7-phase-5-유저--프로필-연결)
8. [Phase 6: 카테고리 & 검색 연결](#8-phase-6-카테고리--검색-연결)
9. [Phase 7: 부가 기능 연결](#9-phase-7-부가-기능-연결)
10. [API 엔드포인트 전체 목록](#10-api-엔드포인트-전체-목록)
11. [백엔드 응답 형식 규격](#11-백엔드-응답-형식-규격)
12. [트러블슈팅](#12-트러블슈팅)

---

## 1. 현재 아키텍처 요약

### 기술 스택
| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 상태 관리 | Zustand 5 (인증), TanStack React Query 5 (서버 상태) |
| HTTP 클라이언트 | Axios (인터셉터, 토큰 자동 갱신 내장) |
| 스타일링 | Tailwind CSS 4 |
| 언어 | TypeScript (strict) |

### 핵심 파일 구조

```
src/
├── lib/api/
│   ├── client.ts        ← Axios 인스턴스 + 인터셉터 (토큰 갱신)
│   ├── endpoints.ts     ← 전체 API 경로 상수
│   └── services.ts      ← 타입이 정의된 API 호출 함수
├── hooks/
│   └── queries.ts       ← ⚠️ 현재 mock, 실제 API로 교체 대상
├── stores/
│   └── auth.ts          ← Zustand 인증 스토어 (변경 불필요)
├── mocks/
│   └── data.ts          ← Mock 데이터 (연결 후 삭제 가능)
├── components/providers/
│   ├── AuthGuard.tsx     ← ⚠️ DEMO_MODE = false로 변경 필요
│   ├── AuthHydration.tsx ← localStorage → Zustand 복원 (변경 불필요)
│   └── Providers.tsx     ← 프로바이더 트리 (변경 불필요)
└── types/
    └── index.ts          ← 전체 타입 정의 (변경 불필요)
```

### 현재 데이터 흐름 (Mock)

```
컴포넌트 → useXxx() 훅 → mockData 배열 직접 조작 → queryClient 캐시 갱신
```

### 목표 데이터 흐름 (백엔드 연결 후)

```
컴포넌트 → useXxx() 훅 → services.ts API 호출 → Axios → 백엔드 → 응답 → 캐시 갱신
```

---

## 2. 연결 전 체크리스트

### 백엔드가 준비해야 할 것

- [ ] CORS 설정: 프론트엔드 도메인 허용 (`http://localhost:3000`)
- [ ] JWT 기반 인증: Access Token + Refresh Token 발급
- [ ] 모든 API 응답을 `ApiResponse<T>` 형식으로 통일
- [ ] 커서 기반 페이지네이션 (피드용) + 오프셋 기반 페이지네이션 (목록용)
- [ ] 파일 업로드 엔드포인트 (`multipart/form-data`)

### 프론트엔드에서 변경할 파일 (2개만)

| 파일 | 변경 내용 |
|------|-----------|
| `src/hooks/queries.ts` | mock → `services.ts` API 호출로 교체 |
| `src/components/providers/AuthGuard.tsx` | `DEMO_MODE = false`로 변경 |

> **이미 구현 완료된 것들** (건드릴 필요 없음):
> - `client.ts`: Axios 인스턴스, 토큰 자동 갱신 인터셉터
> - `endpoints.ts`: 전체 API 경로 상수
> - `services.ts`: 타입이 정의된 API 서비스 함수
> - `auth.ts`: Zustand 인증 스토어
> - `types/index.ts`: TypeScript 타입 정의

---

## 3. Phase 1: 환경 설정

### 3.1 환경 변수

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

`client.ts`에서 이 값을 자동으로 사용:
```typescript
// src/lib/api/client.ts (이미 구현됨)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

### 3.2 DEMO_MODE 비활성화

```typescript
// src/components/providers/AuthGuard.tsx
const DEMO_MODE = false;  // true → false로 변경
```

이 한 줄 변경으로:
- 비로그인 시 `/login`으로 리다이렉트 활성화
- `/admin/*` 경로에 ADMIN 역할 체크 활성화
- 공개 경로 (`/login`, `/signup`, `/about` 등)는 인증 없이 접근 가능

---

## 4. Phase 2: 인증 연결

### 4.1 현재 Mock vs 실제 API

| 훅 | Mock 동작 | 실제 API |
|----|-----------|----------|
| `useLogin()` | `mockUsers`에서 이메일 검색 + `password123` 고정 | `POST /auth/login` |
| `useSignup()` | `mockUsers.push()` | `POST /auth/signup` |
| `useLogout()` | 지연 후 상태 초기화 | `POST /auth/logout` |
| `useMe()` | Zustand 스토어에서 반환 | `GET /auth/me` |

### 4.2 교체 코드

```typescript
// src/hooks/queries.ts — useLogin 교체

import { authApi } from '@/lib/api/services';

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data } = await authApi.login(email, password);
      return data;
    },
    onSuccess: (data) => {
      setAuthToken(data.tokens.accessToken);
      // services.ts의 AuthResponse → UserWithProfile 변환
      const user: UserWithProfile = {
        id: data.user.id,
        email: data.user.email,
        nickname: data.user.nickname,
        handle: data.user.handle,
        status: data.user.status as UserStatus,
        role: data.user.role as UserRole,
        isVerified: data.user.isVerified,
        isBlueChecked: data.user.isBlueChecked,
        createdAt: data.user.createdAt,
        updatedAt: data.user.createdAt,
        profile: data.user.profile ? {
          id: 0,
          userId: data.user.id,
          ...data.user.profile,
          createdAt: data.user.createdAt,
          updatedAt: data.user.createdAt,
        } : undefined,
      };
      login(user, data.tokens);
    },
  });
}
```

```typescript
// useSignup 교체
export function useSignup() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async ({ email, password, nickname }: { email: string; password: string; nickname: string }) => {
      const { data } = await authApi.signup(email, password, nickname);
      return data;
    },
    onSuccess: (data) => {
      setAuthToken(data.tokens.accessToken);
      // 위 useLogin과 동일한 변환 로직
      login(convertUserResponse(data.user), data.tokens);
    },
  });
}
```

```typescript
// useLogout 교체
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSettled: () => {
      clearAuthToken();
      logout();
      queryClient.clear();
    },
  });
}
```

```typescript
// useMe 교체
export function useMe() {
  const tokens = useAuthStore((s) => s.tokens);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await authApi.me();
      return convertUserResponse(data);
    },
    enabled: !!tokens?.accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
```

### 4.3 백엔드 응답 형식

```json
// POST /auth/login
// Request
{ "email": "user@example.com", "password": "..." }

// Response
{
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
      "profileImageUrl": "/images/avatar1.jpg",
      "backgroundImageUrl": null,
      "bio": "안녕하세요",
      "followerCount": 150,
      "followingCount": 89,
      "postCount": 42,
      "hasMembership": false
    },
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "expiresIn": 3600
  }
}
```

### 4.4 토큰 갱신 (이미 구현됨)

`client.ts`의 응답 인터셉터가 401 에러를 감지하면:
1. `POST /auth/refresh`로 새 토큰 요청
2. 성공 시 원래 요청 재시도
3. 실패 시 로그아웃 + `/login` 리다이렉트

```
별도 구현 불필요 — Axios 인터셉터에서 자동 처리
```

---

## 5. Phase 3: 피드 & 게시글 연결

### 5.1 피드 훅 교체

```typescript
import { feedApi } from '@/lib/api/services';

// useHomeFeed 교체
export function useHomeFeed() {
  return useInfiniteQuery({
    queryKey: ['feed', 'home'],
    queryFn: async ({ pageParam }) => {
      const { data } = await feedApi.home({ cursor: pageParam, limit: 20 });
      return data;  // { items: FeedItemResponse[], nextCursor, hasMore }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 60 * 1000,
  });
}

// useFollowingFeed 교체
export function useFollowingFeed() {
  return useInfiniteQuery({
    queryKey: ['feed', 'following'],
    queryFn: async ({ pageParam }) => {
      const { data } = await feedApi.following({ cursor: pageParam, limit: 20 });
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 60 * 1000,
  });
}

// useCategoryFeed 교체
export function useCategoryFeed(categoryId: number) {
  return useInfiniteQuery({
    queryKey: ['feed', 'category', categoryId],
    queryFn: async ({ pageParam }) => {
      const { data } = await feedApi.category(categoryId, { cursor: pageParam, limit: 20 });
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: !!categoryId,
  });
}
```

### 5.2 게시글 CRUD 훅 교체

```typescript
import { postsApi } from '@/lib/api/services';

// usePost 교체
export function usePost(postId: number) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { data } = await postsApi.get(postId);
      return data;
    },
    enabled: !!postId,
  });
}

// useCreatePost 교체
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      content: string;
      categoryId?: number | null;
      visibility?: string;
      mediaIds?: number[];
    }) => {
      const { data: response } = await postsApi.create(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

// useUpdatePost 교체
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, ...data }: {
      postId: number;
      content?: string;
      categoryId?: number | null;
    }) => {
      const { data: response } = await postsApi.update(postId, data);
      return response;
    },
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(['post', variables.postId], updated);
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

// useDeletePost 교체
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      await postsApi.delete(postId);
      return { postId };
    },
    onSuccess: (_, postId) => {
      queryClient.removeQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
```

### 5.3 좋아요 / 북마크 / 리포스트

```typescript
// useLikePost 교체 (낙관적 업데이트 유지)
export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: number; isLiked: boolean }) => {
      if (isLiked) {
        const { data } = await postsApi.unlike(postId);
        return { postId, liked: data.liked };
      } else {
        const { data } = await postsApi.like(postId);
        return { postId, liked: data.liked };
      }
    },
    // 낙관적 업데이트 (onMutate, onError 로직은 현재와 동일하게 유지)
    onMutate: async ({ postId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      const prev = queryClient.getQueryData<PostWithAuthor>(['post', postId]);
      if (prev) {
        queryClient.setQueryData(['post', postId], {
          ...prev,
          isLiked: !isLiked,
          likeCount: isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
        });
      }
      return { prev };
    },
    onError: (_, { postId }, context) => {
      if (context?.prev) queryClient.setQueryData(['post', postId], context.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

// useBookmarkPost 교체
export function useBookmarkPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const { data } = await postsApi.bookmark(postId);
      return { postId, bookmarked: data.bookmarked };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

// useRepostPost 교체
export function useRepostPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const { data } = await postsApi.repost(postId);
      return { postId, reposted: data.reposted };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
```

### 5.4 백엔드 피드 응답 형식

```json
// GET /feed/home?cursor=abc123&limit=20
{
  "items": [
    {
      "type": "post",
      "post": {
        "id": 1,
        "userId": 1,
        "categoryId": 1,
        "content": "글 내용...",
        "visibility": "PUBLIC",
        "isPinned": false,
        "likeCount": 5,
        "commentCount": 3,
        "repostCount": 1,
        "viewCount": 100,
        "bookmarkCount": 2,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "author": { /* UserWithProfileResponse */ },
        "media": [ /* PostMediaResponse[] */ ],
        "category": { /* CategoryResponse */ },
        "isLiked": false,
        "isBookmarked": false,
        "isReposted": false,
        "quotedPost": null
      },
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ],
  "nextCursor": "eyJpZCI6MTB9",
  "hasMore": true
}
```

---

## 6. Phase 4: 댓글 연결

```typescript
import { commentsApi } from '@/lib/api/services';

// useComments 교체
export function useComments(postId: number) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data } = await commentsApi.byPost(postId);
      return data;  // { items: CommentWithAuthorResponse[] }
    },
    enabled: !!postId,
  });
}

// useCreateComment 교체
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { postId: number; parentId?: number | null; content: string }) => {
      const { data: response } = await commentsApi.create(data);
      return response;
    },
    onSuccess: (newComment, variables) => {
      queryClient.setQueryData(['comments', variables.postId], (old: any) => {
        const prev = old?.items ?? [];
        return { ...old, items: [...prev, newComment] };
      });
      queryClient.setQueryData(['post', variables.postId], (old: PostWithAuthor | undefined) => {
        if (!old) return old;
        return { ...old, commentCount: old.commentCount + 1 };
      });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

// useLikeComment 교체
export function useLikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, isLiked, postId }: { commentId: number; isLiked: boolean; postId: number }) => {
      if (isLiked) {
        await commentsApi.unlike(commentId);
      } else {
        await commentsApi.like(commentId);
      }
      return { commentId, liked: !isLiked };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
}

// useDeleteComment 교체
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId }: { commentId: number; postId: number }) => {
      await commentsApi.delete(commentId);
      return { commentId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.setQueryData(['post', variables.postId], (old: PostWithAuthor | undefined) => {
        if (!old) return old;
        return { ...old, commentCount: Math.max(0, old.commentCount - 1) };
      });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
```

---

## 7. Phase 5: 유저 & 프로필 연결

```typescript
import { usersApi, feedApi } from '@/lib/api/services';

// useUserByNickname 교체
export function useUserByNickname(nickname: string) {
  return useQuery({
    queryKey: ['user', 'nickname', nickname],
    queryFn: async () => {
      const { data } = await usersApi.getByNickname(nickname);
      return data;  // UserWithProfileResponse (includes isFollowing)
    },
    enabled: !!nickname,
  });
}

// useUserPosts 교체
export function useUserPosts(userId: number) {
  return useInfiniteQuery({
    queryKey: ['user', userId, 'posts'],
    queryFn: async ({ pageParam }) => {
      const { data } = await feedApi.userPosts(userId, { cursor: pageParam, limit: 20 });
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: !!userId,
  });
}

// useFollow 교체
export function useFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isFollowing }: { userId: number; isFollowing: boolean }) => {
      if (isFollowing) {
        await usersApi.unfollow(userId);
        return { userId, following: false };
      } else {
        await usersApi.follow(userId);
        return { userId, following: true };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'nickname'] });
      queryClient.invalidateQueries({ queryKey: ['user', result.userId] });
    },
  });
}

// useFollowers 교체
export function useFollowers(userId: number, page = 0) {
  return useQuery({
    queryKey: ['user', userId, 'followers', page],
    queryFn: async () => {
      const { data } = await usersApi.followers(userId, { page, pageSize: 20 });
      return data;
    },
    enabled: !!userId,
  });
}

// useFollowing 교체
export function useFollowing(userId: number, page = 0) {
  return useQuery({
    queryKey: ['user', userId, 'following', page],
    queryFn: async () => {
      const { data } = await usersApi.following(userId, { page, pageSize: 20 });
      return data;
    },
    enabled: !!userId,
  });
}

// useUpdateProfile 교체
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { nickname?: string; bio?: string; profileImageUrl?: string }) => {
      const { data: response } = await usersApi.updateProfile(data);
      return response;
    },
    onSuccess: (updated) => {
      useAuthStore.getState().setUser(convertUserResponse(updated));
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}
```

---

## 8. Phase 6: 카테고리 & 검색 연결

```typescript
import { categoriesApi, searchApi } from '@/lib/api/services';

// useCategories 교체
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await categoriesApi.list();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// useCategory 교체
export function useCategory(categoryId: number) {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const { data } = await categoriesApi.get(categoryId);
      return data;
    },
    enabled: !!categoryId,
  });
}

// useSearch 교체
export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const { data } = await searchApi.search({ q: query });
      return data;  // { posts, users, categories }
    },
    enabled: query.length > 0,
    staleTime: 30 * 1000,
  });
}
```

---

## 9. Phase 7: 부가 기능 연결

현재 mock으로만 동작하며, 별도의 services.ts 확장이 필요한 기능들:

### 9.1 알림

```
GET    /notifications              → 알림 목록 (커서 페이지네이션)
POST   /notifications/:id/read     → 읽음 처리
POST   /notifications/read-all     → 전체 읽음
GET    /notifications/unread-count  → 미읽은 개수
```

### 9.2 메시지 (DM)

```
GET    /messages/conversations     → 대화 목록
GET    /messages/received          → 받은 메시지
POST   /messages                   → 메시지 전송
POST   /messages/:id/read          → 읽음 처리
DELETE /messages/:id               → 삭제
```

### 9.3 북마크

```
GET    /bookmarks                  → 북마크 목록
POST   /bookmarks                  → 북마크 추가
DELETE /bookmarks/:postId          → 북마크 제거
GET    /bookmarks/lists            → 북마크 폴더 목록
POST   /bookmarks/:id/move         → 폴더 이동
```

### 9.4 파일 업로드

```
POST   /files                      → 단일 파일 업로드 (multipart/form-data)
POST   /files/multiple             → 다중 파일 업로드
GET    /files/:filename            → 파일 다운로드
```

### 9.5 프리미엄 & 구독

```
GET    /premium/status             → 프리미엄 상태
POST   /premium/subscribe          → 프리미엄 가입
POST   /premium/cancel             → 프리미엄 해지
GET    /users/tiers                → 팬 구독 티어 목록
POST   /users/tiers                → 티어 생성
POST   /subscriptions/fan          → 팬 구독
```

### 9.6 관리자

```
GET    /admin/dashboard/stats      → 대시보드 통계
GET    /admin/reports              → 신고 목록
PATCH  /admin/reports/:id          → 신고 처리
GET    /admin/category-requests    → 카테고리 신청 목록
PATCH  /admin/category-requests/:id → 신청 승인/거절
GET    /admin/users                → 유저 관리
PATCH  /admin/users/:id/status     → 유저 상태 변경
```

### 9.7 익명 질문 & Q&A (신규 엔드포인트 필요)

현재 프론트엔드에 구현된 기능이지만 `endpoints.ts`에 아직 없으므로 백엔드에 추가 필요:

```
POST   /posts/:id/questions        → 익명 질문 전송
GET    /questions/received         → 받은 질문 목록
POST   /posts (qaItems 포함)       → Q&A 답변 게시글 생성
```

---

## 10. API 엔드포인트 전체 목록

> `src/lib/api/endpoints.ts`에 정의된 전체 경로

### 인증 (Auth)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/auth/login` | 로그인 |
| POST | `/auth/signup` | 회원가입 |
| POST | `/auth/logout` | 로그아웃 |
| POST | `/auth/refresh` | 토큰 갱신 |
| GET | `/auth/me` | 내 정보 조회 |
| POST | `/auth/social` | 소셜 로그인 |
| POST | `/auth/verification/send` | 인증 메일 발송 |
| POST | `/auth/verification/verify` | 인증 확인 |
| POST | `/auth/change-password` | 비밀번호 변경 |
| GET | `/auth/sessions` | 로그인 세션 목록 |
| DELETE | `/auth/sessions/:id` | 세션 삭제 |
| DELETE | `/auth/account` | 계정 삭제 |

### 유저 (Users)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/users/me` | 내 프로필 |
| PATCH | `/users/me/profile` | 프로필 수정 |
| GET | `/users/:id` | 유저 조회 |
| GET | `/users/nickname/:nickname` | 닉네임으로 조회 |
| GET | `/users/handle/:handle` | 핸들로 조회 |
| GET | `/users/:id/followers` | 팔로워 목록 |
| GET | `/users/:id/following` | 팔로잉 목록 |
| POST | `/users/:id/follow` | 팔로우 |
| DELETE | `/users/:id/follow` | 언팔로우 |
| POST | `/users/:id/block` | 차단 |
| DELETE | `/users/:id/block` | 차단 해제 |
| GET | `/users/settings` | 설정 조회 |
| PATCH | `/users/settings` | 설정 수정 |

### 게시글 (Posts)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/posts` | 게시글 작성 |
| GET | `/posts/:id` | 게시글 조회 |
| PATCH | `/posts/:id` | 게시글 수정 |
| DELETE | `/posts/:id` | 게시글 삭제 |
| POST | `/posts/:id/like` | 좋아요 |
| DELETE | `/posts/:id/like` | 좋아요 취소 |
| POST | `/posts/:id/bookmark` | 북마크 |
| POST | `/posts/:id/repost` | 리포스트 |

### 피드 (Feed)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/feed/home` | 홈 피드 |
| GET | `/feed/following` | 팔로잉 피드 |
| GET | `/feed/category/:id` | 카테고리 피드 |
| GET | `/users/:id/posts` | 유저 게시글 |

### 댓글 (Comments)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/comments/post/:postId` | 게시글 댓글 |
| POST | `/comments` | 댓글 작성 |
| PATCH | `/comments/:id` | 댓글 수정 |
| DELETE | `/comments/:id` | 댓글 삭제 |
| POST | `/comments/:id/like` | 댓글 좋아요 |
| DELETE | `/comments/:id/like` | 댓글 좋아요 취소 |

### 카테고리 (Categories)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/categories` | 카테고리 목록 |
| GET | `/categories/:id` | 카테고리 상세 |
| POST | `/categories/:id/subscribe` | 구독 |
| DELETE | `/categories/:id/subscribe` | 구독 해제 |

### 검색 (Search)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/search?q=keyword` | 통합 검색 |
| GET | `/search/trending` | 트렌딩 키워드 |

---

## 11. 백엔드 응답 형식 규격

### 11.1 기본 응답 래퍼 (선택)

프론트엔드의 `services.ts`는 Axios 응답의 `.data`를 직접 사용합니다.
백엔드가 래퍼를 사용할 경우 `client.ts` 인터셉터에서 언래핑 처리:

```json
// 옵션 A: 직접 반환 (현재 services.ts 기대 형식)
{ "id": 1, "email": "..." }

// 옵션 B: ApiResponse 래퍼 사용 시
{
  "success": true,
  "data": { "id": 1, "email": "..." },
  "message": "OK"
}
// → client.ts 응답 인터셉터에서 response.data.data로 언래핑
```

### 11.2 페이지네이션 응답

```typescript
// 커서 기반 (피드용)
interface CursorResponse<T> {
  items: T[];
  nextCursor: string | null;  // base64 인코딩된 커서
  hasMore: boolean;
}

// 오프셋 기반 (목록용)
interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

### 11.3 에러 응답

```json
// HTTP 4xx/5xx
{
  "code": "AUTH_INVALID_CREDENTIALS",
  "message": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "details": {}
}
```

프론트엔드에서 `getErrorMessage(error)` 유틸이 자동 추출.

---

## 12. 트러블슈팅

### CORS 오류

```
Access to XMLHttpRequest at 'http://localhost:8080/api' has been blocked by CORS policy
```

**해결:** 백엔드에서 CORS 설정:
```java
// Spring Boot
@CrossOrigin(origins = "http://localhost:3000")
// 또는 전역 설정
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PATCH", "DELETE", "PUT")
            .allowCredentials(true);
    }
}
```

### 401 무한 루프

토큰 갱신 실패 시 로그아웃 처리가 되지 않으면 무한 루프 발생.

**이미 해결됨:** `client.ts`에서 refresh 실패 시 `clearAuthToken()` + `window.location.href = '/login'` 처리.

### hydrate 시점 이슈

새로고침 시 Zustand 스토어가 빈 상태로 시작되어 401 발생.

**이미 해결됨:** `AuthHydration.tsx`에서 `hydrate()` → localStorage 토큰 복원 → `useMe()` 자동 호출.

### 타입 불일치

백엔드 응답 필드명이 프론트엔드 타입과 다를 경우:

**해결:** `services.ts`의 Response 인터페이스를 백엔드에 맞게 수정하거나, 변환 함수 추가:

```typescript
// 예: 백엔드가 snake_case, 프론트가 camelCase
function convertPost(raw: any): PostWithAuthor {
  return {
    id: raw.id,
    userId: raw.user_id,       // snake_case → camelCase
    content: raw.content,
    likeCount: raw.like_count,
    // ...
  };
}
```

> **권장:** 백엔드에서 camelCase로 직렬화하면 변환 불필요.
> Spring Boot: `spring.jackson.property-naming-strategy=LOWER_CAMEL_CASE`

---

## 요약: 최소 변경으로 연결하기

```
1. .env.local에 NEXT_PUBLIC_API_URL 설정
2. AuthGuard.tsx에서 DEMO_MODE = false
3. queries.ts의 각 훅에서 mock 로직 → services.ts API 호출로 교체
4. mock import 제거
5. 끝
```

인프라(Axios, 토큰 갱신, 타입, 엔드포인트, 서비스 함수)는 **이미 전부 구현되어 있습니다.**
