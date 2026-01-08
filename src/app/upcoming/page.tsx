'use client';

/**
 * Upcoming Page
 * 
 * Tasks for the next 7 days, grouped by date.
 */

import { useEffect, useMemo } from 'react';
import { TopBar } from '@/components/app-shell';
import { TaskRow, TaskModal } from '@/components/tasks';
import { useTaskStore } from '@/stores';
import type { Task } from '@/types/database';

export default function UpcomingPage() {
    const {
        tasks: allTasks,
        projects,
        isLoading,
        selectedTaskId,
        fetchTasks,
        fetchProjects,
        updateTask,
        toggleComplete,
        selectTask,
    } = useTaskStore();

    useEffect(() => {
        fetchTasks();
        fetchProjects();
    }, [fetchTasks, fetchProjects]);

    // Filter tasks with due dates in next 7 days
    const upcomingTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);

        return allTasks
            .filter((t) => {
                if (!t.due_date) return false;
                const dueDate = new Date(t.due_date);
                return dueDate >= today && dueDate <= weekFromNow;
            })
            .sort((a, b) => {
                if (!a.due_date || !b.due_date) return 0;
                return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
            });
    }, [allTasks]);

    // Group by date
    const groupedTasks = useMemo(() => {
        const groups: { date: string; label: string; tasks: Task[] }[] = [];
        const dateMap = new Map<string, Task[]>();

        upcomingTasks.forEach((task) => {
            const date = task.due_date!;
            if (!dateMap.has(date)) {
                dateMap.set(date, []);
            }
            dateMap.get(date)!.push(task);
        });

        dateMap.forEach((tasks, date) => {
            const d = new Date(date);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            let label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            if (d.toDateString() === today.toDateString()) label = 'Today';
            if (d.toDateString() === tomorrow.toDateString()) label = 'Tomorrow';

            groups.push({ date, label, tasks });
        });

        return groups;
    }, [upcomingTasks]);

    const selectedTask = allTasks.find(t => t.id === selectedTaskId);
    const projectsMap = new Map(projects.map(p => [p.id, p]));

    return (
        <>
            <TopBar title="Upcoming" />

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto py-10 px-12">
                    {isLoading ? (
                        <div className="py-12 text-center text-[#8E8E93] text-[14px]">
                            Loading tasks...
                        </div>
                    ) : groupedTasks.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-[15px] text-[#8E8E93] font-medium">No upcoming tasks</p>
                            <p className="text-[13px] text-[#C7C7CC] mt-1">Tasks with due dates will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {groupedTasks.map(({ date, label, tasks }) => (
                                <div key={date}>
                                    <h3 className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3 px-3">
                                        {label}
                                    </h3>
                                    <div className="space-y-[1px]">
                                        {tasks.map(task => (
                                            <TaskRow
                                                key={task.id}
                                                task={task}
                                                project={task.project_id ? projectsMap.get(task.project_id) : null}
                                                isSelected={task.id === selectedTaskId}
                                                onToggle={() => toggleComplete(task.id, task.status !== 'done')}
                                                onClick={() => selectTask(task.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    projects={projects}
                    onUpdate={updateTask}
                    onClose={() => selectTask(null)}
                />
            )}
        </>
    );
}
