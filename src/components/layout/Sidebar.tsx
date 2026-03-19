'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { useUser, useIsAuthenticated } from '@/stores/auth';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();

  const navItems: NavItem[] = [
    {
      href: '/',
      label: '홈',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    },
    {
      href: '/notifications',
      label: '알림',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    },
    {
      href: '/categories',
      label: '카테고리',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>,
    },
    {
      href: '/bookmarks',
      label: '북마크',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
    },
    {
      href: '/messages',
      label: '메시지',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    },
    {
      href: '/settings',
      label: '설정',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const profileHref = isAuthenticated && user
    ? `/user/${encodeURIComponent(user.nickname)}`
    : '/login';

  return (
    <aside className="hidden lg:flex flex-col w-[280px] h-screen sticky top-0 border-r border-neutral-100 bg-white py-6 px-3">
      <Link href="/" className="text-xl font-bold text-neutral-900 tracking-tight px-3 mb-8">
        DuckDuck
      </Link>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }
              `.trim()}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/compose"
        className="mx-3 mt-4 flex items-center justify-center h-10 bg-neutral-900 text-white rounded-lg font-medium text-sm hover:bg-neutral-800 transition-colors"
      >
        글쓰기
      </Link>

      {/* Profile section */}
      <Link
        href={profileHref}
        className="flex items-center gap-3 mx-3 mt-4 p-2 rounded-lg hover:bg-neutral-50 transition-colors"
      >
        <Avatar src={user?.profile?.profileImageUrl} alt={user?.nickname || ''} size="sm" />
        <div className="flex-1 min-w-0">
          {isAuthenticated && user ? (
            <>
              <p className="text-sm font-medium text-neutral-900 truncate">{user.nickname}</p>
              <p className="text-xs text-neutral-500 truncate">@{user.handle}</p>
            </>
          ) : (
            <p className="text-sm font-medium text-neutral-900">로그인</p>
          )}
        </div>
      </Link>
    </aside>
  );
};
