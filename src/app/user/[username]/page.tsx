'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar, Button, Loading } from '@/components/ui';
import { FeedList } from '@/components/features/FeedList';
import { useUserByNickname, useUserPosts, useFollow } from '@/hooks/queries';
import { useAuthStore } from '@/stores/auth';
import { mockPosts, mockQuestionTemplates } from '@/mocks/data';
import type { PostWithAuthor } from '@/types';

type TabType = 'posts' | 'premium' | 'replies' | 'media' | 'likes';

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const decodedUsername = decodeURIComponent(username);
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  const currentUser = useAuthStore((s) => s.user);

  const { data: user, isLoading: userLoading } = useUserByNickname(decodedUsername);
  const { data: postsData, isLoading: postsLoading } = useUserPosts(user?.id ?? 0);
  const followMutation = useFollow();

  // Mock: subscription state (not subscribed by default)
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Anonymous question state
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionContent, setQuestionContent] = useState('');
  const [questionTemplateId, setQuestionTemplateId] = useState(1);
  const [questionSent, setQuestionSent] = useState(false);

  const userPosts = (postsData?.pages ?? []).flatMap((page) =>
    page.items.map((p) => p as unknown as PostWithAuthor)
  );

  // Determine if this is the current user's own profile
  const isOwnProfile = currentUser?.id === user?.id;

  // Filter mock posts by user for tab content
  const filteredPosts = useMemo(() => {
    const allUserPosts = userPosts.length > 0
      ? userPosts
      : mockPosts.filter((p) => p.author.nickname === decodedUsername || p.userId === user?.id);

    switch (activeTab) {
      case 'posts':
        // Public posts only (exclude premium/subscriber-only)
        return allUserPosts.filter((p) => p.visibility === 'PUBLIC');
      case 'premium':
        // Premium posts (SUBSCRIBERS visibility) are displayed in this tab
        return allUserPosts.filter((p) => p.visibility === 'SUBSCRIBERS');
      case 'replies':
        return allUserPosts.filter((p) => p.commentCount > 0 && p.visibility === 'PUBLIC');
      case 'media':
        return allUserPosts.filter((p) => p.media && p.media.length > 0);
      case 'likes':
        return allUserPosts.filter((p) => p.isLiked);
      default:
        return allUserPosts;
    }
  }, [activeTab, userPosts, decodedUsername, user?.id]);

  const handleFollow = () => {
    if (!user) return;
    followMutation.mutate({ userId: user.id, isFollowing: user.isFollowing ?? false });
  };

  const hasPremiumContent = mockPosts.some(
    (p) => (p.userId === user?.id || p.author.nickname === decodedUsername) && p.visibility === 'SUBSCRIBERS'
  );

  const tabs: { key: TabType; label: string }[] = [
    { key: 'posts', label: '게시물' },
    ...(hasPremiumContent || user?.profile?.hasMembership
      ? [{ key: 'premium' as TabType, label: '프리미엄' }]
      : []),
    { key: 'replies', label: '답글' },
    { key: 'media', label: '미디어' },
    { key: 'likes', label: '좋아요' },
  ];

  if (userLoading) {
    return (
      <MainLayout showHeader={false}>
        <div className="flex items-center justify-center min-h-[50vh]"><Loading size="lg" /></div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout showHeader={false}>
        <div className="flex items-center justify-center min-h-[50vh] text-neutral-400 text-sm">
          사용자를 찾을 수 없습니다
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showHeader={false}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Sticky top header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
          <div className="flex items-center h-14 px-4">
            <button onClick={() => router.back()} className="p-2 -ml-2 rounded-lg hover:bg-neutral-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="ml-3">
              <h1 className="text-base font-semibold text-neutral-900">{user.nickname}</h1>
              <p className="text-xs text-neutral-500">{user.profile?.postCount ?? 0}개 게시물</p>
            </div>
          </div>
        </div>

        {/* Background image / gradient area */}
        <div className="relative">
          <div className="h-32 sm:h-40 bg-gradient-to-b from-neutral-200 to-neutral-100">
            {user.profile?.backgroundImageUrl && (
              <img src={user.profile.backgroundImageUrl} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          {/* Avatar overlapping background */}
          <div className="absolute -bottom-10 left-4">
            <Avatar src={user.profile?.profileImageUrl} alt={user.nickname} size="xl" className="border-4 border-white" />
          </div>
        </div>

        {/* Action buttons row */}
        <div className="flex justify-end items-center gap-2 px-4 pt-2 pb-2">
          {isOwnProfile ? (
            <>
              <Link href="/settings/profile">
                <Button variant="outline" size="sm">프로필 편집</Button>
              </Link>
              <Link href="/settings">
                <Button variant="secondary" size="sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* Message button */}
              <Link href="/messages">
                <Button variant="secondary" size="sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </Button>
              </Link>
              {/* Anonymous question button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setShowQuestionForm(!showQuestionForm); setQuestionSent(false); }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Button>
              {/* Subscribe button - only if user has membership */}
              {user.profile?.hasMembership && (
                <Link href={`/subscribe/${user.id}`}>
                  <Button variant="secondary" size="sm">구독</Button>
                </Link>
              )}
              {/* Follow/Following toggle */}
              <Button
                variant={user.isFollowing ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleFollow}
                disabled={followMutation.isPending}
              >
                {user.isFollowing ? '팔로잉' : '팔로우'}
              </Button>
            </>
          )}
        </div>

        {/* Anonymous question form */}
        {showQuestionForm && !isOwnProfile && (
          <div className="mx-4 mb-3 p-3 border border-neutral-200 rounded-xl bg-neutral-50/50">
            {questionSent ? (
              <div className="flex flex-col items-center py-3">
                <svg className="w-8 h-8 text-green-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-neutral-900">질문이 전송되었습니다!</p>
                <p className="text-xs text-neutral-500 mt-0.5">익명으로 전송되어 상대방에게 신원이 공개되지 않습니다</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-900">익명 질문하기</span>
                  <select
                    value={questionTemplateId}
                    onChange={(e) => setQuestionTemplateId(Number(e.target.value))}
                    className="text-xs border border-neutral-200 rounded-lg px-2 py-1 outline-none focus:border-neutral-400 bg-white text-neutral-700"
                  >
                    {mockQuestionTemplates.map((t) => (
                      <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
                  placeholder={mockQuestionTemplates.find((t) => t.id === questionTemplateId)?.placeholder ?? '질문을 입력하세요'}
                  rows={3}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 resize-none bg-white"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-neutral-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[10px]">익명으로 전송됩니다</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (questionContent.trim()) {
                        setQuestionSent(true);
                        setQuestionContent('');
                      }
                    }}
                    disabled={!questionContent.trim()}
                  >
                    질문 보내기
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Profile info section */}
        <div className="px-4 pb-4">
          {/* Name + verification badge */}
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-bold text-neutral-900">{user.nickname}</h2>
            {(user.isVerified || user.isBlueChecked) && (
              <svg className="w-5 h-5 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
              </svg>
            )}
          </div>

          {/* Handle display */}
          {user.handle && (
            <p className="text-sm text-neutral-500">@{user.handle}</p>
          )}

          {/* Bio display */}
          {user.profile?.bio && (
            <p className="text-sm text-neutral-700 mt-2 whitespace-pre-wrap">{user.profile.bio}</p>
          )}

          {/* Join date */}
          <div className="flex items-center gap-1 mt-2 text-xs text-neutral-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}</span>
          </div>

          {/* Stats row - Follower/Following counts as clickable links */}
          <div className="flex gap-4 mt-3 text-sm">
            <Link href={`/user/${username}/following`} className="hover:underline">
              <span className="font-semibold text-neutral-900">{user.profile?.followingCount ?? 0}</span>
              <span className="text-neutral-500 ml-1">팔로잉</span>
            </Link>
            <Link href={`/user/${username}/followers`} className="hover:underline">
              <span className="font-semibold text-neutral-900">{user.profile?.followerCount ?? 0}</span>
              <span className="text-neutral-500 ml-1">팔로워</span>
            </Link>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-neutral-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-neutral-900 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Feed content for active tab */}
        {activeTab === 'premium' && !isOwnProfile && !isSubscribed ? (
          /* Blurred premium content for non-subscribers */
          <div className="relative">
            {/* Blurred post previews */}
            <div className="select-none pointer-events-none" style={{ filter: 'blur(8px)' }}>
              <FeedList posts={filteredPosts} isLoading={postsLoading} />
              {filteredPosts.length === 0 && (
                <div className="px-4 py-8 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b border-neutral-100 pb-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-24 bg-neutral-200 rounded" />
                          <div className="h-3 w-full bg-neutral-100 rounded" />
                          <div className="h-3 w-3/4 bg-neutral-100 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subscribe CTA overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
              <div className="flex flex-col items-center text-center px-6 py-8 max-w-sm">
                <div className="w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">프리미엄 콘텐츠</h3>
                <p className="text-sm text-neutral-500 mb-5">
                  {user.nickname}님의 프리미엄 콘텐츠를 보려면 멤버십에 가입하세요.
                </p>
                <Link href={`/subscribe/${user.id}`}>
                  <Button size="md">
                    멤버십 가입하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <FeedList posts={filteredPosts} isLoading={postsLoading} />
        )}
      </div>
    </MainLayout>
  );
}
