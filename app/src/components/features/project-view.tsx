'use client';

import * as React from 'react';
import { TopBar } from '@/components/layout/topbar';
import { TaskRow } from '@/components/ui/task-row';
import { SectionHeader } from '@/components/ui/section-header';
import { Folder, Plus } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    notes?: string;
    completed: boolean;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
    sectionId?: string;
}

interface Section {
    id: string;
    name: string;
}

interface Project {
    id: string;
    name: string;
    color: string;
    description?: string;
}

interface ProjectViewProps {
    project: Project;
    tasks: Task[];
    sections: Section[];
    onTaskToggle: (id: string) => void;
    onTaskClick: (id: string) => void;
    onNewTask: () => void;
    onNewSection: () => void;
}

export function ProjectView({
    project,
    tasks,
    sections,
    onTaskToggle,
    onTaskClick,
    onNewTask,
    onNewSection,
}: ProjectViewProps) {
    // Group tasks by section
    const tasksBySection = React.useMemo(() => {
        const grouped: Record<string, Task[]> = { none: [] };
        sections.forEach((s) => {
            grouped[s.id] = [];
        });

        tasks.forEach((task) => {
            const sectionId = task.sectionId || 'none';
            if (grouped[sectionId]) {
                grouped[sectionId].push(task);
            } else {
                grouped.none.push(task);
            }
        });

        return grouped;
    }, [tasks, sections]);

    const incompleteTasks = tasks.filter((t) => !t.completed);

    return (
        <div className="h-full flex flex-col">
            <TopBar
                title={project.name}
                subtitle={`${incompleteTasks.length} tasks`}
                onNewTask={onNewTask}
                actions={
                    <button
                        onClick={onNewSection}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[12px] text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-colors"
                    >
                        <Plus size={12} strokeWidth={2} />
                        Section
                    </button>
                }
            />

            <div className="flex-1 overflow-y-auto px-4 py-2">
                {/* Project Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${project.color}20` }}
                    >
                        <Folder size={20} strokeWidth={1.5} style={{ color: project.color }} />
                    </div>
                    {project.description && (
                        <p className="text-[13px] text-[#86868B]">{project.description}</p>
                    )}
                </div>

                {/* Tasks by Section */}
                {sections.map((section) => {
                    const sectionTasks = tasksBySection[section.id] || [];
                    if (sectionTasks.length === 0) return null;

                    return (
                        <div key={section.id} className="mb-4">
                            <SectionHeader title={section.name} />
                            <div className="bg-white rounded-xl border border-black/[0.04] overflow-hidden mt-1">
                                {sectionTasks.map((task) => (
                                    <TaskRow
                                        key={task.id}
                                        id={task.id}
                                        title={task.title}
                                        notes={task.notes}
                                        completed={task.completed}
                                        dueDate={task.dueDate}
                                        priority={task.priority}
                                        onToggle={onTaskToggle}
                                        onClick={onTaskClick}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Unsectioned Tasks */}
                {tasksBySection.none && tasksBySection.none.length > 0 && (
                    <div className="mb-4">
                        {sections.length > 0 && <SectionHeader title="No Section" />}
                        <div className="bg-white rounded-xl border border-black/[0.04] overflow-hidden mt-1">
                            {tasksBySection.none.map((task) => (
                                <TaskRow
                                    key={task.id}
                                    id={task.id}
                                    title={task.title}
                                    notes={task.notes}
                                    completed={task.completed}
                                    dueDate={task.dueDate}
                                    priority={task.priority}
                                    onToggle={onTaskToggle}
                                    onClick={onTaskClick}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {tasks.length === 0 && (
                    <div className="py-12 text-center">
                        <Folder size={32} strokeWidth={1} className="mx-auto text-[#C7C7CC] mb-3" />
                        <p className="text-[14px] text-[#86868B]">No tasks in this project</p>
                        <button
                            onClick={onNewTask}
                            className="mt-2 text-[14px] text-[#007AFF] hover:underline"
                        >
                            Add a task
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
