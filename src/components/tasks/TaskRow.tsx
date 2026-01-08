'use client';

/**
 * TaskRow
 * 
 * Single task item in a list. Apple Reminders-inspired.
 * - Circular completion control
 * - Title (primary)
 * - Subtle metadata (due date, project)
 * - No visible borders, subtle hover states
 */

import { Circle, CheckCircle2 } from 'lucide-react';
import type { Task, Project } from '@/types/database';

interface TaskRowProps {
    task: Task;
    project?: Project | null;
    onToggleComplete: (id: string, completed: boolean) => void;
    onSelect: (task: Task) => void;
    isSelected?: boolean;
}

export function TaskRow({
    task,
    project,
    onToggleComplete,
    onSelect,
    isSelected = false
}: TaskRowProps) {
    const isCompleted = task.status === 'done';

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleComplete(task.id, !isCompleted);
    };

    const formatDueDate = (date: string | null) => {
        if (!date) return null;
        const d = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (d.toDateString() === today.toDateString()) return 'Today';
        if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const dueLabel = formatDueDate(task.due_date);
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isCompleted;

    return (
        <div
            className={`task-row ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
            onClick={() => onSelect(task)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(task)}
        >
            <button
                className="completion-control"
                onClick={handleToggle}
                aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
            >
                {isCompleted ? (
                    <CheckCircle2 size={20} strokeWidth={1.5} />
                ) : (
                    <Circle size={20} strokeWidth={1.5} />
                )}
            </button>

            <div className="task-content">
                <span className="task-title">{task.title}</span>

                <div className="task-meta">
                    {dueLabel && (
                        <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                            {dueLabel}
                        </span>
                    )}
                    {project && (
                        <span className="project-name">{project.name}</span>
                    )}
                </div>
            </div>

            <style jsx>{`
        .task-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) var(--space-3);
          min-height: var(--task-row-height);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .task-row:hover {
          background: rgba(0, 0, 0, 0.03);
        }

        .task-row.selected {
          background: rgba(0, 122, 255, 0.08);
        }

        .task-row.completed .task-title {
          color: var(--color-text-tertiary);
          text-decoration: line-through;
        }

        .completion-control {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          color: var(--color-text-tertiary);
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          transition: color var(--transition-fast);
        }

        .completion-control:hover {
          color: var(--color-accent);
        }

        .task-row.completed .completion-control {
          color: var(--color-success);
        }

        .task-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .task-title {
          font-size: 14px;
          font-weight: 400;
          color: var(--color-text-primary);
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .task-meta {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 12px;
          color: var(--color-text-secondary);
        }

        .due-date {
          color: var(--color-text-secondary);
        }

        .due-date.overdue {
          color: var(--color-error);
        }

        .project-name {
          color: var(--color-text-tertiary);
        }

        .project-name::before {
          content: '•';
          margin-right: var(--space-2);
        }
      `}</style>
        </div>
    );
}
