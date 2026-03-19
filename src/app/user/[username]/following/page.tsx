'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { UserCard } from '@/components/features/UserCard';
import { mockUsers } from '@/mocks/data';

export default function FollowingPage() {
  const { username } = useParams<{ username: string }>();
  const decodedUsername = decodeURIComponent(username);
  const title = `${decodedUsername}님의 팔로잉`;

  const [isLoading, setIsLoading] = useState(true);
  // Following users start as "followed" by default
  const [followingSet, setFollowingSet] = useState<Set<number>>(new Set());

  // Mock following: first two users
  const following = mockUsers.slice(0, 2);

  // Simulate loading & initialize follow state
  useEffect(() => {
    const timer = setTimeout(() => {
      setFollowingSet(new Set(following.map((u) => u.id)));
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleFollow = (userId: number) => {
    setFollowingSet((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  return (
    <MainLayout
      headerProps={{
        title,
        showBackButton: true,
        showSearch: false,
        showActions: false,
      }}
    >
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Desktop header (mobile uses MainLayout Header) */}
        <div className="hidden lg:block sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-neutral-100 rounded-t-xl">
          <div className="flex items-center h-14 px-4">
            <h1 className="text-base font-semibold text-neutral-900">{title}</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="divide-y divide-neutral-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                <div className="w-10 h-10 bg-neutral-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-24" />
                  <div className="h-3 bg-neutral-100 rounded w-36" />
                </div>
                <div className="h-8 w-20 bg-neutral-200 rounded-lg" />
              </div>
            ))}
          </div>
        ) : following.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-12 h-12 text-neutral-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-neutral-400 text-sm">팔로잉이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {following.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                showFollowButton
                isFollowing={followingSet.has(u.id)}
                onFollow={handleFollow}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
