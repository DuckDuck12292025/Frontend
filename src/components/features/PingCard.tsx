'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { UserActionMenu } from '@/components/features/UserActionMenu';
import { ShareModal } from '@/components/features/ShareModal';
import { ReportModal } from '@/components/features/ReportModal';
import { RepostModal } from '@/components/features/RepostModal';
import { Button } from '@/components/ui';
import { useUser } from '@/stores/auth';
import type { PostWithAuthor } from '@/types';

interface PingCardProps {
  post: PostWithAuthor;
  onLike?: (postId: number) => void;
  onBookmark?: (postId: number) => void;
  onRepost?: (postId: number) => void;
  onDelete?: (postId: number) => void;
  onEdit?: (postId: number) => void;
  showFullContent?: boolean;
}

export const PingCard: React.FC<PingCardProps> = ({
  post,
  onLike,
  onBookmark,
  onRepost,
  onDelete,
  onEdit,
  showFullContent = false,
}) => {
  const { author, media } = post;
  const currentUser = useUser();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [questionSent, setQuestionSent] = useState(false);

  const isPremium = post.visibility === 'SUBSCRIBERS';

  const formatCount = (count: number) => {
    if (count >= 10000) return `${(count / 10000).toFixed(1)}만`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count > 0 ? String(count) : '';
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '방금';
    if (mins < 60) return `${mins}분`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}시간`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}일`;
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/ping/${post.id}`
    : `/ping/${post.id}`;

  return (
    <>
      <article className="px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
        <div className="flex gap-3">
          <Link href={`/user/${author.nickname}`} className="shrink-0">
            <Avatar src={author.profile?.profileImageUrl} alt={author.nickname} size="md" />
          </Link>
          <div className="flex-1 min-w-0">
            {/* Header: author info + more menu */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <Link href={`/user/${author.nickname}`} className="text-sm font-semibold text-neutral-900 truncate hover:underline">
                  {author.nickname}
                </Link>
                {author.isVerified && (
                  <svg className="w-4 h-4 text-neutral-900 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {/* Premium badge */}
                {isPremium && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-neutral-900 text-white rounded shrink-0">
                    Premium
                  </span>
                )}
                {post.category && (
                  <>
                    <span className="text-neutral-300 shrink-0">&middot;</span>
                    <Link
                      href={`/category/${post.category.slug}`}
                      className="text-xs text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded-full transition-colors shrink-0"
                    >
                      {post.category.name}
                    </Link>
                  </>
                )}
                <span className="text-xs text-neutral-400 shrink-0">{timeAgo(post.createdAt)}</span>
              </div>
              {/* More menu (three dots) */}
              <UserActionMenu
                postId={post.id}
                authorId={author.id}
                onEdit={onEdit}
                onDelete={onDelete}
                onReport={() => setIsReportModalOpen(true)}
              />
            </div>

            {/* Content */}
            <Link href={`/ping/${post.id}`}>
              <p
                className={`text-sm text-neutral-800 whitespace-pre-wrap break-words leading-relaxed ${
                  !showFullContent ? 'line-clamp-6' : ''
                }`}
              >
                {post.content}
              </p>
            </Link>

            {/* Quoted post preview */}
            {post.quotedPost && (
              <Link href={`/ping/${post.quotedPost.id}`} className="block mt-2">
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
                    {post.quotedPost.author.isVerified && (
                      <svg className="w-3 h-3 text-neutral-900 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className="text-xs text-neutral-400">
                      {timeAgo(post.quotedPost.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 line-clamp-3 whitespace-pre-wrap">
                    {post.quotedPost.content}
                  </p>
                  {post.quotedPost.media && post.quotedPost.media.length > 0 && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-neutral-100 aspect-video max-h-32">
                      <img
                        src={post.quotedPost.media[0].mediaUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </Link>
            )}

            {/* Media */}
            {media && media.length > 0 && (
              <div className={`mt-2 rounded-xl overflow-hidden border border-neutral-100 ${media.length === 1 ? '' : 'grid grid-cols-2 gap-0.5'}`}>
                {media.slice(0, 4).map((m, i) => (
                  <div key={m.id} className={`relative ${media.length === 1 ? 'aspect-video' : 'aspect-square'} bg-neutral-100`}>
                    <img src={m.mediaUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                    {i === 3 && media.length > 4 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold">+{media.length - 4}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Q&A items (answered questions) */}
            {post.qaItems && post.qaItems.length > 0 && (
              <div className="mt-2.5 space-y-2.5">
                {post.qaItems.map((qa, i) => (
                  <div key={i} className="rounded-xl border border-neutral-200 overflow-hidden">
                    {/* Question */}
                    <div className="flex gap-2.5 px-3 py-2.5 bg-neutral-50">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">Q</span>
                      <p className="text-sm text-neutral-900 pt-0.5">{qa.question}</p>
                    </div>
                    {/* Answer */}
                    <div className="flex gap-2.5 px-3 py-2.5">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center">A</span>
                      <p className="text-sm text-neutral-800 whitespace-pre-wrap pt-0.5">{qa.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Anonymous question box */}
            {post.acceptsQuestion && (
              <div className="mt-2.5">
                {questionSent ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-violet-50 border border-violet-200 rounded-xl">
                    <svg className="w-4 h-4 text-violet-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-violet-700 font-medium">질문이 전송되었습니다!</span>
                  </div>
                ) : !isQuestionOpen ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsQuestionOpen(true); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-violet-50 border border-violet-200 rounded-xl hover:bg-violet-100 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-violet-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-violet-700 font-medium">익명으로 질문하기</span>
                  </button>
                ) : (
                  <div className="p-3 bg-violet-50 border border-violet-200 rounded-xl" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-semibold text-violet-800">익명 질문</span>
                    </div>
                    <textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="궁금한 것을 물어보세요..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm bg-white border border-violet-200 rounded-lg outline-none focus:border-violet-400 resize-none placeholder:text-violet-300"
                      autoFocus
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-violet-400">작성자에게 익명으로 전달됩니다</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setIsQuestionOpen(false); setQuestionText(''); }}
                          className="px-2.5 py-1 text-xs text-violet-500 hover:text-violet-700 transition-colors"
                        >
                          취소
                        </button>
                        <Button
                          size="sm"
                          onClick={() => {
                            if (questionText.trim()) {
                              setQuestionSent(true);
                              setIsQuestionOpen(false);
                              setQuestionText('');
                              setTimeout(() => setQuestionSent(false), 3000);
                            }
                          }}
                          disabled={!questionText.trim()}
                        >
                          보내기
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between mt-2 -ml-2 max-w-sm">
              {/* Comment */}
              <Link href={`/ping/${post.id}`} className="flex items-center gap-1 p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span className="text-xs">{formatCount(post.commentCount)}</span>
              </Link>

              {/* Repost - opens RepostModal */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRepostModalOpen(true);
                }}
                className={`flex items-center gap-1 p-2 rounded-full transition-colors ${post.isReposted ? 'text-green-600' : 'text-neutral-500 hover:text-green-600 hover:bg-green-50'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span className="text-xs">{formatCount(post.repostCount)}</span>
              </button>

              {/* Like */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.(post.id);
                }}
                className={`flex items-center gap-1 p-2 rounded-full transition-colors ${post.isLiked ? 'text-red-500' : 'text-neutral-500 hover:text-red-500 hover:bg-red-50'}`}
              >
                <svg className="w-4 h-4" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <span className="text-xs">{formatCount(post.likeCount)}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark?.(post.id);
                }}
                className={`flex items-center gap-1 p-2 rounded-full transition-colors ${post.isBookmarked ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'}`}
              >
                <svg className="w-4 h-4" fill={post.isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              </button>

              {/* Share - opens ShareModal */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareModalOpen(true);
                }}
                className="flex items-center gap-1 p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={shareUrl}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="POST"
        targetId={post.id}
      />
      <RepostModal
        isOpen={isRepostModalOpen}
        onClose={() => setIsRepostModalOpen(false)}
        post={post}
        onQuoteRepost={(postId) => onRepost?.(postId)}
      />
    </>
  );
};
