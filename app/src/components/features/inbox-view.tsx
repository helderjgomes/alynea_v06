'use client';

import * as React from 'react';
import { TopBar } from '@/components/layout/topbar';
import { TaskRow } from '@/components/ui/task-row';
import { SortableList, SortableTaskRow } from '@/components/dnd';
import { EmptyState } from '@/components/ui/empty-state';
import { Inbox } from 'lucide-react';


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
    onReorder?: (tasks: Task[]) => void;
}

export function InboxView({
    tasks,
    onTaskToggle,
    onTaskClick,
    onNewTask,
    onReorder,
}: InboxViewProps) {
    const incompleteTasks = tasks.filter((t) => !t.completed);
    const completedTasks = tasks.filter((t) => t.completed);

    const handleReorder = (reorderedTasks: Task[]) => {
        // Merge reordered incomplete tasks with completed tasks
        const newTaskList = [...reorderedTasks, ...completedTasks];
        onReorder?.(newTaskList);
    };

    return (
        <div className="h-full flex flex-col">
            <TopBar
                title="Inbox"
                subtitle={`${incompleteTasks.length} tasks`}
                onNewTask={onNewTask}
                showSearch
            />

            <div className="flex-1 overflow-y-auto">
                {/* Incomplete tasks with DnD */}
                <div className="px-4 py-2">
                    {incompleteTasks.length === 0 ? (
                        <EmptyState
                            icon={Inbox}
                            title="Your inbox is clear"
                            description="Take a moment to relax, or start planning your next big thing."
                            actionLabel="Add a Task"
                            onAction={onNewTask}
                        />
                    ) : (
                        <div className="bg-white rounded-xl border border-black/[0.04] overflow-hidden pl-6">
                            <SortableList items={incompleteTasks} onReorder={handleReorder}>
                                {incompleteTasks.map((task) => (
                                    <SortableTaskRow
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
                            </SortableList>
                        </div>
                    )}
                </div>

                {/* Completed tasks (no DnD) */}
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
