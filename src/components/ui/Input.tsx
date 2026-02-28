import React, { forwardRef } from 'react';
import { cn } from '@/utils/helpers';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'form-input flex h-10 w-full rounded-md border border-light-brown/30 bg-pure-white px-3 py-2 text-sm text-dark-gray placeholder:text-medium-gray disabled:cursor-not-allowed disabled:opacity-50 focus:border-soft-gold focus:outline-none transition-colors duration-300',
          error && 'border-destructive focus:border-destructive',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };