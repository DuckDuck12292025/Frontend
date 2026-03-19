'use client';
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

interface PolicySection {
  title: string;
  content: string[];
}

const policySections: PolicySection[] = [
  {
    title: '1. 수집하는 정보',
    content: [
      '서비스는 회원가입 및 서비스 이용을 위해 다음과 같은 개인정보를 수집합니다.',
      '필수 정보: 이메일 주소, 비밀번호, 닉네임',
      '선택 정보: 프로필 이미지, 자기소개, 관심 카테고리',
      '자동 수집 정보: 접속 IP, 기기 정보, 서비스 이용 기록, 쿠키',
    ],
  },
  {
    title: '2. 정보의 이용',
    content: [
      '수집한 개인정보는 다음 목적으로 이용됩니다.',
      '회원 가입 및 관리: 본인 확인, 회원 식별, 서비스 부정 이용 방지',
      '서비스 제공: 콘텐츠 제공, 맞춤형 피드, 알림 서비스',
      '서비스 개선: 이용 통계 분석, 신규 기능 개발, 사용자 경험 향상',
      '고객 지원: 문의 응대, 공지사항 전달, 분쟁 조정',
    ],
  },
  {
    title: '3. 정보의 공유',
    content: [
      '회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.',
      '다만, 다음의 경우에는 예외로 합니다.',
      '이용자가 사전에 동의한 경우',
      '법령에 의해 요구되는 경우',
      '서비스 제공을 위해 필요한 범위 내에서 업무 위탁하는 경우',
    ],
  },
  {
    title: '4. 정보 보관',
    content: [
      '개인정보는 수집 목적이 달성되면 지체 없이 파기됩니다.',
      '회원 탈퇴 시: 즉시 파기 (단, 부정 이용 방지를 위해 30일간 보관 후 파기)',
      '관련 법령에 의한 보존이 필요한 경우 해당 기간 동안 보관합니다.',
      '전자상거래법에 따른 표시/광고 기록: 6개월',
      '통신비밀보호법에 따른 로그인 기록: 3개월',
    ],
  },
  {
    title: '5. 사용자 권리',
    content: [
      '이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다.',
      '개인정보 열람 요구: 수집된 본인의 개인정보를 조회할 수 있습니다.',
      '개인정보 수정 요구: 부정확한 정보를 수정할 수 있습니다.',
      '개인정보 삭제 요구: 불필요한 정보의 삭제를 요청할 수 있습니다.',
      '처리 정지 요구: 개인정보 처리의 정지를 요청할 수 있습니다.',
      '권리 행사는 설정 > 개인정보 메뉴 또는 고객센터를 통해 가능합니다.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <MainLayout headerProps={{ title: '개인정보처리방침', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-neutral-900 mb-2">개인정보처리방침</h1>
          <p className="text-xs text-neutral-500">최종 수정일: 2026년 2월 25일</p>
          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            DuckDuck(이하 &quot;서비스&quot;)은 이용자의 개인정보를 소중히 다루며,
            개인정보 보호법 등 관련 법령을 준수합니다.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {policySections.map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-semibold text-neutral-900 mb-3 pb-2 border-b border-neutral-100">
                {section.title}
              </h2>
              <div className="space-y-2">
                {section.content.map((paragraph, idx) => (
                  <p key={idx} className={`text-sm leading-relaxed ${idx === 0 ? 'text-neutral-700' : 'text-neutral-600 pl-3 flex gap-2'}`}>
                    {idx > 0 && <span className="text-neutral-300 shrink-0">&#8226;</span>}
                    <span>{paragraph}</span>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 bg-neutral-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-neutral-900 mb-2">문의처</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            개인정보 관련 문의는 설정 &gt; 고객센터를 통해 접수해주세요.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
