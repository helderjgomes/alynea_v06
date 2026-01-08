'use client';

/**
 * Upcoming Page
 * 
 * Forward-looking task list (next 7 days).
 * Simple grouped list, not a dense calendar grid.
 */

import { useEffect, useMemo } from 'react';
import { TopBar } from '@/components/app-shell';
import { TaskList, TaskEditor } from '@/components/tasks';
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

    const selectedTask = allTasks.find((t) => t.id === selectedTaskId) || null;
    const projectsMap = new Map(projects.map((p) => [p.id, p]));

    const handleSelectTask = (task: Task) => {
        selectTask(task.id === selectedTaskId ? null : task.id);
    };

    return (
        <div className="upcoming-page">
            <TopBar title="Upcoming" />

            <div className="upcoming-content">
                <div className="task-list-container">
                    {isLoading ? (
                        <div className="loading">Loading tasks...</div>
                    ) : groupedTasks.length === 0 ? (
                        <div className="empty-state">
                            <p>No upcoming tasks</p>
                            <span>Tasks with due dates will appear here.</span>
                        </div>
                    ) : (
                        <div className="grouped-tasks">
                            {groupedTasks.map(({ date, label, tasks }) => (
                                <div key={date} className="date-group">
                                    <h3 className="date-label">{label}</h3>
                                    <TaskList
                                        tasks={tasks}
                                        projects={projectsMap}
                                        selectedTaskId={selectedTaskId}
                                        onToggleComplete={toggleComplete}
                                        onSelectTask={handleSelectTask}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedTask && (
                    <TaskEditor
                        task={selectedTask}
                        projects={projects}
                        onUpdate={updateTask}
                        onClose={() => selectTask(null)}
                    />
                )}
            </div>

            <style jsx>{`
        .upcoming-page {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        .upcoming-content {
          display: flex;
          flex: 1;
          min-height: 0;
        }

        .task-list-container {
          flex: 1;
          overflow-y: auto;
          min-width: 0;
          padding: var(--space-4);
        }

        .loading,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-12);
          color: var(--color-text-secondary);
          font-size: 14px;
          text-align: center;
        }

        .empty-state p {
          font-size: 15px;
          font-weight: 500;
          margin: 0 0 var(--space-2);
        }

        .empty-state span {
          color: var(--color-text-tertiary);
          font-size: 13px;
        }

        .grouped-tasks {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .date-group {
          display: flex;
          flex-direction: column;
        }

        .date-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-secondary);
          margin: 0 0 var(--space-2);
          padding: 0 var(--space-3);
        }
      `}</style>
        </div>
    );
}
