'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  replyTo?: { commentId: number; nickname: string } | null;
  onCancelReply?: () => void;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  placeholder = '댓글을 입력하세요...',
  isLoading = false,
  replyTo,
  onCancelReply,
}) => {
  const [content, setContent] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when replyTo changes
  useEffect(() => {
    if (replyTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyTo]);

  const handleSubmit = () => {
    if (!content.trim() || isLoading) return;
    onSubmit(content.trim());
    setContent('');
  };

  const displayPlaceholder = replyTo
    ? `@${replyTo.nickname}에게 답글...`
    : placeholder;

  return (
    <div className="border-t border-neutral-100 bg-white">
      {/* Reply indicator */}
      {replyTo && (
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 border-b border-neutral-100">
          <span className="text-xs text-neutral-500">
            <span className="font-medium text-neutral-700">@{replyTo.nickname}</span>에게 답글 작성 중
          </span>
          <button
            onClick={onCancelReply}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 transition-colors"
            aria-label="답글 취소"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className="flex items-center gap-2 px-4 py-3">
        <input
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          placeholder={displayPlaceholder}
          className="flex-1 h-9 px-3 rounded-full bg-neutral-100 text-sm outline-none placeholder:text-neutral-400 focus:ring-1 focus:ring-neutral-900"
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          className="text-sm font-medium text-neutral-900 disabled:text-neutral-300 transition-colors"
        >
          게시
        </button>
      </div>
    </div>
  );
};
