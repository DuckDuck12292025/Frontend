/**
 * 컴포넌트: MainLayout
 * 설명: 전체 페이지의 공통 레이아웃. Header, Sidebar(데스크톱), RightSidebar(xl 이상),
 *       BottomNav(모바일)를 조합하여 3컬럼 레이아웃을 구성한다.
 *       showHeader, showNav, showRightSidebar props로 각 영역 표시 여부를 제어한다.
 * 사용하는 API: 없음
 * Mock 상태: 없음
 */
'use client';

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { RightSidebar } from './RightSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showNav?: boolean;
  showRightSidebar?: boolean;
  headerProps?: {
    title?: string;
    showBackButton?: boolean;
    showSearch?: boolean;
    showActions?: boolean;
    rightAction?: React.ReactNode;
    unreadCount?: number;
  };
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showNav = true,
  showRightSidebar = true,
  headerProps,
}) => {
  return (
    <div className="min-h-screen bg-white lg:bg-neutral-50">
      <div className="max-w-[1280px] mx-auto flex">
        {showNav && <Sidebar />}
        <div className="flex-1 min-w-0">
          {showHeader && <Header {...headerProps} />}
          <main className={`
            max-w-[600px] mx-auto
            ${showNav ? 'pb-16 lg:pb-0' : ''}
            lg:py-4
          `.trim()}>
            {children}
          </main>
        </div>
        {showNav && showRightSidebar && <RightSidebar />}
      </div>
      {showNav && <BottomNav />}
    </div>
  );
};
