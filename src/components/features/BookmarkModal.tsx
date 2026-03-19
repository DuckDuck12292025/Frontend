'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui';

export interface BookmarkFolder {
  id: number;
  name: string;
  count: number;
}

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: BookmarkFolder[];
  selectedFolderIds: number[];
  onSave: (folderIds: number[]) => void;
  onCreateFolder: (name: string) => void;
}

export const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  onClose,
  folders,
  selectedFolderIds,
  onSave,
  onCreateFolder,
}) => {
  const [checkedIds, setCheckedIds] = useState<number[]>(selectedFolderIds);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Sync checkedIds when modal opens with new selectedFolderIds
  React.useEffect(() => {
    if (isOpen) {
      setCheckedIds(selectedFolderIds);
      setIsCreatingFolder(false);
      setNewFolderName('');
    }
  }, [isOpen, selectedFolderIds]);

  const toggleFolder = (folderId: number) => {
    setCheckedIds((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleCreateFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    onCreateFolder(trimmed);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleSave = () => {
    onSave(checkedIds);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="북마크에 저장">
      <div className="space-y-1">
        {folders.map((folder) => (
          <label
            key={folder.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={checkedIds.includes(folder.id)}
              onChange={() => toggleFolder(folder.id)}
              className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 focus:ring-offset-0 accent-neutral-900"
            />
            <span className="flex-1 text-sm text-neutral-900">{folder.name}</span>
            <span className="text-xs text-neutral-400">{folder.count}</span>
          </label>
        ))}
      </div>

      {/* Create new folder */}
      {isCreatingFolder ? (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
          <input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            placeholder="폴더 이름"
            className="flex-1 h-9 px-3 text-sm rounded-lg border border-neutral-200 outline-none focus:border-neutral-900 transition-colors"
            autoFocus
          />
          <Button size="sm" onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
            추가
          </Button>
          <button
            onClick={() => {
              setIsCreatingFolder(false);
              setNewFolderName('');
            }}
            className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            취소
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreatingFolder(true)}
          className="flex items-center gap-2 w-full mt-3 pt-3 border-t border-neutral-100 px-3 py-2.5 rounded-lg text-sm text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 폴더
        </button>
      )}

      {/* Save button */}
      <div className="mt-4 pt-3 border-t border-neutral-100">
        <Button className="w-full" onClick={handleSave}>
          저장
        </Button>
      </div>
    </Modal>
  );
};
