'use client';

import * as React from 'react';
import { TopBar } from '@/components/layout/topbar';
import { TaskRow } from '@/components/ui/task-row';
import { SectionHeader } from '@/components/ui/section-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Sun } from 'lucide-react';


interface Task {
    id: string;
    title: string;
    notes?: string;
    completed: boolean;
    dueDate?: string;
    project?: string;
    priority?: 'low' | 'medium' | 'high';
}

interface TodayViewProps {
    tasks: Task[];
    overdueTasks: Task[];
    onTaskToggle: (id: string) => void;
    onTaskClick: (id: string) => void;
    onNewTask: () => void;
}

export function TodayView({
    tasks,
    overdueTasks,
    onTaskToggle,
    onTaskClick,
    onNewTask,
}: TodayViewProps) {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    const incompleteTasks = tasks.filter((t) => !t.completed);
    const completedTasks = tasks.filter((t) => t.completed);

    return (
        <div className="h-full flex flex-col">
            <TopBar
                title="Today"
                subtitle={today}
                onNewTask={onNewTask}
            />

            <div className="flex-1 overflow-y-auto px-4 py-2">
                {/* Overdue Section */}
                {overdueTasks.length > 0 && (
                    <div className="mb-4">
                        <SectionHeader title="Overdue" />
                        <div className="bg-[#FF3B30]/5 rounded-xl border border-[#FF3B30]/10 overflow-hidden mt-1">
                            {overdueTasks.map((task) => (
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
                    </div>
                )}

                {/* Today's Tasks */}
                <div>
                    <SectionHeader title="Today" />
                    {incompleteTasks.length === 0 ? (
                        <EmptyState
                            icon={Sun}
                            title="All done for today!"
                            description="You've completed all your scheduled tasks. Time to recharge."
                        />
                    ) : (
                        <div className="bg-white rounded-xl border border-black/[0.04] overflow-hidden mt-1">
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

                {/* Completed */}
                {completedTasks.length > 0 && (
                    <div className="mt-4">
                        <details className="group">
                            <summary className="text-[12px] text-[#86868B] cursor-pointer">
                                Completed today ({completedTasks.length})
                            </summary>
                            <div className="bg-white rounded-xl border border-black/[0.04] overflow-hidden opacity-60 mt-1">
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
