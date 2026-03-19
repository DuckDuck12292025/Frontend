import React from 'react';

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'premium';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  dotColor?: string;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700',
  success: 'bg-green-50 text-green-700',
  danger: 'bg-red-50 text-red-700',
  warning: 'bg-amber-50 text-amber-700',
  info: 'bg-blue-50 text-blue-700',
  outline: 'bg-transparent text-neutral-700 border border-neutral-300',
  premium: 'bg-neutral-900 text-white',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  dot = false,
  dotColor = 'bg-current',
  removable = false,
  onRemove,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-black/10 transition-colors ml-0.5 cursor-pointer"
          aria-label="Remove"
        >
          <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 3L9 9M9 3L3 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
};
