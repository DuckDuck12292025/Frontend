/**
 * 페이지: 뮤트 사용자
 * 경로: /settings/muted
 * 설명: 뮤트한 사용자 목록을 표시하고, 뮤트 해제 기능을 제공하는 화면.
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

export default function MutedUsersPage() {
  const [muted, setMuted] = useState(mockUsers.slice(2));
  const unmute = (id: number) => setMuted((p) => p.filter((u) => u.id !== id));

  return (
    <MainLayout headerProps={{ title: '뮤트 사용자', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {muted.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-neutral-400 text-sm">뮤트한 사용자가 없습니다</div>
        ) : muted.map((u) => (
          <div key={u.id} className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
            <Avatar src={u.profile?.profileImageUrl} alt={u.nickname} size="sm" />
            <span className="flex-1 text-sm font-medium text-neutral-900">{u.nickname}</span>
            <Button variant="secondary" size="sm" onClick={() => unmute(u.id)}>해제</Button>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
