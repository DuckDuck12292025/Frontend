/**
 * 페이지: 구독 관리
 * 경로: /settings/subscriptions
 * 설명: 내가 구독 중인 크리에이터 목록과 나를 구독하는 구독자 목록을 관리하는 화면.
 *       구독 취소 기능을 제공한다.
 *
 * 사용하는 API:
 *   - 없음 (현재 로컬 state로 처리)
 *
 * Mock 상태: mockUsers 사용 중
 */
'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar, Button } from '@/components/ui';
import { mockUsers } from '@/mocks/data';

export default function SubscriptionsPage() {
  const [mySubscriptions, setMySubscriptions] = useState(mockUsers.slice(0, 3));
  const [mySubscribers] = useState(mockUsers.slice(3));

  const cancelSubscription = (id: number) =>
    setMySubscriptions((p) => p.filter((u) => u.id !== id));

  return (
    <MainLayout headerProps={{ title: '구독 관리', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* 내 구독 */}
        <div className="px-4 py-3 border-b border-neutral-100">
          <h3 className="text-sm font-semibold text-neutral-900">내 구독</h3>
        </div>
        {mySubscriptions.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-neutral-400 text-sm">구독 중인 사용자가 없습니다</div>
        ) : (
          mySubscriptions.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
              <Avatar src={u.profile?.profileImageUrl} alt={u.nickname} size="sm" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-neutral-900 block truncate">{u.nickname}</span>
                <span className="text-xs text-neutral-500">@{u.handle || u.nickname}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={() => cancelSubscription(u.id)}>구독 취소</Button>
            </div>
          ))
        )}

        {/* 나의 구독자 */}
        <div className="px-4 py-3 border-b border-neutral-100 mt-2">
          <h3 className="text-sm font-semibold text-neutral-900">나의 구독자</h3>
        </div>
        {mySubscribers.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-neutral-400 text-sm">구독자가 없습니다</div>
        ) : (
          mySubscribers.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
              <Avatar src={u.profile?.profileImageUrl} alt={u.nickname} size="sm" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-neutral-900 block truncate">{u.nickname}</span>
                <span className="text-xs text-neutral-500">@{u.handle || u.nickname}</span>
              </div>
              <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">구독자</span>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}
