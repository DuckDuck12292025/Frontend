/**
 * 페이지: 개인정보 설정
 * 경로: /settings/privacy
 * 설명: 활동 상태 표시, 읽음 확인 등 개인정보 관련 설정을 토글로 관리하는 화면.
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

export default function PrivacySettingsPage() {
  const [settings, setSettings] = useState(mockUserSettings);
  const toggle = (key: string) => setSettings((p) => ({ ...p, [key]: !p[key as keyof typeof p] }));

  const items = [
    { key: 'showActivityStatus', label: '활동 상태 표시', desc: '다른 사용자에게 온라인 상태를 표시합니다' },
    { key: 'showReadReceipts', label: '읽음 확인', desc: '메시지 읽음 확인을 표시합니다' },
  ];

  return (
    <MainLayout headerProps={{ title: '개인정보 설정', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-100">
            <div>
              <p className="text-sm text-neutral-900">{item.label}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
            </div>
            <Toggle checked={settings[item.key as keyof typeof settings] as boolean} onChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
