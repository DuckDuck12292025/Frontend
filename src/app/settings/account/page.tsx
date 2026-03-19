/**
 * 페이지: 계정 관리
 * 경로: /settings/account
 * 설명: 비밀번호 변경 및 계정 삭제 기능을 제공하는 계정 관리 화면.
 *
 * 사용하는 API:
 *   - 없음 (현재 로컬 state로 처리)
 *
 * Mock 상태: 비밀번호 변경은 로컬 검증만 수행
 */
'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button, Input } from '@/components/ui';

export default function AccountSettingsPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const handleChange = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { setMessage('비밀번호가 일치하지 않습니다'); return; }
    setMessage('비밀번호가 변경되었습니다');
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <MainLayout headerProps={{ title: '계정 관리', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        <div className="p-4 border-b border-neutral-100">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">비밀번호 변경</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input label="현재 비밀번호" type="password" value={form.currentPassword} onChange={handleChange('currentPassword')} required />
            <Input label="새 비밀번호" type="password" value={form.newPassword} onChange={handleChange('newPassword')} required />
            <Input label="비밀번호 확인" type="password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} error={message && message.includes('일치') ? message : undefined} required />
            {message && !message.includes('일치') && <p className="text-sm text-green-600">{message}</p>}
            <Button type="submit" fullWidth>변경</Button>
          </form>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-red-600 mb-2">계정 삭제</h3>
          <p className="text-xs text-neutral-500 mb-3">계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</p>
          <Button variant="danger" size="sm">계정 삭제</Button>
        </div>
      </div>
    </MainLayout>
  );
}
