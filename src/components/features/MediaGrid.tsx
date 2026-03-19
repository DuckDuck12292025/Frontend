'use client';

import React, { useState } from 'react';
import type { PostMedia } from '@/types';

interface MediaGridProps {
  media: PostMedia[];
  className?: string;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  media,
  className = '',
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!media || media.length === 0) return null;

  const visibleMedia = media.slice(0, 4);
  const remainingCount = media.length - 4;

  const getGridClass = () => {
    switch (visibleMedia.length) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      default:
        return 'grid-cols-2 grid-rows-2';
    }
  };

  const getAspectClass = (index: number) => {
    if (visibleMedia.length === 1) return 'aspect-video';
    if (visibleMedia.length === 3 && index === 0) return 'aspect-square row-span-2';
    return 'aspect-square';
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  return (
    <>
      <div
        className={`grid ${getGridClass()} gap-0.5 rounded-xl overflow-hidden border border-neutral-100 ${className}`}
      >
        {visibleMedia.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            className={`relative ${getAspectClass(index)} bg-neutral-100 overflow-hidden focus:outline-none`}
          >
            {item.mediaType === 'VIDEO' ? (
              <div className="relative w-full h-full">
                <img
                  src={item.thumbnailUrl || item.mediaUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={item.mediaUrl}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}

            {/* GIF badge */}
            {item.mediaType === 'GIF' && (
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded">
                GIF
              </span>
            )}

            {/* Remaining count overlay */}
            {index === 3 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  +{remainingCount}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={handleClose}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            aria-label="닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white text-sm font-medium z-10">
            {selectedIndex + 1} / {media.length}
          </div>

          {/* Previous button */}
          {selectedIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex - 1);
              }}
              className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
              aria-label="이전"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {selectedIndex < media.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex + 1);
              }}
              className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
              aria-label="다음"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Media content */}
          <div
            className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {media[selectedIndex].mediaType === 'VIDEO' ? (
              <video
                src={media[selectedIndex].mediaUrl}
                controls
                autoPlay
                className="max-w-full max-h-[90vh] object-contain"
              />
            ) : (
              <img
                src={media[selectedIndex].mediaUrl}
                alt=""
                className="max-w-full max-h-[90vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
