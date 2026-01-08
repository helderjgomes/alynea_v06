'use client';

/**
 * Top Bar
 * 
 * View title, add task button, and search placeholder.
 * Minimal, content doesn't compete with main view.
 */

import { Plus, Search } from 'lucide-react';

interface TopBarProps {
    title: string;
    onAddTask?: () => void;
}

export function TopBar({ title, onAddTask }: TopBarProps) {
    return (
        <header className="top-bar">
            <h1 className="view-title">{title}</h1>

            <div className="top-bar-actions">
                <button
                    className="search-button"
                    onClick={() => {/* TODO: Implement search */ }}
                    aria-label="Search"
                >
                    <Search size={16} strokeWidth={1.5} />
                    <span>Search</span>
                    <kbd>⌘K</kbd>
                </button>

                {onAddTask && (
                    <button
                        className="add-task-button"
                        onClick={onAddTask}
                        aria-label="Add task"
                    >
                        <Plus size={16} strokeWidth={2} />
                        <span>Add Task</span>
                    </button>
                )}
            </div>

            <style jsx>{`
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-6);
          height: 52px;
          border-bottom: 1px solid var(--color-divider);
          background: var(--color-bg-primary);
          flex-shrink: 0;
        }

        .view-title {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .top-bar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .search-button {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--color-border);
          background: var(--color-bg-tertiary);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          font-size: 13px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .search-button:hover {
          border-color: var(--color-text-tertiary);
        }

        .search-button kbd {
          font-family: var(--font-sans);
          font-size: 11px;
          padding: 2px 4px;
          background: var(--color-bg-secondary);
          border-radius: 3px;
          color: var(--color-text-tertiary);
        }

        .add-task-button {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          border: none;
          background: var(--color-accent);
          border-radius: var(--radius-md);
          color: white;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .add-task-button:hover {
          background: var(--color-accent-hover);
        }
      `}</style>
        </header>
    );
}
