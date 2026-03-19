'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar, Button } from '@/components/ui';
import { mockUsers, mockPosts, mockAnonQuestions } from '@/mocks/data';
import type { AnonQuestion } from '@/mocks/data';

const CURRENT_USER_ID = 1;

interface Note {
  id: number;
  senderId: number;
  receiverId: number;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

const mockNotes: Note[] = [
  { id: 1, senderId: 2, receiverId: 1, title: '글 잘 봤습니다', content: '안녕하세요! 작성하신 글 잘 봤습니다. 혹시 Virtual Thread 관련해서 더 이야기 나눌 수 있을까요?', isRead: false, createdAt: '2025-02-25T11:30:00.000Z' },
  { id: 2, senderId: 3, receiverId: 1, title: '디자인 피드백 요청', content: '안녕하세요! 제가 작업 중인 디자인 시스템에 대해 피드백을 부탁드려도 될까요?', isRead: false, createdAt: '2025-02-25T10:00:00.000Z' },
  { id: 3, senderId: 4, receiverId: 1, title: '커뮤니티 가이드라인 업데이트 안내', content: '안녕하세요, DuckDuck 운영팀입니다. 커뮤니티 가이드라인이 업데이트되었습니다.', isRead: true, createdAt: '2025-02-24T15:00:00.000Z' },
  { id: 4, senderId: 2, receiverId: 1, title: 'React 19 스터디 같이 하실래요?', content: 'React 19 관련 스터디 그룹을 만들어 보려고 하는데 혹시 관심 있으시면 참여해 주세요!', isRead: true, createdAt: '2025-02-23T09:00:00.000Z' },
  { id: 5, senderId: 1, receiverId: 2, title: 'Re: 글 잘 봤습니다', content: '안녕하세요! 답변 감사합니다. Virtual Thread는 I/O 바운드 작업에서 특히 효과적이었습니다.', isRead: true, createdAt: '2025-02-25T12:00:00.000Z' },
];

type TabType = 'received' | 'sent' | 'questions';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours < 12 ? '오전' : '오후';
    const displayHours = hours % 12 || 12;
    return `${period} ${displayHours}:${minutes}`;
  }
  if (days === 1) return '어제';
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function getSender(senderId: number) {
  return mockUsers.find((u) => u.id === senderId) ?? mockUsers[0];
}

export default function MessagesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('received');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [notes, setNotes] = useState(mockNotes);

  // Compose state
  const [composeRecipient, setComposeRecipient] = useState('');
  const [composeTitle, setComposeTitle] = useState('');
  const [composeContent, setComposeContent] = useState('');

  // Questions state
  const [questions, setQuestions] = useState<AnonQuestion[]>(mockAnonQuestions);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<number>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);

  const receivedNotes = notes.filter((n) => n.receiverId === CURRENT_USER_ID);
  const sentNotes = notes.filter((n) => n.senderId === CURRENT_USER_ID);
  const displayNotes = activeTab === 'received' ? receivedNotes : sentNotes;

  const unreadNoteCount = receivedNotes.filter((n) => !n.isRead).length;
  const myQuestions = questions.filter((q) => q.receiverId === CURRENT_USER_ID);
  const unreadQuestionCount = myQuestions.filter((q) => !q.isRead).length;
  const unansweredQuestions = myQuestions.filter((q) => !q.isAnswered);

  // Group unanswered questions by source post
  const groupedByPost = useMemo(() => {
    const groups = new Map<number, AnonQuestion[]>();
    for (const q of unansweredQuestions) {
      const list = groups.get(q.sourcePostId) || [];
      list.push(q);
      groups.set(q.sourcePostId, list);
    }
    return groups;
  }, [unansweredQuestions]);

  const answeredQuestions = myQuestions.filter((q) => q.isAnswered);

  // Get source post info
  const getSourcePost = (postId: number) => mockPosts.find((p) => p.id === postId);

  const handleSelectNote = (note: Note) => {
    if (!note.isRead && note.receiverId === CURRENT_USER_ID) {
      setNotes((prev) => prev.map((n) => n.id === note.id ? { ...n, isRead: true } : n));
    }
    setSelectedNote(note);
    setShowCompose(false);
  };

  const handleDelete = (noteId: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (selectedNote?.id === noteId) setSelectedNote(null);
  };

  const handleReply = (note: Note) => {
    const sender = getSender(note.senderId);
    setComposeRecipient(sender.nickname);
    setComposeTitle(`Re: ${note.title}`);
    setComposeContent('');
    setShowCompose(true);
    setSelectedNote(null);
  };

  const handleSend = () => {
    if (!composeTitle.trim() || !composeContent.trim()) return;
    const recipient = mockUsers.find((u) => u.nickname === composeRecipient);
    const newNote: Note = {
      id: Date.now(),
      senderId: CURRENT_USER_ID,
      receiverId: recipient?.id ?? 2,
      title: composeTitle.trim(),
      content: composeContent.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setComposeRecipient('');
    setComposeTitle('');
    setComposeContent('');
    setShowCompose(false);
    setActiveTab('sent');
  };

  const toggleQuestionSelect = (qId: number) => {
    setSelectedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const selectAllInGroup = (postId: number) => {
    const group = groupedByPost.get(postId) ?? [];
    setSelectedQuestionIds((prev) => {
      const next = new Set(prev);
      const allSelected = group.every((q) => next.has(q.id));
      if (allSelected) {
        group.forEach((q) => next.delete(q.id));
      } else {
        group.forEach((q) => next.add(q.id));
      }
      return next;
    });
  };

  const handleAnswerSelected = () => {
    if (selectedQuestionIds.size === 0) return;
    const ids = Array.from(selectedQuestionIds).join(',');
    router.push(`/compose?qa=${ids}`);
  };

  const handleDeleteQuestion = (qId: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
    setSelectedQuestionIds((prev) => {
      const next = new Set(prev);
      next.delete(qId);
      return next;
    });
  };

  // ─── Note detail view ───
  if (selectedNote) {
    const noteUser = activeTab === 'received'
      ? getSender(selectedNote.senderId)
      : getSender(selectedNote.receiverId);
    const label = activeTab === 'received' ? '보낸 사람' : '받는 사람';

    return (
      <MainLayout headerProps={{ title: '쪽지', showBackButton: true, showSearch: false }}>
        <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
          <div className="px-4 py-3 border-b border-neutral-100">
            <button onClick={() => setSelectedNote(null)} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              목록으로
            </button>
            <h2 className="text-lg font-bold text-neutral-900">{selectedNote.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Avatar src={noteUser.profile?.profileImageUrl} alt={noteUser.nickname} size="sm" isBlueChecked={noteUser.isBlueChecked} />
              <div>
                <p className="text-sm font-medium text-neutral-900">{noteUser.nickname}</p>
                <p className="text-xs text-neutral-400">{label} · {formatDate(selectedNote.createdAt)}</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-6">
            <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">{selectedNote.content}</p>
          </div>
          <div className="px-4 py-3 border-t border-neutral-100 flex gap-2">
            {activeTab === 'received' && <Button size="sm" onClick={() => handleReply(selectedNote)}>답장</Button>}
            <Button variant="secondary" size="sm" onClick={() => handleDelete(selectedNote.id)}>삭제</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ─── Compose view ───
  if (showCompose) {
    return (
      <MainLayout headerProps={{ title: '쪽지', showBackButton: true, showSearch: false }}>
        <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
          <div className="px-4 py-3 border-b border-neutral-100">
            <button onClick={() => setShowCompose(false)} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              목록으로
            </button>
            <h2 className="text-base font-bold text-neutral-900">쪽지 보내기</h2>
          </div>
          <div className="px-4 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">받는 사람</label>
              <input type="text" value={composeRecipient} onChange={(e) => setComposeRecipient(e.target.value)} placeholder="닉네임을 입력하세요" className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">제목</label>
              <input type="text" value={composeTitle} onChange={(e) => setComposeTitle(e.target.value)} placeholder="제목을 입력하세요" className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">내용</label>
              <textarea value={composeContent} onChange={(e) => setComposeContent(e.target.value)} placeholder="내용을 입력하세요" rows={8} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 resize-none" />
            </div>
          </div>
          <div className="px-4 py-3 border-t border-neutral-100 flex gap-2">
            <Button size="sm" onClick={handleSend} disabled={!composeTitle.trim() || !composeContent.trim()}>보내기</Button>
            <Button variant="secondary" size="sm" onClick={() => setShowCompose(false)}>취소</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ─── List view ───
  return (
    <MainLayout headerProps={{ title: '쪽지', showBackButton: true, showSearch: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Tab + Compose button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
          <div className="flex gap-1">
            <button onClick={() => setActiveTab('received')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'received' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>
              받은 쪽지{unreadNoteCount > 0 && ` (${unreadNoteCount})`}
            </button>
            <button onClick={() => setActiveTab('questions')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'questions' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>
              받은 질문{unreadQuestionCount > 0 && ` (${unreadQuestionCount})`}
            </button>
            <button onClick={() => setActiveTab('sent')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'sent' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>
              보낸 쪽지
            </button>
          </div>
          {activeTab !== 'questions' && (
            <Button size="sm" onClick={() => { setShowCompose(true); setSelectedNote(null); }}>쪽지 쓰기</Button>
          )}
        </div>

        {/* Questions tab */}
        {activeTab === 'questions' ? (
          myQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
              <svg className="w-12 h-12 mb-3 text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">받은 질문이 없습니다</p>
              <p className="text-xs text-neutral-300 mt-1">글 작성 시 질문받기를 켜보세요</p>
            </div>
          ) : (
            <div>
              {/* Select mode toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100 bg-neutral-50/50">
                <button
                  onClick={() => { setIsSelectMode(!isSelectMode); setSelectedQuestionIds(new Set()); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isSelectMode
                      ? 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                      : 'bg-violet-500 text-white hover:bg-violet-600'
                  }`}
                >
                  {isSelectMode ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      선택 취소
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                      선택하여 답변
                    </>
                  )}
                </button>
                {isSelectMode && selectedQuestionIds.size > 0 && (
                  <Button size="sm" onClick={handleAnswerSelected}>
                    {selectedQuestionIds.size}개 묶어서 답변하기
                  </Button>
                )}
              </div>

              {/* Unanswered — grouped by source post */}
              {Array.from(groupedByPost.entries()).map(([postId, qs]) => {
                const sourcePost = getSourcePost(postId);
                const allSelected = qs.every((q) => selectedQuestionIds.has(q.id));

                return (
                  <div key={postId} className="border-b border-neutral-100">
                    {/* Group header: source post preview */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-50/80">
                      {isSelectMode && (
                        <button
                          onClick={() => selectAllInGroup(postId)}
                          className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                            allSelected ? 'bg-violet-500 border-violet-500' : 'border-neutral-300 hover:border-violet-400'
                          }`}
                        >
                          {allSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          )}
                        </button>
                      )}
                      <svg className="w-3.5 h-3.5 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <p className="text-xs text-neutral-500 truncate flex-1">
                        <span className="font-medium text-neutral-700">원본글:</span>{' '}
                        {sourcePost ? sourcePost.content.slice(0, 40) + (sourcePost.content.length > 40 ? '...' : '') : `게시글 #${postId}`}
                      </p>
                      <span className="text-[10px] text-neutral-400 shrink-0">{qs.length}개 질문</span>
                    </div>

                    {/* Questions in this group */}
                    {qs.map((q) => (
                      <div
                        key={q.id}
                        className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-neutral-50 ${!q.isRead ? 'bg-violet-50/30' : ''}`}
                      >
                        {isSelectMode && (
                          <button
                            onClick={() => toggleQuestionSelect(q.id)}
                            className={`mt-0.5 w-4.5 h-4.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                              selectedQuestionIds.has(q.id) ? 'bg-violet-500 border-violet-500' : 'border-neutral-300 hover:border-violet-400'
                            }`}
                          >
                            {selectedQuestionIds.has(q.id) && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            )}
                          </button>
                        )}
                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {!q.isRead && <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />}
                              <span className="text-sm font-medium text-neutral-500">익명</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-neutral-400">{formatDate(q.createdAt)}</span>
                              <button onClick={() => handleDeleteQuestion(q.id)} className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-red-500 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          </div>
                          <p className={`text-sm mt-0.5 ${!q.isRead ? 'font-semibold text-neutral-900' : 'text-neutral-800'}`}>{q.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Answered questions */}
              {answeredQuestions.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-neutral-50/80 border-b border-neutral-100">
                    <span className="text-xs font-medium text-neutral-400">답변 완료 ({answeredQuestions.length})</span>
                  </div>
                  {answeredQuestions.map((q) => (
                    <div key={q.id} className="flex items-start gap-3 px-4 py-3 border-b border-neutral-100 opacity-60">
                      <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-neutral-500">익명</span>
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="text-[10px] text-green-600 font-medium">답변 완료</span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-0.5 truncate">{q.content}</p>
                        {q.answer && <p className="text-xs text-neutral-400 mt-1 truncate">→ {q.answer}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        ) : (
          /* Notes (received/sent) */
          displayNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
              <svg className="w-12 h-12 mb-3 text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">{activeTab === 'received' ? '받은 쪽지가 없습니다' : '보낸 쪽지가 없습니다'}</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {displayNotes.map((note) => {
                const noteUser = activeTab === 'received' ? getSender(note.senderId) : getSender(note.receiverId);
                return (
                  <button key={note.id} onClick={() => handleSelectNote(note)} className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-neutral-50 ${!note.isRead && activeTab === 'received' ? 'bg-neutral-50/50' : ''}`}>
                    <Avatar src={noteUser.profile?.profileImageUrl} alt={noteUser.nickname} size="md" isBlueChecked={noteUser.isBlueChecked} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {!note.isRead && activeTab === 'received' && <span className="shrink-0 w-2 h-2 rounded-full bg-neutral-900" />}
                          <span className={`text-sm truncate ${!note.isRead && activeTab === 'received' ? 'font-bold text-neutral-900' : 'font-medium text-neutral-700'}`}>{noteUser.nickname}</span>
                        </div>
                        <span className="text-xs text-neutral-400 shrink-0">{formatDate(note.createdAt)}</span>
                      </div>
                      <p className={`text-sm mt-0.5 truncate ${!note.isRead && activeTab === 'received' ? 'font-semibold text-neutral-900' : 'text-neutral-800'}`}>{note.title}</p>
                      <p className="text-xs text-neutral-400 mt-0.5 truncate">{note.content}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}
