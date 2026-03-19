# API 엔드포인트 매핑 문서

> 프론트엔드(`endpoints.ts`)가 호출하는 API 경로와 백엔드(Spring Boot)가 현재 제공하는 경로를 비교한 문서입니다.
>
> **상태 범례**: 일치 — 경로가 동일 | 경로 다름 — 기능은 있으나 경로가 다름 | 미구현 — 백엔드에 해당 API 없음

---

## 1. 인증 (AUTH)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 로그인 | `POST /auth/login` | `POST /api/auth/login` | 일치 |
| 회원가입 | `POST /auth/signup` | `POST /api/users/register` | 경로 다름 |
| 로그아웃 | `POST /auth/logout` | — | 미구현 |
| 토큰 갱신 | `POST /auth/refresh` | `POST /api/auth/refresh` | 일치 |
| 내 정보 조회 | `GET /auth/me` | — | 미구현 |
| 소셜 로그인 | `POST /auth/social` | — | 미구현 |
| 이메일 인증 발송 | `POST /auth/verification/send` | `POST /api/auth/email-request` | 경로 다름 |
| 이메일 인증 확인 | `POST /auth/verification/verify` | `POST /api/auth/email-verify` | 경로 다름 |
| 이메일 인증 재발송 | `POST /auth/verification/resend` | — | 미구현 |
| 비밀번호 변경 | `POST /auth/change-password` | `POST /api/auth/password-reset` | 경로 다름 |
| 세션 목록 | `GET /auth/sessions` | — | 미구현 |
| 세션 삭제 | `DELETE /auth/sessions/{id}` | — | 미구현 |
| 다른 세션 전체 삭제 | `DELETE /auth/sessions/others` | — | 미구현 |
| 회원 탈퇴 | `DELETE /auth/account` | `DELETE /api/users/me` | 경로 다름 |

> **참고**: 백엔드에 `POST /api/auth/password-reset-request` (비밀번호 재설정 요청)가 있으나 프론트엔드에 대응하는 엔드포인트가 없습니다.

---

## 2. 유저 / 프로필 (USERS)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 내 정보 | `GET /users/me` | — | 미구현 |
| 내 프로필 수정 | `PATCH /users/me/profile` | — | 미구현 |
| 유저 조회 (ID) | `GET /users/{id}` | `GET /api/profiles/{userId}` | 경로 다름 |
| 유저 조회 (핸들) | `GET /users/handle/{handle}` | — | 미구현 |
| 유저 조회 (닉네임) | `GET /users/nickname/{nickname}` | — | 미구현 |
| 팔로워 목록 | `GET /users/{id}/followers` | `GET /api/profiles/{userId}/followers` | 경로 다름 |
| 팔로잉 목록 | `GET /users/{id}/following` | `GET /api/profiles/{userId}/following` | 경로 다름 |
| 팔로우 | `POST /users/{id}/follow` | `POST /api/profiles/{userId}/follow` | 경로 다름 |
| 언팔로우 | `DELETE /users/{id}/follow` | `DELETE /api/profiles/{userId}/follow` | 경로 다름 |
| 유저 티어 목록 | `GET /users/{id}/tiers` | `GET /api/profiles/{creatorId}/subscription/tiers` | 경로 다름 |
| 구독 상태 확인 | `GET /users/{creatorId}/subscribed` | `GET /api/profiles/{creatorId}/subscription` | 경로 다름 |
| 내 구독 티어 확인 | `GET /users/{creatorId}/my-tier` | — | 미구현 |
| 차단 목록 | `GET /users/blocked` | — | 미구현 |
| 뮤트 목록 | `GET /users/muted` | — | 미구현 |
| 유저 차단 | `POST /users/{id}/block` | — | 미구현 |
| 유저 뮤트 | `POST /users/{id}/mute` | — | 미구현 |
| 좋아요한 게시글 | `GET /users/{id}/liked-posts` | — | 미구현 |
| 유저 댓글 목록 | `GET /users/{id}/comments` | — | 미구현 |
| 설정 | `GET/PATCH /users/settings` | — | 미구현 |

---

## 3. 게시글 (POSTS)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 게시글 작성 | `POST /posts` | `POST /api/posts` | 일치 |
| 게시글 조회 | `GET /posts/{id}` | `GET /api/posts/{postId}` | 일치 |
| 게시글 수정 | `PUT /posts/{id}` | `PUT /api/posts/{postId}` | 일치 |
| 게시글 삭제 | `DELETE /posts/{id}` | `DELETE /api/posts/{postId}` | 일치 |
| 좋아요 | `POST /posts/{id}/like` | — | 미구현 |
| 북마크 | `POST /posts/{id}/bookmark` | — | 미구현 |
| 리포스트 | `POST /posts/{id}/repost` | — | 미구현 |
| 게시글 댓글 목록 | `GET /posts/{id}/comments` | — | 미구현 |
| 접근 권한 확인 | `GET /posts/{id}/can-access` | — | 미구현 |
| 유저별 게시글 | `GET /users/{userId}/posts` | `GET /api/posts/user/{userId}` | 경로 다름 |

> **참고**: 백엔드에 `GET /api/posts/category/{categoryId}` (카테고리별 게시글)와 `DELETE /api/posts/user/{userId}` (유저 게시글 전체 삭제)가 있으나 프론트엔드에 직접 대응하는 엔드포인트가 없습니다. 프론트엔드에서는 피드 카테고리(`/feed/category/{categoryId}`)를 대신 사용합니다.

---

## 4. 피드 (FEED)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 통합 피드 | `GET /feed` | — | 미구현 |
| 홈 피드 | `GET /feed/home` | — | 미구현 |
| 팔로잉 피드 | `GET /feed/following` | — | 미구현 |
| 카테고리 피드 | `GET /feed/category/{categoryId}` | `GET /api/posts/category/{categoryId}` | 경로 다름 |

---

## 5. 댓글 (COMMENTS)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 게시글 댓글 조회 | `GET /comments/post/{postId}` | — | 미구현 |
| 댓글 작성 | `POST /comments` | — | 미구현 |
| 댓글 수정 | `PUT /comments/{id}` | — | 미구현 |
| 댓글 삭제 | `DELETE /comments/{id}` | — | 미구현 |
| 댓글 좋아요 | `POST /comments/{id}/like` | — | 미구현 |

---

## 6. 카테고리 (CATEGORIES)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 카테고리 목록 | `GET /categories` | — | 미구현 |
| 카테고리 조회 | `GET /categories/{id}` | — | 미구현 |
| 카테고리 구독 | `POST /categories/{id}/subscribe` | — | 미구현 |

---

## 7. 북마크 (BOOKMARKS)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 북마크 목록 | `GET /bookmarks` | — | 미구현 |
| 북마크 추가 | `POST /bookmarks` | — | 미구현 |
| 북마크 삭제 | `DELETE /bookmarks/{postId}` | — | 미구현 |
| 북마크 리스트 목록 | `GET /bookmarks/lists` | — | 미구현 |
| 북마크 리스트 상세 | `GET /bookmarks/lists/{listId}` | — | 미구현 |
| 북마크 이동 | `PATCH /bookmarks/{bookmarkId}/move` | — | 미구현 |

---

## 8. 알림 (NOTIFICATIONS)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 알림 목록 | `GET /notifications` | — | 미구현 |
| 알림 읽음 처리 | `PATCH /notifications/{id}/read` | — | 미구현 |
| 전체 읽음 처리 | `PATCH /notifications/read-all` | — | 미구현 |
| 안읽은 알림 수 | `GET /notifications/unread-count` | — | 미구현 |

---

## 9. 메시지 (MESSAGES)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 대화 목록 | `GET /messages/conversations` | — | 미구현 |
| 받은 메시지 | `GET /messages/received` | — | 미구현 |
| 보낸 메시지 | `GET /messages/sent` | — | 미구현 |
| 안읽은 메시지 수 | `GET /messages/unread-count` | — | 미구현 |
| 메시지 조회 | `GET /messages/{id}` | — | 미구현 |
| 메시지 전송 | `POST /messages` | — | 미구현 |
| 메시지 읽음 처리 | `PATCH /messages/{id}/read` | — | 미구현 |
| 메시지 삭제 | `DELETE /messages/{id}` | — | 미구현 |

---

## 10. 검색 (SEARCH)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 통합 검색 | `GET /search` | — | 미구현 |
| 트렌딩 검색어 | `GET /search/trending` | — | 미구현 |

---

## 11. 파일 (FILES)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 파일 업로드 | `POST /files` | — | 미구현 |
| 다중 파일 업로드 | `POST /files/multiple` | — | 미구현 |
| 파일 다운로드 | `GET /files/{filename}` | — | 미구현 |

---

## 12. 프리미엄 (PREMIUM)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 프리미엄 상태 | `GET /premium/status` | — | 미구현 |
| 프리미엄 구독 | `POST /premium/subscribe` | — | 미구현 |
| 프리미엄 해지 | `POST /premium/cancel` | — | 미구현 |

---

## 13. 팬 티어 (FAN_TIERS)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 내 티어 목록 | `GET /users/tiers` | — | 미구현 |
| 티어 생성 | `POST /users/tiers` | `POST /api/profiles/{creatorId}/subscription/tiers` | 경로 다름 |
| 티어 수정 | `PUT /users/tiers/{tierId}` | — | 미구현 |
| 티어 삭제 | `DELETE /users/tiers/{tierId}` | — | 미구현 |

---

## 14. 팬 구독 (FAN_SUBSCRIPTIONS)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 팬 구독 | `POST /subscriptions/fan` | `POST /api/profiles/{creatorId}/subscription` | 경로 다름 |
| 내 구독 목록 | `GET /subscriptions/fan/me` | — | 미구현 |
| 내 구독자 목록 | `GET /subscriptions/fan/subscribers` | — | 미구현 |

> **참고**: 백엔드에 `DELETE /api/profiles/{creatorId}/subscription` (구독 취소), `GET /api/profiles/{creatorId}/subscription/count` (구독자 수), `GET /api/profiles/{creatorId}/subscription/enabled` (구독 활성화 여부)가 있으나 프론트엔드에 직접 대응하는 엔드포인트가 없습니다.

---

## 15. 고객지원 (SUPPORT)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 문의 티켓 | `/support/tickets` | — | 미구현 |
| 신고 | `/support/reports` | — | 미구현 |
| 카테고리 요청 | `/support/category-requests` | — | 미구현 |

---

## 16. 관리자 (ADMIN)

| 기능 | 프론트엔드 (endpoints.ts) | 백엔드 (현재) | 상태 |
|------|--------------------------|--------------|------|
| 대시보드 통계 | `GET /admin/dashboard/stats` | — | 미구현 |
| 신고 목록 | `GET /admin/reports` | — | 미구현 |
| 신고 상세 | `GET /admin/reports/{id}` | — | 미구현 |
| 카테고리 요청 목록 | `GET /admin/category-requests` | — | 미구현 |
| 카테고리 요청 상세 | `GET /admin/category-requests/{id}` | — | 미구현 |
| 문의 티켓 목록 | `GET /admin/support-tickets` | — | 미구현 |
| 문의 티켓 상세 | `GET /admin/support-tickets/{id}` | — | 미구현 |
| 유저 관리 | `GET /admin/users` | — | 미구현 |
| 유저 상태 변경 | `PATCH /admin/users/{id}/status` | — | 미구현 |
| 게시글 관리 | `GET /admin/posts` | — | 미구현 |
| 게시글 상세 | `GET /admin/posts/{id}` | — | 미구현 |

---

## 17. 인기/트렌딩 (POPULARITY) — 백엔드 전용

다음 엔드포인트는 백엔드에만 존재하며 프론트엔드 `endpoints.ts`에 정의되어 있지 않습니다.

| 기능 | 백엔드 (현재) | 비고 |
|------|--------------|------|
| 인기 게시글 | `GET /api/popularity/posts/trending` | 프론트엔드 미정의 |
| 인기 게시판 | `GET /api/popularity/boards/popular` | 프론트엔드 미정의 |
| 게시글 통계 | `GET /api/popularity/posts/{postId}/stats` | 프론트엔드 미정의 |

---

## 요약 통계

| 상태 | 개수 |
|------|------|
| 일치 | 5 |
| 경로 다름 | 14 |
| 미구현 (백엔드에 없음) | 62 |
| 백엔드 전용 (프론트엔드에 없음) | 7 |

---

## 프론트엔드 엔드포인트 수정 방법

프론트엔드의 모든 API 경로는 단일 파일에서 관리됩니다.

### 파일 위치

```
src/lib/api/endpoints.ts
```

### 수정 방법

1. **경로 변경**: `ENDPOINTS` 객체에서 해당 키의 값을 백엔드 경로에 맞게 수정합니다.

   ```typescript
   // 변경 전
   SIGNUP: '/auth/signup',
   // 변경 후 (백엔드에 맞춤)
   SIGNUP: '/users/register',
   ```

2. **동적 경로 변경**: 함수 형태의 엔드포인트는 반환값을 수정합니다.

   ```typescript
   // 변경 전
   GET: (id: number) => `/users/${id}`,
   // 변경 후 (백엔드에 맞춤)
   GET: (id: number) => `/profiles/${id}`,
   ```

3. **새 엔드포인트 추가**: 해당 도메인 객체에 새 키를 추가합니다.

   ```typescript
   POSTS: {
     // 기존 엔드포인트들...
     CREATE: '/posts',
     // 새로 추가
     BY_CATEGORY: (categoryId: number) => `/posts/category/${categoryId}`,
   },
   ```

4. **API base URL**: `/api` 접두사는 API 클라이언트(axios 등)의 `baseURL` 설정에서 관리됩니다. `endpoints.ts`에는 `/api` 접두사 없이 경로만 정의합니다.

### 주의사항

- `as const`로 선언되어 있으므로 타입 안전성이 보장됩니다.
- 엔드포인트를 변경하면 해당 경로를 사용하는 모든 API 호출 함수가 자동으로 영향을 받습니다.
- 변경 후 반드시 관련 API 호출이 정상 동작하는지 확인하세요.
