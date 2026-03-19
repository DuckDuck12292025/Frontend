import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, showCount = false, maxLength, className = '', id, value, defaultValue, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const currentLength = typeof value === 'string'
      ? value.length
      : typeof defaultValue === 'string'
        ? defaultValue.length
        : 0;

    const isNearLimit = maxLength ? currentLength >= maxLength * 0.9 : false;
    const isAtLimit = maxLength ? currentLength >= maxLength : false;

    const counterColor = isAtLimit
      ? 'text-red-600'
      : isNearLimit
        ? 'text-amber-600'
        : 'text-neutral-400';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          className={`
            w-full min-h-[100px] px-3 py-2.5 rounded-lg text-sm resize-y
            bg-white text-neutral-900 placeholder:text-neutral-400
            border transition-colors duration-150
            ${error
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'
            }
            disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
            outline-none
            ${className}
          `.trim()}
          {...props}
        />
        <div className="flex items-center justify-between mt-1">
          <div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            {helperText && !error && (
              <p className="text-xs text-neutral-500">{helperText}</p>
            )}
          </div>
          {showCount && (
            <p className={`text-xs ${counterColor} ml-auto`}>
              {currentLength}{maxLength ? `/${maxLength}` : ''}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
