'use client';

/**
 * Today Page
 * 
 * Tasks due today with modal editor.
 */

import { useEffect } from 'react';
import { TopBar } from '@/components/app-shell';
import { TaskRow, TaskModal } from '@/components/tasks';
import { useTaskStore } from '@/stores';

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
    const todayTasks = allTasks.filter(t => t.due_date === today);

    const selectedTask = allTasks.find(t => t.id === selectedTaskId);
    const projectsMap = new Map(projects.map(p => [p.id, p]));

    return (
        <>
            <TopBar title="Today" />

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto py-10 px-12">
                    <div className="space-y-[1px]">
                        {isLoading ? (
                            <div className="py-12 text-center text-[#8E8E93] text-[14px]">
                                Loading tasks...
                            </div>
                        ) : todayTasks.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-[15px] text-[#8E8E93] font-medium">No tasks for today</p>
                                <p className="text-[13px] text-[#C7C7CC] mt-1">All clear! Or add some from Inbox.</p>
                            </div>
                        ) : (
                            todayTasks.map(task => (
                                <TaskRow
                                    key={task.id}
                                    task={task}
                                    project={task.project_id ? projectsMap.get(task.project_id) : null}
                                    isSelected={task.id === selectedTaskId}
                                    onToggle={() => toggleComplete(task.id, task.status !== 'done')}
                                    onClick={() => selectTask(task.id)}
                                />
                            ))
                        )}
                    </div>
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
