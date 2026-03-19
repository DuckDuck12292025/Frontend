/**
 * 페이지: 홈 피드
 * 경로: /
 * 설명: 전체 게시글 피드를 무한 스크롤로 표시하는 메인 화면.
 *       차단/뮤트 사용자의 게시글을 필터링하고, 좋아요/북마크/삭제 기능을 제공한다.
 *
 * 사용하는 API:
 *   - GET /feed/home — 홈 피드 조회 (커서 기반 페이지네이션)
 *   - POST /posts/:id/like — 게시글 좋아요 토글
 *   - POST /posts/:id/bookmark — 게시글 북마크 토글
 *   - DELETE /posts/:id — 게시글 삭제
 *
 * Mock 상태: mockPosts, mockNotifications 사용 중 (API fallback)
 */
'use client';

import React, { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FeedList } from '@/components/features/FeedList';
import { useHomeFeed, useLikePost, useBookmarkPost, useDeletePost } from '@/hooks/queries';
import { useBlockStore } from '@/stores/block';
import { useMuteStore } from '@/stores/mute';
import { mockPosts, mockNotifications } from '@/mocks/data';
import type { PostWithAuthor } from '@/types';

export default function HomePage() {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHomeFeed();

  const likeMutation = useLikePost();
  const bookmarkMutation = useBookmarkPost();
  const deleteMutation = useDeletePost();

  // Block / Mute filtering
  const blockedIds = useBlockStore((s) => s.blockedIds);
  const mutedIds = useMuteStore((s) => s.mutedIds);

  // Unread notification count for header badge (mock data)
  const unreadCount = useMemo(
    () => mockNotifications.filter((n) => !n.isRead).length,
    [],
  );

  // Build posts from API feed, fallback to mockPosts for demo
  const apiPosts = useMemo(() => {
    const items = (data?.pages ?? []).flatMap((page) =>
      page.items.map((item) => item.post as unknown as PostWithAuthor),
    );
    return items;
  }, [data]);

  // Use API posts when available, otherwise fall back to mockPosts for demo
  const rawPosts = apiPosts.length > 0 ? apiPosts : mockPosts;

  // Filter out muted and blocked users
  const posts = useMemo(() => {
    return rawPosts.filter((post) => {
      const authorId = post.author?.id ?? post.userId;
      if (blockedIds.has(authorId)) return false;
      if (mutedIds.has(authorId)) return false;
      return true;
    });
  }, [rawPosts, blockedIds, mutedIds]);

  const handleLike = (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      likeMutation.mutate({ postId, isLiked: post.isLiked ?? false });
    }
  };

  const handleBookmark = (postId: number) => {
    bookmarkMutation.mutate(postId);
  };

  const handleDelete = (postId: number) => {
    deleteMutation.mutate(postId);
  };

  return (
    <MainLayout
      headerProps={{
        unreadCount,
      }}
    >
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        <FeedList
          posts={posts}
          isLoading={isLoading}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onDelete={handleDelete}
          hasMore={hasNextPage}
          onLoadMore={() => !isFetchingNextPage && fetchNextPage()}
        />
      </div>
    </MainLayout>
  );
}
