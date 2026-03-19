import React from 'react';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  size?: LogoSize;
  href?: string;
  className?: string;
}

const sizeStyles: Record<LogoSize, string> = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  href = '/',
  className = '',
}) => {
  return (
    <a
      href={href}
      className={`inline-flex items-center font-bold tracking-tight text-neutral-900 hover:opacity-80 transition-opacity ${sizeStyles[size]} ${className}`}
    >
      DuckDuck
    </a>
  );
};
