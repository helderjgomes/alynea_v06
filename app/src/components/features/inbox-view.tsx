'use client';

import * as React from 'react';
import { TopBar } from '@/components/layout/topbar';
import { TaskRow } from '@/components/ui/task-row';

interface Task {
    id: string;
    title: string;
    notes?: string;
    completed: boolean;
    dueDate?: string;
    project?: string;
    priority?: 'low' | 'medium' | 'high';
}

interface InboxViewProps {
    tasks: Task[];
    onTaskToggle: (id: string) => void;
    onTaskClick: (id: string) => void;
    onNewTask: () => void;
}

export function InboxView({
    tasks,
    onTaskToggle,
    onTaskClick,
    onNewTask,
}: InboxViewProps) {
    const incompleteTasks = tasks.filter((t) => !t.completed);
    const completedTasks = tasks.filter((t) => t.completed);

    return (
        <div className="h-full flex flex-col">
            <TopBar
                title="Inbox"
                subtitle={`${incompleteTasks.length} tasks`}
                onNewTask={onNewTask}
                showSearch
            />

            <div className="flex-1 overflow-y-auto">
                {/* Incomplete tasks */}
                <div className="px-4 py-2">
                    {incompleteTasks.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-[14px] text-[#86868B]">
                                No tasks in inbox
                            </p>
                            <button
                                onClick={onNewTask}
                                className="mt-2 text-[14px] text-[#007AFF] hover:underline"
                            >
                                Add a task
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-black/[0.04] overflow-hidden">
                            {incompleteTasks.map((task) => (
                                <TaskRow
                                    key={task.id}
                                    id={task.id}
                                    title={task.title}
                                    notes={task.notes}
                                    completed={task.completed}
                                    dueDate={task.dueDate}
                                    project={task.project}
                                    priority={task.priority}
                                    onToggle={onTaskToggle}
                                    onClick={onTaskClick}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Completed tasks */}
                {completedTasks.length > 0 && (
                    <div className="px-4 py-2 mt-4">
                        <details className="group">
                            <summary className="text-[12px] text-[#86868B] cursor-pointer mb-2">
                                Completed ({completedTasks.length})
                            </summary>
                            <div className="bg-white rounded-xl border border-black/[0.04] overflow-hidden opacity-60">
                                {completedTasks.map((task) => (
                                    <TaskRow
                                        key={task.id}
                                        id={task.id}
                                        title={task.title}
                                        completed={task.completed}
                                        onToggle={onTaskToggle}
                                        onClick={onTaskClick}
                                    />
                                ))}
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
}
