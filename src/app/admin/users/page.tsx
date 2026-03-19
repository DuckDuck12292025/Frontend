'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar, Badge, Button, Input } from '@/components/ui';
import { mockUsers } from '@/mocks/data';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(mockUsers);

  const filteredUsers = users.filter(
    (u) =>
      u.nickname.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.handle?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuspend = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'SUSPENDED' ? 'ACTIVE' as const : 'SUSPENDED' as const }
          : u
      )
    );
  };

  const handleDelete = (userId: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <MainLayout headerProps={{ title: '사용자 관리', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Search Input */}
        <div className="p-4 border-b border-neutral-200">
          <Input
            placeholder="닉네임, 이메일, 핸들로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* User List */}
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">검색 결과가 없습니다.</div>
        ) : (
          filteredUsers.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100 last:border-b-0">
              <Avatar src={u.profile?.profileImageUrl} alt={u.nickname} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-neutral-900">{u.nickname}</span>
                  <Badge variant={u.role === 'ADMIN' ? 'danger' : u.role === 'PREMIUM' ? 'warning' : 'default'}>
                    {u.role}
                  </Badge>
                  <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'}>
                    {u.status === 'ACTIVE' ? '활성' : '정지'}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-500 truncate">{u.email}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button
                  size="sm"
                  variant={u.status === 'SUSPENDED' ? 'secondary' : 'outline'}
                  onClick={() => handleSuspend(u.id)}
                >
                  {u.status === 'SUSPENDED' ? '해제' : '정지'}
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)}>
                  삭제
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}
