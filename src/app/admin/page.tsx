'use client';
import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui';
import { mockAdminStats } from '@/mocks/data';

const statCards = [
  { label: '전체 사용자', value: mockAdminStats.totalUsers, href: '/admin/users' },
  { label: '전체 게시글', value: mockAdminStats.totalPosts, href: '/admin/posts' },
  { label: '미처리 신고', value: mockAdminStats.pendingReports, href: '/admin/reports' },
  { label: '오늘 가입', value: mockAdminStats.newUsersToday, href: '/admin/users' },
];

const menuItems = [
  { label: '사용자 관리', href: '/admin/users' },
  { label: '게시글 관리', href: '/admin/posts' },
  { label: '신고 관리', href: '/admin/reports' },
  { label: '카테고리 관리', href: '/admin/categories' },
  { label: '카테고리 요청', href: '/admin/category-requests' },
  { label: '지원 티켓', href: '/admin/support-tickets' },
];

export default function AdminDashboardPage() {
  return (
    <MainLayout headerProps={{ title: '관리자', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((s) => (
            <Link key={s.label} href={s.href}>
              <Card className="p-4 hover:border-neutral-300 transition-colors">
                <p className="text-xs text-neutral-500">{s.label}</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{s.value.toLocaleString()}</p>
              </Card>
            </Link>
          ))}
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors">
              <span className="text-sm text-neutral-900">{item.label}</span>
              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
