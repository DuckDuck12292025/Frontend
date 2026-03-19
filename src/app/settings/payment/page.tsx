'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, Button } from '@/components/ui';
import { mockPayments } from '@/mocks/data';

interface PaymentMethod {
  id: number;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export default function PaymentSettingsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: 1, brand: 'VISA', last4: '1234', expiry: '12/27', isDefault: true },
    { id: 2, brand: 'Mastercard', last4: '5678', expiry: '06/28', isDefault: false },
  ]);

  const deleteMethod = (id: number) => {
    setMethods((p) => {
      const filtered = p.filter((m) => m.id !== id);
      if (filtered.length > 0 && !filtered.some((m) => m.isDefault)) {
        filtered[0].isDefault = true;
      }
      return [...filtered];
    });
  };

  const setDefault = (id: number) => {
    setMethods((p) =>
      p.map((m) => ({ ...m, isDefault: m.id === id }))
    );
  };

  return (
    <MainLayout headerProps={{ title: '결제 수단', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Payment methods */}
        <div className="px-4 py-3 border-b border-neutral-100">
          <h3 className="text-sm font-semibold text-neutral-900">등록된 결제 수단</h3>
        </div>

        {methods.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-neutral-400 text-sm">등록된 결제 수단이 없습니다</div>
        ) : (
          methods.map((m) => (
            <div key={m.id} className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
              <div className="w-10 h-7 rounded bg-neutral-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900">{m.brand} •••• {m.last4}</span>
                  {m.isDefault && (
                    <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">기본</span>
                  )}
                </div>
                <p className="text-xs text-neutral-500">만료 {m.expiry}</p>
              </div>
              <div className="flex items-center gap-2">
                {!m.isDefault && (
                  <button onClick={() => setDefault(m.id)} className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
                    기본으로
                  </button>
                )}
                <button onClick={() => deleteMethod(m.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">
                  삭제
                </button>
              </div>
            </div>
          ))
        )}

        <div className="px-4 py-3">
          <Button variant="secondary" fullWidth>결제 수단 추가</Button>
        </div>

        {/* Payment history */}
        <div className="px-4 py-3 border-t border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">결제 내역</h3>
          {mockPayments.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0">
              <div>
                <p className="text-sm text-neutral-900">{p.paymentType === 'PREMIUM' ? '프리미엄 구독' : '팬 구독'}</p>
                <p className="text-xs text-neutral-500">{new Date(p.createdAt).toLocaleDateString('ko-KR')}</p>
              </div>
              <span className="text-sm font-medium text-neutral-900">{p.amount.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
