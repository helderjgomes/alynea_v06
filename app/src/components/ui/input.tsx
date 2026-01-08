import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'ghost' | 'title';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant = 'default', type = 'text', ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    // Base styles
                    'flex w-full rounded-lg transition-colors',
                    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                    'placeholder:text-[#C7C7CC]',
                    'focus-visible:outline-none',
                    'disabled:cursor-not-allowed disabled:opacity-50',

                    // Variants
                    {
                        // Default - With border
                        'h-10 px-3 text-[14px] text-[#1D1D1F] bg-white border border-[#D1D1D6] focus-visible:border-[#007AFF] focus-visible:ring-1 focus-visible:ring-[#007AFF]':
                            variant === 'default',

                        // Ghost - Borderless (Figma style)
                        'px-0 text-[14px] text-[#1D1D1F] bg-transparent border-none':
                            variant === 'ghost',

                        // Title - Large heading input
                        'px-0 text-[20px] font-medium text-[#1D1D1F] bg-transparent border-none':
                            variant === 'title',
                    },

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
