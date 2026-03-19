'use client';
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

interface TermsSection {
  title: string;
  content: string[];
}

const termsSections: TermsSection[] = [
  {
    title: '제1장 서비스 이용 약관',
    content: [
      '이 약관은 DuckDuck(이하 "서비스")의 이용 조건 및 절차, 이용자와 서비스 제공자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.',
      '"이용자"란 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.',
      '이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.',
      '회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지를 통해 효력이 발생합니다.',
    ],
  },
  {
    title: '제2장 이용자 의무',
    content: [
      '이용자는 서비스를 이용할 때 관계 법령, 약관, 이용안내 등을 준수하여야 합니다.',
      '타인의 정보를 부정하게 사용하는 행위를 하여서는 안 됩니다.',
      '서비스의 정상적인 운영을 방해하는 행위를 하여서는 안 됩니다.',
      '다른 이용자의 개인정보를 수집, 저장, 유포하는 행위를 하여서는 안 됩니다.',
      '커뮤니티 가이드라인을 준수하고, 건전한 소통 문화에 기여해야 합니다.',
    ],
  },
  {
    title: '제3장 서비스 제공',
    content: [
      '서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다.',
      '다만, 시스템 점검, 증설 및 교체, 장애, 천재지변 등의 사유로 일시적으로 중단될 수 있습니다.',
      '회사는 서비스의 내용, 이용 방법, 이용 시간 등을 변경할 수 있으며, 변경 사항은 사전에 공지합니다.',
      '무료 서비스는 별도의 통지 없이 변경 또는 종료될 수 있습니다.',
    ],
  },
  {
    title: '제4장 지식재산권',
    content: [
      '서비스에서 제공하는 콘텐츠의 저작권 및 지식재산권은 회사에 귀속됩니다.',
      '이용자가 게시한 콘텐츠의 저작권은 해당 이용자에게 있습니다.',
      '이용자는 서비스를 통해 얻은 정보를 회사의 사전 승낙 없이 복제, 배포, 방송 등에 사용할 수 없습니다.',
      '회사는 이용자가 게시한 콘텐츠를 서비스 운영, 홍보 등의 목적으로 합리적인 범위 내에서 사용할 수 있습니다.',
    ],
  },
  {
    title: '제5장 책임 제한',
    content: [
      '회사는 천재지변, 전쟁 등 불가항력으로 인해 서비스를 제공할 수 없는 경우 책임이 면제됩니다.',
      '이용자의 귀책사유로 인한 서비스 이용 장애에 대해 회사는 책임을 지지 않습니다.',
      '회사는 이용자가 게시하는 콘텐츠의 정확성, 신뢰성에 대해 보증하지 않습니다.',
      '회사는 이용자 간 또는 이용자와 제3자 간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없습니다.',
    ],
  },
];

export default function TermsPage() {
  return (
    <MainLayout headerProps={{ title: '이용약관', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-neutral-900 mb-2">이용약관</h1>
          <p className="text-xs text-neutral-500">최종 수정일: 2026년 2월 25일</p>
          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            DuckDuck 서비스를 이용해 주셔서 감사합니다.
            본 약관은 이용자의 권리와 의무, 서비스 이용 조건을 규정합니다.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-neutral-50 rounded-xl p-4 mb-8">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">목차</h2>
          <div className="space-y-1.5">
            {termsSections.map((section, idx) => (
              <p key={idx} className="text-sm text-neutral-600">
                {section.title}
              </p>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {termsSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-semibold text-neutral-900 mb-3 pb-2 border-b border-neutral-100">
                {section.title}
              </h2>
              <div className="space-y-2.5">
                {section.content.map((paragraph, idx) => (
                  <div key={idx} className="flex gap-2.5 text-sm text-neutral-700 leading-relaxed">
                    <span className="text-neutral-300 shrink-0 mt-0.5">&#8226;</span>
                    <p>{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-neutral-100">
          <p className="text-xs text-neutral-400 leading-relaxed">
            본 약관에 대한 문의사항은 설정 &gt; 고객센터를 통해 접수해주세요.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
