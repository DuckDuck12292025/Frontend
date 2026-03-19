'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  url,
}) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="공유하기">
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-neutral-700 truncate">{shareUrl}</p>
          </div>
        </div>

        <button
          onClick={handleCopyLink}
          className={`
            w-full h-10 rounded-lg font-medium text-sm transition-colors duration-150
            ${copied
              ? 'bg-neutral-700 text-white'
              : 'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-700'
            }
          `.trim()}
        >
          {copied ? '복사됨!' : '링크 복사'}
        </button>
      </div>
    </Modal>
  );
};
