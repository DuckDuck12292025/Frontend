'use client';

import React, { useState, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FeedList } from '@/components/features/FeedList';
import { mockPosts } from '@/mocks/data';
import type { PostWithAuthor } from '@/types';

export default function LikesPage() {
  const [posts, setPosts] = useState<PostWithAuthor[]>(() =>
    mockPosts.filter((p) => p.isLiked)
  );

  const handleLike = useCallback((postId: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
            }
          : p
      )
    );
  }, []);

  const handleBookmark = useCallback((postId: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isBookmarked: !p.isBookmarked,
              bookmarkCount: p.isBookmarked ? p.bookmarkCount - 1 : p.bookmarkCount + 1,
            }
          : p
      )
    );
  }, []);

  const likedPosts = posts.filter((p) => p.isLiked);

  return (
    <MainLayout headerProps={{ title: '좋아요', showSearch: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-100">
          <h2 className="text-base font-semibold text-neutral-900">
            좋아요한 게시글
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {likedPosts.length}개의 게시글
          </p>
        </div>

        {likedPosts.length > 0 ? (
          <FeedList
            posts={likedPosts}
            isLoading={false}
            onLike={handleLike}
            onBookmark={handleBookmark}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <p className="text-sm font-medium text-neutral-500">
              아직 좋아요한 게시글이 없습니다
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              마음에 드는 게시글에 좋아요를 눌러보세요
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
