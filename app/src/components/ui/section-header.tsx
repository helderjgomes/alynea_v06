import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    action?: React.ReactNode;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
    ({ className, title, action, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'flex items-center justify-between px-2.5 py-1.5',
                    className
                )}
                {...props}
            >
                <h2 className="text-[11px] uppercase tracking-wide text-[#86868B] font-medium">
                    {title}
                </h2>
                {action && <div className="flex items-center">{action}</div>}
            </div>
        );
    }
);

SectionHeader.displayName = 'SectionHeader';

export { SectionHeader };
