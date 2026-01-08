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
import { Checkbox } from '@/components/ui/checkbox';
import {
    Flag,
    Trash2,
    Hash,
    Calendar,
    Clock,
    GripVertical,
    Plus,
    X,
    Bell,
    ChevronDown,
    Save,
    RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

interface Task {
    id?: string;
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    projectId?: string;
    projectName?: string;
    completed?: boolean;
    tags?: string[];
    subtasks?: Subtask[];
    duration?: string;
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
    const [completed, setCompleted] = React.useState(task?.completed || false);
    const [tags, setTags] = React.useState<string[]>(task?.tags || []);
    const [subtasks, setSubtasks] = React.useState<Subtask[]>(task?.subtasks || []);
    const [duration, setDuration] = React.useState(task?.duration || '');
    const [newTag, setNewTag] = React.useState('');
    const [newSubtaskTitle, setNewSubtaskTitle] = React.useState('');

    const notesRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setPriority(task.priority);
            setDueDate(task.dueDate || '');
            setProjectId(task.projectId || '');
            setCompleted(task.completed || false);
            setTags(task.tags || []);
            setSubtasks(task.subtasks || []);
            setDuration(task.duration || '');
        } else {
            setTitle('');
            setDescription('');
            setPriority(undefined);
            setDueDate('');
            setProjectId('');
            setCompleted(false);
            setTags([]);
            setSubtasks([]);
            setDuration('');
        }
    }, [task, open]);

    // Auto-resize for notes
    React.useEffect(() => {
        if (notesRef.current) {
            notesRef.current.style.height = 'auto';
            notesRef.current.style.height = notesRef.current.scrollHeight + 'px';
        }
    }, [description]);

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
            completed,
            tags,
            subtasks,
            duration,
        });

        onOpenChange(false);
    };

    const handleDelete = () => {
        if (task?.id && onDelete) {
            onDelete(task.id);
            onOpenChange(false);
        }
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newTag.trim()) {
            if (!tags.includes(newTag.trim())) {
                setTags([...tags, newTag.trim()]);
            }
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleAddSubtask = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newSubtaskTitle.trim()) {
            const newSub: Subtask = {
                id: Math.random().toString(36).substr(2, 9),
                title: newSubtaskTitle.trim(),
                completed: false
            };
            setSubtasks([...subtasks, newSub]);
            setNewSubtaskTitle('');
        }
    };

    const toggleSubtask = (id: string) => {
        setSubtasks(subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
    };

    const removeSubtask = (id: string) => {
        setSubtasks(subtasks.filter(s => s.id !== id));
    };

    const selectedProject = projects.find(p => p.id === projectId);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalContent size="2xl" className="overflow-hidden bg-[#FFFFFF]" onKeyDown={handleKeyDown}>
                <ModalHeader className="px-6 py-4 border-b border-black/[0.04]">
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={completed}
                            onCheckedChange={setCompleted}
                            priority={priority}
                        />
                        <ModalTitle className="text-[14px] text-[#86868B] font-normal">
                            {task?.id ? 'Task Details' : 'New Task'}
                        </ModalTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#C7C7CC] mr-2">⌘↵ to Save</span>
                        <ModalCloseButton />
                    </div>
                </ModalHeader>

                <div className="flex h-[calc(85vh-120px)] divide-x divide-black/[0.04]">
                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                        {/* Title Section */}
                        <div className="space-y-2">
                            <Input
                                variant="title"
                                placeholder="Task title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                autoFocus
                                className="w-full text-[26px] font-bold tracking-tight text-[#1D1D1F] placeholder-[#C7C7CC]"
                            />

                            {/* Project Picker (Subtle) */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/[0.03] text-[#86868B] text-[13px] hover:bg-black/[0.06] cursor-pointer transition-colors group">
                                    <Hash size={14} className="text-[#C7C7CC] group-hover:text-[#86868B]" />
                                    <span>{selectedProject?.name || 'In Inbox'}</span>
                                    <ChevronDown size={14} className="text-[#C7C7CC]" />
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-3">
                            <label className="text-[11px] uppercase text-[#86868B] font-semibold tracking-wider">
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-2 items-center">
                                <AnimatePresence mode="popLayout">
                                    {tags.map(tag => (
                                        <motion.span
                                            key={tag}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/[0.04] text-[#1D1D1F] text-[12px] group"
                                        >
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="hover:text-[#FF3B30] transition-colors">
                                                <X size={12} />
                                            </button>
                                        </motion.span>
                                    ))}
                                </AnimatePresence>
                                <input
                                    type="text"
                                    placeholder="Add tag..."
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    className="text-[12px] bg-transparent outline-none border-none placeholder-[#C7C7CC] w-24"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-3">
                            <label className="text-[11px] uppercase text-[#86868B] font-semibold tracking-wider">
                                Notes
                            </label>
                            <textarea
                                ref={notesRef}
                                placeholder="Add more detailed notes or links..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full h-auto min-h-[100px] text-[15px] text-[#1D1D1F] placeholder-[#86868B] bg-transparent border-none outline-none resize-none leading-relaxed"
                            />
                        </div>

                        {/* Subtasks */}
                        <div className="space-y-4">
                            <label className="text-[11px] uppercase text-[#86868B] font-semibold tracking-wider">
                                Checklist
                            </label>

                            <Reorder.Group axis="y" values={subtasks} onReorder={setSubtasks} className="space-y-1">
                                {subtasks.map((subtask) => (
                                    <Reorder.Item
                                        key={subtask.id}
                                        value={subtask}
                                        className="group flex items-center gap-3 p-2 rounded-lg hover:bg-black/[0.02] transition-colors"
                                    >
                                        <GripVertical size={14} className="text-[#C7C7CC] cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Checkbox
                                            checked={subtask.completed}
                                            onCheckedChange={() => toggleSubtask(subtask.id)}
                                            className="w-4 h-4"
                                        />
                                        <input
                                            value={subtask.title}
                                            onChange={(e) => {
                                                setSubtasks(subtasks.map(s => s.id === subtask.id ? { ...s, title: e.target.value } : s));
                                            }}
                                            className={cn(
                                                "flex-1 bg-transparent border-none outline-none text-[14px]",
                                                subtask.completed && "text-[#C7C7CC] line-through"
                                            )}
                                        />
                                        <button
                                            onClick={() => removeSubtask(subtask.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#86868B] hover:text-[#FF3B30]"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>

                            <div className="flex items-center gap-3 p-2">
                                <Plus size={14} className="text-[#C7C7CC] ml-6" />
                                <input
                                    type="text"
                                    placeholder="Add subtask..."
                                    value={newSubtaskTitle}
                                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                    onKeyDown={handleAddSubtask}
                                    className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder-[#86868B]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Properties Sidebar */}
                    <div className="w-80 bg-[#FAFAF9] p-6 space-y-8 overflow-y-auto custom-scrollbar">
                        {/* Schedule Section */}
                        <div className="space-y-4">
                            <h3 className="text-[11px] uppercase text-[#86868B] font-semibold tracking-wider">
                                Schedule
                            </h3>
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <label className="text-[12px] text-[#1D1D1F] flex items-center gap-2">
                                        <Calendar size={14} className="text-[#86868B]" />
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full h-9 px-3 text-[13px] text-[#1D1D1F] bg-white border border-black/[0.08] rounded-md outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[12px] text-[#1D1D1F] flex items-center gap-2">
                                        <Clock size={14} className="text-[#86868B]" />
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 30m, 1h"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full h-9 px-3 text-[13px] text-[#1D1D1F] bg-white border border-black/[0.08] rounded-md outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Priority Selection */}
                        <div className="space-y-4">
                            <h3 className="text-[11px] uppercase text-[#86868B] font-semibold tracking-wider">
                                Priority
                            </h3>
                            <div className="grid grid-cols-1 gap-1">
                                {priorities.map((p) => (
                                    <button
                                        key={p.value}
                                        onClick={() => setPriority(priority === p.value ? undefined : p.value)}
                                        className={cn(
                                            'w-full text-left px-3 py-2 rounded-md text-[13px] transition-all flex items-center justify-between group',
                                            priority === p.value
                                                ? 'bg-white text-[#1D1D1F] shadow-sm ring-1 ring-black/[0.04]'
                                                : 'text-[#1D1D1F] hover:bg-black/[0.03]'
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Flag
                                                size={14}
                                                strokeWidth={2}
                                                style={{ color: priority === p.value ? p.color : '#86868B' }}
                                                className={cn("transition-colors", priority === p.value && "fill-current/10")}
                                            />
                                            {p.label}
                                        </div>
                                        {priority === p.value && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reminders Section (Placeholder) */}
                        <div className="space-y-4 opacity-50">
                            <h3 className="text-[11px] uppercase text-[#86868B] font-semibold tracking-wider flex items-center justify-between">
                                Reminders
                                <span className="text-[9px] bg-black/[0.05] px-1.5 py-0.5 rounded text-[#86868B]">SOON</span>
                            </h3>
                            <button disabled className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] border border-dashed border-black/[0.1] text-[#86868B]">
                                <Bell size={14} />
                                Add reminder...
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <ModalFooter className="px-6 py-4 bg-[#FAFAF9] border-t border-black/[0.04] flex items-center justify-between">
                    <div>
                        {task?.id && onDelete && (
                            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-[#FF3B30] hover:bg-[#FF3B30]/10 hover:text-[#FF3B30]">
                                <Trash2 size={14} />
                                Delete Task
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)} className="gap-1.5">
                            <RotateCcw size={14} className="text-[#86868B]" />
                            Discard
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={!title.trim()} className="gap-1.5 px-6">
                            <Save size={14} />
                            {task?.id ? 'Save Changes' : 'Create Task'}
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
