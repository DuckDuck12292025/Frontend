import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-700',
  secondary: 'bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100',
  ghost: 'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  outline: 'bg-transparent text-neutral-900 border border-neutral-900 hover:bg-neutral-900 hover:text-white active:bg-neutral-800',
  link: 'bg-transparent text-neutral-900 underline-offset-4 hover:underline p-0 h-auto',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const Spinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const spinnerSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div
      className={`${spinnerSize} border-2 border-current/30 border-t-current rounded-full animate-spin`}
    />
  );
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-colors duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${variant !== 'link' ? sizeStyles[size] : ''}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'relative' : ''}
        ${className}
      `.trim()}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-inherit">
          <Spinner size={size} />
        </div>
      )}
      <span className={`inline-flex items-center gap-2 ${loading ? 'invisible' : ''}`}>
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </span>
    </button>
  );
};
