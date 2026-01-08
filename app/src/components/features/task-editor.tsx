'use client';

import * as React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalTitle,
    ModalCloseButton,
} from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Flag,
    Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
    id?: string;
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    projectId?: string;
    projectName?: string;
}

interface Project {
    id: string;
    name: string;
    color: string;
}

interface TaskEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task?: Task;
    projects: Project[];
    onSave: (task: Task) => void;
    onDelete?: (id: string) => void;
}

const priorities = [
    { value: 'high', label: 'High', color: '#FF3B30' },
    { value: 'medium', label: 'Medium', color: '#F6BD16' },
    { value: 'low', label: 'Low', color: '#86868B' },
] as const;

export function TaskEditor({
    open,
    onOpenChange,
    task,
    projects,
    onSave,
    onDelete,
}: TaskEditorProps) {
    const [title, setTitle] = React.useState(task?.title || '');
    const [description, setDescription] = React.useState(task?.description || '');
    const [priority, setPriority] = React.useState<'low' | 'medium' | 'high' | undefined>(
        task?.priority
    );
    const [dueDate, setDueDate] = React.useState(task?.dueDate || '');
    const [projectId, setProjectId] = React.useState(task?.projectId || '');

    React.useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setPriority(task.priority);
            setDueDate(task.dueDate || '');
            setProjectId(task.projectId || '');
        } else {
            setTitle('');
            setDescription('');
            setPriority(undefined);
            setDueDate('');
            setProjectId('');
        }
    }, [task, open]);

    const handleSave = () => {
        if (!title.trim()) return;

        const selectedProject = projects.find((p) => p.id === projectId);

        onSave({
            id: task?.id,
            title: title.trim(),
            description: description.trim() || undefined,
            priority,
            dueDate: dueDate || undefined,
            projectId: projectId || undefined,
            projectName: selectedProject?.name,
        });

        onOpenChange(false);
    };

    const handleDelete = () => {
        if (task?.id && onDelete) {
            onDelete(task.id);
            onOpenChange(false);
        }
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalContent size="lg">
                {/* Header */}
                <ModalHeader>
                    <ModalTitle>{task?.id ? 'Edit Task' : 'New Task'}</ModalTitle>
                    <ModalCloseButton />
                </ModalHeader>

                {/* Body */}
                <div className="flex divide-x divide-black/[0.04]">
                    {/* Main Content */}
                    <div className="flex-1 p-4 space-y-4">
                        {/* Title */}
                        <Input
                            variant="title"
                            placeholder="Task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />

                        {/* Description */}
                        <textarea
                            placeholder="Add description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[120px] text-[14px] text-[#1D1D1F] placeholder-[#86868B] bg-transparent border-none outline-none resize-none leading-relaxed"
                        />
                    </div>

                    {/* Right Panel - Properties */}
                    <div className="w-56 p-4 bg-[#FAFAF9] space-y-4">
                        {/* Project */}
                        <div>
                            <label className="text-[11px] uppercase text-[#86868B] font-medium mb-1.5 block">
                                Project
                            </label>
                            <select
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                className="w-full h-9 px-2.5 text-[13px] text-[#1D1D1F] bg-white border border-black/[0.06] rounded-lg outline-none focus:border-[#007AFF]"
                            >
                                <option value="">No project</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="text-[11px] uppercase text-[#86868B] font-medium mb-1.5 block">
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full h-9 px-2.5 text-[13px] text-[#1D1D1F] bg-white border border-black/[0.06] rounded-lg outline-none focus:border-[#007AFF]"
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="text-[11px] uppercase text-[#86868B] font-medium mb-1.5 block">
                                Priority
                            </label>
                            <div className="space-y-1">
                                {priorities.map((p) => (
                                    <button
                                        key={p.value}
                                        onClick={() => setPriority(priority === p.value ? undefined : p.value)}
                                        className={cn(
                                            'w-full text-left px-2.5 py-1.5 rounded-md text-[13px] transition-all flex items-center gap-1.5',
                                            priority === p.value
                                                ? 'bg-white text-[#1D1D1F] shadow-sm'
                                                : 'text-[#86868B] hover:bg-black/[0.04]'
                                        )}
                                    >
                                        <Flag
                                            size={12}
                                            strokeWidth={2}
                                            style={{ color: priority === p.value ? p.color : 'currentColor' }}
                                            fill={priority === p.value && p.value === 'high' ? p.color : 'none'}
                                        />
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <ModalFooter>
                    {task?.id && onDelete && (
                        <Button variant="ghost" size="sm" onClick={handleDelete} className="mr-auto text-[#FF3B30]">
                            <Trash2 size={14} />
                            Delete
                        </Button>
                    )}
                    <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={!title.trim()}>
                        {task?.id ? 'Save' : 'Create'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
