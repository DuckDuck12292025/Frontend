'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showActions?: boolean;
  rightAction?: React.ReactNode;
  /** Number of unread notifications (shown as badge on bell icon) */
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showSearch = true,
  showActions = true,
  rightAction,
  unreadCount = 0,
}) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
      <div className="flex items-center justify-between h-14 px-4 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="뒤로가기"
            >
              <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {title ? (
            <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
          ) : (
            <Link href="/" className="text-lg font-bold text-neutral-900 tracking-tight">
              DuckDuck
            </Link>
          )}
        </div>
        <div className="flex items-center gap-1">
          {rightAction}
          {showSearch && (
            <Link href="/search" className="p-2 rounded-lg hover:bg-neutral-100 transition-colors" aria-label="검색">
              <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          )}
          {showActions && (
            <Link href="/notifications" className="p-2 rounded-lg hover:bg-neutral-100 transition-colors relative" aria-label="알림">
              <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full leading-none">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
