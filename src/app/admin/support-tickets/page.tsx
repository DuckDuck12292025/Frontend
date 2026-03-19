'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge, Button } from '@/components/ui';

const initialTickets = [
  { id: 1, subject: '로그인이 안 됩니다', status: 'OPEN' as const, user: '사용자1', description: '이메일 로그인 시 오류가 발생합니다.', createdAt: new Date().toISOString() },
  { id: 2, subject: '게시글이 삭제되었습니다', status: 'IN_PROGRESS' as const, user: '사용자2', description: '작성한 게시글이 갑자기 사라졌습니다.', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, subject: '프리미엄 결제 오류', status: 'RESOLVED' as const, user: '사용자3', description: '결제가 완료되었지만 프리미엄이 적용되지 않았습니다.', createdAt: new Date(Date.now() - 172800000).toISOString() },
];

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export default function AdminSupportTicketsPage() {
  const [tickets, setTickets] = useState(initialTickets);

  const handleStatusChange = (ticketId: number, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: newStatus } : t
      )
    );
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="warning">접수</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="info">처리 중</Badge>;
      case 'RESOLVED':
        return <Badge variant="success">완료</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getNextAction = (status: TicketStatus): { label: string; nextStatus: TicketStatus } | null => {
    switch (status) {
      case 'OPEN':
        return { label: '처리 시작', nextStatus: 'IN_PROGRESS' };
      case 'IN_PROGRESS':
        return { label: '처리 완료', nextStatus: 'RESOLVED' };
      default:
        return null;
    }
  };

  return (
    <MainLayout headerProps={{ title: '지원 티켓', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {tickets.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">지원 티켓이 없습니다.</div>
        ) : (
          tickets.map((t) => {
            const action = getNextAction(t.status);
            return (
              <div key={t.id} className="px-4 py-3 border-b border-neutral-100 last:border-b-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-900">{t.subject}</span>
                  {getStatusBadge(t.status)}
                </div>
                <p className="text-sm text-neutral-600 mb-1">{t.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 text-xs text-neutral-500">
                    <span>{t.user}</span>
                    <span>·</span>
                    <span>{new Date(t.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                  {action && (
                    <Button
                      size="sm"
                      variant={t.status === 'OPEN' ? 'primary' : 'secondary'}
                      onClick={() => handleStatusChange(t.id, action.nextStatus)}
                    >
                      {action.label}
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </MainLayout>
  );
}
