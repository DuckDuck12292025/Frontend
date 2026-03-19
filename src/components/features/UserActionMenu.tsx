'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBlockStore } from '@/stores/block';
import { useMuteStore } from '@/stores/mute';
import { useAuthStore } from '@/stores/auth';

interface UserActionMenuProps {
  postId: number;
  authorId: number;
  onEdit?: (postId: number) => void;
  onDelete?: (postId: number) => void;
  onReport?: (postId: number) => void;
}

export const UserActionMenu: React.FC<UserActionMenuProps> = ({
  postId,
  authorId,
  onEdit,
  onDelete,
  onReport,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentUser = useAuthStore((state) => state.user);
  const { isBlocked, toggleBlock } = useBlockStore();
  const { isMuted, toggleMute } = useMuteStore();

  const isOwnPost = currentUser?.id === authorId;
  const isAdmin = currentUser?.role === 'ADMIN';
  const blocked = isBlocked(authorId);
  const muted = isMuted(authorId);

  const [adminActionDone, setAdminActionDone] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        aria-label="더보기"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg z-40 py-1 overflow-hidden">
          {/* Admin action feedback */}
          {adminActionDone && (
            <div className="flex items-center gap-2 px-4 py-2.5 text-sm text-green-700 bg-green-50">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {adminActionDone}
            </div>
          )}

          {isOwnPost ? (
            <>
              <button
                onClick={() => handleAction(() => onEdit?.(postId))}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                수정하기
              </button>
              <button
                onClick={() => handleAction(() => onDelete?.(postId))}
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
                onClick={() => handleAction(() => toggleMute(authorId))}
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
                onClick={() => handleAction(() => toggleBlock(authorId))}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                {blocked ? '차단 해제' : '차단하기'}
              </button>
              <div className="my-1 border-t border-neutral-100" />
              <button
                onClick={() => handleAction(() => onReport?.(postId))}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                신고하기
              </button>
            </>
          )}

          {/* Admin-only actions */}
          {isAdmin && (
            <>
              <div className="my-1 border-t border-neutral-100" />
              <div className="px-4 py-1.5">
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">관리자</span>
              </div>
              {/* Pin/Unpin post */}
              <button
                onClick={() => {
                  setAdminActionDone('게시글이 고정되었습니다');
                  setTimeout(() => { setAdminActionDone(null); setIsOpen(false); }, 1200);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-amber-50 transition-colors text-left"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                공지로 고정
              </button>
              {/* Hide post */}
              <button
                onClick={() => {
                  setAdminActionDone('게시글이 숨김 처리되었습니다');
                  setTimeout(() => { setAdminActionDone(null); setIsOpen(false); }, 1200);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-amber-50 transition-colors text-left"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                게시글 숨기기
              </button>
              {/* Admin delete */}
              {!isOwnPost && (
                <button
                  onClick={() => {
                    onDelete?.(postId);
                    setAdminActionDone('게시글이 삭제되었습니다');
                    setTimeout(() => { setAdminActionDone(null); setIsOpen(false); }, 1200);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  게시글 삭제 (관리자)
                </button>
              )}
              {/* Warn user */}
              {!isOwnPost && (
                <button
                  onClick={() => {
                    setAdminActionDone('경고가 전송되었습니다');
                    setTimeout(() => { setAdminActionDone(null); setIsOpen(false); }, 1200);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors text-left"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  사용자 경고
                </button>
              )}
              {/* Suspend user */}
              {!isOwnPost && (
                <button
                  onClick={() => {
                    setAdminActionDone('사용자가 정지되었습니다');
                    setTimeout(() => { setAdminActionDone(null); setIsOpen(false); }, 1200);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  사용자 정지
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
