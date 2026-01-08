'use client';

import * as React from 'react';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export interface TopBarProps {
    title: string;
    subtitle?: string;
    onNewTask?: () => void;
    showSearch?: boolean;
    actions?: React.ReactNode;
    className?: string;
}

export function TopBar({
    title,
    subtitle,
    onNewTask,
    showSearch = false,
    actions,
    className,
}: TopBarProps) {
    return (
        <header
            className={cn(
                'h-14 px-4 flex items-center justify-between border-b border-black/[0.04]',
                className
            )}
        >
            {/* Left - Title */}
            <div className="flex items-center gap-3">
                <div>
                    <h1 className="text-[20px] font-medium text-[#1D1D1F]">{title}</h1>
                    {subtitle && (
                        <p className="text-[12px] text-[#86868B] mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
                {showSearch && (
                    <div className="relative">
                        <Search
                            size={14}
                            strokeWidth={2}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#86868B]"
                        />
                        <Input
                            placeholder="Search..."
                            className="pl-8 w-48 h-8 text-[13px] bg-black/[0.03] border-none"
                        />
                    </div>
                )}

                {actions}

                <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreHorizontal size={16} strokeWidth={1.5} className="text-[#86868B]" />
                </Button>

                {onNewTask && (
                    <Button size="sm" onClick={onNewTask}>
                        <Plus size={14} strokeWidth={2} />
                        New Task
                    </Button>
                )}
            </div>
        </header>
    );
}
