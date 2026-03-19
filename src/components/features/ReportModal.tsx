'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType?: 'USER' | 'POST' | 'COMMENT';
  targetId?: number;
}

const REPORT_REASONS = [
  { value: 'spam', label: '스팸' },
  { value: 'harassment', label: '괴롭힘' },
  { value: 'hate_speech', label: '혐오 발언' },
  { value: 'violence', label: '폭력적 콘텐츠' },
  { value: 'sexual', label: '성적 콘텐츠' },
  { value: 'misinformation', label: '허위 정보' },
  { value: 'other', label: '기타' },
] as const;

type ReportReasonValue = (typeof REPORT_REASONS)[number]['value'];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReasonValue | null>(null);
  const [otherDescription, setOtherDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);

    // Mock action - log and close
    console.log('Report submitted:', {
      targetType,
      targetId,
      reason: selectedReason,
      description: selectedReason === 'other' ? otherDescription : undefined,
    });

    // Simulate brief delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    setIsSubmitting(false);
    setSelectedReason(null);
    setOtherDescription('');
    onClose();
  };

  const handleClose = () => {
    setSelectedReason(null);
    setOtherDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="신고하기">
      <div className="space-y-3">
        <p className="text-sm text-neutral-500 mb-4">
          신고 사유를 선택해주세요.
        </p>

        <div className="space-y-2">
          {REPORT_REASONS.map((reason) => (
            <label
              key={reason.value}
              className={`
                flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${selectedReason === reason.value
                  ? 'border-neutral-900 bg-neutral-50'
                  : 'border-neutral-200 hover:bg-neutral-50'
                }
              `.trim()}
            >
              <div
                className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                  ${selectedReason === reason.value
                    ? 'border-neutral-900'
                    : 'border-neutral-300'
                  }
                `.trim()}
              >
                {selectedReason === reason.value && (
                  <div className="w-2 h-2 rounded-full bg-neutral-900" />
                )}
              </div>
              <span className="text-sm text-neutral-800">{reason.label}</span>
              <input
                type="radio"
                name="report-reason"
                value={reason.value}
                checked={selectedReason === reason.value}
                onChange={() => setSelectedReason(reason.value)}
                className="sr-only"
              />
            </label>
          ))}
        </div>

        {selectedReason === 'other' && (
          <textarea
            value={otherDescription}
            onChange={(e) => setOtherDescription(e.target.value)}
            placeholder="신고 사유를 상세히 작성해주세요."
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-800 placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedReason || isSubmitting}
          className="w-full h-10 rounded-lg font-medium text-sm transition-colors duration-150 bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isSubmitting ? '제출 중...' : '신고하기'}
        </button>
      </div>
    </Modal>
  );
};
