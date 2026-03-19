import React from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: AvatarSize;
  isBlueChecked?: boolean;
  showBadge?: boolean;
  badgeColor?: string;
  className?: string;
}

const sizeMap: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-xl',
  '2xl': 'w-28 h-28 text-2xl',
};

const badgeSizeMap: Record<AvatarSize, string> = {
  xs: 'w-2 h-2',
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5',
};

const checkSizeMap: Record<AvatarSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
  '2xl': 'w-7 h-7',
};

const nameColors = [
  'bg-red-200 text-red-800',
  'bg-orange-200 text-orange-800',
  'bg-amber-200 text-amber-800',
  'bg-yellow-200 text-yellow-800',
  'bg-lime-200 text-lime-800',
  'bg-green-200 text-green-800',
  'bg-emerald-200 text-emerald-800',
  'bg-teal-200 text-teal-800',
  'bg-cyan-200 text-cyan-800',
  'bg-sky-200 text-sky-800',
  'bg-blue-200 text-blue-800',
  'bg-indigo-200 text-indigo-800',
  'bg-violet-200 text-violet-800',
  'bg-purple-200 text-purple-800',
  'bg-fuchsia-200 text-fuchsia-800',
  'bg-pink-200 text-pink-800',
];

function getNameColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % nameColors.length;
  return nameColors[index];
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  isBlueChecked = false,
  showBadge = false,
  badgeColor = 'bg-green-500',
  className = '',
}) => {
  const initials = alt.charAt(0).toUpperCase();
  const colorClass = getNameColor(alt);

  return (
    <div className={`relative inline-flex shrink-0 rounded-full ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeMap[size]} rounded-full object-cover bg-neutral-200`}
        />
      ) : (
        <div
          className={`${sizeMap[size]} rounded-full ${colorClass} flex items-center justify-center font-medium`}
          aria-label={alt}
        >
          {initials}
        </div>
      )}

      {showBadge && (
        <span
          className={`absolute bottom-0 right-0 ${badgeSizeMap[size]} ${badgeColor} rounded-full ring-2 ring-white`}
        />
      )}

      {isBlueChecked && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${checkSizeMap[size]} flex items-center justify-center`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full"
          >
            <circle cx="12" cy="12" r="12" fill="#3B82F6" />
            <path
              d="M9 12.5L11 14.5L15.5 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </div>
  );
};
