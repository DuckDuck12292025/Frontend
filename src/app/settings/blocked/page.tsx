'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar, Button } from '@/components/ui';
import { mockUsers } from '@/mocks/data';

export default function BlockedUsersPage() {
  const [blocked, setBlocked] = useState(mockUsers.slice(1));
  const unblock = (id: number) => setBlocked((p) => p.filter((u) => u.id !== id));

  return (
    <MainLayout headerProps={{ title: '차단 사용자', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {blocked.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-neutral-400 text-sm">차단한 사용자가 없습니다</div>
        ) : blocked.map((u) => (
          <div key={u.id} className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
            <Avatar src={u.profile?.profileImageUrl} alt={u.nickname} size="sm" />
            <span className="flex-1 text-sm font-medium text-neutral-900">{u.nickname}</span>
            <Button variant="secondary" size="sm" onClick={() => unblock(u.id)}>해제</Button>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
