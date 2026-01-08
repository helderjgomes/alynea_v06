'use client';

/**
 * TaskList
 * 
 * Clean vertical list of tasks.
 * No visible borders per row, dividers between groups.
 */

import { TaskRow } from './TaskRow';
import type { Task, Project } from '@/types/database';

interface TaskListProps {
    tasks: Task[];
    projects?: Map<string, Project>;
    selectedTaskId?: string | null;
    onToggleComplete: (id: string, completed: boolean) => void;
    onSelectTask: (task: Task) => void;
}

export function TaskList({
    tasks,
    projects = new Map(),
    selectedTaskId,
    onToggleComplete,
    onSelectTask,
}: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <p>No tasks yet</p>
                <span>Press ⌘N to create your first task</span>

                <style jsx>{`
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: var(--space-12);
            color: var(--color-text-tertiary);
            text-align: center;
          }

          .empty-state p {
            font-size: 15px;
            font-weight: 500;
            margin: 0 0 var(--space-2);
            color: var(--color-text-secondary);
          }

          .empty-state span {
            font-size: 13px;
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map((task) => (
                <TaskRow
                    key={task.id}
                    task={task}
                    project={task.project_id ? projects.get(task.project_id) : null}
                    isSelected={task.id === selectedTaskId}
                    onToggleComplete={onToggleComplete}
                    onSelect={onSelectTask}
                />
            ))}

            <style jsx>{`
        .task-list {
          display: flex;
          flex-direction: column;
          padding: var(--space-2);
        }
      `}</style>
        </div>
    );
}
