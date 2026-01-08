'use client';

/**
 * Today Page
 * 
 * Tasks due today. Derived view with date filtering.
 */

import { useEffect } from 'react';
import { TopBar } from '@/components/app-shell';
import { TaskList, TaskEditor } from '@/components/tasks';
import { useTaskStore } from '@/stores';
import type { Task } from '@/types/database';

export default function TodayPage() {
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

    // Filter tasks due today
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = allTasks.filter((t) => t.due_date === today);

    const selectedTask = allTasks.find((t) => t.id === selectedTaskId) || null;
    const projectsMap = new Map(projects.map((p) => [p.id, p]));

    const handleSelectTask = (task: Task) => {
        selectTask(task.id === selectedTaskId ? null : task.id);
    };

    return (
        <div className="today-page">
            <TopBar title="Today" />

            <div className="today-content">
                <div className="task-list-container">
                    {isLoading ? (
                        <div className="loading">Loading tasks...</div>
                    ) : todayTasks.length === 0 ? (
                        <div className="empty-state">
                            <p>No tasks for today</p>
                            <span>All clear! Or add some tasks from Inbox.</span>
                        </div>
                    ) : (
                        <TaskList
                            tasks={todayTasks}
                            projects={projectsMap}
                            selectedTaskId={selectedTaskId}
                            onToggleComplete={toggleComplete}
                            onSelectTask={handleSelectTask}
                        />
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
        .today-page {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        .today-content {
          display: flex;
          flex: 1;
          min-height: 0;
        }

        .task-list-container {
          flex: 1;
          overflow-y: auto;
          min-width: 0;
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
      `}</style>
        </div>
    );
}
