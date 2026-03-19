'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { useUser } from '@/stores/auth';
import type { PostWithAuthor } from '@/types';

interface RepostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostWithAuthor;
  onQuoteRepost?: (postId: number, quote: string) => void;
}

const MAX_LENGTH = 300;

export const RepostModal: React.FC<RepostModalProps> = ({
  isOpen,
  onClose,
  post,
  onQuoteRepost,
}) => {
  const [quoteText, setQuoteText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentUser = useUser();

  const remaining = MAX_LENGTH - quoteText.length;
  const progress = quoteText.length / MAX_LENGTH;
  const isOverLimit = remaining < 0;
  const canSubmit = quoteText.trim().length > 0 && !isOverLimit;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      setQuoteText('');
      onClose();
    }, 200);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onQuoteRepost?.(post.id, quoteText.trim());
    setQuoteText('');
    setIsVisible(false);
    onClose();
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuoteText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
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

  if (!isOpen && !isVisible) return null;

  const circumference = 2 * Math.PI * 10;
  const strokeDashoffset = circumference * (1 - Math.min(progress, 1));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl
          max-h-[90dvh] overflow-hidden shadow-2xl
          transition-all duration-200 ease-out
          ${isClosing
            ? 'translate-y-full sm:translate-y-0 sm:scale-95 opacity-0'
            : 'translate-y-0 sm:scale-100 opacity-100'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
          <button
            onClick={handleClose}
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors py-1 px-1 -ml-1"
          >
            취소
          </button>
          <span className="text-sm font-semibold text-neutral-900">인용</span>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`text-sm font-semibold py-1.5 px-4 rounded-full transition-all duration-150 ${
              canSubmit
                ? 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }`}
          >
            게시
          </button>
        </div>

        {/* Compose Area */}
        <div className="px-4 py-3 overflow-y-auto max-h-[calc(90dvh-120px)]">
          <div className="flex gap-3">
            {/* Left column: avatar + thread line */}
            <div className="flex flex-col items-center shrink-0">
              <Avatar
                src={currentUser?.profile?.profileImageUrl}
                alt={currentUser?.nickname || '나'}
                size="md"
              />
              {/* Thread line */}
              <div className="w-0.5 flex-1 bg-neutral-200 my-1.5 min-h-[24px] rounded-full" />
            </div>

            {/* Right column: text input */}
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm font-semibold text-neutral-900 mb-1">
                {currentUser?.nickname || '나'}
              </p>
              <textarea
                ref={textareaRef}
                value={quoteText}
                onChange={handleTextareaInput}
                placeholder="내 생각을 남겨보세요..."
                rows={1}
                className="w-full text-sm text-neutral-800 placeholder-neutral-400 resize-none outline-none leading-relaxed bg-transparent"
              />
            </div>
          </div>

          {/* Quoted Post Card */}
          <div className="ml-[52px] mt-1">
            <div className="border border-neutral-200 rounded-xl overflow-hidden hover:bg-neutral-50/50 transition-colors">
              <div className="p-3">
                {/* Author row */}
                <div className="flex items-center gap-2 mb-2">
                  <Avatar
                    src={post.author.profile?.profileImageUrl}
                    alt={post.author.nickname}
                    size="xs"
                  />
                  <span className="text-xs font-semibold text-neutral-900">
                    {post.author.nickname}
                  </span>
                  {post.author.isVerified && (
                    <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="text-xs text-neutral-400">
                    {timeAgo(post.createdAt)}
                  </span>
                </div>

                {/* Content */}
                <p className="text-[13px] text-neutral-700 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Media preview */}
                {post.media && post.media.length > 0 && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-neutral-100 aspect-video max-h-32">
                    <img
                      src={post.media[0].mediaUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Engagement stats */}
                <div className="flex items-center gap-3 mt-2.5 text-neutral-400">
                  <span className="flex items-center gap-1 text-[11px]">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {post.likeCount}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.commentCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: character count */}
        <div className="flex items-center justify-end px-4 py-2.5 border-t border-neutral-100">
          {quoteText.length > 0 && (
            <div className="flex items-center gap-2">
              {/* Circular progress */}
              <div className="relative w-6 h-6">
                <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12" cy="12" r="10"
                    fill="none"
                    stroke="#e5e5e5"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="12" cy="12" r="10"
                    fill="none"
                    stroke={isOverLimit ? '#ef4444' : remaining <= 20 ? '#f59e0b' : '#171717'}
                    strokeWidth="2.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-150"
                  />
                </svg>
              </div>
              {remaining <= 20 && (
                <span className={`text-xs tabular-nums ${isOverLimit ? 'text-red-500 font-medium' : 'text-amber-500'}`}>
                  {remaining}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
