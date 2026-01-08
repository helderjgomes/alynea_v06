'use client';

import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

export function SortableItem({ id, children, className }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'relative',
                isDragging && 'z-50 opacity-75 shadow-lg',
                className
            )}
            {...attributes}
            {...listeners}
        >
            {children}
        </div>
    );
}
