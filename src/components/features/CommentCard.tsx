'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/stores/auth';
import { useBlockStore } from '@/stores/block';
import { useMuteStore } from '@/stores/mute';
import type { CommentWithAuthor } from '@/types';

interface CommentCardProps {
  comment: CommentWithAuthor;
  onLike?: (commentId: number, isLiked: boolean) => void;
  onReply?: (commentId: number, nickname: string) => void;
  onEdit?: (commentId: number, content: string) => void;
  onDelete?: (commentId: number) => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onLike,
  onReply,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);

  const currentUser = useAuthStore((state) => state.user);
  const { isBlocked, toggleBlock } = useBlockStore();
  const { isMuted, toggleMute } = useMuteStore();

  const isOwn = currentUser?.id === comment.author.id;
  const blocked = isBlocked(comment.author.id);
  const muted = isMuted(comment.author.id);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      editRef.current.setSelectionRange(editRef.current.value.length, editRef.current.value.length);
    }
  }, [isEditing]);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '방금';
    if (mins < 60) return `${mins}분`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}시간`;
    return `${Math.floor(hours / 24)}일`;
  };

  const handleEditSubmit = () => {
    if (!editContent.trim()) return;
    onEdit?.(comment.id, editContent.trim());
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    onDelete?.(comment.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="px-4 py-3 border-b border-neutral-50">
      <div className="flex gap-3">
        <Link href={`/user/${comment.author.nickname}`} className="shrink-0">
          <Avatar src={comment.author.profile?.profileImageUrl} alt={comment.author.nickname} size="sm" />
        </Link>
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-semibold text-neutral-900">{comment.author.nickname}</span>
              <span className="text-xs text-neutral-400">{timeAgo(comment.createdAt)}</span>
            </div>

            {/* Three-dot more menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label="댓글 더보기"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-neutral-200 rounded-xl shadow-lg z-40 py-1 overflow-hidden">
                  {isOwn ? (
                    <>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setIsEditing(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        수정하기
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setShowDeleteConfirm(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        삭제하기
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          toggleMute(comment.author.id);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {muted ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-8.464a5 5 0 000 7.072M4.93 19.07A10 10 0 0112 2a10 10 0 017.07 17.07" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                          )}
                        </svg>
                        {muted ? '음소거 해제' : '음소거'}
                      </button>
                      <button
                        onClick={() => {
                          toggleBlock(comment.author.id);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        {blocked ? '차단 해제' : '차단하기'}
                      </button>
                      <div className="my-1 border-t border-neutral-100" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        신고하기
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Reply-to mention */}
          {comment.replyTo && (
            <Link
              href={`/user/${comment.replyTo.nickname}`}
              className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              @{comment.replyTo.nickname}
            </Link>
          )}

          {/* Content or edit mode */}
          {isEditing ? (
            <div className="mt-1">
              <textarea
                ref={editRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full text-sm text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleEditSubmit();
                  }
                  if (e.key === 'Escape') {
                    handleEditCancel();
                  }
                }}
              />
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  onClick={handleEditSubmit}
                  disabled={!editContent.trim()}
                  className="text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 px-3 py-1.5 rounded-lg transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={handleEditCancel}
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-700 mt-0.5 whitespace-pre-wrap">{comment.content}</p>
          )}

          {/* Action buttons */}
          {!isEditing && (
            <div className="flex items-center gap-4 mt-1.5">
              <button
                onClick={() => onLike?.(comment.id, comment.isLiked ?? false)}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  comment.isLiked
                    ? 'text-red-500'
                    : 'text-neutral-400 hover:text-red-500'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill={comment.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
              </button>
              <button
                onClick={() => onReply?.(comment.id, comment.author.nickname)}
                className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                답글
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation overlay */}
      {showDeleteConfirm && (
        <div className="mt-3 ml-10 p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
          <p className="text-sm text-neutral-700 mb-3">이 댓글을 삭제하시겠습니까?</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteConfirm}
              className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              삭제
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
