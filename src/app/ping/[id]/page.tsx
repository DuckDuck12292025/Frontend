'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar, Loading } from '@/components/ui';
import { CommentCard } from '@/components/features/CommentCard';
import { CommentInput } from '@/components/features/CommentInput';
import { ShareModal } from '@/components/features/ShareModal';
import { UserActionMenu } from '@/components/features/UserActionMenu';
import {
  usePost,
  useComments,
  useCreateComment,
  useLikePost,
  useBookmarkPost,
  useLikeComment,
  useUpdateComment,
  useDeleteComment,
} from '@/hooks/queries';
import type { CommentWithAuthor } from '@/types';

export default function PingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const postId = Number(id);

  const { data: post, isLoading: postLoading, isError: postError } = usePost(postId);
  const { data: commentsData, isLoading: commentsLoading } = useComments(postId);
  const createComment = useCreateComment();
  const likeMutation = useLikePost();
  const bookmarkMutation = useBookmarkPost();
  const likeCommentMutation = useLikeComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  const [localLiked, setLocalLiked] = useState<boolean | null>(null);
  const [localLikeCount, setLocalLikeCount] = useState<number | null>(null);
  const [localBookmarked, setLocalBookmarked] = useState<boolean | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<{ commentId: number; nickname: string } | null>(null);

  const isLiked = localLiked ?? post?.isLiked ?? false;
  const likeCount = localLikeCount ?? post?.likeCount ?? 0;
  const isBookmarked = localBookmarked ?? post?.isBookmarked ?? false;
  const comments = commentsData?.items ?? [];

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/ping/${postId}`
    : `/ping/${postId}`;

  const handleLike = () => {
    if (!post) return;
    setLocalLiked(!isLiked);
    setLocalLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    likeMutation.mutate({ postId: post.id, isLiked });
  };

  const handleBookmark = () => {
    if (!post) return;
    setLocalBookmarked(!isBookmarked);
    bookmarkMutation.mutate(post.id);
  };

  const handleComment = (content: string) => {
    const data: { postId: number; content: string; parentId?: number | null } = {
      postId,
      content: replyTo ? `@${replyTo.nickname} ${content}` : content,
    };
    if (replyTo) {
      data.parentId = replyTo.commentId;
    }
    createComment.mutate(data);
    setReplyTo(null);
  };

  const handleCommentLike = (commentId: number, isCurrentlyLiked: boolean) => {
    likeCommentMutation.mutate({ commentId, isLiked: isCurrentlyLiked, postId });
  };

  const handleCommentReply = (commentId: number, nickname: string) => {
    setReplyTo({ commentId, nickname });
  };

  const handleCommentEdit = (commentId: number, content: string) => {
    updateCommentMutation.mutate({ commentId, content, postId });
  };

  const handleCommentDelete = (commentId: number) => {
    deleteCommentMutation.mutate({ commentId, postId });
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return '방금';
    if (m < 60) return `${m}분 전`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}시간 전`;
    return `${Math.floor(h / 24)}일 전`;
  };

  // Loading state
  if (postLoading) {
    return (
      <MainLayout showHeader={false} showNav={false}>
        <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl min-h-screen flex flex-col">
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
            <div className="flex items-center h-14 px-4">
              <button onClick={() => router.back()} className="p-2 -ml-2 rounded-lg hover:bg-neutral-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h1 className="ml-3 text-base font-semibold text-neutral-900">게시글</h1>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Loading size="lg" />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (postError || !post) {
    return (
      <MainLayout showHeader={false} showNav={false}>
        <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl min-h-screen flex flex-col">
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
            <div className="flex items-center h-14 px-4">
              <button onClick={() => router.back()} className="p-2 -ml-2 rounded-lg hover:bg-neutral-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h1 className="ml-3 text-base font-semibold text-neutral-900">게시글</h1>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-neutral-400 text-sm">게시글을 찾을 수 없습니다</p>
            <button
              onClick={() => router.back()}
              className="text-sm font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg transition-colors"
            >
              돌아가기
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showHeader={false} showNav={false}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl min-h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center">
              <button onClick={() => router.back()} className="p-2 -ml-2 rounded-lg hover:bg-neutral-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h1 className="ml-3 text-base font-semibold text-neutral-900">게시글</h1>
            </div>
            {/* Post action menu */}
            <UserActionMenu
              postId={post.id}
              authorId={post.author.id}
            />
          </div>
        </div>

        {/* Post content - full display, no line clamping */}
        <div className="px-4 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3 mb-3">
            <Link href={`/user/${post.author.nickname}`}>
              <Avatar src={post.author.profile?.profileImageUrl} alt={post.author.nickname} size="md" />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Link href={`/user/${post.author.nickname}`} className="text-sm font-semibold text-neutral-900 hover:underline">{post.author.nickname}</Link>
                {post.author.isVerified && (
                  <svg className="w-4 h-4 text-neutral-900 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {post.category && (
                  <>
                    <span className="text-neutral-300">&middot;</span>
                    <Link href={`/category/${post.category.slug}`} className="text-xs text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded-full transition-colors">
                      {post.category.name}
                    </Link>
                  </>
                )}
              </div>
              <p className="text-xs text-neutral-500">{timeAgo(post.createdAt)}</p>
            </div>
          </div>

          {/* Full content - no line-clamp */}
          <p className="text-base text-neutral-800 whitespace-pre-wrap leading-relaxed">{post.content}</p>

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div className={`mt-3 rounded-xl overflow-hidden border border-neutral-100 ${post.media.length === 1 ? '' : 'grid grid-cols-2 gap-0.5'}`}>
              {post.media.map((m) => (
                <div key={m.id} className={`relative ${post.media.length === 1 ? 'aspect-video' : 'aspect-square'} bg-neutral-100`}>
                  <img src={m.mediaUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Quoted post preview */}
          {post.quotedPost && (
            <Link href={`/ping/${post.quotedPost.id}`} className="block mt-3">
              <div className="p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <Avatar
                    src={post.quotedPost.author.profile?.profileImageUrl}
                    alt={post.quotedPost.author.nickname}
                    size="xs"
                  />
                  <span className="text-xs font-semibold text-neutral-900">
                    {post.quotedPost.author.nickname}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 line-clamp-3 whitespace-pre-wrap">
                  {post.quotedPost.content}
                </p>
              </div>
            </Link>
          )}

          {/* Action bar: Like, Comment count, Repost, Bookmark, Share */}
          <div className="flex items-center gap-5 mt-4 pt-3 border-t border-neutral-50 text-sm text-neutral-500">
            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
            >
              <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likeCount}</span>
            </button>

            {/* Comment count */}
            <span className="flex items-center gap-1.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {comments.length}
            </span>

            {/* Repost count */}
            <span className="flex items-center gap-1.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {post.repostCount}
            </span>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1.5 transition-colors ${isBookmarked ? 'text-neutral-900' : 'hover:text-neutral-900'}`}
            >
              <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            {/* Share */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 ml-auto hover:text-neutral-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Comments section */}
        <div className="flex-1">
          {commentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loading />
            </div>
          ) : comments.length > 0 ? (
            comments.map((c) => (
              <CommentCard
                key={c.id}
                comment={c as unknown as CommentWithAuthor}
                onLike={handleCommentLike}
                onReply={handleCommentReply}
                onEdit={handleCommentEdit}
                onDelete={handleCommentDelete}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-neutral-400 text-sm">아직 댓글이 없습니다</p>
              <p className="text-neutral-300 text-xs">첫 번째 댓글을 남겨보세요</p>
            </div>
          )}
        </div>

        {/* Comment input */}
        <div className="sticky bottom-0">
          <CommentInput
            onSubmit={handleComment}
            isLoading={createComment.isPending}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />
        </div>
      </div>

      {/* Share modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={shareUrl}
      />
    </MainLayout>
  );
}
