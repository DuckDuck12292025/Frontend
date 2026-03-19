'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge, Button } from '@/components/ui';
import { mockPosts } from '@/mocks/data';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState(mockPosts);

  const handleDelete = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <MainLayout headerProps={{ title: '게시글 관리', showBackButton: true, showSearch: false, showActions: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">게시글이 없습니다.</div>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="px-4 py-3 border-b border-neutral-100 last:border-b-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900">{p.author.nickname}</span>
                  <Badge>{p.visibility}</Badge>
                </div>
                <span className="text-xs text-neutral-500">
                  {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <p className="text-sm text-neutral-700 line-clamp-2 mb-2">{p.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-3 text-xs text-neutral-500">
                  <span>좋아요 {p.likeCount}</span>
                  <span>댓글 {p.commentCount}</span>
                  <span>조회 {p.viewCount}</span>
                </div>
                <div className="flex gap-1.5">
                  <Link href={`/post/${p.id}`}>
                    <Button size="sm" variant="ghost">보기</Button>
                  </Link>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}
