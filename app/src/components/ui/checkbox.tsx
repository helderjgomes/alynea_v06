'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    priority?: 'low' | 'medium' | 'high';
    disabled?: boolean;
    className?: string;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
    ({ checked = false, onCheckedChange, priority, disabled = false, className }, ref) => {
        const priorityColors = {
            low: '#86868B',
            medium: '#F6BD16',
            high: '#FF3B30',
        };

        const borderColor = priority && !checked ? priorityColors[priority] : undefined;

        return (
            <button
                ref={ref}
                type="button"
                role="checkbox"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onCheckedChange?.(!checked)}
                className={cn(
                    'flex-shrink-0 w-[18px] h-[18px] rounded-full border-2 transition-all',
                    'flex items-center justify-center',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    checked
                        ? 'bg-[#007AFF] border-[#007AFF]'
                        : 'bg-transparent border-[#D1D1D6] hover:border-[#007AFF]/50',
                    className
                )}
                style={{
                    borderColor: !checked ? borderColor : undefined,
                }}
            >
                {checked && (
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
            </button>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
