/**
 * 페이지: 신고 관리 (관리자)
 * 경로: /admin/reports
 * 설명: 사용자 신고 목록을 조회하고, 처리/기각 상태를 관리하는 관리자 화면.
 *       신고 유형(스팸, 괴롭힘, 부적절), 대상, 날짜를 표시한다.
 *
 * 사용하는 API:
 *   - 없음 (현재 로컬 state로 처리)
 *
 * Mock 상태: mockReports 사용 중
 */
'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge, Button } from '@/components/ui';
import { mockReports } from '@/mocks/data';

type Report = {
  id: number;
  userId: number;
  targetType: string;
  targetId: number;
  reason: string;
  description?: string;
  status: string;
  adminId?: number;
  createdAt: string;
  resolvedAt?: string;
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);

  const handleResolve = (reportId: number) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: 'RESOLVED' as const, resolvedAt: new Date().toISOString() } : r
      )
    );
  };

  const handleDismiss = (reportId: number) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: 'DISMISSED' as const } : r
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">대기</Badge>;
      case 'RESOLVED':
        return <Badge variant="success">처리됨</Badge>;
      case 'DISMISSED':
        return <Badge variant="default">기각</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'SPAM': return '스팸';
      case 'HARASSMENT': return '괴롭힘';
      case 'INAPPROPRIATE': return '부적절한 콘텐츠';
      default: return reason;
    }
  };

  return (
    <MainLayout headerProps={{ title: '신고 관리', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {reports.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">신고 내역이 없습니다.</div>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="px-4 py-3 border-b border-neutral-100 last:border-b-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Badge>{r.targetType}</Badge>
                  {getStatusBadge(r.status)}
                </div>
                <span className="text-xs text-neutral-500">
                  {new Date(r.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <p className="text-sm text-neutral-700">
                <span className="font-medium">{getReasonLabel(r.reason)}</span>
                {r.description && <span className="text-neutral-500"> - {r.description}</span>}
              </p>
              {r.status === 'PENDING' && (
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="primary" onClick={() => handleResolve(r.id)}>
                    처리
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDismiss(r.id)}>
                    기각
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}
