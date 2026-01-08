'use client';

import * as React from 'react';
import { Folder, Flag, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from './checkbox';

export interface TaskRowProps {
    id: string;
    title: string;
    notes?: string;
    completed?: boolean;
    dueDate?: string;
    project?: string;
    priority?: 'low' | 'medium' | 'high';
    onToggle?: (id: string) => void;
    onClick?: (id: string) => void;
    className?: string;
}

const priorityColors = {
    low: '#86868B',
    medium: '#F6BD16',
    high: '#FF3B30',
};

const TaskRow = React.forwardRef<HTMLDivElement, TaskRowProps>(
    (
        {
            id,
            title,
            notes,
            completed = false,
            dueDate,
            project,
            priority,
            onToggle,
            onClick,
            className,
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'group flex items-start gap-3 py-2.5 px-3',
                    'hover:bg-black/[0.02] active:bg-black/[0.04] transition-all cursor-pointer active:scale-[0.99] origin-center',
                    'border-b border-black/[0.04] last:border-0',
                    className
                )}
                onClick={() => onClick?.(id)}
            >
                {/* Checkbox */}
                <div className="mt-0.5" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        checked={completed}
                        onCheckedChange={() => onToggle?.(id)}
                        priority={priority}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <div
                        className={cn(
                            'text-[14px] leading-snug',
                            completed ? 'text-[#86868B] line-through' : 'text-[#1D1D1F]'
                        )}
                    >
                        {title}
                    </div>

                    {/* Notes preview */}
                    {notes && !completed && (
                        <div className="text-[12px] text-[#86868B] leading-relaxed mt-0.5 line-clamp-1">
                            {notes}
                        </div>
                    )}

                    {/* Meta */}
                    {(project || dueDate || priority) && !completed && (
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {project && (
                                <div className="flex items-center gap-1 text-[11px] text-[#86868B]">
                                    <Folder size={10} strokeWidth={2} />
                                    <span>{project}</span>
                                </div>
                            )}
                            {dueDate && (
                                <div className="flex items-center gap-1 text-[11px] text-[#86868B]">
                                    <Calendar size={10} strokeWidth={2} />
                                    <span>{dueDate}</span>
                                </div>
                            )}
                            {priority && (
                                <Flag
                                    size={11}
                                    strokeWidth={2}
                                    style={{ color: priorityColors[priority] }}
                                    fill={priority === 'high' ? priorityColors[priority] : 'none'}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

TaskRow.displayName = 'TaskRow';

export { TaskRow };
