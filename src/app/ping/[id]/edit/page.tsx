/**
 * 페이지: 게시글 수정
 * 경로: /ping/[id]/edit
 * 설명: 기존 게시글의 내용과 카테고리를 수정하는 에디터 화면.
 *       글자 수 제한(500자)을 적용하고, 수정 완료 시 상세 페이지로 이동한다.
 *
 * 사용하는 API:
 *   - GET /posts/:id — 수정할 게시글 조회
 *   - PUT /posts/:id — 게시글 수정
 *   - GET /categories — 카테고리 목록 조회
 *
 * Mock 상태: 실제 API 연동 가능
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui';
import { usePost, useUpdatePost, useCategories } from '@/hooks/queries';
import { getErrorMessage } from '@/lib/api/client';

const MAX_CHARS = 500;

export default function PingEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const postId = Number(id);

  const { data: post, isLoading, isError, error: fetchError } = usePost(postId);
  const updatePost = useUpdatePost();
  const { data: categories } = useCategories();

  const [content, setContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeCategories = (categories ?? []).filter((c) => c.status === 'ACTIVE' && c.slug !== 'notice');
  const selectedCategory = activeCategories.find((c) => c.id === selectedCategoryId);

  // Pre-fill form when post data loads
  useEffect(() => {
    if (post && !initialized) {
      setContent(post.content);
      setSelectedCategoryId(post.categoryId ?? null);
      setInitialized(true);
    }
  }, [post, initialized]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const charsRemaining = MAX_CHARS - content.length;
  const isOverLimit = charsRemaining < 0;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    if (!content.trim() || isOverLimit) return;
    setError('');

    updatePost.mutate(
      { postId, content: content.trim(), categoryId: selectedCategoryId },
      {
        onSuccess: () => router.push(`/ping/${postId}`),
        onError: (err) => setError(getErrorMessage(err)),
      }
    );
  };

  const handleCancel = () => {
    router.back();
  };

  // Loading state
  if (isLoading) {
    return (
      <MainLayout
        showNav={false}
        showRightSidebar={false}
        headerProps={{
          title: '수정',
          showBackButton: true,
          showSearch: false,
          showActions: false,
        }}
      >
        <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
              <p className="text-sm text-neutral-500">게시물을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (isError || !post) {
    return (
      <MainLayout
        showNav={false}
        showRightSidebar={false}
        headerProps={{
          title: '수정',
          showBackButton: true,
          showSearch: false,
          showActions: false,
        }}
      >
        <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <svg className="w-12 h-12 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-neutral-900 font-medium">
                게시물을 찾을 수 없습니다
              </p>
              <p className="text-xs text-neutral-500">
                {fetchError ? getErrorMessage(fetchError) : '삭제되었거나 접근 권한이 없는 게시물입니다.'}
              </p>
              <button
                onClick={() => router.back()}
                className="mt-2 text-sm text-neutral-600 hover:text-neutral-900 underline underline-offset-2 transition-colors"
              >
                돌아가기
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      showNav={false}
      showRightSidebar={false}
      headerProps={{
        title: '수정',
        showBackButton: true,
        showSearch: false,
        showActions: false,
        rightAction: (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              취소
            </button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!content.trim() || isOverLimit || updatePost.isPending}
            >
              {updatePost.isPending ? '저장 중...' : '저장'}
            </Button>
          </div>
        ),
      }}
    >
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Category dropdown */}
        <div className="px-4 pt-4 pb-2">
          <div ref={dropdownRef} className="relative inline-block">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-sm hover:border-neutral-400 transition-colors"
            >
              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className={selectedCategory ? 'text-neutral-900' : 'text-neutral-400'}>
                {selectedCategory ? selectedCategory.name : '카테고리 선택'}
              </span>
              <svg className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                <button
                  onClick={() => { setSelectedCategoryId(null); setIsDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    selectedCategoryId === null ? 'bg-neutral-100 font-medium text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  선택 안함
                </button>
                {activeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategoryId(cat.id); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      selectedCategoryId === cat.id ? 'bg-neutral-100 font-medium text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-b border-neutral-100 mx-4" />

        {/* Content textarea */}
        <div className="p-4">
          {error && (
            <div className="mb-3 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력하세요..."
            className="w-full min-h-[200px] text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-none leading-relaxed"
            autoFocus
          />
        </div>

        {/* Bottom toolbar with character counter */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            {/* Placeholder for future toolbar buttons */}
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs tabular-nums ${
              isOverLimit
                ? 'text-red-500 font-medium'
                : charsRemaining <= 50
                  ? 'text-amber-500'
                  : 'text-neutral-400'
            }`}>
              {content.length}/{MAX_CHARS}
            </span>
            {isOverLimit && (
              <span className="text-xs text-red-500">
                {Math.abs(charsRemaining)}자 초과
              </span>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
