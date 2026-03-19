'use client';

import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuthStore, useUser } from '@/stores/auth';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui';

// ---------------------------------------------------------------------------
// Icon components (neutral-500 stroke, 20x20)
// ---------------------------------------------------------------------------

const IconUser = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 0 1 15 0" />
  </svg>
);

const IconAccount = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const IconShield = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);

const IconHistory = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const IconCog = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const IconBookmark = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
  </svg>
);

const IconBlock = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const IconMute = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
  </svg>
);

const IconBell = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

const IconStar = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

const IconMembership = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const IconSubscription = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </svg>
);

const IconCreditCard = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </svg>
);

const IconHelp = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
  </svg>
);

const IconReport = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
  </svg>
);

const IconInfo = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);

const IconAdmin = () => (
  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
  </svg>
);

const IconChevronRight = () => (
  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const IconLogout = () => (
  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
  </svg>
);

// ---------------------------------------------------------------------------
// Section / item types
// ---------------------------------------------------------------------------

interface SettingsItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
  /** If true, only shown when user role is ADMIN */
  adminOnly?: boolean;
}

// ---------------------------------------------------------------------------
// Settings sections data
// ---------------------------------------------------------------------------

const settingsSections: SettingsSection[] = [
  {
    title: '계정',
    items: [
      { href: '/settings/profile', label: '프로필 편집', icon: <IconUser /> },
      { href: '/settings/account', label: '계정 관리', icon: <IconAccount /> },
      { href: '/settings/privacy', label: '개인정보 설정', icon: <IconShield /> },
      { href: '/settings/login-history', label: '로그인 내역', icon: <IconHistory /> },
      { href: '/settings/app', label: '앱 설정', icon: <IconCog /> },
    ],
  },
  {
    title: '콘텐츠',
    items: [
      { href: '/bookmarks', label: '북마크', icon: <IconBookmark /> },
      { href: '/settings/blocked', label: '차단 사용자', icon: <IconBlock /> },
      { href: '/settings/muted', label: '뮤트 사용자', icon: <IconMute /> },
    ],
  },
  {
    title: '알림',
    items: [
      { href: '/settings/notifications', label: '알림 설정', icon: <IconBell /> },
    ],
  },
  {
    title: '덕덕 프리미엄',
    items: [
      { href: '/premium', label: '프리미엄', icon: <IconStar /> },
    ],
  },
  {
    title: '멤버십',
    items: [
      { href: '/settings/membership', label: '멤버십 관리', icon: <IconMembership /> },
      { href: '/settings/subscriptions', label: '구독 관리', icon: <IconSubscription /> },
    ],
  },
  {
    title: '결제',
    items: [
      { href: '/settings/payment', label: '결제 수단', icon: <IconCreditCard /> },
    ],
  },
  {
    title: '지원',
    items: [
      { href: '/help', label: '도움말', icon: <IconHelp /> },
      { href: '/report', label: '문제 신고', icon: <IconReport /> },
      { href: '/about', label: '서비스 정보', icon: <IconInfo /> },
    ],
  },
  {
    title: '관리자',
    adminOnly: true,
    items: [
      { href: '/admin', label: '관리자 대시보드', icon: <IconAdmin /> },
    ],
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const router = useRouter();
  const user = useUser();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const nickname = user?.nickname ?? '사용자';
  const handle = user?.handle ?? user?.email?.split('@')[0] ?? 'user';
  const profileImage = user?.profile?.profileImageUrl ?? null;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <MainLayout headerProps={{ title: '설정', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white dark:bg-black lg:border lg:border-neutral-200 dark:lg:border-neutral-800 lg:rounded-xl">
        {/* ---- Profile Card ---- */}
        <Link
          href={`/user/${handle}`}
          className="flex items-center gap-3 px-4 py-4 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
        >
          <Avatar
            src={profileImage}
            alt={nickname}
            size="lg"
            isBlueChecked={user?.isBlueChecked}
          />
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-neutral-900 dark:text-white truncate">
              {nickname}
            </p>
            <p className="text-sm text-neutral-500 truncate">@{handle}</p>
          </div>
          <IconChevronRight />
        </Link>

        {/* ---- Grouped Sections ---- */}
        {settingsSections.map((section) => {
          if (section.adminOnly && !isAdmin) return null;

          return (
            <div key={section.title}>
              {/* Section header */}
              <div className="px-4 pt-5 pb-1.5">
                <h3 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>

              {/* Section items */}
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    {item.icon}
                  </span>
                  <span className="flex-1 text-sm text-neutral-900 dark:text-white">
                    {item.label}
                  </span>
                  <IconChevronRight />
                </Link>
              ))}

              {/* Divider */}
              <div className="mx-4 border-b border-neutral-100 dark:border-neutral-800" />
            </div>
          );
        })}

        {/* ---- Logout Button ---- */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950">
            <IconLogout />
          </span>
          <span className="text-sm font-medium text-red-600 dark:text-red-400">로그아웃</span>
        </button>

        {/* ---- App Version ---- */}
        <div className="px-4 py-4 text-center">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">v1.0.0</p>
        </div>
      </div>
    </MainLayout>
  );
}
