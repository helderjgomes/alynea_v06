'use client';

/**
 * QuickAdd
 * 
 * Inline task creation input. Minimal, distraction-free.
 * Appears at the top of task lists.
 */

import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';

interface QuickAddProps {
    onAdd: (title: string) => void;
    placeholder?: string;
}

export function QuickAdd({ onAdd, placeholder = 'Add a task...' }: QuickAddProps) {
    const [isActive, setIsActive] = useState(false);
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onAdd(value.trim());
            setValue('');
            inputRef.current?.focus();
        }
    };

    const handleBlur = () => {
        if (!value.trim()) {
            setIsActive(false);
        }
    };

    return (
        <form className="quick-add" onSubmit={handleSubmit}>
            {!isActive ? (
                <button
                    type="button"
                    className="quick-add-trigger"
                    onClick={() => {
                        setIsActive(true);
                        setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                >
                    <Plus size={16} strokeWidth={1.5} />
                    <span>{placeholder}</span>
                </button>
            ) : (
                <div className="quick-add-input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        className="quick-add-input"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={(e) => e.key === 'Escape' && setIsActive(false)}
                        placeholder="Task title..."
                    />
                </div>
            )}

            <style jsx>{`
        .quick-add {
          padding: var(--space-2) var(--space-3);
        }

        .quick-add-trigger {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          width: 100%;
          padding: var(--space-2) var(--space-3);
          border: none;
          background: transparent;
          color: var(--color-text-tertiary);
          font-size: 14px;
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          text-align: left;
        }

        .quick-add-trigger:hover {
          background: rgba(0, 0, 0, 0.03);
          color: var(--color-text-secondary);
        }

        .quick-add-input-wrapper {
          display: flex;
          align-items: center;
        }

        .quick-add-input {
          width: 100%;
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--color-accent);
          background: var(--color-bg-primary);
          border-radius: var(--radius-md);
          font-size: 14px;
          color: var(--color-text-primary);
          outline: none;
        }

        .quick-add-input::placeholder {
          color: var(--color-text-tertiary);
        }
      `}</style>
        </form>
    );
}
