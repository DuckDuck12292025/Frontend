'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui';
import { useCreatePost, useCategories } from '@/hooks/queries';
import { useAuthStore } from '@/stores/auth';
import { getErrorMessage } from '@/lib/api/client';
import { Avatar } from '@/components/ui/Avatar';
import { mockPosts, mockAnonQuestions } from '@/mocks/data';

const MAX_CHARS = 500;

function ComposeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createPost = useCreatePost();
  const currentUser = useAuthStore((s) => s.user);
  const isAdmin = currentUser?.role === 'ADMIN';
  const { data: categories } = useCategories();
  const [content, setContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isPremiumTab, setIsPremiumTab] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotice, setIsNotice] = useState(false);
  const [error, setError] = useState('');
  const [attachedImages, setAttachedImages] = useState<{ file: File; preview: string; progress: number }[]>([]);
  const [isQuestionEnabled, setIsQuestionEnabled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quote post detection
  const quoteId = searchParams.get('quote');
  const quotedPost = quoteId ? mockPosts.find((p) => p.id === Number(quoteId)) : null;

  // Q&A mode: answering anonymous questions
  const qaParam = searchParams.get('qa');
  const qaQuestions = qaParam
    ? qaParam.split(',').map(Number).map((id) => mockAnonQuestions.find((q) => q.id === id)).filter(Boolean)
    : [];
  const isQAMode = qaQuestions.length > 0;
  const [qaAnswers, setQaAnswers] = useState<Record<number, string>>({});

  // Q&A: lock category to the source post's category
  const qaSourcePost = isQAMode && qaQuestions[0] ? mockPosts.find((p) => p.id === qaQuestions[0]!.sourcePostId) : null;
  const qaLockedCategoryId = qaSourcePost?.category?.id ?? null;

  // Repost: lock category to the quoted post's category
  const quoteLockedCategoryId = quotedPost?.category?.id ?? null;

  // Category is locked when in QA mode or repost mode
  const isCategoryLocked = isQAMode || !!quotedPost;
  const lockedCategoryId = isQAMode ? qaLockedCategoryId : quoteLockedCategoryId;

  const activeCategories = (categories ?? []).filter((c) => c.status === 'ACTIVE' && c.slug !== 'notice');
  const effectiveCategoryId = isCategoryLocked ? lockedCategoryId : selectedCategoryId;
  const selectedCategory = activeCategories.find((c) => c.id === effectiveCategoryId);

  // Character count helpers
  const charCount = content.length;
  const charPercentage = (charCount / MAX_CHARS) * 100;
  const getCharCountColor = () => {
    if (charPercentage > 90) return 'text-red-500';
    if (charPercentage >= 70) return 'text-amber-500';
    return 'text-neutral-400';
  };

  // URL param category auto-selection
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    if (categorySlug && activeCategories.length > 0 && selectedCategoryId === null) {
      const match = activeCategories.find((c) => c.slug === categorySlug);
      if (match) {
        setSelectedCategoryId(match.id);
      }
    }
    // Only run when categories load or searchParams change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategories.length, searchParams]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      attachedImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [attachedImages]);

  // Simulate upload progress for newly added images
  const simulateUploadProgress = useCallback((startIndex: number, count: number) => {
    let frame = 0;
    const totalFrames = 20; // ~1 second at 50ms intervals
    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(Math.round((frame / totalFrames) * 100), 100);
      setAttachedImages((prev) =>
        prev.map((img, idx) => {
          if (idx >= startIndex && idx < startIndex + count && img.progress < 100) {
            return { ...img, progress };
          }
          return img;
        })
      );
      if (frame >= totalFrames) {
        clearInterval(interval);
      }
    }, 50);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const startIndex = attachedImages.length;
    const newImages = Array.from(files)
      .filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'))
      .slice(0, 4 - attachedImages.length)
      .map((file) => ({ file, preview: URL.createObjectURL(file), progress: 0 }));

    if (newImages.length > 0) {
      setAttachedImages((prev) => [...prev, ...newImages].slice(0, 4));
      simulateUploadProgress(startIndex, newImages.length);
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setAttachedImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setContent(value);
    }
  };

  const handleSubmit = () => {
    // QA mode: validate answers instead of content
    if (isQAMode) {
      const items = qaQuestions
        .filter((q) => q && qaAnswers[q.id]?.trim())
        .map((q) => ({ question: q!.content, answer: qaAnswers[q!.id].trim() }));
      if (items.length === 0) return;
      setError('');
      const visibility = isPremiumTab ? 'SUBSCRIBERS' : 'PUBLIC';
      const categoryId = qaLockedCategoryId; // always use source post's category
      createPost.mutate(
        { content: content.trim() || `${items.length}개의 익명 질문에 답변합니다`, categoryId, visibility, qaItems: items },
        {
          onSuccess: () => {
            // Mark questions as answered in mock data
            qaQuestions.forEach((q) => {
              if (q) {
                const found = mockAnonQuestions.find((mq) => mq.id === q.id);
                if (found) {
                  found.isAnswered = true;
                  found.answer = qaAnswers[q.id] ?? '';
                  found.answeredAt = new Date().toISOString();
                }
              }
            });
            router.push('/');
          },
          onError: (err: unknown) => setError(getErrorMessage(err)),
        }
      );
      return;
    }

    if (!content.trim()) return;
    if (charCount > MAX_CHARS) return;
    setError('');

    const visibility = isPremiumTab ? 'SUBSCRIBERS' : 'PUBLIC';
    const categoryId = isPremiumTab ? null : (quotedPost ? quoteLockedCategoryId : effectiveCategoryId);

    createPost.mutate(
      { content: content.trim(), categoryId, visibility, quotedPostId: quotedPost?.id ?? undefined, acceptsQuestion: isQuestionEnabled },
      {
        onSuccess: () => router.push('/'),
        onError: (err: unknown) => setError(getErrorMessage(err)),
      }
    );
  };

  const isVideoFile = (file: File) => file.type.startsWith('video/');

  return (
    <MainLayout
      showNav={false}
      showRightSidebar={false}
      headerProps={{
        title: isQAMode ? 'Q&A 답변 작성' : quotedPost ? '인용 리포스트' : '새 글 작성',
        showBackButton: true,
        showSearch: false,
        showActions: false,
        rightAction: (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={
              isQAMode
                ? !qaQuestions.some((q) => q && qaAnswers[q.id]?.trim()) || createPost.isPending
                : !content.trim() || charCount > MAX_CHARS || createPost.isPending
            }
          >
            {createPost.isPending ? '게시 중...' : '게시'}
          </Button>
        ),
      }}
    >
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Category & Tier selection row */}
        <div className="px-4 pt-4 pb-2 flex items-center gap-2 flex-wrap">
          {/* Category dropdown (locked in QA mode) */}
          <div ref={dropdownRef} className="relative inline-block">
            <button
              type="button"
              onClick={() => { if (!isCategoryLocked) setIsDropdownOpen(!isDropdownOpen); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                isCategoryLocked
                  ? 'border-violet-300 bg-violet-50 text-violet-700 cursor-default'
                  : isPremiumTab
                  ? 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100'
                  : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {isCategoryLocked ? (
                <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              ) : isPremiumTab ? (
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
              )}
              <span className={selectedCategory || isPremiumTab || isCategoryLocked ? '' : 'text-neutral-400'}>
                {isCategoryLocked ? (selectedCategory?.name ?? '카테고리 없음') : isPremiumTab ? '나의 프리미엄탭' : selectedCategory ? selectedCategory.name : '카테고리 선택'}
              </span>
              {!isCategoryLocked && (
                <svg className={`w-3.5 h-3.5 transition-transform ${isPremiumTab ? 'text-amber-400' : 'text-neutral-400'} ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                <button
                  onClick={() => { setSelectedCategoryId(null); setIsPremiumTab(false); setIsDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    selectedCategoryId === null && !isPremiumTab ? 'bg-neutral-100 font-medium text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  선택 안함
                </button>
                {activeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategoryId(cat.id); setIsPremiumTab(false); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      selectedCategoryId === cat.id && !isPremiumTab ? 'bg-neutral-100 font-medium text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
                {/* Premium tab option with yellow overlay */}
                <div className="border-t border-neutral-100 mt-1 pt-1">
                  <button
                    onClick={() => { setIsPremiumTab(true); setSelectedCategoryId(null); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      isPremiumTab
                        ? 'bg-amber-50 font-medium text-amber-700'
                        : 'text-neutral-600 hover:bg-amber-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span>나의 프리미엄탭</span>
                    </div>
                    <p className="text-[10px] text-amber-500/80 mt-0.5 ml-6">구독자 전용 콘텐츠</p>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notice toggle (admin only — independent of category) */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsNotice(!isNotice)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                isNotice
                  ? 'border-red-500 bg-red-500 text-white hover:bg-red-600'
                  : 'border-neutral-200 hover:border-neutral-400 text-neutral-500'
              }`}
            >
              <svg className={`w-4 h-4 ${isNotice ? 'text-white' : 'text-neutral-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              공지
            </button>
          )}

          {/* Question toggle */}
          <button
            type="button"
            onClick={() => setIsQuestionEnabled(!isQuestionEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
              isQuestionEnabled
                ? 'border-violet-500 bg-violet-500 text-white hover:bg-violet-600'
                : 'border-neutral-200 hover:border-neutral-400 text-neutral-500'
            }`}
          >
            <svg className={`w-4 h-4 ${isQuestionEnabled ? 'text-white' : 'text-neutral-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            질문받기
          </button>
        </div>

        <div className="border-b border-neutral-100 mx-4" />

        {/* Content textarea */}
        <div className="p-4">
          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

          {/* Notice banner — high visibility */}
          {isNotice && (
            <div className="mb-3 rounded-xl overflow-hidden border-2 border-red-500">
              <div className="flex items-center gap-2.5 px-4 py-3 bg-red-500 text-white">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <div>
                  <p className="text-sm font-bold">공지사항</p>
                  <p className="text-xs text-white/80">이 게시물은 카테고리 상단에 고정됩니다</p>
                </div>
              </div>
            </div>
          )}

          {/* Premium tab indicator */}
          {isPremiumTab && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg">
              <svg className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs text-amber-700">
                이 게시물은 <strong className="text-amber-800">프리미엄탭</strong>에 게시되며 구독자만 볼 수 있습니다
              </span>
            </div>
          )}

          {/* QA Mode: question-answer editor */}
          {isQAMode ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-violet-800">{qaQuestions.length}개 질문에 답변</span>
              </div>

              {qaQuestions.map((q) => q && (
                <div key={q.id} className="rounded-xl border border-violet-200 overflow-hidden">
                  {/* Question bubble */}
                  <div className="px-3 py-2.5 bg-violet-50 border-b border-violet-200">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded-full bg-neutral-300 flex items-center justify-center">
                        <svg className="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                      <span className="text-[10px] font-medium text-violet-500">익명의 질문</span>
                    </div>
                    <p className="text-sm text-neutral-900">{q.content}</p>
                  </div>
                  {/* Answer textarea */}
                  <div className="px-3 py-2">
                    <textarea
                      value={qaAnswers[q.id] ?? ''}
                      onChange={(e) => setQaAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="답변을 작성하세요..."
                      rows={2}
                      className="w-full text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-none"
                    />
                  </div>
                </div>
              ))}

              {/* Optional intro text */}
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="추가 코멘트 (선택사항)"
                rows={2}
                className="w-full text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-none border border-neutral-200 rounded-lg px-3 py-2"
              />
            </div>
          ) : (
            <>
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="무슨 생각을 하고 계신가요?"
                className="w-full min-h-[160px] text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-none"
                autoFocus
              />

              {/* Character counter */}
              <div className="flex justify-end mt-1">
                <span className={`text-xs font-medium tabular-nums ${getCharCountColor()}`}>
                  {charCount}/{MAX_CHARS}
                </span>
              </div>

              {/* Question enabled indicator */}
              {isQuestionEnabled && (
                <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg">
                  <svg className="w-4 h-4 text-violet-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-violet-700">이 글에 <strong className="text-violet-800">익명 질문</strong>을 받을 수 있습니다</span>
                </div>
              )}
            </>
          )}

          {/* Quoted post preview */}
          {quotedPost && (
            <div className="mt-3 p-3 border border-neutral-200 rounded-xl bg-neutral-50/50">
              <div className="flex items-center gap-2 mb-1.5">
                <Avatar
                  src={quotedPost.author.profile?.profileImageUrl}
                  alt={quotedPost.author.nickname}
                  size="xs"
                />
                <span className="text-xs font-semibold text-neutral-900">
                  {quotedPost.author.nickname}
                </span>
                {quotedPost.author.isVerified && (
                  <svg className="w-3 h-3 text-neutral-900 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-neutral-600 line-clamp-3 whitespace-pre-wrap">
                {quotedPost.content}
              </p>
              {quotedPost.media && quotedPost.media.length > 0 && (
                <div className="mt-2 rounded-lg overflow-hidden border border-neutral-100 aspect-video max-h-32">
                  <img
                    src={quotedPost.media[0].mediaUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* Image/Video previews */}
          {attachedImages.length > 0 && (
            <div className={`grid gap-1.5 mt-2 ${attachedImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {attachedImages.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-neutral-100">
                  {isVideoFile(img.file) ? (
                    <div className={`w-full flex items-center justify-center bg-neutral-100 ${attachedImages.length === 1 ? 'h-48' : 'aspect-square'}`}>
                      <div className="flex flex-col items-center gap-2 text-neutral-500">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">{img.file.name}</span>
                      </div>
                    </div>
                  ) : (
                    <img src={img.preview} alt="" className={`w-full object-cover ${attachedImages.length === 1 ? 'max-h-64' : 'aspect-square'}`} />
                  )}

                  {/* Upload progress overlay */}
                  {img.progress < 100 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-3/4 max-w-[160px]">
                        <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                            style={{ width: `${img.progress}%` }}
                          />
                        </div>
                        <p className="text-white text-xs text-center mt-1.5">{img.progress}%</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom toolbar */}
        <div className="flex items-center gap-1 px-4 py-3 border-t border-neutral-100">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={attachedImages.length >= 4}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="이미지/동영상 첨부"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          {/* Video button */}
          <button
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = 'video/*';
                fileInputRef.current.click();
                // Reset accept after click
                setTimeout(() => {
                  if (fileInputRef.current) fileInputRef.current.accept = 'image/*,video/*';
                }, 100);
              }
            }}
            disabled={attachedImages.length >= 4}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="동영상 첨부"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="GIF"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="투표"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          {attachedImages.length > 0 && (
            <span className="ml-auto text-xs text-neutral-400">{attachedImages.length}/4</span>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function ComposePage() {
  return (
    <Suspense fallback={
      <MainLayout showNav={false} showRightSidebar={false} headerProps={{ title: '새 글 작성', showBackButton: true, showSearch: false, showActions: false }}>
        <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl p-8 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
        </div>
      </MainLayout>
    }>
      <ComposeContent />
    </Suspense>
  );
}
