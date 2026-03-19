/**
 * 페이지: 크리에이터 구독
 * 경로: /subscribe/[userId]
 * 설명: 특정 크리에이터의 구독 티어를 선택하고 구독/변경/해지할 수 있는 화면.
 *       크리에이터 프로필, 팔로워 수, 티어별 혜택 및 가격을 표시한다.
 *
 * 사용하는 API:
 *   - 없음 (현재 로컬 state로 처리)
 *
 * Mock 상태: mockUsers, mockFanTiers 사용 중
 */
'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar, Button, Card, Badge } from '@/components/ui';
import { mockUsers, mockFanTiers } from '@/mocks/data';

export default function SubscribePage() {
  const { userId } = useParams<{ userId: string }>();
  const creator = mockUsers.find((u) => u.id === Number(userId)) || mockUsers[1];
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedTierId, setSubscribedTierId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubscribe = () => {
    if (!selectedTier) return;
    setShowConfirm(true);
  };

  const confirmSubscribe = () => {
    setIsSubscribed(true);
    setSubscribedTierId(selectedTier);
    setShowConfirm(false);
  };

  const handleUnsubscribe = () => {
    setIsSubscribed(false);
    setSubscribedTierId(null);
    setSelectedTier(null);
  };

  const selectedTierData = mockFanTiers.find((t) => t.id === selectedTier);

  return (
    <MainLayout headerProps={{ title: '구독하기', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="p-4 space-y-5">
        {/* Creator Profile Section */}
        <div className="flex flex-col items-center text-center py-6">
          <div className="relative">
            <Avatar src={creator.profile?.profileImageUrl} alt={creator.nickname} size="xl" isBlueChecked={creator.isBlueChecked} />
            {creator.role === 'PREMIUM' && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
          <h2 className="text-lg font-bold text-neutral-900 mt-3">{creator.nickname}</h2>
          <p className="text-sm text-neutral-500 mt-0.5">@{creator.handle}</p>
          {creator.profile?.bio && (
            <p className="text-sm text-neutral-600 mt-2 max-w-xs leading-relaxed">{creator.profile.bio}</p>
          )}
          <div className="flex items-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-base font-bold text-neutral-900">{creator.profile?.followerCount?.toLocaleString() ?? 0}</p>
              <p className="text-xs text-neutral-500">팔로워</p>
            </div>
            <div className="w-px h-8 bg-neutral-200" />
            <div className="text-center">
              <p className="text-base font-bold text-neutral-900">{creator.profile?.postCount ?? 0}</p>
              <p className="text-xs text-neutral-500">게시글</p>
            </div>
            <div className="w-px h-8 bg-neutral-200" />
            <div className="text-center">
              <p className="text-base font-bold text-neutral-900">{mockFanTiers.length}</p>
              <p className="text-xs text-neutral-500">구독 티어</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-neutral-200" />

        {/* Already Subscribed Banner */}
        {isSubscribed && subscribedTierId && (
          <div className="bg-neutral-900 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">구독 중</p>
                    <p className="text-xs text-neutral-300">
                      {mockFanTiers.find((t) => t.id === subscribedTierId)?.name} 구독 중입니다
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={handleUnsubscribe}>
                구독 해지
              </Button>
            </div>
          </div>
        )}

        {/* Tier Selection */}
        <div>
          <h3 className="text-base font-bold text-neutral-900 mb-1">구독 티어 선택</h3>
          <p className="text-xs text-neutral-500 mb-4">크리에이터를 응원하고 특별한 혜택을 받아보세요</p>
          <div className="space-y-3">
            {mockFanTiers.map((t, index) => {
              const isCurrentlySubscribed = isSubscribed && subscribedTierId === t.id;
              const isSelected = selectedTier === t.id;
              const isPopular = index === 1; // 두 번째 티어를 인기 표시
              return (
                <Card
                  key={t.id}
                  hoverable={!isCurrentlySubscribed}
                  onClick={() => {
                    if (!isCurrentlySubscribed) setSelectedTier(t.id);
                  }}
                  className={`p-4 relative overflow-hidden transition-all duration-200 ${
                    isCurrentlySubscribed
                      ? 'border-neutral-900 border-2 bg-neutral-50'
                      : isSelected
                        ? 'border-neutral-900 border-2 shadow-lg'
                        : ''
                  }`}
                >
                  {/* Popular tag */}
                  {isPopular && !isCurrentlySubscribed && (
                    <div className="absolute top-0 left-0 bg-neutral-900 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-br-lg">
                      인기
                    </div>
                  )}

                  {/* Selected indicator */}
                  {(isSelected || isCurrentlySubscribed) && (
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-t-neutral-900 border-l-[32px] border-l-transparent">
                      <svg className="absolute -top-[28px] right-[2px] w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isCurrentlySubscribed || isSelected ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {index === 0 ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-neutral-900">{t.name}</h3>
                          {isCurrentlySubscribed && (
                            <Badge variant="premium">현재 구독</Badge>
                          )}
                        </div>
                      </div>
                      {t.description && (
                        <p className="text-xs text-neutral-500 mt-1.5 ml-10">{t.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-xl font-bold text-neutral-900">{t.price.toLocaleString()}<span className="text-xs font-normal text-neutral-500">원</span></p>
                      <p className="text-xs text-neutral-400">/월</p>
                    </div>
                  </div>

                  {t.benefits?.items && t.benefits.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-neutral-100">
                      <p className="text-xs font-medium text-neutral-700 mb-2">혜택</p>
                      <ul className="space-y-1.5">
                        {t.benefits.items.map((b, i) => (
                          <li key={i} className="text-xs text-neutral-600 flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-neutral-900 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Subscribe Button */}
        {!isSubscribed ? (
          <div className="sticky bottom-4 pt-2">
            <Button fullWidth size="lg" disabled={!selectedTier} onClick={handleSubscribe}>
              {selectedTier
                ? `${selectedTierData?.name} - ${selectedTierData?.price.toLocaleString()}원/월 구독하기`
                : '구독 티어를 선택하세요'}
            </Button>
          </div>
        ) : (
          <div className="sticky bottom-4 pt-2">
            <Button fullWidth size="lg" variant="outline" onClick={() => {
              if (selectedTier && selectedTier !== subscribedTierId) {
                setShowConfirm(true);
              }
            }} disabled={!selectedTier || selectedTier === subscribedTierId}>
              {selectedTier && selectedTier !== subscribedTierId
                ? `${selectedTierData?.name}으로 변경하기`
                : '다른 티어를 선택하여 변경할 수 있습니다'}
            </Button>
          </div>
        )}

        {/* Safety Note */}
        <div className="flex items-start gap-2 p-3 bg-neutral-50 rounded-lg">
          <svg className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-xs text-neutral-600 font-medium">안전한 결제</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">구독은 언제든 해지할 수 있으며, 남은 기간까지 혜택이 유지됩니다.</p>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white w-full sm:max-w-sm sm:rounded-xl rounded-t-xl p-6 text-center">
            <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              {isSubscribed ? '구독 변경 확인' : '구독 확인'}
            </h3>
            <p className="text-sm text-neutral-500 mt-2">
              <span className="font-semibold text-neutral-900">{creator.nickname}</span>의{' '}
              <span className="font-semibold text-neutral-900">{selectedTierData?.name}</span>을(를)
            </p>
            <p className="text-sm text-neutral-500">
              월 <span className="font-bold text-neutral-900">{selectedTierData?.price.toLocaleString()}원</span>에 {isSubscribed ? '변경' : '구독'}하시겠습니까?
            </p>
            <div className="mt-5 space-y-2">
              <Button fullWidth onClick={confirmSubscribe}>{isSubscribed ? '변경하기' : '구독하기'}</Button>
              <Button fullWidth variant="ghost" onClick={() => setShowConfirm(false)}>취소</Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
