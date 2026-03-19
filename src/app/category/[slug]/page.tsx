'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui';
import { FeedList } from '@/components/features/FeedList';
import { PingCard } from '@/components/features/PingCard';
import { mockCategories, mockPosts } from '@/mocks/data';

type TabType = 'latest' | 'popular';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('latest');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNoticeOpen, setIsNoticeOpen] = useState(true);

  const category = useMemo(
    () => mockCategories.find((c) => c.slug === slug) || null,
    [slug]
  );

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = useMemo(() => {
    if (!category) return [];
    return mockPosts.filter((post) => post.category?.slug === slug);
  }, [category, slug]);

  // Notice (pinned) posts
  const noticePosts = useMemo(
    () => filteredPosts.filter((p) => p.isPinned),
    [filteredPosts]
  );

  // Regular (non-pinned) posts
  const regularPosts = useMemo(() => {
    const nonPinned = filteredPosts.filter((p) => !p.isPinned);
    switch (activeTab) {
      case 'popular':
        return [...nonPinned].sort((a, b) => b.likeCount - a.likeCount);
      case 'latest':
      default:
        return [...nonPinned].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [filteredPosts, activeTab]);

  const subscriberCount = useMemo(() => {
    if (!category) return 0;
    return isSubscribed ? category.subscriberCount + 1 : category.subscriberCount;
  }, [category, isSubscribed]);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'latest', label: '최신' },
    { key: 'popular', label: '인기' },
  ];

  if (!isLoading && !category) {
    return (
      <MainLayout showHeader={false}>
        <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
            <div className="flex items-center h-14 px-4">
              <button onClick={() => router.back()} className="p-2 -ml-2 rounded-lg hover:bg-neutral-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="ml-3 text-base font-semibold text-neutral-900">카테고리</h1>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <svg className="w-12 h-12 mb-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">카테고리를 찾을 수 없습니다</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showHeader={false}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
          <div className="flex items-center h-14 px-4">
            <button onClick={() => router.back()} className="p-2 -ml-2 rounded-lg hover:bg-neutral-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="ml-3 text-base font-semibold text-neutral-900">
              {category?.name ?? ''}
            </h1>
          </div>
        </div>

        {/* Category info */}
        {isLoading ? (
          <div className="px-4 py-6 border-b border-neutral-100 animate-pulse">
            <div className="h-4 w-48 bg-neutral-200 rounded mb-3" />
            <div className="flex items-center justify-between">
              <div className="h-3 w-32 bg-neutral-100 rounded" />
              <div className="h-8 w-16 bg-neutral-200 rounded-lg" />
            </div>
          </div>
        ) : category ? (
          <div className="px-4 py-4 border-b border-neutral-100">
            {category.description && (
              <p className="text-sm text-neutral-600 leading-relaxed">{category.description}</p>
            )}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-700">{subscriberCount}</span>명 구독
                </span>
                <span className="text-neutral-300">|</span>
                <span className="text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-700">{category.postCount}</span>개 게시글
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/compose?category=${slug}`}>
                  <Button variant="secondary" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </Button>
                </Link>
                <Button
                  variant={isSubscribed ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => setIsSubscribed(!isSubscribed)}
                >
                  {isSubscribed ? '구독 중' : '구독'}
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Collapsible notice section */}
        {noticePosts.length > 0 && !isLoading && (
          <div className="border-b border-neutral-100">
            {/* Toggle header */}
            <button
              onClick={() => setIsNoticeOpen(!isNoticeOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span className="text-sm font-semibold text-neutral-900">공지사항</span>
                <span className="text-xs text-neutral-400 font-normal">{noticePosts.length}개</span>
              </div>
              <svg
                className={`w-4 h-4 text-neutral-400 transition-transform ${isNoticeOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Notice posts (collapsible) */}
            {isNoticeOpen && (
              <div className="border-t border-neutral-100">
                {noticePosts.map((post) => (
                  <div key={post.id} className="relative bg-red-50/60">
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 rounded-r" />
                    {/* Notice badge overlay */}
                    <div className="absolute top-3 right-4 z-10">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500 text-[10px] font-bold text-white uppercase tracking-wide">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        공지
                      </span>
                    </div>
                    <PingCard post={post} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-neutral-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-neutral-900 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Feed */}
        <FeedList posts={regularPosts} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
}
