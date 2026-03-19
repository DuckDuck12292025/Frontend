/**
 * 컴포넌트: AuthLayout
 * 설명: 로그인, 회원가입, 비밀번호 찾기 등 인증 관련 페이지의 공통 레이아웃.
 *       중앙 정렬된 카드 형태로 DuckDuck 로고, 제목, 뒤로가기 버튼을 제공한다.
 * 사용하는 API: 없음
 * Mock 상태: 없음
 */
'use client';
import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, showBackButton, title }) => (
  <div className="min-h-dvh flex flex-col bg-white">
    <header className="flex items-center h-12 px-4">
      {showBackButton && (
        <Link href="/login" className="p-1 text-neutral-500 hover:text-neutral-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      )}
    </header>
    <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-neutral-900 tracking-tight">DuckDuck</Link>
          {title && <p className="text-sm text-neutral-500 mt-2">{title}</p>}
        </div>
        {children}
      </div>
    </main>
  </div>
);
