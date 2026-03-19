/**
 * 페이지: 검색
 * 경로: /search
 * 설명: 게시글, 사용자, 카테고리를 키워드로 검색하는 화면.
 *       추천 검색어를 제공하고, 탭별로 검색 결과를 표시한다.
 *
 * 사용하는 API:
 *   - 없음 (현재 로컬 필터링으로 처리)
 *
 * Mock 상태: mockPosts, mockUsers, mockCategories 사용 중
 */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { FeedList } from '@/components/features/FeedList';
import { UserCard } from '@/components/features/UserCard';
import { mockPosts, mockUsers, mockCategories } from '@/mocks/data';

type SearchTab = 'posts' | 'users' | 'categories';

const TRENDING_SEARCHES = ['개발', '디자인', 'React', 'Next.js'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('posts');

  const lowerQuery = query.toLowerCase();

  const filteredPosts = query
    ? mockPosts.filter((p) => p.content.toLowerCase().includes(lowerQuery))
    : [];

  const filteredUsers = query
    ? mockUsers.filter((u) => u.nickname.toLowerCase().includes(lowerQuery))
    : [];

  const filteredCategories = query
    ? mockCategories.filter((c) => c.name.toLowerCase().includes(lowerQuery))
    : [];

  const tabs: { key: SearchTab; label: string; count: number }[] = [
    { key: 'posts', label: '게시글', count: filteredPosts.length },
    { key: 'users', label: '사용자', count: filteredUsers.length },
    { key: 'categories', label: '카테고리', count: filteredCategories.length },
  ];

  const renderTabContent = () => {
    if (!query) return null;

    switch (activeTab) {
      case 'posts':
        return filteredPosts.length > 0 ? (
          <FeedList posts={filteredPosts} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <p className="text-sm font-medium">&quot;{query}&quot;에 대한 게시글이 없습니다</p>
            <p className="text-xs mt-1">다른 검색어를 시도해보세요</p>
          </div>
        );

      case 'users':
        return filteredUsers.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} showFollowButton />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <p className="text-sm font-medium">&quot;{query}&quot;에 대한 사용자가 없습니다</p>
            <p className="text-xs mt-1">닉네임으로 검색해보세요</p>
          </div>
        );

      case 'categories':
        return filteredCategories.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {filteredCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 font-semibold text-sm">
                  #
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-neutral-500 truncate">{cat.description}</p>
                  )}
                  <p className="text-xs text-neutral-400 mt-0.5">
                    게시글 {cat.postCount}개 · 구독자 {cat.subscriberCount}명
                  </p>
                </div>
                <svg className="w-4 h-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
            </svg>
            <p className="text-sm font-medium">&quot;{query}&quot;에 대한 카테고리가 없습니다</p>
            <p className="text-xs mt-1">다른 키워드로 검색해보세요</p>
          </div>
        );
    }
  };

  return (
    <MainLayout headerProps={{ title: '검색', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Search input */}
        <div className="px-4 py-3 border-b border-neutral-100">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요..."
            className="w-full h-10 px-4 rounded-full bg-neutral-100 text-sm outline-none placeholder:text-neutral-400 focus:ring-1 focus:ring-neutral-900"
            autoFocus
          />
        </div>

        {query ? (
          <>
            {/* Tabs */}
            <div className="flex border-b border-neutral-100">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3 text-sm font-medium text-center transition-colors relative ${
                    activeTab === tab.key
                      ? 'text-neutral-900'
                      : 'text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  {tab.label}
                  {query && (
                    <span className={`ml-1 text-xs ${activeTab === tab.key ? 'text-neutral-900' : 'text-neutral-300'}`}>
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-neutral-900 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {renderTabContent()}
          </>
        ) : (
          /* Trending / recent searches when no query */
          <div className="px-4 py-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">추천 검색어</h3>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-full bg-neutral-100 text-sm text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
              <svg className="w-16 h-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <p className="text-sm">검색어를 입력해주세요</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
