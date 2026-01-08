'use client';

import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    count?: number;
    active?: boolean;
    onClick?: () => void;
    className?: string;
}

const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
    ({ icon: Icon, label, count, active = false, onClick, className }, ref) => {
        return (
            <button
                ref={ref}
                onClick={onClick}
                className={cn(
                    'w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-all group',
                    active
                        ? 'bg-[#007AFF]/10 text-[#007AFF]'
                        : 'text-[#1D1D1F] hover:bg-black/[0.04]',
                    className
                )}
            >
                <div className="flex items-center gap-2.5">
                    <Icon size={16} strokeWidth={1.5} />
                    <span className="text-[14px]">{label}</span>
                </div>
                {count !== undefined && (
                    <span
                        className={cn(
                            'text-[12px] tabular-nums',
                            active ? 'text-[#007AFF]/70' : 'text-[#86868B]'
                        )}
                    >
                        {count}
                    </span>
                )}
            </button>
        );
    }
);

SidebarItem.displayName = 'SidebarItem';

export { SidebarItem };
