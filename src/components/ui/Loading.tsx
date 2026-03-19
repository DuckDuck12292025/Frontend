import React from 'react';

/* --- Loading (existing spinner) --- */

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const Loading: React.FC<LoadingProps> = ({ size = 'md', className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeMap[size]} border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin`}
      />
    </div>
  );
};

/* --- LoadingOverlay --- */

interface LoadingOverlayProps {
  visible?: boolean;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible = true, className = '' }) => {
  if (!visible) return null;

  return (
    <div className={`absolute inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-inherit ${className}`}>
      <Loading size="lg" />
    </div>
  );
};

/* --- LoadingDots --- */

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const dotSizeMap = {
  sm: 'w-1 h-1',
  md: 'w-1.5 h-1.5',
  lg: 'w-2 h-2',
};

export const LoadingDots: React.FC<LoadingDotsProps> = ({ size = 'md', className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <span className={`${dotSizeMap[size]} bg-neutral-900 rounded-full animate-bounce [animation-delay:-0.3s]`} />
      <span className={`${dotSizeMap[size]} bg-neutral-900 rounded-full animate-bounce [animation-delay:-0.15s]`} />
      <span className={`${dotSizeMap[size]} bg-neutral-900 rounded-full animate-bounce`} />
    </div>
  );
};

/* --- FullPageLoading --- */

interface FullPageLoadingProps {
  message?: string;
  className?: string;
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({ message, className = '' }) => {
  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white ${className}`}>
      <Loading size="lg" />
      {message && (
        <p className="mt-4 text-sm text-neutral-500 font-medium">{message}</p>
      )}
    </div>
  );
};
