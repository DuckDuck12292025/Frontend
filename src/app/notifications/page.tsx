'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { NotificationCard } from '@/components/features/NotificationCard';
import { mockNotifications } from '@/mocks/data';
import type { NotificationWithSender } from '@/types';

type FilterTab = '전체' | '좋아요' | '댓글' | '팔로우' | '리포스트' | '멘션';

const filterTabs: FilterTab[] = ['전체', '좋아요', '댓글', '팔로우', '리포스트', '멘션'];

const filterToType: Record<FilterTab, string | null> = {
  '전체': null,
  '좋아요': 'LIKE',
  '댓글': 'COMMENT',
  '팔로우': 'FOLLOW',
  '리포스트': 'REPOST',
  '멘션': 'MENTION',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationWithSender[]>(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('전체');

  const filteredNotifications = useMemo(() => {
    const typeFilter = filterToType[activeFilter];
    if (!typeFilter) return notifications;
    return notifications.filter((n) => n.type === typeFilter);
  }, [notifications, activeFilter]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const handleMarkAsRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const headerRight = unreadCount > 0 ? (
    <button
      onClick={handleMarkAllAsRead}
      className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors whitespace-nowrap"
    >
      모두 읽음
    </button>
  ) : undefined;

  return (
    <MainLayout headerProps={{ title: '알림', showBackButton: true, showSearch: false, rightAction: headerRight }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl overflow-hidden">
        {/* Filter Tabs */}
        <div className="border-b border-neutral-200 overflow-x-auto scrollbar-hide">
          <div className="flex px-2">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-neutral-900'
                      : 'text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-neutral-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification List */}
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-4 text-neutral-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <p className="text-sm font-medium text-neutral-500">알림이 없습니다</p>
            <p className="text-xs text-neutral-400 mt-1">
              {activeFilter === '전체' ? '새로운 알림이 오면 여기에 표시됩니다' : `${activeFilter} 알림이 없습니다`}
            </p>
          </div>
        ) : (
          <div>
            {filteredNotifications.map((n) => (
              <NotificationCard key={n.id} notification={n} onRead={handleMarkAsRead} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
