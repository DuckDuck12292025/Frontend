import { api } from './client';
import { ENDPOINTS } from './endpoints';

// ============================================================
// Auth
// ============================================================

export interface AuthResponse {
  user: UserResponse;
  tokens: { accessToken: string; refreshToken: string; expiresIn: number };
}

export interface UserResponse {
  id: number;
  email: string;
  handle: string;
  nickname: string;
  status: string;
  role: string;
  isVerified: boolean;
  isBlueChecked: boolean;
  profile: ProfileResponse | null;
  createdAt: string;
}

export interface ProfileResponse {
  profileImageUrl: string | null;
  backgroundImageUrl: string | null;
  bio: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  hasMembership: boolean;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, { email, password }),

  signup: (email: string, password: string, nickname: string) =>
    api.post<AuthResponse>(ENDPOINTS.AUTH.SIGNUP, { email, password, nickname }),

  logout: () =>
    api.post<void>(ENDPOINTS.AUTH.LOGOUT),

  me: () =>
    api.get<UserResponse>(ENDPOINTS.AUTH.ME),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<void>(ENDPOINTS.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword }),

  sessions: () =>
    api.get<LoginSessionResponse[]>(ENDPOINTS.AUTH.SESSIONS),

  deleteAccount: (password: string) =>
    api.delete<void>(ENDPOINTS.AUTH.DELETE_ACCOUNT, { data: { password } }),
};

export interface LoginSessionResponse {
  id: number;
  device: string;
  deviceType: string;
  browser: string;
  location: string;
  ip: string;
  loginAt: string;
  isCurrentSession: boolean;
}

// ============================================================
// Users
// ============================================================

export interface UserWithProfileResponse {
  id: number;
  email: string;
  handle: string;
  nickname: string;
  status: string;
  role: string;
  isVerified: boolean;
  isBlueChecked: boolean;
  profile: ProfileResponse | null;
  isFollowing: boolean | null;
  isFollowedBy: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export const usersApi = {
  getByNickname: (nickname: string) =>
    api.get<UserWithProfileResponse>(ENDPOINTS.USERS.GET_BY_NICKNAME(nickname)),

  getById: (id: number) =>
    api.get<UserWithProfileResponse>(ENDPOINTS.USERS.GET(id)),

  getMyProfile: () =>
    api.get<UserWithProfileResponse>(ENDPOINTS.USERS.ME),

  updateProfile: (data: { nickname?: string; bio?: string; profileImageUrl?: string; backgroundImageUrl?: string }) =>
    api.patch<UserWithProfileResponse>(ENDPOINTS.USERS.ME_PROFILE, data),

  followers: (userId: number, params?: { page?: number; pageSize?: number }) =>
    api.get<PageResponse<UserWithProfileResponse>>(ENDPOINTS.USERS.FOLLOWERS(userId), { params }),

  following: (userId: number, params?: { page?: number; pageSize?: number }) =>
    api.get<PageResponse<UserWithProfileResponse>>(ENDPOINTS.USERS.FOLLOWING(userId), { params }),

  follow: (userId: number) =>
    api.post<{ followed: boolean }>(ENDPOINTS.USERS.FOLLOW(userId)),

  unfollow: (userId: number) =>
    api.delete<{ followed: boolean }>(ENDPOINTS.USERS.FOLLOW(userId)),

  block: (userId: number) =>
    api.post<{ blocked: boolean }>(ENDPOINTS.USERS.BLOCK(userId)),

  unblock: (userId: number) =>
    api.delete<{ blocked: boolean }>(ENDPOINTS.USERS.BLOCK(userId)),

  getSettings: () =>
    api.get<UserSettingsResponse>(ENDPOINTS.USERS.SETTINGS),

  updateSettings: (data: Record<string, unknown>) =>
    api.patch<UserSettingsResponse>(ENDPOINTS.USERS.SETTINGS, data),
};

export interface UserSettingsResponse {
  privacy: Record<string, unknown>;
  notifications: Record<string, unknown>;
  app: Record<string, unknown>;
}

// ============================================================
// Posts
// ============================================================

export interface PostWithAuthorResponse {
  id: number;
  userId: number;
  categoryId: number | null;
  content: string;
  visibility: string;
  isPinned: boolean;
  likeCount: number;
  commentCount: number;
  repostCount: number;
  viewCount: number;
  bookmarkCount: number;
  createdAt: string;
  updatedAt: string;
  author: UserWithProfileResponse;
  media: PostMediaResponse[];
  category: CategoryResponse | null;
  isLiked: boolean | null;
  isBookmarked: boolean | null;
  isReposted: boolean | null;
  quotedPost: PostWithAuthorResponse | null;
}

export interface PostMediaResponse {
  id: number;
  postId: number;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  orderIndex: number;
  createdAt: string;
}

export interface FeedItemResponse {
  type: string;
  post: PostWithAuthorResponse;
  timestamp: string;
}

export const postsApi = {
  get: (postId: number) =>
    api.get<PostWithAuthorResponse>(ENDPOINTS.POSTS.GET(postId)),

  create: (data: { content: string; categoryId?: number | null; visibility?: string; mediaIds?: number[] }) =>
    api.post<PostWithAuthorResponse>(ENDPOINTS.POSTS.CREATE, data),

  update: (postId: number, data: { content?: string; categoryId?: number | null }) =>
    api.patch<PostWithAuthorResponse>(ENDPOINTS.POSTS.UPDATE(postId), data),

  delete: (postId: number) =>
    api.delete<{ deleted: boolean }>(ENDPOINTS.POSTS.DELETE(postId)),

  like: (postId: number) =>
    api.post<{ liked: boolean; likeCount: number }>(ENDPOINTS.POSTS.LIKE(postId)),

  unlike: (postId: number) =>
    api.delete<{ liked: boolean; likeCount: number }>(ENDPOINTS.POSTS.LIKE(postId)),

  bookmark: (postId: number) =>
    api.post<{ bookmarked: boolean }>(ENDPOINTS.POSTS.BOOKMARK(postId)),

  repost: (postId: number) =>
    api.post<{ reposted: boolean }>(ENDPOINTS.POSTS.REPOST(postId)),
};

// ============================================================
// Feed
// ============================================================

export const feedApi = {
  home: (params?: { cursor?: string; limit?: number }) =>
    api.get<CursorResponse<FeedItemResponse>>(ENDPOINTS.FEED.HOME, { params }),

  following: (params?: { cursor?: string; limit?: number }) =>
    api.get<CursorResponse<FeedItemResponse>>(ENDPOINTS.FEED.FOLLOWING, { params }),

  category: (categoryId: number, params?: { cursor?: string; limit?: number }) =>
    api.get<CursorResponse<FeedItemResponse>>(ENDPOINTS.FEED.CATEGORY(categoryId), { params }),

  userPosts: (userId: number, params?: { cursor?: string; limit?: number }) =>
    api.get<CursorResponse<PostWithAuthorResponse>>(ENDPOINTS.POSTS.USER_POSTS(userId), { params }),
};

// ============================================================
// Comments
// ============================================================

export interface CommentWithAuthorResponse {
  id: number;
  postId: number;
  userId: number;
  parentId: number | null;
  content: string;
  likeCount: number;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  author: UserWithProfileResponse;
  replies: CommentWithAuthorResponse[];
  isLiked: boolean | null;
}

export const commentsApi = {
  byPost: (postId: number, params?: { page?: number; pageSize?: number }) =>
    api.get<PageResponse<CommentWithAuthorResponse>>(ENDPOINTS.COMMENTS.BY_POST(postId), { params }),

  create: (data: { postId: number; parentId?: number | null; content: string }) =>
    api.post<CommentWithAuthorResponse>(ENDPOINTS.COMMENTS.CREATE, data),

  update: (commentId: number, content: string) =>
    api.patch<CommentWithAuthorResponse>(ENDPOINTS.COMMENTS.UPDATE(commentId), { content }),

  delete: (commentId: number) =>
    api.delete<void>(ENDPOINTS.COMMENTS.DELETE(commentId)),

  like: (commentId: number) =>
    api.post<{ liked: boolean; likeCount: number }>(ENDPOINTS.COMMENTS.LIKE(commentId)),

  unlike: (commentId: number) =>
    api.delete<{ liked: boolean; likeCount: number }>(ENDPOINTS.COMMENTS.LIKE(commentId)),
};

// ============================================================
// Categories
// ============================================================

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  status: string;
  visibility: string;
  postCount: number;
  subscriberCount: number;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
  isSubscribed: boolean | null;
}

export const categoriesApi = {
  list: () =>
    api.get<CategoryResponse[]>(ENDPOINTS.CATEGORIES.LIST),

  get: (categoryId: number) =>
    api.get<CategoryResponse>(ENDPOINTS.CATEGORIES.GET(categoryId)),

  subscribe: (categoryId: number) =>
    api.post<{ subscribed: boolean }>(ENDPOINTS.CATEGORIES.SUBSCRIBE(categoryId)),

  unsubscribe: (categoryId: number) =>
    api.delete<{ subscribed: boolean }>(ENDPOINTS.CATEGORIES.SUBSCRIBE(categoryId)),
};

// ============================================================
// Search
// ============================================================

export const searchApi = {
  search: (params: { q: string; type?: string }) =>
    api.get<{ users: UserWithProfileResponse[]; posts: PostWithAuthorResponse[]; categories: CategoryResponse[] }>(
      ENDPOINTS.SEARCH.ALL, { params }
    ),

  trending: () =>
    api.get<string[]>(ENDPOINTS.SEARCH.TRENDING),
};

// ============================================================
// Common Response Types
// ============================================================

export interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CursorResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
