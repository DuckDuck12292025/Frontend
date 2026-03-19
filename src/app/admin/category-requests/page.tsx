'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge, Button } from '@/components/ui';
import { mockBoardApplications } from '@/mocks/data';

type BoardApplication = {
  id: number;
  userId: number;
  boardName: string;
  boardDescription: string;
  requestReason: string;
  status: string;
  adminId?: number;
  createdAt: string;
  processedAt?: string;
};

export default function AdminCategoryRequestsPage() {
  const [applications, setApplications] = useState<BoardApplication[]>(mockBoardApplications);

  const handleApprove = (appId: number) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? { ...a, status: 'APPROVED' as const, adminId: 1, processedAt: new Date().toISOString() }
          : a
      )
    );
  };

  const handleReject = (appId: number) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? { ...a, status: 'REJECTED' as const, adminId: 1, processedAt: new Date().toISOString() }
          : a
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">대기</Badge>;
      case 'APPROVED':
        return <Badge variant="success">승인</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">거절</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <MainLayout headerProps={{ title: '카테고리 요청', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {applications.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">카테고리 요청이 없습니다.</div>
        ) : (
          applications.map((a) => (
            <div key={a.id} className="px-4 py-3 border-b border-neutral-100 last:border-b-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-neutral-900">{a.boardName}</span>
                {getStatusBadge(a.status)}
              </div>
              {a.boardDescription && (
                <p className="text-sm text-neutral-600">{a.boardDescription}</p>
              )}
              {a.requestReason && (
                <p className="text-xs text-neutral-500 mt-1">사유: {a.requestReason}</p>
              )}
              <p className="text-xs text-neutral-400 mt-1">
                {new Date(a.createdAt).toLocaleDateString('ko-KR')}
              </p>
              {a.status === 'PENDING' && (
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={() => handleApprove(a.id)}>승인</Button>
                  <Button size="sm" variant="ghost" onClick={() => handleReject(a.id)}>거절</Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}
