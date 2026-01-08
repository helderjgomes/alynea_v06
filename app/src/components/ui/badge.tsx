import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
    size?: 'sm' | 'md';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', size = 'md', ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    // Base styles
                    'inline-flex items-center rounded-full font-medium transition-colors',

                    // Sizes
                    {
                        'px-2 py-0.5 text-[11px]': size === 'sm',
                        'px-2.5 py-0.5 text-[12px]': size === 'md',
                    },

                    // Variants
                    {
                        // Default - Brand blue
                        'bg-[#007AFF]/10 text-[#007AFF]': variant === 'default',

                        // Secondary - Gray
                        'bg-[#F5F5F4] text-[#86868B]': variant === 'secondary',

                        // Success - Green
                        'bg-[#34C759]/10 text-[#34C759]': variant === 'success',

                        // Warning - Yellow
                        'bg-[#F6BD16]/10 text-[#F6BD16]': variant === 'warning',

                        // Destructive - Red
                        'bg-[#FF3B30]/10 text-[#FF3B30]': variant === 'destructive',

                        // Outline - Border only
                        'bg-transparent border border-[#D1D1D6] text-[#86868B]': variant === 'outline',
                    },

                    className
                )}
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';

export { Badge };
