'use client';
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge, Button } from '@/components/ui';
import { mockLoginHistory } from '@/mocks/data';

export default function LoginHistoryPage() {
  return (
    <MainLayout headerProps={{ title: '로그인 내역', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Header with logout all button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-900">최근 로그인</h3>
          <Button variant="secondary" size="sm" onClick={() => alert('전체 로그아웃 처리됨')}>전체 로그아웃</Button>
        </div>

        {mockLoginHistory.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-neutral-400 text-sm">로그인 내역이 없습니다</div>
        ) : (
          mockLoginHistory.map((h) => (
            <div key={h.id} className="flex items-start gap-3 px-4 py-3 border-b border-neutral-100">
              {/* Device icon */}
              <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                {h.deviceType === 'DESKTOP' ? (
                  <svg className="w-4.5 h-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                  </svg>
                ) : (
                  <svg className="w-4.5 h-4.5 text-neutral-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-900">
                    {h.deviceType === 'DESKTOP' ? '데스크톱' : '모바일'}
                  </span>
                  <Badge variant={h.status === 'SUCCESS' ? 'success' : 'danger'}>
                    {h.status === 'SUCCESS' ? '성공' : '실패'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span>{h.location}</span>
                  <span>·</span>
                  <span>{h.ipAddress}</span>
                  <span>·</span>
                  <span>{new Date(h.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">{h.userAgent}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}
