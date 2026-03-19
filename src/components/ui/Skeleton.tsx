import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-neutral-200 rounded ${className}`} />
  );
};

/* --- SkeletonText --- */

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-neutral-200 rounded h-3 ${
            i === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

/* --- SkeletonAvatar --- */

interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizeMap: Record<string, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({ size = 'md', className = '' }) => {
  return (
    <div className={`animate-pulse bg-neutral-200 rounded-full ${avatarSizeMap[size]} ${className}`} />
  );
};

/* --- SkeletonCard --- */

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white border border-neutral-200 rounded-xl p-4 space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="sm" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  );
};

/* --- SkeletonPost --- */

interface SkeletonPostProps {
  className?: string;
}

export const SkeletonPost: React.FC<SkeletonPostProps> = ({ className = '' }) => {
  return (
    <div className={`border-b border-neutral-200 p-4 space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="md" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex items-center gap-6 pt-1">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
};
