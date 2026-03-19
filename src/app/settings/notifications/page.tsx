/**
 * 페이지: 알림 설정
 * 경로: /settings/notifications
 * 설명: 푸시 알림 전체 활성화/비활성화 및 유형별(좋아요, 댓글, 팔로우,
 *       리포스트, 구독, 마케팅) 알림 토글을 관리하는 화면.
 *
 * 사용하는 API:
 *   - 없음 (현재 로컬 state로 처리)
 *
 * Mock 상태: mockUserSettings 사용 중
 */
'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockUserSettings } from '@/mocks/data';

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button onClick={onChange} className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-neutral-900' : 'bg-neutral-300'}`}>
    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
  </button>
);

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState(mockUserSettings);
  const toggle = (key: string) => setSettings((p) => ({ ...p, [key]: !p[key as keyof typeof p] }));

  const items = [
    { key: 'pushLike', label: '좋아요' },
    { key: 'pushComment', label: '댓글' },
    { key: 'pushFollow', label: '팔로우' },
    { key: 'pushRepost', label: '리포스트' },
    { key: 'pushSubscription', label: '구독' },
    { key: 'pushMarketing', label: '마케팅' },
  ];

  return (
    <MainLayout headerProps={{ title: '알림 설정', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-200">
          <span className="text-sm font-semibold text-neutral-900">푸시 알림</span>
          <Toggle checked={settings.pushEnabled} onChange={() => toggle('pushEnabled')} />
        </div>
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-100">
            <span className="text-sm text-neutral-700">{item.label}</span>
            <Toggle checked={settings[item.key as keyof typeof settings] as boolean} onChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
