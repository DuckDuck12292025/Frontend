/**
 * 페이지: 카테고리 관리 (관리자)
 * 경로: /admin/categories
 * 설명: 카테고리 생성/편집/삭제, 활성/비활성 상태 토글을 수행하는 관리자 화면.
 *
 * 사용하는 API:
 *   - 없음 (현재 로컬 state로 처리)
 *
 * Mock 상태: mockCategories 사용 중
 */
'use client';
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge, Button, Input } from '@/components/ui';
import { mockCategories } from '@/mocks/data';
import type { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newCategory: Category = {
      id: Date.now(),
      name: newName.trim(),
      slug: newName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: newDesc.trim(),
      status: 'ACTIVE',
      visibility: 'PUBLIC',
      postCount: 0,
      subscriberCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCategory]);
    setNewName('');
    setNewDesc('');
    setShowCreate(false);
  };

  const handleToggleStatus = (categoryId: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, status: c.status === 'ACTIVE' ? 'INACTIVE' as const : 'ACTIVE' as const }
          : c
      )
    );
  };

  const handleDelete = (categoryId: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const handleStartEdit = (c: Category) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditDesc(c.description || '');
  };

  const handleSaveEdit = (categoryId: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, name: editName.trim(), description: editDesc.trim(), updatedAt: new Date().toISOString() }
          : c
      )
    );
    setEditingId(null);
  };

  return (
    <MainLayout headerProps={{ title: '카테고리 관리', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Create Button */}
        <div className="px-4 py-3 border-b border-neutral-200">
          {!showCreate ? (
            <Button size="sm" onClick={() => setShowCreate(true)}>카테고리 추가</Button>
          ) : (
            <div className="space-y-2">
              <Input
                placeholder="카테고리 이름"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Input
                placeholder="설명 (선택사항)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreate} disabled={!newName.trim()}>생성</Button>
                <Button size="sm" variant="ghost" onClick={() => { setShowCreate(false); setNewName(''); setNewDesc(''); }}>
                  취소
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Category List */}
        {categories.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">카테고리가 없습니다.</div>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="px-4 py-3 border-b border-neutral-100 last:border-b-0">
              {editingId === c.id ? (
                <div className="space-y-2">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="카테고리 이름" />
                  <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="설명" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveEdit(c.id)} disabled={!editName.trim()}>저장</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>취소</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-900">{c.name}</span>
                      <Badge variant={c.status === 'ACTIVE' ? 'success' : 'danger'}>
                        {c.status === 'ACTIVE' ? '활성' : '비활성'}
                      </Badge>
                    </div>
                    {c.description && (
                      <p className="text-xs text-neutral-500 mt-0.5">{c.description}</p>
                    )}
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {c.postCount}개 게시글 · {c.subscriberCount}명 구독
                    </p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {/* Status Toggle */}
                    <button
                      onClick={() => handleToggleStatus(c.id)}
                      className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer ${c.status === 'ACTIVE' ? 'bg-neutral-900' : 'bg-neutral-300'}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${c.status === 'ACTIVE' ? 'translate-x-5' : 'translate-x-0'}`}
                      />
                    </button>
                    <Button variant="ghost" size="sm" onClick={() => handleStartEdit(c)}>편집</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)}>삭제</Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}
