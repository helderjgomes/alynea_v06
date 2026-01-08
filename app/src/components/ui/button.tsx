import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        return (
            <Comp
                className={cn(
                    // Base styles
                    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all active:scale-[0.98]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',

                    // Variants
                    {
                        // Primary - Brand blue
                        'bg-[#007AFF] text-white hover:bg-[#0051D5]': variant === 'primary',

                        // Secondary - Subtle
                        'bg-[#F5F5F4] text-[#1D1D1F] hover:bg-black/[0.08]': variant === 'secondary',

                        // Ghost - Transparent
                        'bg-transparent text-[#1D1D1F] hover:bg-black/[0.04]': variant === 'ghost',

                        // Destructive - Red
                        'bg-[#FF3B30] text-white hover:bg-[#D70015]': variant === 'destructive',
                    },

                    // Sizes
                    {
                        'h-8 px-3 text-[13px]': size === 'sm',
                        'h-10 px-4 text-[14px]': size === 'md',
                        'h-12 px-6 text-[15px]': size === 'lg',
                        'h-10 w-10 p-0': size === 'icon',
                    },

                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export { Button };
