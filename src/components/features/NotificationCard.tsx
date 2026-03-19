'use client';

import React from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import type { NotificationWithSender } from '@/types';

interface NotificationCardProps {
  notification: NotificationWithSender;
  onRead?: (id: number) => void;
}

const notificationMessages: Record<string, string> = {
  LIKE: '님이 회원님의 게시물을 좋아합니다',
  COMMENT: '님이 댓글을 남겼습니다',
  FOLLOW: '님이 회원님을 팔로우합니다',
  REPOST: '님이 회원님의 게시물을 리포스트했습니다',
  MENTION: '님이 회원님을 언급했습니다',
};

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case 'LIKE':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      );
    case 'COMMENT':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" />
        </svg>
      );
    case 'FOLLOW':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
        </svg>
      );
    case 'REPOST':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      );
    case 'MENTION':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      );
  }
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return date.toLocaleDateString('ko-KR');
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onRead }) => {
  const handleClick = () => {
    if (!notification.isRead) onRead?.(notification.id);
  };

  const contentPreview = notification.message && notification.type !== 'FOLLOW'
    ? truncate(notification.message, 50)
    : null;

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 px-4 py-3 border-b transition-colors cursor-pointer hover:bg-neutral-50 ${
        notification.isRead
          ? 'border-neutral-100 bg-white'
          : 'border-neutral-200 bg-neutral-50'
      }`}
    >
      {/* Avatar with type icon badge */}
      <div className="relative shrink-0">
        {notification.sender && (
          <Link href={`/user/${notification.sender.nickname}`}>
            <Avatar src={notification.sender.profile?.profileImageUrl} alt={notification.sender.nickname} size="sm" />
          </Link>
        )}
        <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white ring-2 ring-white">
          <NotificationIcon type={notification.type} />
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${notification.isRead ? 'text-neutral-500' : 'text-neutral-800'}`}>
          {notification.sender && (
            <Link href={`/user/${notification.sender.nickname}`} className={`font-bold hover:underline ${notification.isRead ? 'text-neutral-700' : 'text-neutral-900'}`}>
              {notification.sender.nickname}
            </Link>
          )}
          <span>{notificationMessages[notification.type] || notification.message}</span>
        </p>

        {/* Content preview */}
        {contentPreview && (
          <p className={`text-xs mt-1 leading-relaxed line-clamp-1 ${notification.isRead ? 'text-neutral-400' : 'text-neutral-500'}`}>
            &ldquo;{contentPreview}&rdquo;
          </p>
        )}

        {/* Timestamp */}
        <p className={`text-xs mt-1 ${notification.isRead ? 'text-neutral-300' : 'text-neutral-400'}`}>
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 shrink-0 mt-2" />
      )}
    </div>
  );
};
