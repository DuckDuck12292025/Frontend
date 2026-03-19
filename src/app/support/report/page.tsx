/**
 * 페이지: 문의하기
 * 경로: /support/report
 * 설명: 버그 신고, 기능 제안, 콘텐츠 신고, 계정 문제 등의 유형을 선택하고
 *       제목/내용을 입력하여 문의를 제출하는 화면.
 *
 * 사용하는 API:
 *   - 없음 (현재 로컬 state로 처리)
 *
 * Mock 상태: 문의 제출은 로컬 state 전환만 수행 (실제 API 미연동)
 */
'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button, Input } from '@/components/ui';

const reportTypes = ['버그 신고', '기능 제안', '콘텐츠 신고', '계정 문제', '기타'];

export default function ReportPage() {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!type || !title || !desc) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <MainLayout headerProps={{ title: '문의하기', showBackButton: true, showSearch: false, showActions: false }}>
        <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">문의가 접수되었습니다</h2>
          <p className="text-sm text-neutral-600 mb-1">유형: {type}</p>
          <p className="text-sm text-neutral-600 mb-4">제목: {title}</p>
          <p className="text-sm text-neutral-500">빠른 시일 내에 확인 후 답변 드리겠습니다.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout headerProps={{ title: '문의하기', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl p-4 space-y-4">
        {/* Report Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">문의 유형</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full h-10 px-3 rounded-lg text-sm bg-white text-neutral-900 border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-colors duration-150 cursor-pointer appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
          >
            <option value="" disabled>유형을 선택해주세요</option>
            {reportTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Title Input */}
        <Input
          label="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="문의 제목을 입력해주세요"
        />

        {/* Description Textarea */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">내용</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={6}
            placeholder="문의 내용을 자세히 설명해주세요..."
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 resize-none placeholder:text-neutral-400 transition-colors duration-150"
          />
        </div>

        {/* Submit Button */}
        <Button
          fullWidth
          disabled={!type || !title || !desc}
          onClick={handleSubmit}
        >
          문의 제출
        </Button>
      </div>
    </MainLayout>
  );
}
