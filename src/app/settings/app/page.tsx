'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui';

export default function AppSettingsPage() {
  const [theme, setTheme] = useState<'LIGHT' | 'DARK' | 'SYSTEM'>('LIGHT');
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  return (
    <MainLayout headerProps={{ title: '앱 설정', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Theme selection */}
        <div className="px-4 py-3.5 border-b border-neutral-100">
          <label className="block text-sm font-medium text-neutral-900 mb-3">테마</label>
          <div className="space-y-2">
            {([
              { value: 'LIGHT' as const, label: '라이트' },
              { value: 'DARK' as const, label: '다크' },
              { value: 'SYSTEM' as const, label: '시스템' },
            ]).map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer py-1.5"
                onClick={() => setTheme(option.value)}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  theme === option.value ? 'border-neutral-900' : 'border-neutral-300'
                }`}>
                  {theme === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                  )}
                </div>
                <span className="text-sm text-neutral-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="px-4 py-3.5 border-b border-neutral-100">
          <label className="block text-sm font-medium text-neutral-900 mb-2">언어</label>
          <div className="flex items-center gap-3 py-1.5">
            <div className="w-5 h-5 rounded-full border-2 border-neutral-900 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
            </div>
            <span className="text-sm text-neutral-900">한국어</span>
          </div>
        </div>

        {/* Cache clear */}
        <div className="px-4 py-3.5 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900">캐시 삭제</p>
              <p className="text-xs text-neutral-500 mt-0.5">임시 데이터를 삭제합니다</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleClearCache}>
              {cacheCleared ? '삭제 완료' : '캐시 삭제'}
            </Button>
          </div>
        </div>

        {/* App version */}
        <div className="px-4 py-3.5">
          <p className="text-xs text-neutral-400">앱 버전 1.0.0</p>
        </div>
      </div>
    </MainLayout>
  );
}
