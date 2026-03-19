'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FeedList } from '@/components/features/FeedList';
import { PingCard } from '@/components/features/PingCard';
import { Button } from '@/components/ui';
import { mockPosts } from '@/mocks/data';
import type { PostWithAuthor } from '@/types';

interface BookmarkFolder {
  id: number;
  name: string;
  parentId: number | null;
  children: BookmarkFolder[];
  postIds: number[];
}

function buildInitialFolders(): BookmarkFolder[] {
  return [
    {
      id: 1, name: '애니메이션', parentId: null, postIds: [1],
      children: [
        { id: 11, name: '2025년 신작', parentId: 1, children: [], postIds: [] },
        { id: 12, name: '명작 모음', parentId: 1, children: [], postIds: [] },
      ],
    },
    {
      id: 2, name: '코스프레', parentId: null, postIds: [2],
      children: [
        { id: 21, name: '제작 팁', parentId: 2, children: [], postIds: [] },
      ],
    },
    { id: 3, name: '굿즈/피규어', parentId: null, children: [], postIds: [] },
  ];
}

function countAllPosts(folder: BookmarkFolder): number {
  return folder.postIds.length + folder.children.reduce((sum, child) => sum + countAllPosts(child), 0);
}

function getAllPostIds(folder: BookmarkFolder): number[] {
  return [...folder.postIds, ...folder.children.flatMap((child) => getAllPostIds(child))];
}

function findFolder(folders: BookmarkFolder[], id: number): BookmarkFolder | null {
  for (const f of folders) {
    if (f.id === id) return f;
    const found = findFolder(f.children, id);
    if (found) return found;
  }
  return null;
}

function updateInTree(folders: BookmarkFolder[], id: number, updater: (f: BookmarkFolder) => BookmarkFolder): BookmarkFolder[] {
  return folders.map((f) => {
    if (f.id === id) return updater(f);
    return { ...f, children: updateInTree(f.children, id, updater) };
  });
}

function addChildToTree(folders: BookmarkFolder[], parentId: number, child: BookmarkFolder): BookmarkFolder[] {
  return folders.map((f) => {
    if (f.id === parentId) return { ...f, children: [...f.children, child] };
    return { ...f, children: addChildToTree(f.children, parentId, child) };
  });
}

function removeFromTree(folders: BookmarkFolder[], id: number): BookmarkFolder[] {
  return folders
    .filter((f) => f.id !== id)
    .map((f) => ({ ...f, children: removeFromTree(f.children, id) }));
}

function removePostIdFromTree(folders: BookmarkFolder[], postId: number): BookmarkFolder[] {
  return folders.map((f) => ({
    ...f,
    postIds: f.postIds.filter((id) => id !== postId),
    children: removePostIdFromTree(f.children, postId),
  }));
}

function addPostIdToFolder(folders: BookmarkFolder[], folderId: number, postId: number): BookmarkFolder[] {
  return folders.map((f) => {
    if (f.id === folderId) return { ...f, postIds: [...f.postIds, postId] };
    return { ...f, children: addPostIdToFolder(f.children, folderId, postId) };
  });
}

// Check if targetId is a descendant of ancestorId
function hasDescendant(folder: BookmarkFolder, targetId: number): boolean {
  for (const child of folder.children) {
    if (child.id === targetId) return true;
    if (hasDescendant(child, targetId)) return true;
  }
  return false;
}

// Collect all folder IDs in tree
function collectAllFolderIds(folders: BookmarkFolder[]): number[] {
  return folders.flatMap((f) => [f.id, ...collectAllFolderIds(f.children)]);
}

/* ─── Move destination picker modal ─── */
function FolderPickerModal({
  folders,
  disabledIds,
  currentFolderId,
  onSelect,
  onClose,
}: {
  folders: BookmarkFolder[];
  disabledIds: Set<number>;
  currentFolderId: number | null;
  onSelect: (folderId: number | null) => void;
  onClose: () => void;
}) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => {
    // Auto-expand all by default for easier navigation
    return new Set(collectAllFolderIds(folders));
  });

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderFolder = (folder: BookmarkFolder, depth: number) => {
    const isDisabled = disabledIds.has(folder.id);
    const isCurrent = folder.id === currentFolderId;
    const hasChildren = folder.children.length > 0;
    const isExpanded = expandedIds.has(folder.id);

    return (
      <div key={folder.id}>
        <button
          onClick={() => !isDisabled && onSelect(folder.id)}
          disabled={isDisabled}
          className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors ${
            isDisabled
              ? 'opacity-30 cursor-not-allowed'
              : isCurrent
                ? 'bg-neutral-100 text-neutral-900'
                : 'hover:bg-neutral-50 text-neutral-700'
          }`}
          style={{ paddingLeft: `${12 + depth * 20}px` }}
        >
          {hasChildren && (
            <span
              onClick={(e) => { e.stopPropagation(); toggleExpand(folder.id); }}
              className="w-4 h-4 flex items-center justify-center shrink-0 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
          {!hasChildren && <span className="w-4 shrink-0" />}
          <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="text-sm truncate">{folder.name}</span>
          {isCurrent && (
            <span className="ml-auto text-[10px] text-neutral-400 shrink-0">현재 위치</span>
          )}
        </button>
        {hasChildren && isExpanded && folder.children.map((child) => renderFolder(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
          <h3 className="text-sm font-semibold text-neutral-900">이동할 폴더 선택</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Folder tree */}
        <div className="flex-1 overflow-y-auto py-1">
          {/* Root option */}
          <button
            onClick={() => onSelect(null)}
            className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors ${
              currentFolderId === null
                ? 'bg-neutral-100 text-neutral-900'
                : 'hover:bg-neutral-50 text-neutral-700'
            }`}
          >
            <span className="w-4 shrink-0" />
            <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
            </svg>
            <span className="text-sm">전체 (루트)</span>
            {currentFolderId === null && (
              <span className="ml-auto text-[10px] text-neutral-400 shrink-0">현재 위치</span>
            )}
          </button>
          {folders.map((f) => renderFolder(f, 0))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function BookmarksPage() {
  const [posts, setPosts] = useState<PostWithAuthor[]>(() =>
    mockPosts.filter((p) => p.isBookmarked).map((p) => ({ ...p }))
  );
  const [folders, setFolders] = useState<BookmarkFolder[]>(buildInitialFolders);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [addingSubfolderToId, setAddingSubfolderToId] = useState<number | null>(null);
  const [subfolderName, setSubfolderName] = useState('');

  // Select & Move state
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedPostIds, setSelectedPostIds] = useState<Set<number>>(new Set());
  const [selectedFolderIds, setSelectedFolderIds] = useState<Set<number>>(new Set());
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1] : null;

  const getCurrentFolders = (): BookmarkFolder[] => {
    if (currentFolderId === null) return folders;
    const folder = findFolder(folders, currentFolderId);
    return folder?.children ?? [];
  };

  const getCurrentFolder = (): BookmarkFolder | null => {
    if (currentFolderId === null) return null;
    return findFolder(folders, currentFolderId);
  };

  const breadcrumbs = currentPath.map((id) => {
    const f = findFolder(folders, id);
    return { id, name: f?.name ?? '' };
  });

  const displayPosts = (() => {
    if (currentFolderId === null) return posts;
    const folder = getCurrentFolder();
    if (!folder) return [];
    const ids = new Set(getAllPostIds(folder));
    return posts.filter((p) => ids.has(p.id));
  })();

  const currentSubFolders = getCurrentFolders();

  const totalSelected = selectedPostIds.size + selectedFolderIds.size;

  // ─── Select helpers ───
  const toggleSelectPost = (postId: number) => {
    setSelectedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const toggleSelectFolder = (folderId: number) => {
    setSelectedFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const exitSelectMode = () => {
    setIsSelectMode(false);
    setSelectedPostIds(new Set());
    setSelectedFolderIds(new Set());
  };

  const selectAll = () => {
    setSelectedPostIds(new Set(displayPosts.map((p) => p.id)));
    setSelectedFolderIds(new Set(currentSubFolders.map((f) => f.id)));
  };

  // ─── Move logic ───
  const disabledMoveTargets = useMemo(() => {
    const disabled = new Set<number>();
    // Can't move a folder into itself or any of its descendants
    selectedFolderIds.forEach((fId) => {
      disabled.add(fId);
      const folder = findFolder(folders, fId);
      if (folder) {
        collectAllFolderIds(folder.children).forEach((cId) => disabled.add(cId));
      }
    });
    return disabled;
  }, [selectedFolderIds, folders]);

  const handleMoveItems = (destinationId: number | null) => {
    setFolders((prev) => {
      let updated = prev;

      // Move selected posts
      selectedPostIds.forEach((postId) => {
        // Remove postId from all folders
        updated = removePostIdFromTree(updated, postId);
        // Add to destination
        if (destinationId !== null) {
          updated = addPostIdToFolder(updated, destinationId, postId);
        }
        // If destination is null (root), post just exists without folder assignment
      });

      // Move selected folders
      selectedFolderIds.forEach((folderId) => {
        const folderToMove = findFolder(updated, folderId);
        if (!folderToMove) return;

        // Remove from current location
        updated = removeFromTree(updated, folderId);

        // Update parentId
        const moved = { ...folderToMove, parentId: destinationId };

        // Add to destination
        if (destinationId === null) {
          updated = [...updated, moved];
        } else {
          updated = addChildToTree(updated, destinationId, moved);
        }
      });

      return updated;
    });

    setIsMoveModalOpen(false);
    exitSelectMode();
  };

  // ─── Folder CRUD ───
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: BookmarkFolder = {
      id: Date.now(),
      name: newFolderName.trim(),
      parentId: currentFolderId,
      children: [],
      postIds: [],
    };
    if (currentFolderId === null) {
      setFolders((prev) => [...prev, newFolder]);
    } else {
      setFolders((prev) => addChildToTree(prev, currentFolderId, newFolder));
    }
    setNewFolderName('');
    setIsCreating(false);
  };

  const handleDeleteFolder = (id: number) => {
    setFolders((prev) => removeFromTree(prev, id));
    if (currentPath.includes(id)) {
      setCurrentPath((prev) => prev.slice(0, prev.indexOf(id)));
    }
  };

  const handleRenameFolder = () => {
    if (!editName.trim() || editingId === null) return;
    setFolders((prev) => updateInTree(prev, editingId, (f) => ({ ...f, name: editName.trim() })));
    setEditingId(null);
  };

  const handleCreateSubfolder = (parentId: number) => {
    if (!subfolderName.trim()) return;
    const newFolder: BookmarkFolder = {
      id: Date.now(),
      name: subfolderName.trim(),
      parentId,
      children: [],
      postIds: [],
    };
    setFolders((prev) => addChildToTree(prev, parentId, newFolder));
    setSubfolderName('');
    setAddingSubfolderToId(null);
  };

  // ─── Post interactions ───
  const handleLike = useCallback((postId: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1 }
          : p
      )
    );
  }, []);

  const handleBookmark = useCallback((postId: number) => {
    setPosts((prev) => {
      const target = prev.find((p) => p.id === postId);
      if (target?.isBookmarked) return prev.filter((p) => p.id !== postId);
      return prev.map((p) => p.id === postId ? { ...p, isBookmarked: true, bookmarkCount: p.bookmarkCount + 1 } : p);
    });
  }, []);

  const handleDelete = useCallback((postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  return (
    <MainLayout headerProps={{ title: '북마크', showBackButton: true, showSearch: false }}>
      <div className="bg-white lg:border lg:border-neutral-200 lg:rounded-xl">
        {/* Breadcrumb navigation */}
        <div className="px-4 pt-3 pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => { setCurrentPath([]); exitSelectMode(); }}
              className={`hover:underline transition-colors ${currentPath.length === 0 ? 'font-semibold text-neutral-900' : 'text-neutral-500'}`}
            >
              전체
            </button>
            {breadcrumbs.map((bc, i) => (
              <React.Fragment key={bc.id}>
                <svg className="w-3.5 h-3.5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <button
                  onClick={() => { setCurrentPath((prev) => prev.slice(0, i + 1)); exitSelectMode(); }}
                  className={`hover:underline transition-colors ${i === breadcrumbs.length - 1 ? 'font-semibold text-neutral-900' : 'text-neutral-500'}`}
                >
                  {bc.name}
                </button>
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-neutral-400">
              {displayPosts.length}개 북마크 · {currentSubFolders.length}개 폴더
            </span>
            <div className="flex items-center gap-3">
              {/* Select mode toggle */}
              {(displayPosts.length > 0 || currentSubFolders.length > 0) && (
                <button
                  onClick={() => isSelectMode ? exitSelectMode() : setIsSelectMode(true)}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    isSelectMode ? 'text-neutral-900 font-medium' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  {isSelectMode ? '취소' : '선택'}
                </button>
              )}
              {!isSelectMode && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  새 폴더
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Select mode action bar */}
        {isSelectMode && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100 bg-neutral-50/80">
            <div className="flex items-center gap-3">
              <button
                onClick={selectAll}
                className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                전체선택
              </button>
              {totalSelected > 0 && (
                <span className="text-xs font-medium text-neutral-900">{totalSelected}개 선택됨</span>
              )}
            </div>
            <Button
              size="sm"
              disabled={totalSelected === 0}
              onClick={() => setIsMoveModalOpen(true)}
            >
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              이동
            </Button>
          </div>
        )}

        {/* Create folder input */}
        {isCreating && !isSelectMode && (
          <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
            <input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              placeholder="폴더 이름"
              className="flex-1 h-8 px-3 text-sm rounded-lg border border-neutral-200 outline-none focus:border-neutral-900"
              autoFocus
            />
            <Button size="sm" onClick={handleCreateFolder} disabled={!newFolderName.trim()}>추가</Button>
            <button onClick={() => { setIsCreating(false); setNewFolderName(''); }} className="text-xs text-neutral-500 hover:text-neutral-900">취소</button>
          </div>
        )}

        {/* Sub-folders grid */}
        {currentSubFolders.length > 0 && (
          <div className="px-4 py-3 border-b border-neutral-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currentSubFolders.map((folder) => (
                <div key={folder.id} className="group relative">
                  {editingId === folder.id ? (
                    <div className="flex items-center gap-1 p-2 rounded-lg border border-neutral-300 bg-white">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder()}
                        className="flex-1 text-xs outline-none min-w-0"
                        autoFocus
                      />
                      <button onClick={handleRenameFolder} className="text-[10px] text-neutral-900 font-medium shrink-0">저장</button>
                      <button onClick={() => setEditingId(null)} className="text-[10px] text-neutral-400 shrink-0">취소</button>
                    </div>
                  ) : isSelectMode ? (
                    /* Select mode: folder with checkbox */
                    <button
                      onClick={() => toggleSelectFolder(folder.id)}
                      className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg border transition-colors text-left ${
                        selectedFolderIds.has(folder.id)
                          ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        selectedFolderIds.has(folder.id)
                          ? 'bg-neutral-900 border-neutral-900'
                          : 'border-neutral-300'
                      }`}>
                        {selectedFolderIds.has(folder.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-neutral-900 truncate">{folder.name}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {countAllPosts(folder)}개 · {folder.children.length}개 폴더
                        </p>
                      </div>
                    </button>
                  ) : (
                    /* Normal mode: folder card */
                    <button
                      onClick={() => setCurrentPath((prev) => [...prev, folder.id])}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <svg className="w-5 h-5 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-neutral-900 truncate">{folder.name}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {countAllPosts(folder)}개 · {folder.children.length}개 폴더
                        </p>
                      </div>
                    </button>
                  )}

                  {/* Folder actions (hover) - only in normal mode */}
                  {!isSelectMode && editingId !== folder.id && (
                    <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setAddingSubfolderToId(folder.id); setSubfolderName(''); }}
                        className="w-6 h-6 flex items-center justify-center rounded bg-white/80 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
                        title="하위 폴더 추가"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingId(folder.id); setEditName(folder.name); }}
                        className="w-6 h-6 flex items-center justify-center rounded bg-white/80 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
                        title="이름 변경"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                        className="w-6 h-6 flex items-center justify-center rounded bg-white/80 hover:bg-red-50 text-neutral-400 hover:text-red-500"
                        title="삭제"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Inline subfolder creation input */}
                  {!isSelectMode && addingSubfolderToId === folder.id && (
                    <div className="mt-1.5 flex items-center gap-1 p-2 rounded-lg border border-neutral-300 bg-white">
                      <svg className="w-3.5 h-3.5 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <input
                        value={subfolderName}
                        onChange={(e) => setSubfolderName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateSubfolder(folder.id)}
                        placeholder="하위 폴더 이름"
                        className="flex-1 text-xs outline-none min-w-0"
                        autoFocus
                      />
                      <button
                        onClick={() => handleCreateSubfolder(folder.id)}
                        disabled={!subfolderName.trim()}
                        className="text-[10px] text-neutral-900 font-medium shrink-0 disabled:text-neutral-300"
                      >
                        추가
                      </button>
                      <button onClick={() => setAddingSubfolderToId(null)} className="text-[10px] text-neutral-400 shrink-0">취소</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        {isSelectMode ? (
          /* Select mode: posts with checkboxes */
          <div>
            {displayPosts.map((post) => (
              <div key={post.id} className="relative">
                {/* Checkbox overlay */}
                <button
                  onClick={() => toggleSelectPost(post.id)}
                  className="absolute top-4 left-4 z-10 w-6 h-6 flex items-center justify-center"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedPostIds.has(post.id)
                      ? 'bg-neutral-900 border-neutral-900'
                      : 'bg-white border-neutral-300'
                  }`}>
                    {selectedPostIds.has(post.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
                {/* Post card with left padding for checkbox */}
                <div
                  className={`transition-colors ${
                    selectedPostIds.has(post.id) ? 'bg-neutral-50' : ''
                  }`}
                  onClick={() => toggleSelectPost(post.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="pointer-events-none pl-6">
                    <PingCard post={post} />
                  </div>
                </div>
              </div>
            ))}
            {displayPosts.length === 0 && currentSubFolders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
                <p className="text-sm">선택할 항목이 없습니다</p>
              </div>
            )}
          </div>
        ) : (
          /* Normal mode */
          <>
            <FeedList
              posts={displayPosts}
              isLoading={false}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onDelete={handleDelete}
            />
            {displayPosts.length === 0 && currentSubFolders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p className="text-sm">이 폴더에 저장된 북마크가 없습니다</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Move destination modal */}
      {isMoveModalOpen && (
        <FolderPickerModal
          folders={folders}
          disabledIds={disabledMoveTargets}
          currentFolderId={currentFolderId}
          onSelect={handleMoveItems}
          onClose={() => setIsMoveModalOpen(false)}
        />
      )}
    </MainLayout>
  );
}
