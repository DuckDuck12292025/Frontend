'use client';
import React, { useRef, useEffect } from 'react';
import { PingCard } from './PingCard';
import { SkeletonPost } from '@/components/ui/Skeleton';
import type { PostWithAuthor } from '@/types';

interface FeedListProps {
  posts: PostWithAuthor[];
  isLoading?: boolean;
  hasMore?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  onLike?: (postId: number) => void;
  onBookmark?: (postId: number) => void;
  onDelete?: (postId: number) => void;
}

export const FeedList: React.FC<FeedListProps> = ({
  posts,
  isLoading,
  hasMore,
  isFetchingNextPage,
  onLoadMore,
  onLike,
  onBookmark,
  onDelete,
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || !onLoadMore || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) onLoadMore(); },
      { threshold: 0.1 }
    );
    const el = observerRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasMore, onLoadMore, isFetchingNextPage]);

  if (isLoading && posts.length === 0) {
    return <div>{Array.from({ length: 5 }).map((_, i) => <SkeletonPost key={i} />)}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
        <p className="text-sm">아직 게시물이 없습니다</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PingCard key={post.id} post={post} onLike={onLike} onBookmark={onBookmark} onDelete={onDelete} />
      ))}
      {hasMore && (
        <div ref={observerRef} className="py-4">
          {isFetchingNextPage && (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
