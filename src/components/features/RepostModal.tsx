'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import type { PostWithAuthor } from '@/types';

interface RepostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostWithAuthor;
  onRepost?: (postId: number) => void;
  onQuoteRepost?: (postId: number, quote: string) => void;
}

export const RepostModal: React.FC<RepostModalProps> = ({
  isOpen,
  onClose,
  post,
  onRepost,
  onQuoteRepost,
}) => {
  const [quoteText, setQuoteText] = useState('');
  const [mode, setMode] = useState<'simple' | 'quote'>('simple');

  const handleSimpleRepost = () => {
    onRepost?.(post.id);
    onClose();
  };

  const handleQuoteRepost = () => {
    if (!quoteText.trim()) return;
    onQuoteRepost?.(post.id, quoteText.trim());
    setQuoteText('');
    setMode('simple');
    onClose();
  };

  const handleClose = () => {
    setQuoteText('');
    setMode('simple');
    onClose();
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="리포스트">
      <div className="space-y-4">
        {/* Simple Repost */}
        <button
          onClick={handleSimpleRepost}
          className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors text-left"
        >
          <svg className="w-5 h-5 text-neutral-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <div>
            <p className="text-sm font-medium text-neutral-900">리포스트</p>
            <p className="text-xs text-neutral-500">내 타임라인에 공유합니다</p>
          </div>
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-neutral-400">또는</span>
          </div>
        </div>

        {/* Quote Repost */}
        <div className="space-y-3">
          <button
            onClick={() => setMode(mode === 'quote' ? 'simple' : 'quote')}
            className="flex items-center gap-3 text-left"
          >
            <svg className="w-5 h-5 text-neutral-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-neutral-900">인용 리포스트</p>
              <p className="text-xs text-neutral-500">내 코멘트와 함께 공유합니다</p>
            </div>
          </button>

          {mode === 'quote' && (
            <div className="space-y-3">
              <textarea
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="내 생각을 남겨보세요..."
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-800 placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />

              {/* Quoted Post Preview */}
              <div className="p-3 border border-neutral-200 rounded-lg bg-neutral-50">
                <div className="flex items-center gap-2 mb-1.5">
                  <Avatar
                    src={post.author.profile?.profileImageUrl}
                    alt={post.author.nickname}
                    size="xs"
                  />
                  <span className="text-xs font-semibold text-neutral-900">
                    {post.author.nickname}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {timeAgo(post.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 line-clamp-3 whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              <button
                onClick={handleQuoteRepost}
                disabled={!quoteText.trim()}
                className="w-full h-10 rounded-lg font-medium text-sm transition-colors duration-150 bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                인용 리포스트
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
