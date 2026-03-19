'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { mockCategories, mockUsers } from '@/mocks/data';

export const RightSidebar: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const trendingCategories = [...mockCategories]
    .filter((c) => c.slug !== 'notice')
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 5);

  const suggestedUsers = mockUsers.slice(0, 3);

  return (
    <aside className="hidden xl:block w-[320px] shrink-0">
      <div className="sticky top-0 h-screen overflow-y-auto py-4 pl-6 pr-2">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative mb-5">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색"
            className="w-full h-10 pl-10 pr-4 bg-neutral-100 rounded-full text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900 transition-colors"
          />
        </form>

        {/* Trending Categories */}
        <div className="bg-neutral-50 rounded-xl p-4 mb-4">
          <h3 className="text-base font-bold text-neutral-900 mb-3">인기 카테고리</h3>
          <div className="space-y-3">
            {trendingCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex items-center justify-between group"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900 group-hover:underline">
                    {cat.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    게시글 {cat.postCount}개
                  </p>
                </div>
                <span className="text-xs text-neutral-400 bg-neutral-200/60 px-2 py-0.5 rounded-full">
                  {cat.subscriberCount}명
                </span>
              </Link>
            ))}
          </div>
          <Link
            href="/categories"
            className="block mt-3 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            더 보기
          </Link>
        </div>

        {/* Suggested Users */}
        <div className="bg-neutral-50 rounded-xl p-4 mb-4">
          <h3 className="text-base font-bold text-neutral-900 mb-3">추천 유저</h3>
          <div className="space-y-3">
            {suggestedUsers.map((user) => (
              <Link
                key={user.id}
                href={`/user/${user.nickname}`}
                className="flex items-center gap-3 group"
              >
                <Avatar src={user.profile?.profileImageUrl} alt={user.nickname} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-neutral-900 truncate group-hover:underline">
                      {user.nickname}
                    </p>
                    {user.isVerified && (
                      <svg className="w-3.5 h-3.5 text-neutral-900 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 truncate">
                    {user.profile?.bio}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="shrink-0 px-3 py-1 text-xs font-medium border border-neutral-900 text-neutral-900 rounded-full hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  팔로우
                </button>
              </Link>
            ))}
          </div>
          <Link
            href="/search"
            className="block mt-3 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            더 보기
          </Link>
        </div>

        {/* Footer Links */}
        <div className="px-1 text-xs text-neutral-400 flex flex-wrap gap-x-2 gap-y-1">
          <Link href="/terms" className="hover:underline">이용약관</Link>
          <Link href="/privacy-policy" className="hover:underline">개인정보처리방침</Link>
          <Link href="/community-guidelines" className="hover:underline">커뮤니티 가이드</Link>
          <Link href="/about" className="hover:underline">소개</Link>
          <span>&copy; 2025 DuckDuck</span>
        </div>
      </div>
    </aside>
  );
};
