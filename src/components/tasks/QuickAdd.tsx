'use client';

/**
 * QuickAdd
 * 
 * Inline task creation with keyboard hint.
 */

import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Plus } from 'lucide-react';

interface QuickAddProps {
    onAdd: (title: string) => void;
}

export interface QuickAddRef {
    focus: () => void;
}

export const QuickAdd = forwardRef<QuickAddRef, QuickAddProps>(({ onAdd }, ref) => {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus()
    }));

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && value.trim()) {
            onAdd(value.trim());
            setValue('');
        }
        if (e.key === 'Escape') {
            setValue('');
            inputRef.current?.blur();
        }
    };

    return (
        <div className="flex items-center gap-3.5 py-4 px-3 group border-b border-transparent">
            <Plus size={18} className="text-[#C7C7CC]" />
            <input
                ref={inputRef}
                type="text"
                placeholder="New Task"
                className="flex-1 bg-transparent border-none p-0 text-[15px] text-[#1d1d1f] placeholder-[#C7C7CC] outline-none"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <span className="text-[10px] text-[#C7C7CC] font-medium opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                ⌘N
            </span>
        </div>
    );
});

QuickAdd.displayName = 'QuickAdd';
