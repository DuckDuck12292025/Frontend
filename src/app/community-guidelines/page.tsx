/**
 * 페이지: 커뮤니티 가이드라인
 * 경로: /community-guidelines
 * 설명: 존중, 안전, 진실성, 콘텐츠 기준, 위반 시 조치 등
 *       커뮤니티 가이드라인 전문을 표시하는 화면.
 *
 * 사용하는 API: 없음
 * Mock 상태: 없음 (정적 콘텐츠)
 */
'use client';
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

interface GuidelineSection {
  title: string;
  icon: string;
  items: string[];
}

const sections: GuidelineSection[] = [
  {
    title: '존중',
    icon: '🤝',
    items: [
      '다른 사용자를 존중하고 예의 바르게 소통해주세요.',
      '다양한 의견과 취향을 인정하고 열린 마음으로 대화해주세요.',
      '개인 공격, 비하, 차별적 발언은 허용되지 않습니다.',
    ],
  },
  {
    title: '안전',
    icon: '🛡️',
    items: [
      '타인의 개인정보를 동의 없이 공유하지 마세요.',
      '스토킹, 괴롭힘, 위협적인 행위는 엄격히 금지됩니다.',
      '미성년자 보호를 위한 정책을 준수해주세요.',
    ],
  },
  {
    title: '진실성',
    icon: '✅',
    items: [
      '의도적인 허위 정보 유포는 제한됩니다.',
      '타인을 사칭하거나 오해를 유발하는 행위를 하지 마세요.',
      '스팸, 반복적인 홍보, 광고성 게시글은 제한됩니다.',
    ],
  },
  {
    title: '콘텐츠 기준',
    icon: '📋',
    items: [
      '불법 콘텐츠의 공유 및 배포는 엄격히 금지됩니다.',
      '폭력적이거나 혐오스러운 콘텐츠는 제한됩니다.',
      '성인 콘텐츠는 적절한 태그와 경고를 포함해야 합니다.',
      '저작권을 존중하고, 출처를 명시해주세요.',
    ],
  },
  {
    title: '위반 시 조치',
    icon: '⚠️',
    items: [
      '경고: 경미한 위반 시 경고 알림이 발송됩니다.',
      '콘텐츠 삭제: 가이드라인에 위반되는 게시물은 삭제될 수 있습니다.',
      '일시 정지: 반복적인 위반 시 계정이 일시 정지됩니다.',
      '영구 정지: 심각한 위반 시 계정이 영구 정지될 수 있습니다.',
    ],
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <MainLayout headerProps={{ title: '커뮤니티 가이드라인', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-neutral-900 mb-2">커뮤니티 가이드라인</h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            DuckDuck은 모든 사용자가 안전하고 즐거운 환경에서 소통할 수 있도록 다음 가이드라인을 운영합니다.
            모든 이용자는 이 가이드라인을 준수해야 합니다.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, sectionIdx) => (
            <div key={section.title} className="border border-neutral-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-neutral-900 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                  {sectionIdx + 1}
                </div>
                <h2 className="text-base font-semibold text-neutral-900">{section.title}</h2>
              </div>
              <ul className="space-y-2.5">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex gap-2.5 text-sm text-neutral-700 leading-relaxed">
                    <span className="text-neutral-300 mt-0.5 shrink-0">&#8226;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer notice */}
        <div className="mt-8 bg-neutral-50 rounded-xl p-4">
          <p className="text-xs text-neutral-500 leading-relaxed">
            본 가이드라인은 DuckDuck 커뮤니티의 건강한 문화를 위해 수시로 업데이트될 수 있습니다.
            위반 사항을 발견하면 신고 기능을 통해 알려주세요.
          </p>
          <p className="text-xs text-neutral-400 mt-2">최종 수정일: 2026년 2월 25일</p>
        </div>
      </div>
    </MainLayout>
  );
}
