# 🦆 DuckDuck 백엔드 ↔ 프론트엔드 통합 가이드

> **목적:** `DuckDuck12292025/Backend`(Spring Boot)를 `DuckDuck12292025/Frontend`(Next.js)의 API 스펙에 맞게 수정하는 방법을 안내합니다.
>
> **현재 상태:** 프론트엔드는 API 클라이언트, 서비스 함수, React Query 훅이 모두 구현되어 있습니다. 백엔드를 프론트엔드 스펙에 맞추면 바로 연결됩니다.

---

## 📑 목차

| # | 섹션 | 설명 |
|---|------|------|
| 1 | [수정이 필요한 이유](#1-수정이-필요한-이유) | 현재 불일치 현황 요약 |
| 2 | [공통 응답 래퍼 도입](#2-공통-응답-래퍼-도입) | `ApiResponse<T>` 통일 |
| 3 | [에러 응답 형식 통일](#3-에러-응답-형식-통일) | `GlobalExceptionHandler` 수정 |
| 4 | [인증 방식 통일](#4-인증-방식-통일) | `X-User-Id` → `@CurrentUser` 전환 |
| 5 | [엔드포인트 경로 매핑](#5-엔드포인트-경로-매핑) | 프론트가 호출하는 경로와 백엔드 경로 대조표 |
| 6 | [응답 DTO 수정](#6-응답-dto-수정) | 도메인별 DTO 필드 맞추기 |
| 7 | [페이지네이션 통일](#7-페이지네이션-통일) | 커서 기반 / 오프셋 기반 표준화 |
| 8 | [CORS 수정](#8-cors-수정) | `localhost:8080` → `localhost:3000` |
| 9 | [미구현 엔드포인트 목록](#9-미구현-엔드포인트-목록) | 구현이 필요한 API 전체 목록 |
| 10 | [작업 우선순위](#10-작업-우선순위) | 어떤 순서로 맞추면 좋은지 |

---

## 1. 수정이 필요한 이유

프론트엔드와 백엔드 사이에 다음 불일치가 존재합니다.

| 항목 | 프론트엔드 기대 | 백엔드 현재 | 심각도 |
|------|---------------|-----------|--------|
| 응답 래퍼 | `{ success, data, message }` | DTO 직접 반환 (래퍼 없음) | 🔴 치명적 |
| 에러 형식 | `{ success, error: { code, message } }` | `{ status, message, timestamp }` | 🔴 치명적 |
| 인증 방식 | 전체 `Authorization: Bearer` | Post만 `X-User-Id` 헤더 | 🟡 불일치 |
| 회원가입 경로 | `POST /auth/signup` | `POST /users/register` | 🔴 치명적 |
| 프로필 경로 | `/users/*` | `/profiles/*` | 🔴 치명적 |
| 로그인 응답 | `{ user: {...}, tokens: {...} }` 중첩 | 플랫 `{ accessToken, userId, ... }` | 🔴 치명적 |
| 페이지네이션 | 커서 기반 `{ items, nextCursor, hasMore }` | Spring `Page<T>` / 없음 / limit+offset 혼재 | 🔴 치명적 |
| CORS | `http://localhost:3000` | `http://localhost:8080` (자기 자신) | 🔴 치명적 |
| ID 필드명 | 통일된 `id` | `id` / `userId` / `tierId` 혼재 | 🟡 불일치 |
| DTO 스타일 | — | `record` / Lombok class 혼재 | 🟢 경미 |

---

## 2. 공통 응답 래퍼 도입

프론트엔드의 `client.ts`는 모든 API 응답이 아래 형식이라고 가정합니다.

### 프론트엔드가 기대하는 형식

```typescript
// src/lib/api/client.ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: { code: string; message: string; details?: Record<string, unknown> };
}
```

```typescript
// 프론트에서 이렇게 사용:
const result = await api.get<UserResponse>('/users/me');
// result = { success: true, data: { id: 1, nickname: "..." }, message: "OK" }
// result.data 로 실제 데이터 접근
```

### 백엔드에 추가할 코드

#### 2-1. `ApiResponse<T>` 클래스 생성

```java
// common/presentation/dto/ApiResponse.java
package com.duckduck.backend.common.presentation.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final boolean success;
    private final T data;
    private final String message;
    private final ErrorDetail error;

    // 성공 응답 (데이터 + 메시지)
    public static <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder()
            .success(true)
            .data(data)
            .build();
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return ApiResponse.<T>builder()
            .success(true)
            .data(data)
            .message(message)
            .build();
    }

    // 성공 응답 (데이터 없음)
    public static ApiResponse<Void> ok() {
        return ApiResponse.<Void>builder()
            .success(true)
            .build();
    }

    // 에러 응답
    public static <T> ApiResponse<T> error(String code, String message) {
        return ApiResponse.<T>builder()
            .success(false)
            .error(new ErrorDetail(code, message, null))
            .build();
    }

    public record ErrorDetail(
        String code,
        String message,
        Object details
    ) {}
}
```

#### 2-2. 컨트롤러 수정 예시

```java
// ❌ 변경 전
@PostMapping("/login")
public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    LoginResult result = loginUseCase.login(request.toCommand());
    return ResponseEntity.ok(LoginResponse.from(result));
}

// ✅ 변경 후
@PostMapping("/login")
public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
    LoginResult result = loginUseCase.login(request.toCommand());
    return ResponseEntity.ok(ApiResponse.ok(AuthResponse.from(result)));
}
```

> 모든 컨트롤러의 `ResponseEntity<XxxResponse>`를 `ResponseEntity<ApiResponse<XxxResponse>>`로 변경합니다.
>
> 문자열을 직접 반환하는 엔드포인트(`ResponseEntity<String>`)도 `ApiResponse.ok(null, "메시지")`로 변경합니다.

---

## 3. 에러 응답 형식 통일

### 프론트엔드가 기대하는 에러 형식

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다."
  }
}
```

프론트의 `getErrorMessage()` 함수가 이 구조에서 메시지를 추출합니다:

```typescript
// client.ts
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return (
      error.response?.data?.error?.message ||  // ← 여기서 추출
      error.response?.data?.message ||
      error.message
    );
  }
};
```

### `GlobalExceptionHandler` 수정

```java
// ❌ 변경 전
@ExceptionHandler(LoginFailedException.class)
public ResponseEntity<ErrorResponse> handleLoginFailed(LoginFailedException e) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), e.getMessage(), LocalDateTime.now()));
}

public record ErrorResponse(int status, String message, LocalDateTime timestamp) {}
```

```java
// ✅ 변경 후
@ExceptionHandler(LoginFailedException.class)
public ResponseEntity<ApiResponse<Void>> handleLoginFailed(LoginFailedException e) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(ApiResponse.error("AUTH_INVALID_CREDENTIALS", e.getMessage()));
}
```

### 에러 코드 표준 목록 (권장)

| 에러 코드 | HTTP 상태 | 설명 |
|----------|----------|------|
| `AUTH_INVALID_CREDENTIALS` | 401 | 이메일/비밀번호 불일치 |
| `AUTH_TOKEN_EXPIRED` | 401 | 토큰 만료 |
| `AUTH_TOKEN_INVALID` | 401 | 유효하지 않은 토큰 |
| `AUTH_UNAUTHORIZED` | 401 | 인증 필요 |
| `USER_NOT_FOUND` | 404 | 사용자 없음 |
| `USER_DUPLICATE_EMAIL` | 409 | 이메일 중복 |
| `USER_DUPLICATE_NICKNAME` | 409 | 닉네임 중복 |
| `USER_NOT_ACTIVE` | 403 | 비활성 사용자 |
| `VALIDATION_ERROR` | 400 | 입력값 유효성 실패 |
| `VERIFICATION_INVALID` | 400 | 인증번호 불일치/만료 |
| `EMAIL_SEND_FAILED` | 500 | 이메일 발송 실패 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

---

## 4. 인증 방식 통일

### 현재 문제

```java
// PostController — X-User-Id 커스텀 헤더 사용 ❌
@PostMapping
public ResponseEntity<PostResponse> createPost(
    @RequestHeader("X-User-Id") Long userId,     // ← 이것
    @Valid @RequestBody PostCreateRequest request
) { ... }

// ProfileController — @CurrentUser 사용 ✅
@PostMapping("/{userId}/follow")
public ResponseEntity<FollowResponse> follow(
    @PathVariable Long userId,
    @CurrentUser AuthenticatedUser currentUser    // ← 이것
) { ... }
```

### 수정 방법

`PostController`의 모든 메서드에서 `@RequestHeader("X-User-Id")`를 `@CurrentUser AuthenticatedUser`로 변경합니다.

```java
// ✅ 변경 후
@PostMapping
public ResponseEntity<ApiResponse<PostWithAuthorResponse>> createPost(
    @CurrentUser AuthenticatedUser currentUser,
    @Valid @RequestBody PostCreateRequest request
) {
    Post post = postService.createPost(
        request.content(),
        request.visibility(),
        request.isSubscribersOnly(),
        currentUser.userId(),           // ← @CurrentUser에서 추출
        request.categoryId()
    );
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.ok(PostWithAuthorResponse.from(post)));
}
```

> `PostController`의 `createPost`, `updatePost`, `deletePost`, `deleteAllPostsByUserId` 4개 메서드 모두 변경 필요.

---

## 5. 엔드포인트 경로 매핑

프론트엔드가 호출하는 경로(`endpoints.ts`)와 백엔드 현재 경로의 대조표입니다.

### 5-1. 인증 (Auth)

| 프론트 경로 | 백엔드 현재 | 상태 | 수정 방법 |
|------------|-----------|------|---------|
| `POST /auth/login` | `POST /auth/login` | ✅ 경로 일치 | 응답 형식만 수정 |
| `POST /auth/signup` | `POST /users/register` | ❌ 경로 다름 | `AuthController`에 추가하거나 프론트 수정 |
| `POST /auth/logout` | 없음 | ❌ 미구현 | 구현 필요 |
| `POST /auth/refresh` | `POST /auth/refresh` | ✅ 경로 일치 | 응답 형식만 수정 |
| `GET /auth/me` | 없음 | ❌ 미구현 | 구현 필요 |
| `POST /auth/change-password` | `POST /auth/password-reset` | ❌ 경로+동작 다름 | 별도 구현 필요 |

#### 회원가입 경로 수정

**옵션 A:** 백엔드에 `/auth/signup` 추가 (권장)

```java
// AuthController.java에 추가
@PostMapping("/signup")
public ResponseEntity<ApiResponse<AuthResponse>> signup(
    @Valid @RequestBody SignupRequest request
) {
    // 회원가입 + 자동 로그인 (토큰 발급)
    User user = registerUserUseCase.register(request.toCommand());
    LoginResult loginResult = loginUseCase.login(
        new LoginCommand(request.email(), request.password())
    );
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.ok(AuthResponse.from(user, loginResult)));
}
```

**옵션 B:** 프론트엔드의 `endpoints.ts`를 수정

```typescript
// endpoints.ts
AUTH: {
  SIGNUP: '/users/register',  // '/auth/signup' → '/users/register'
}
```

### 5-2. 유저/프로필

| 프론트 경로 | 백엔드 현재 | 상태 | 수정 방법 |
|------------|-----------|------|---------|
| `GET /users/me` | 없음 | ❌ | 구현 필요 |
| `PATCH /users/me/profile` | `PATCH /profiles/{userId}` | ❌ 경로 다름 | 아래 참고 |
| `GET /users/{id}` | `GET /profiles/{userId}` | ❌ 경로 다름 | 아래 참고 |
| `GET /users/nickname/{nickname}` | 없음 | ❌ | 구현 필요 (nickname 검색) |
| `GET /users/handle/{handle}` | 없음 | ❌ | 구현 필요 |
| `GET /users/{id}/followers` | `GET /profiles/{id}/followers` | ❌ 경로 다름 | 아래 참고 |
| `GET /users/{id}/following` | `GET /profiles/{id}/following` | ❌ 경로 다름 | 아래 참고 |
| `POST /users/{id}/follow` | `POST /profiles/{id}/follow` | ❌ 경로 다름 | 아래 참고 |
| `DELETE /users/{id}/follow` | `DELETE /profiles/{id}/follow` | ❌ 경로 다름 | 아래 참고 |

#### 프로필 경로 수정

**옵션 A:** `ProfileController`의 `@RequestMapping`을 변경 (권장)

```java
// ❌ 변경 전
@RequestMapping("/api/profiles")

// ✅ 변경 후
@RequestMapping("/api/users")
```

그리고 프로필 조회를 `{userId}` 대신 다양한 방식으로 지원:

```java
@GetMapping("/me")
public ResponseEntity<ApiResponse<UserWithProfileResponse>> getMyProfile(
    @CurrentUser AuthenticatedUser currentUser
) { ... }

@GetMapping("/{id}")
public ResponseEntity<ApiResponse<UserWithProfileResponse>> getUserById(
    @PathVariable Long id
) { ... }

@GetMapping("/nickname/{nickname}")
public ResponseEntity<ApiResponse<UserWithProfileResponse>> getUserByNickname(
    @PathVariable String nickname
) { ... }
```

**옵션 B:** 프론트엔드의 `endpoints.ts`를 수정

```typescript
USERS: {
  GET: (id: number) => `/profiles/${id}`,
  FOLLOWERS: (id: number) => `/profiles/${id}/followers`,
  // ...
}
```

### 5-3. 게시글 (Posts)

| 프론트 경로 | 백엔드 현재 | 상태 |
|------------|-----------|------|
| `POST /posts` | `POST /posts` | ✅ 경로 일치 |
| `GET /posts/{id}` | `GET /posts/{id}` | ✅ 경로 일치 |
| `PATCH /posts/{id}` | `PUT /posts/{id}` | ❌ HTTP 메서드 다름 (PUT→PATCH) |
| `DELETE /posts/{id}` | `DELETE /posts/{id}` | ✅ 경로 일치 |
| `POST /posts/{id}/like` | 없음 (`feat/postLike` 브랜치) | ❌ 미머지 |
| `DELETE /posts/{id}/like` | 없음 | ❌ 미머지 |
| `POST /posts/{id}/bookmark` | 없음 | ❌ 미구현 |
| `POST /posts/{id}/repost` | 없음 | ❌ 미구현 |

### 5-4. 피드 (Feed)

| 프론트 경로 | 백엔드 현재 | 상태 |
|------------|-----------|------|
| `GET /feed/home` | 없음 | ❌ 미구현 |
| `GET /feed/following` | 없음 | ❌ 미구현 |
| `GET /feed/category/{id}` | `GET /posts/category/{id}` | ❌ 경로 다름 |
| `GET /users/{id}/posts` | `GET /posts/user/{id}` | ❌ 경로 다름 |

### 5-5. 나머지 (전부 미구현)

| 도메인 | 프론트 경로 | 백엔드 현재 |
|--------|-----------|-----------|
| 댓글 | `/comments/*` | 엔티티만 존재, API 없음 |
| 카테고리 | `/categories/*` | 없음 |
| 검색 | `/search/*` | `feature/search-api` 브랜치 (미머지) |
| 알림 | `/notifications/*` | `feat/noti` 브랜치 (미머지) |
| 메시지 | `/messages/*` | `feature/messaging` 브랜치 (미머지) |
| 북마크 | `/bookmarks/*` | 없음 |
| 파일 | `/files/*` | 없음 |
| 설정 | `/users/settings` | 없음 |
| 프리미엄 | `/premium/*` | 없음 |
| 관리자 | `/admin/*` | 없음 |

---

## 6. 응답 DTO 수정

### 6-1. 로그인 응답

```java
// ❌ 현재 백엔드 LoginResponse
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "userId": 1,
  "email": "user@example.com",
  "nickname": "덕덕이"
}
```

```java
// ✅ 프론트엔드가 기대하는 형식 (ApiResponse 래핑 후)
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "handle": "duckking",
      "nickname": "덕덕이",
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

#### 새로 만들 DTO

```java
// auth/presentation/dto/AuthResponse.java
public record AuthResponse(
    UserResponse user,
    TokenResponse tokens
) {
    public record TokenResponse(
        String accessToken,
        String refreshToken,
        long expiresIn
    ) {}
}
```

### 6-2. 유저/프로필 응답

프론트엔드의 `UserWithProfileResponse`에 맞춰야 합니다.

```java
// ❌ 현재: 필드명 불일치, 누락 필드 다수
ProfileResponse {
  userId,              // → id
  emailVerified,       // → isVerified
  badgeVisible,        // → isBlueChecked
  isOwnProfile,        // 프론트에 없음
  subscriptionEnabled  // → hasMembership (profile 안으로)
  // handle 없음
  // isFollowing 없음
  // isFollowedBy 없음
  // updatedAt 없음
}
```

```java
// ✅ 프론트엔드 기대 형식에 맞춘 새 DTO
public record UserWithProfileResponse(
    Long id,
    String email,
    String handle,
    String nickname,
    String status,
    String role,
    boolean isVerified,
    boolean isBlueChecked,
    ProfileResponse profile,
    Boolean isFollowing,
    Boolean isFollowedBy,
    String createdAt,
    String updatedAt
) {
    public record ProfileResponse(
        String profileImageUrl,
        String backgroundImageUrl,
        String bio,
        int followerCount,
        int followingCount,
        int postCount,
        boolean hasMembership
    ) {}
}
```

#### 필드 매핑 표

| 프론트엔드 필드 | 백엔드 현재 필드 | 변환 방법 |
|---------------|---------------|---------|
| `id` | `userId` | 필드명 변경 |
| `handle` | 없음 | User 엔티티에 `handle` 필드 추가 |
| `isVerified` | `emailVerified` | 필드명 변경 |
| `isBlueChecked` | `badgeVisible` | 필드명 변경 |
| `profile.hasMembership` | `subscriptionEnabled` | profile 안으로 이동 |
| `isFollowing` | 없음 | 조회 시 팔로우 관계 확인 로직 추가 |
| `isFollowedBy` | 없음 | 조회 시 팔로우 관계 확인 로직 추가 |
| `updatedAt` | 없음 | User 엔티티에서 가져오기 |

### 6-3. 게시글 응답

```java
// ❌ 현재: 작성자 정보 없음, 미디어 없음, 상호작용 상태 없음
PostResponse {
  id, content, visibility, isSubscribersOnly,
  likeCount, commentCount, repostCount, viewCount, bookmarkCount,
  userId, categoryId, createdAt, updatedAt
}
```

```java
// ✅ 프론트엔드가 기대하는 형식
public record PostWithAuthorResponse(
    Long id,
    Long userId,
    Long categoryId,
    String content,
    String visibility,
    boolean isPinned,
    int likeCount,
    int commentCount,
    int repostCount,
    int viewCount,
    int bookmarkCount,
    String createdAt,
    String updatedAt,
    UserWithProfileResponse author,       // ← 중첩 유저 객체 추가
    List<PostMediaResponse> media,        // ← 미디어 배열 추가
    CategoryResponse category,            // ← 중첩 카테고리 추가
    Boolean isLiked,                      // ← 현재 유저 상호작용 상태
    Boolean isBookmarked,
    Boolean isReposted,
    PostWithAuthorResponse quotedPost     // ← 인용 게시글
) {}
```

> **주의:** `author`, `category`를 함께 반환하려면 서비스 레이어에서 JOIN 또는 추가 조회가 필요합니다.

### 6-4. 팔로우 응답

```java
// ❌ 현재 FollowResponse
{ "following": true, "followerCount": 150, "followingCount": 89 }

// ✅ 프론트엔드 기대
{ "followed": true }
```

### 6-5. 팔로워/팔로잉 목록 응답

```java
// ❌ 현재 FollowUserResponse
{ "userId": 1, "nickname": "...", "profileImageUrl": "...", "bio": "...", "followerCount": 150, "badgeVisible": true }

// ✅ 프론트엔드 기대 — UserWithProfileResponse (6-2 참고) 그대로 사용
```

### 6-6. 토큰 갱신 응답

```java
// ❌ 현재 RefreshTokenResponse
{ "accessToken": "eyJ...", "refreshToken": "eyJ..." }

// ✅ 프론트엔드 기대 (client.ts 라인 79)
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

> `client.ts`에서 `response.data.data.accessToken`으로 접근하므로 `ApiResponse` 래퍼만 씌우면 됩니다.

---

## 7. 페이지네이션 통일

프론트엔드는 두 가지 페이지네이션을 사용합니다.

### 7-1. 커서 기반 (피드, 무한 스크롤)

```typescript
// 프론트엔드 services.ts
interface CursorResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
```

**사용하는 곳:** 홈 피드, 팔로잉 피드, 카테고리 피드, 유저 게시글, 북마크, 알림

```java
// 백엔드 구현 예시
public record CursorResponse<T>(
    List<T> items,
    String nextCursor,
    boolean hasMore
) {
    public static <T> CursorResponse<T> of(List<T> items, int limit) {
        boolean hasMore = items.size() > limit;
        List<T> result = hasMore ? items.subList(0, limit) : items;
        String cursor = hasMore && !result.isEmpty()
            ? encodeCursor(result.get(result.size() - 1))
            : null;
        return new CursorResponse<>(result, cursor, hasMore);
    }
}
```

### 7-2. 오프셋 기반 (목록)

```typescript
// 프론트엔드 services.ts
interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

**사용하는 곳:** 팔로워 목록, 팔로잉 목록, 댓글

```java
// 백엔드: Spring Page<T>를 프론트 형식으로 변환
public record PageResponse<T>(
    List<T> items,
    long total,
    int page,
    int pageSize,
    boolean hasNext,
    boolean hasPrevious
) {
    public static <T> PageResponse<T> from(Page<T> springPage) {
        return new PageResponse<>(
            springPage.getContent(),
            springPage.getTotalElements(),
            springPage.getNumber(),
            springPage.getSize(),
            springPage.hasNext(),
            springPage.hasPrevious()
        );
    }
}
```

### 현재 백엔드의 문제

| 컨트롤러 | 현재 방식 | 프론트 기대 |
|---------|---------|-----------|
| `ProfileController` (followers) | Spring `Page<T>` 직접 반환 | `PageResponse<T>` |
| `ProfileController` (posts) | Spring `Page<T>` 직접 반환 | `CursorResponse<T>` |
| `PostController` (category) | `List<T>` 전체 반환 (페이지네이션 없음) | `CursorResponse<T>` |
| `PopularityController` | `limit` + `offset` 수동 | 해당 없음 |

---

## 8. CORS 수정

### 현재 문제

```java
// SecurityConfig.java 63번째 줄
configuration.setAllowedOrigins(List.of("http://localhost:8080")); // ← 자기 자신
```

### 수정

```java
// ✅ 프론트엔드 주소로 변경
configuration.setAllowedOrigins(List.of(
    "http://localhost:3000"    // Next.js 개발 서버
));

// 또는 환경변수로 관리 (권장)
@Value("${cors.allowed-origins:http://localhost:3000}")
private String allowedOrigins;

// ...
configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));
```

---

## 9. 미구현 엔드포인트 목록

프론트엔드 `endpoints.ts`에 정의되어 있지만 백엔드 dev 브랜치에 없는 엔드포인트들입니다.

### 9-1. dev 브랜치에서 구현 필요

| 메서드 | 경로 | 설명 | 우선순위 |
|--------|------|------|---------|
| POST | `/auth/signup` | 회원가입 (토큰 포함 응답) | 🔴 |
| POST | `/auth/logout` | 로그아웃 | 🔴 |
| GET | `/auth/me` | 내 정보 조회 | 🔴 |
| GET | `/users/me` | 내 프로필 | 🔴 |
| GET | `/users/nickname/{nickname}` | 닉네임으로 유저 조회 | 🔴 |
| GET | `/feed/home` | 홈 피드 (커서 페이지네이션) | 🔴 |
| GET | `/feed/following` | 팔로잉 피드 | 🟡 |
| GET | `/categories` | 카테고리 목록 | 🔴 |
| GET | `/categories/{id}` | 카테고리 상세 | 🟡 |
| POST | `/comments` | 댓글 작성 | 🔴 |
| GET | `/comments/post/{postId}` | 게시글 댓글 조회 | 🔴 |
| PATCH | `/comments/{id}` | 댓글 수정 | 🟡 |
| DELETE | `/comments/{id}` | 댓글 삭제 | 🟡 |
| GET | `/users/settings` | 사용자 설정 조회 | 🟡 |
| PATCH | `/users/settings` | 사용자 설정 수정 | 🟡 |

### 9-2. 피처 브랜치 머지 후 수정 필요

| 브랜치 | 기능 | 프론트 경로와 일치 여부 |
|--------|------|---------------------|
| `feat/postLike` | 좋아요 | 경로 확인 필요 (`/posts/{id}/likes` vs `/posts/{id}/like`) |
| `feature/messaging` | DM | 경로 확인 필요 (`/messages/inbox` vs `/messages/received`) |
| `feature/search-api` | 검색 | 경로 확인 필요 (`/search/posts` vs `/search`) |
| `feat/noti` | 알림 | 경로 확인 필요 |

### 9-3. 완전 미구현

| 도메인 | 엔드포인트 수 | 우선순위 |
|--------|-------------|---------|
| 북마크 | 6개 | 🟡 |
| 파일 업로드 | 3개 | 🟡 |
| 프리미엄 | 3개 | ⚪ |
| 팬 구독 (프론트 경로 기준) | 3개 | ⚪ |
| 고객지원 | 3개 | ⚪ |
| 관리자 | 12개 | ⚪ |

---

## 10. 작업 우선순위

### Phase 1 — 바로 연결 가능하게 (필수)

> 이것만 하면 로그인 → 피드 조회 → 게시글 작성 기본 플로우가 동작합니다.

1. **CORS 수정** — `SecurityConfig.java` 한 줄 (`localhost:8080` → `localhost:3000`)
2. **`ApiResponse<T>` 래퍼 추가** — 공통 클래스 1개 생성
3. **`GlobalExceptionHandler` 수정** — 에러 응답 형식 변경
4. **로그인 응답 DTO 수정** — `AuthResponse` (user + tokens 중첩 구조)
5. **`/auth/signup` 엔드포인트 추가** — 회원가입 + 토큰 발급
6. **`/auth/me` 엔드포인트 추가** — JWT에서 유저 정보 반환
7. **PostController 인증 방식 변경** — `X-User-Id` → `@CurrentUser`

### Phase 2 — 핵심 기능 연결

8. **프로필 경로 변경** — `/profiles/*` → `/users/*`
9. **`UserWithProfileResponse` DTO 생성** — 프론트 스펙에 맞는 유저+프로필 응답
10. **`PostWithAuthorResponse` DTO 생성** — author, media, category 포함
11. **페이지네이션 DTO 추가** — `CursorResponse<T>`, `PageResponse<T>`
12. **피드 API 구현** — `GET /feed/home` (커서 기반)
13. **카테고리 API 구현** — `GET /categories`
14. **댓글 API 구현** — CRUD + 좋아요

### Phase 3 — 피처 브랜치 머지 + 경로 통일

15. `feat/postLike` 머지 → 경로를 프론트에 맞게 수정
16. `feature/search-api` 머지 → 통합 검색 응답 형식 맞추기
17. `feature/messaging` 머지 → 경로 수정
18. `feat/noti` 머지 → 경로 수정

### Phase 4 — 부가 기능

19. 북마크 CRUD
20. 파일 업로드
21. 사용자 설정
22. 차단/뮤트

### Phase 5 — 관리자/프리미엄

23. 관리자 대시보드 + 유저 관리
24. 프리미엄 구독
25. 고객지원

---

## 부록: 프론트엔드 참조 파일

백엔드 수정 시 참고해야 할 프론트엔드 파일들입니다.

| 파일 | 내용 | 참고 목적 |
|------|------|---------|
| `src/lib/api/client.ts` | Axios 설정, 응답 래퍼 타입, 토큰 갱신 로직 | 응답 형식, 인증 흐름 |
| `src/lib/api/endpoints.ts` | 전체 API 경로 상수 | 엔드포인트 경로 |
| `src/lib/api/services.ts` | API 호출 함수 + 요청/응답 DTO 정의 | DTO 필드 스펙 |
| `src/hooks/queries.ts` | React Query 훅 (실제 호출 코드) | 호출 방식, 파라미터 |
| `src/types/index.ts` | TypeScript 전체 타입 정의 | 엔티티 필드 스펙 |
