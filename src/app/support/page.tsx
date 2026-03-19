'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockSupportFAQ } from '@/mocks/data';

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <MainLayout headerProps={{ title: '고객지원', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* FAQ Accordion */}
        <div className="p-4 border-b border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">자주 묻는 질문</h3>
          <div className="divide-y divide-neutral-100">
            {mockSupportFAQ.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-3 text-sm text-left text-neutral-900 cursor-pointer"
                >
                  <span className="font-medium">{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-200 shrink-0 ml-2 ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="pb-3 pl-1">
                    <p className="text-sm text-neutral-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 문의하기 Link */}
        <div className="p-4">
          <Link
            href="/support/report"
            className="flex items-center justify-between py-3 px-4 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors group"
          >
            <div>
              <span className="text-sm font-semibold text-neutral-900">문의하기</span>
              <p className="text-xs text-neutral-500 mt-0.5">버그 신고, 기능 제안, 콘텐츠 신고 등</p>
            </div>
            <svg className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
