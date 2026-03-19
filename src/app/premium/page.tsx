'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button, Card, Badge } from '@/components/ui';

const plans = [
  { id: 'monthly', name: '월간', price: 9900, period: '월', pricePerMonth: 9900 },
  { id: 'yearly', name: '연간', price: 99000, period: '년', discount: '17% 할인', pricePerMonth: 8250 },
];

interface FeatureRow {
  name: string;
  free: string | boolean;
  premium: string | boolean;
}

const comparisonFeatures: FeatureRow[] = [
  { name: '게시글 작성', free: true, premium: true },
  { name: '댓글 작성', free: true, premium: true },
  { name: '팔로우/팔로잉', free: true, premium: true },
  { name: '광고', free: '있음', premium: '없음' },
  { name: '게시글 길이', free: '300자', premium: '5,000자' },
  { name: '미디어 업로드', free: '720p', premium: '4K 고화질' },
  { name: '프로필 배지', free: false, premium: true },
  { name: '프리미엄 전용 콘텐츠', free: false, premium: true },
  { name: '북마크 폴더', free: '3개', premium: '무제한' },
  { name: '고객 지원', free: '일반', premium: '우선 응대' },
];

const premiumHighlights = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    title: '광고 제거',
    desc: '광고 없는 깨끗한 피드',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: '프로필 배지',
    desc: '프리미엄 회원 인증 배지',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: '긴 게시글',
    desc: '최대 5,000자까지 작성',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: '고화질 미디어',
    desc: '4K 이미지 및 동영상 지원',
  },
];

export default function PremiumPage() {
  const [selected, setSelected] = useState('yearly');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const selectedPlan = plans.find((p) => p.id === selected);

  return (
    <MainLayout headerProps={{ title: '프리미엄', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">DuckDuck 프리미엄</h2>
          <p className="text-sm text-neutral-500 mt-2">더 나은 경험을 위한 프리미엄 구독</p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-3">
          {premiumHighlights.map((h) => (
            <div key={h.title} className="bg-neutral-50 rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-white border border-neutral-200 rounded-lg flex items-center justify-center mx-auto text-neutral-900">
                {h.icon}
              </div>
              <p className="text-sm font-semibold text-neutral-900 mt-2.5">{h.title}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Plan Selection */}
        <div>
          <h3 className="text-base font-bold text-neutral-900 mb-3">플랜 선택</h3>
          <div className="grid grid-cols-2 gap-3">
            {plans.map((p) => (
              <Card
                key={p.id}
                hoverable
                onClick={() => setSelected(p.id)}
                className={`p-4 text-center relative overflow-hidden transition-all duration-200 ${
                  selected === p.id ? 'border-neutral-900 border-2 shadow-md' : ''
                }`}
              >
                {p.discount && (
                  <div className="absolute top-0 right-0 bg-neutral-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-bl-lg">
                    {p.discount}
                  </div>
                )}
                {selected === p.id && (
                  <div className="absolute top-2 left-2">
                    <div className="w-5 h-5 bg-neutral-900 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
                <p className="text-sm font-medium text-neutral-900 mt-1">{p.name}</p>
                <p className="text-2xl font-bold text-neutral-900 mt-2">
                  {p.price.toLocaleString()}
                  <span className="text-xs font-normal text-neutral-500">원/{p.period}</span>
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  월 {p.pricePerMonth.toLocaleString()}원
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div>
          <h3 className="text-base font-bold text-neutral-900 mb-3">무료 vs 프리미엄</h3>
          <Card className="overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-neutral-50 border-b border-neutral-200">
              <div className="px-3 py-2.5 text-xs font-semibold text-neutral-500">기능</div>
              <div className="px-3 py-2.5 text-xs font-semibold text-neutral-500 text-center">무료</div>
              <div className="px-3 py-2.5 text-xs font-semibold text-neutral-900 text-center bg-neutral-100">
                <Badge variant="premium">프리미엄</Badge>
              </div>
            </div>
            {/* Table Rows */}
            {comparisonFeatures.map((f, idx) => (
              <div
                key={f.name}
                className={`grid grid-cols-3 ${
                  idx < comparisonFeatures.length - 1 ? 'border-b border-neutral-100' : ''
                }`}
              >
                <div className="px-3 py-2.5 text-xs text-neutral-700">{f.name}</div>
                <div className="px-3 py-2.5 text-center">
                  {typeof f.free === 'boolean' ? (
                    f.free ? (
                      <svg className="w-4 h-4 text-neutral-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-neutral-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )
                  ) : (
                    <span className="text-xs text-neutral-500">{f.free}</span>
                  )}
                </div>
                <div className="px-3 py-2.5 text-center bg-neutral-50/50">
                  {typeof f.premium === 'boolean' ? (
                    f.premium ? (
                      <svg className="w-4 h-4 text-neutral-900 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-neutral-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )
                  ) : (
                    <span className="text-xs font-medium text-neutral-900">{f.premium}</span>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Subscribe Button */}
        <div className="sticky bottom-4 pt-2">
          {!isSubscribed ? (
            <Button fullWidth size="lg" onClick={() => setIsSubscribed(true)}>
              {selectedPlan
                ? `${selectedPlan.name} ${selectedPlan.price.toLocaleString()}원으로 시작하기`
                : '구독하기'}
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="bg-neutral-900 text-white rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">프리미엄 활성화됨</p>
                    <p className="text-xs text-neutral-300">{selectedPlan?.name} 플랜</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setIsSubscribed(false)}>
                  해지
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-neutral-400 pb-4">
          구독은 언제든 해지할 수 있습니다. 결제 후 7일 이내 환불 가능.
        </p>
      </div>
    </MainLayout>
  );
}
