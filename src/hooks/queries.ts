import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { setAuthToken, clearAuthToken } from '@/lib/api/client';
import {
  authApi,
  usersApi,
  postsApi,
  feedApi,
  commentsApi,
  categoriesApi,
  searchApi,
} from '@/lib/api/services';
import type { PostWithAuthor, CommentWithAuthor, UserWithProfile } from '@/types';

// ============================================================
// Auth Hooks
// ============================================================

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await authApi.login(email, password);
      return response.data;
    },
    onSuccess: (data) => {
      const { user, tokens } = data;
      setAuthToken(tokens.accessToken);
      login(user as unknown as UserWithProfile, tokens);
    },
  });
}

export function useSignup() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async ({ email, password, nickname }: { email: string; password: string; nickname: string }) => {
      const response = await authApi.signup(email, password, nickname);
      return response.data;
    },
    onSuccess: (data) => {
      const { user, tokens } = data;
      setAuthToken(tokens.accessToken);
      login(user as unknown as UserWithProfile, tokens);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch {
        // Ignore logout API errors — clear local state regardless
      }
    },
    onSettled: () => {
      clearAuthToken();
      logout();
      queryClient.clear();
    },
  });
}

export function useMe() {
  const tokens = useAuthStore((s) => s.tokens);
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authApi.me();
      const user = response.data as unknown as UserWithProfile;
      setUser(user);
      return user;
    },
    enabled: !!tokens?.accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================
// Feed Hooks
// ============================================================

// Helper: normalize feed response items
// Backend may return PostWithAuthorResponse directly or wrapped as FeedItemResponse
function normalizeFeedItems(items: unknown[]): { type: 'post'; post: PostWithAuthor; timestamp: string }[] {
  return items.map((item: any) => ({
    type: 'post' as const,
    post: item.post ?? item,
    timestamp: item.timestamp ?? (item.post ?? item).createdAt,
  }));
}

export function useHomeFeed() {
  return useInfiniteQuery({
    queryKey: ['feed', 'home'],
    queryFn: async ({ pageParam }) => {
      const response = await feedApi.home({ cursor: pageParam, limit: 20 });
      const data = response.data;
      return {
        items: normalizeFeedItems(data.items),
        nextCursor: data.nextCursor,
        hasMore: data.hasMore,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 60 * 1000,
  });
}

export function useFollowingFeed() {
  return useInfiniteQuery({
    queryKey: ['feed', 'following'],
    queryFn: async ({ pageParam }) => {
      const response = await feedApi.following({ cursor: pageParam, limit: 20 });
      const data = response.data;
      return {
        items: normalizeFeedItems(data.items),
        nextCursor: data.nextCursor,
        hasMore: data.hasMore,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 60 * 1000,
  });
}

export function useCategoryFeed(categoryId: number) {
  return useInfiniteQuery({
    queryKey: ['feed', 'category', categoryId],
    queryFn: async ({ pageParam }) => {
      const response = await feedApi.category(categoryId, { cursor: pageParam, limit: 20 });
      const data = response.data;
      return {
        items: normalizeFeedItems(data.items),
        nextCursor: data.nextCursor,
        hasMore: data.hasMore,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: !!categoryId,
  });
}

// ============================================================
// Post Hooks
// ============================================================

export function usePost(postId: number) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await postsApi.get(postId);
      return response.data as unknown as PostWithAuthor;
    },
    enabled: !!postId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content: string; categoryId?: number | null; visibility?: string; quotedPostId?: number; acceptsQuestion?: boolean; qaItems?: { question: string; answer: string }[] }) => {
      const response = await postsApi.create(data);
      return response.data as unknown as PostWithAuthor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, ...data }: { postId: number; content?: string; categoryId?: number | null }) => {
      const response = await postsApi.update(postId, data);
      return response.data as unknown as PostWithAuthor;
    },
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(['post', variables.postId], updated);
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      await postsApi.delete(postId);
      return { deleted: true, postId };
    },
    onSuccess: (_, postId) => {
      queryClient.removeQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: number; isLiked: boolean }) => {
      if (isLiked) {
        const response = await postsApi.unlike(postId);
        return { postId, liked: false, likeCount: response.data.likeCount };
      } else {
        const response = await postsApi.like(postId);
        return { postId, liked: true, likeCount: response.data.likeCount };
      }
    },
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
      if (context?.prev) {
        queryClient.setQueryData(['post', postId], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useBookmarkPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await postsApi.bookmark(postId);
      return { postId, bookmarked: response.data.bookmarked };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

export function useRepostPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await postsApi.repost(postId);
      return { postId, reposted: response.data.reposted };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

// ============================================================
// Comment Hooks
// ============================================================

export function useComments(postId: number) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await commentsApi.byPost(postId);
      return { items: response.data.items as unknown as CommentWithAuthor[] };
    },
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { postId: number; parentId?: number | null; content: string }) => {
      const response = await commentsApi.create(data);
      return response.data as unknown as CommentWithAuthor;
    },
    onSuccess: (newComment, variables) => {
      queryClient.setQueryData(['comments', variables.postId], (old: { items: CommentWithAuthor[] } | undefined) => {
        const prev = old?.items ?? [];
        return { items: [...prev, newComment] };
      });
      queryClient.setQueryData(['post', variables.postId], (old: PostWithAuthor | undefined) => {
        if (!old) return old;
        return { ...old, commentCount: old.commentCount + 1 };
      });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useLikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, isLiked }: { commentId: number; isLiked: boolean; postId: number }) => {
      if (isLiked) {
        await commentsApi.unlike(commentId);
        return { commentId, liked: false };
      } else {
        await commentsApi.like(commentId);
        return { commentId, liked: true };
      }
    },
    onMutate: async (variables) => {
      queryClient.setQueryData(['comments', variables.postId], (old: { items: CommentWithAuthor[] } | undefined) => {
        if (!old) return old;
        return {
          items: old.items.map((c) =>
            c.id === variables.commentId
              ? { ...c, isLiked: !variables.isLiked, likeCount: variables.isLiked ? c.likeCount - 1 : c.likeCount + 1 }
              : c
          ),
        };
      });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string; postId: number }) => {
      const response = await commentsApi.update(commentId, content);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId }: { commentId: number; postId: number }) => {
      await commentsApi.delete(commentId);
      return { deleted: true, commentId };
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['comments', variables.postId], (old: { items: CommentWithAuthor[] } | undefined) => {
        if (!old) return old;
        return { items: old.items.filter((c) => c.id !== variables.commentId) };
      });
      queryClient.setQueryData(['post', variables.postId], (old: PostWithAuthor | undefined) => {
        if (!old) return old;
        return { ...old, commentCount: Math.max(0, old.commentCount - 1) };
      });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

// ============================================================
// User Profile Hooks
// ============================================================

export function useUserByNickname(nickname: string) {
  return useQuery({
    queryKey: ['user', 'nickname', nickname],
    queryFn: async () => {
      const response = await usersApi.getByNickname(nickname);
      return response.data as unknown as UserWithProfile & { isFollowing: boolean };
    },
    enabled: !!nickname,
  });
}

export function useUserPosts(userId: number) {
  return useInfiniteQuery({
    queryKey: ['user', userId, 'posts'],
    queryFn: async ({ pageParam }) => {
      const response = await feedApi.userPosts(userId, { cursor: pageParam, limit: 20 });
      const data = response.data;
      return {
        items: data.items as unknown as PostWithAuthor[],
        nextCursor: data.nextCursor,
        hasMore: data.hasMore,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: !!userId,
  });
}

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
    onSuccess: (result, variables) => {
      queryClient.setQueriesData<UserWithProfile & { isFollowing: boolean }>(
        { queryKey: ['user', 'nickname'] },
        (old) => {
          if (!old || old.id !== variables.userId) return old;
          return {
            ...old,
            isFollowing: result.following,
            profile: old.profile ? {
              ...old.profile,
              followerCount: result.following
                ? old.profile.followerCount + 1
                : Math.max(0, old.profile.followerCount - 1),
            } : old.profile,
          };
        }
      );
    },
  });
}

export function useFollowers(userId: number, page = 0) {
  return useQuery({
    queryKey: ['user', userId, 'followers', page],
    queryFn: async () => {
      const response = await usersApi.followers(userId, { page, pageSize: 20 });
      return response.data;
    },
    enabled: !!userId,
  });
}

export function useFollowing(userId: number, page = 0) {
  return useQuery({
    queryKey: ['user', userId, 'following', page],
    queryFn: async () => {
      const response = await usersApi.following(userId, { page, pageSize: 20 });
      return response.data;
    },
    enabled: !!userId,
  });
}

// ============================================================
// Profile Update Hook
// ============================================================

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { nickname?: string; handle?: string; bio?: string }) => {
      const response = await usersApi.updateProfile(data);
      const updated = response.data as unknown as UserWithProfile;
      useAuthStore.getState().setUser(updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

// ============================================================
// Category Hooks
// ============================================================

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesApi.list();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategory(categoryId: number) {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const response = await categoriesApi.get(categoryId);
      return response.data;
    },
    enabled: !!categoryId,
  });
}

// ============================================================
// Search Hooks
// ============================================================

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const response = await searchApi.search({ q: query });
      return response.data;
    },
    enabled: query.length > 0,
    staleTime: 30 * 1000,
  });
}
