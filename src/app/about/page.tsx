'use client';
import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';

export default function AboutPage() {
  return (
    <MainLayout headerProps={{ title: '소개', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl p-6">
        {/* App Identity */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-neutral-900 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <span className="text-3xl font-black text-white tracking-tight">DD</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">DuckDuck</h1>
          <p className="text-sm text-neutral-500 mt-1">v1.0.0</p>
        </div>

        {/* Description */}
        <div className="text-center mb-10">
          <p className="text-base font-medium text-neutral-900 mb-2">
            애니메이션 &amp; 만화 커뮤니티 소셜 플랫폼
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed">
            DuckDuck은 애니메이션과 만화를 사랑하는 사람들이 모여
            생각과 이야기를 자유롭게 나눌 수 있는 커뮤니티 플랫폼입니다.
            건강한 팬 문화와 창작 활동을 응원합니다.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {[
            { icon: '💬', label: '실시간 소통' },
            { icon: '🎨', label: '창작 공유' },
            { icon: '📚', label: '작품 리뷰' },
            { icon: '👥', label: '팬 커뮤니티' },
          ].map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2.5 bg-neutral-50 rounded-xl px-4 py-3"
            >
              <span className="text-lg">{feature.icon}</span>
              <span className="text-sm font-medium text-neutral-900">{feature.label}</span>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="border-t border-neutral-100 pt-6 space-y-1">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">법적 고지</h2>
          {[
            { href: '/terms', label: '이용약관' },
            { href: '/privacy-policy', label: '개인정보처리방침' },
            { href: '/community-guidelines', label: '커뮤니티 가이드라인' },
            { href: '/licenses', label: '오픈소스 라이선스' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between py-2.5 group"
            >
              <span className="text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors">
                {link.label}
              </span>
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-400">&copy; 2026 DuckDuck. All rights reserved.</p>
          <p className="text-xs text-neutral-300 mt-1">Made with love for anime fans</p>
        </div>
      </div>
    </MainLayout>
  );
}
