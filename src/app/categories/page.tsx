'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button, Input } from '@/components/ui';
import { mockCategories, mockPosts } from '@/mocks/data';

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribedIds, setSubscribedIds] = useState<Set<number>>(new Set());

  const toggleSubscribe = useCallback((e: React.MouseEvent, categoryId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSubscribedIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return mockCategories;
    const q = searchQuery.trim().toLowerCase();
    return mockCategories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Count pinned (notice) posts per category
  const noticeCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    mockPosts.forEach((post) => {
      if (post.isPinned && post.category) {
        counts[post.category.id] = (counts[post.category.id] || 0) + 1;
      }
    });
    return counts;
  }, []);

  return (
    <MainLayout headerProps={{ title: '게시판', showSearch: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Search / Filter */}
        <div className="px-4 pt-4 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input
              placeholder="게시판 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Categories list */}
        {filteredCategories.length > 0 ? (
          <div>
            {filteredCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-neutral-900">{cat.name}</h3>
                    {(noticeCounts[cat.id] ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        공지 {noticeCounts[cat.id]}
                      </span>
                    )}
                  </div>
                  {cat.description && (
                    <p className="text-xs text-neutral-500 mt-0.5">{cat.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-neutral-400">
                      {cat.subscriberCount}명 구독
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {cat.postCount}개 게시글
                    </span>
                  </div>
                </div>
                <div className="shrink-0 ml-4">
                  <Button
                    variant={subscribedIds.has(cat.id) ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={(e) => toggleSubscribe(e, cat.id)}
                  >
                    {subscribedIds.has(cat.id) ? '구독 중' : '구독'}
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <svg className="w-10 h-10 mb-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
