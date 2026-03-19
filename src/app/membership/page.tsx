'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button, Card, Badge, Input, Modal } from '@/components/ui';
import { mockFanTiers } from '@/mocks/data';

interface TierFormData {
  name: string;
  price: string;
  description: string;
  benefits: string;
}

const emptyForm: TierFormData = { name: '', price: '', description: '', benefits: '' };

// Mock subscriber counts per tier
const mockSubscriberCounts: Record<number, number> = {
  1: 47,
  2: 12,
};

export default function MembershipPage() {
  const [tiers, setTiers] = useState(
    mockFanTiers.map((t) => ({ ...t }))
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTierId, setEditingTierId] = useState<number | null>(null);
  const [form, setForm] = useState<TierFormData>(emptyForm);

  const totalSubscribers = tiers.reduce((sum, t) => sum + (mockSubscriberCounts[t.id] ?? 0), 0);
  const totalRevenue = tiers.reduce(
    (sum, t) => sum + t.price * (mockSubscriberCounts[t.id] ?? 0),
    0
  );

  const handleAdd = () => {
    const benefitItems = form.benefits
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const newTier = {
      id: Date.now(),
      userId: 1,
      name: form.name,
      price: Number(form.price),
      description: form.description,
      benefits: { items: benefitItems },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTiers((prev) => [...prev, newTier]);
    setShowAddModal(false);
    setForm(emptyForm);
  };

  const openEditModal = (tierId: number) => {
    const tier = tiers.find((t) => t.id === tierId);
    if (!tier) return;
    setEditingTierId(tierId);
    setForm({
      name: tier.name,
      price: String(tier.price),
      description: tier.description || '',
      benefits: tier.benefits?.items?.join('\n') || '',
    });
  };

  const handleEdit = () => {
    if (editingTierId === null) return;
    const benefitItems = form.benefits
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    setTiers((prev) =>
      prev.map((t) =>
        t.id === editingTierId
          ? {
              ...t,
              name: form.name,
              price: Number(form.price),
              description: form.description,
              benefits: { items: benefitItems },
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    setEditingTierId(null);
    setForm(emptyForm);
  };

  const toggleActive = (tierId: number) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId ? { ...t, isActive: !t.isActive, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingTierId(null);
    setForm(emptyForm);
  };

  const isModalOpen = showAddModal || editingTierId !== null;
  const modalTitle = editingTierId !== null ? '티어 수정' : '새 티어 추가';

  return (
    <MainLayout headerProps={{ title: '멤버십 관리', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="p-4 space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <p className="text-lg font-bold text-neutral-900">{tiers.length}</p>
            <p className="text-xs text-neutral-500">전체 티어</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-lg font-bold text-neutral-900">{totalSubscribers}</p>
            <p className="text-xs text-neutral-500">구독자</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-lg font-bold text-neutral-900">{(totalRevenue / 10000).toFixed(1)}<span className="text-xs font-normal text-neutral-500">만</span></p>
            <p className="text-xs text-neutral-500">월 수익</p>
          </Card>
        </div>

        {/* Add Button */}
        <Button fullWidth variant="secondary" onClick={() => setShowAddModal(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 구독 티어 추가
        </Button>

        {/* Tier Cards */}
        <div className="space-y-3">
          {tiers.map((t) => {
            const subscriberCount = mockSubscriberCounts[t.id] ?? 0;
            const monthlyRevenue = t.price * subscriberCount;
            return (
              <Card key={t.id} className={`overflow-hidden ${!t.isActive ? 'opacity-60' : ''}`}>
                {/* Tier Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-neutral-900">{t.name}</h3>
                        <Badge variant={t.isActive ? 'success' : 'default'}>
                          {t.isActive ? '활성' : '비활성'}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-neutral-900 mt-1">
                        {t.price.toLocaleString()}원
                        <span className="text-xs font-normal text-neutral-500">/월</span>
                      </p>
                      {t.description && (
                        <p className="text-xs text-neutral-500 mt-1">{t.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Subscriber Stats */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-xs text-neutral-600">
                        <span className="font-semibold text-neutral-900">{subscriberCount}</span>명 구독 중
                      </span>
                    </div>
                    <div className="w-px h-4 bg-neutral-200" />
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-neutral-600">
                        월 <span className="font-semibold text-neutral-900">{monthlyRevenue.toLocaleString()}</span>원
                      </span>
                    </div>
                  </div>

                  {/* Benefits */}
                  {t.benefits?.items && t.benefits.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-neutral-100">
                      <p className="text-xs font-medium text-neutral-500 mb-1.5">혜택</p>
                      <ul className="space-y-1">
                        {t.benefits.items.map((b, i) => (
                          <li key={i} className="text-xs text-neutral-600 flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-neutral-900 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => openEditModal(t.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    수정
                  </button>
                  <div className="w-px bg-neutral-100" />
                  <button
                    type="button"
                    onClick={() => toggleActive(t.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                      t.isActive
                        ? 'text-neutral-500 hover:bg-neutral-50'
                        : 'text-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    {t.isActive ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        비활성화
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        활성화
                      </>
                    )}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>

        {tiers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-sm text-neutral-500">아직 구독 티어가 없습니다</p>
            <p className="text-xs text-neutral-400 mt-1">첫 번째 구독 티어를 만들어보세요</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        <div className="space-y-3">
          <Input
            label="이름"
            placeholder="예: 기본 구독"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <Input
            label="가격 (원/월)"
            type="number"
            placeholder="예: 5000"
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
          />
          <Input
            label="설명"
            placeholder="티어에 대한 간단한 설명"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              혜택 (줄바꿈으로 구분)
            </label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2.5 rounded-lg text-sm bg-white text-neutral-900 placeholder:text-neutral-400 border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none resize-y"
              placeholder={'모든 게시글 열람\n댓글 작성\n전용 컨텐츠'}
              value={form.benefits}
              onChange={(e) => setForm((p) => ({ ...p, benefits: e.target.value }))}
            />
          </div>
          <Button
            fullWidth
            onClick={editingTierId !== null ? handleEdit : handleAdd}
            disabled={!form.name || !form.price}
          >
            {editingTierId !== null ? '수정 완료' : '추가'}
          </Button>
          {editingTierId !== null && (
            <Button fullWidth variant="ghost" onClick={closeModal}>
              취소
            </Button>
          )}
        </div>
      </Modal>
    </MainLayout>
  );
}
