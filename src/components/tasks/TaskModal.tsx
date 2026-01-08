'use client';

/**
 * TaskModal
 * 
 * Full-featured modal task editor.
 * Apple HIG inspired with properties sidebar.
 */

import { useState, useEffect } from 'react';
import {
    X,
    MoreHorizontal,
    ChevronRight,
    Circle,
    CheckCircle2,
    Calendar,
    Hash,
    Flag,
    Tag,
    Plus,
    User
} from 'lucide-react';
import type { Task, Project, TaskUpdate } from '@/types/database';

interface TaskModalProps {
    task: Task;
    projects: Project[];
    onUpdate: (id: string, updates: TaskUpdate) => void;
    onClose: () => void;
}

export function TaskModal({ task, projects, onUpdate, onClose }: TaskModalProps) {
    const [title, setTitle] = useState(task.title);
    const [notes, setNotes] = useState(task.description || '');

    const project = projects.find(p => p.id === task.project_id);
    const isCompleted = task.status === 'done';

    // Sync when task changes
    useEffect(() => {
        setTitle(task.title);
        setNotes(task.description || '');
    }, [task.id, task.title, task.description]);

    const handleTitleBlur = () => {
        if (title !== task.title) {
            onUpdate(task.id, { title });
        }
    };

    const handleNotesBlur = () => {
        if (notes !== (task.description || '')) {
            onUpdate(task.id, { description: notes || null });
        }
    };

    const toggleComplete = () => {
        onUpdate(task.id, {
            status: isCompleted ? 'todo' : 'done',
            completed_at: isCompleted ? null : new Date().toISOString()
        });
    };

    const priorityLabels: Record<number, string> = {
        1: "Urgent",
        2: "High",
        3: "Medium",
        4: "Low",
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'None';
        const d = new Date(date);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return 'Today';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl h-[85vh] flex flex-col bg-white/95 backdrop-blur-3xl rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-[#D1D1D6]/40 overflow-hidden animate-zoom-in">

                {/* Header */}
                <div className="h-14 px-6 flex items-center justify-between shrink-0 border-b border-[#F2F2F7] bg-white/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-2 text-[#8E8E93] text-[12px] font-medium">
                        <span className="uppercase tracking-wide">{project?.name || 'Inbox'}</span>
                        <ChevronRight size={12} className="opacity-50" />
                        <span className="text-[#1d1d1f] truncate max-w-[200px]">{task.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleComplete}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-[12px] font-bold uppercase tracking-wider border outline-none mr-2 ${isCompleted
                                    ? "bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20"
                                    : "bg-white text-[#48484A] border-[#D1D1D6] hover:bg-[#F2F2F7]"
                                }`}
                        >
                            {isCompleted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                            {isCompleted ? "Finished" : "Done"}
                        </button>

                        <div className="w-[1px] h-4 bg-[#D1D1D6] mx-1" />

                        <button className="p-2 text-[#8E8E93] hover:text-[#48484A] rounded-md transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-[#8E8E93] hover:text-[#48484A] hover:bg-[#F2F2F7] rounded-md transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8">
                        {/* Title & Notes */}
                        <div className="space-y-6">
                            <textarea
                                className="w-full text-3xl font-bold tracking-tight bg-transparent border-none p-0 resize-none min-h-[40px] text-[#1d1d1f] placeholder-[#E5E5EA] outline-none leading-tight"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleTitleBlur}
                                rows={2}
                            />
                            <textarea
                                className="w-full text-[15px] leading-relaxed text-[#48484A] bg-transparent border-none p-1 resize-none min-h-[100px] placeholder-[#C7C7CC] outline-none"
                                value={notes}
                                placeholder="Add details, links, or thoughts..."
                                onChange={(e) => setNotes(e.target.value)}
                                onBlur={handleNotesBlur}
                            />
                        </div>

                        {/* Checklist Placeholder */}
                        <div className="space-y-3 pt-4 border-t border-[#F2F2F7]">
                            <h3 className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest px-1">
                                Checklist
                            </h3>
                            <div className="flex items-center gap-3 py-2 px-1">
                                <Plus size={18} className="text-[#C7C7CC]" />
                                <input
                                    type="text"
                                    placeholder="Add subtask..."
                                    className="flex-1 bg-transparent border-none p-0 text-[14px] text-[#8E8E93] placeholder-[#E5E5EA] outline-none"
                                />
                            </div>
                        </div>

                        {/* Activity */}
                        <div className="space-y-4 pt-6 border-t border-[#F2F2F7]">
                            <h3 className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest px-1">
                                Activity
                            </h3>
                            <div className="pt-2 flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#8E8E93] shrink-0">
                                    <User size={14} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Leave a comment..."
                                    className="w-full bg-[#F2F2F7]/50 border border-transparent rounded-lg px-4 py-2 text-[13px] outline-none transition-all placeholder-[#C7C7CC]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Properties Sidebar */}
                    <div className="w-[280px] bg-[#F9F9FB]/80 border-l border-[#E5E5EA] flex flex-col">
                        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest">
                                    Properties
                                </h3>

                                <div className="space-y-3">
                                    <PropertyRow
                                        icon={<Hash size={14} className="text-[#8E8E93]" />}
                                        label="Project"
                                    >
                                        <select
                                            className="bg-transparent border-none text-[13px] font-medium text-[#1d1d1f] outline-none cursor-pointer"
                                            value={task.project_id || ''}
                                            onChange={(e) => onUpdate(task.id, { project_id: e.target.value || null })}
                                        >
                                            <option value="">Inbox</option>
                                            {projects.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </PropertyRow>

                                    <PropertyRow
                                        icon={<Calendar size={14} className="text-[#8E8E93]" />}
                                        label="Due Date"
                                    >
                                        <input
                                            type="date"
                                            className="bg-transparent border-none text-[13px] font-medium text-[#1d1d1f] outline-none cursor-pointer"
                                            value={task.due_date || ''}
                                            onChange={(e) => onUpdate(task.id, {
                                                due_date: e.target.value || null,
                                                due_type: e.target.value ? 'date' : 'none'
                                            })}
                                        />
                                    </PropertyRow>

                                    <PropertyRow
                                        icon={<Flag size={14} className="text-[#8E8E93]" />}
                                        label="Priority"
                                    >
                                        <select
                                            className="bg-transparent border-none text-[13px] font-medium text-[#1d1d1f] outline-none cursor-pointer"
                                            value={task.priority}
                                            onChange={(e) => onUpdate(task.id, { priority: Number(e.target.value) as 1 | 2 | 3 | 4 })}
                                        >
                                            <option value={4}>Low</option>
                                            <option value={3}>Medium</option>
                                            <option value={2}>High</option>
                                            <option value={1}>Urgent</option>
                                        </select>
                                    </PropertyRow>

                                    <PropertyRow
                                        icon={<Tag size={14} className="text-[#8E8E93]" />}
                                        label="Tags"
                                    >
                                        <span className="text-[#C7C7CC] text-[13px]">Add tags</span>
                                    </PropertyRow>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[#E5E5EA]/60 space-y-4">
                                <h3 className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest">
                                    Meta
                                </h3>
                                <div className="flex flex-col gap-2 text-[12px] text-[#8E8E93]">
                                    <div className="flex justify-between">
                                        <span>Created</span>
                                        <span>{new Date(task.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Updated</span>
                                        <span>{new Date(task.updated_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>ID</span>
                                        <span className="font-mono text-[10px]">{task.id.slice(0, 8)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PropertyRow({ icon, label, children }: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5 group cursor-pointer hover:bg-gray-100/50 -mx-2 px-2 py-1.5 rounded-md transition-colors">
            <div className="flex items-center gap-2 text-[11px] text-[#8E8E93] font-medium">
                {icon}
                <span>{label}</span>
            </div>
            <div className="pl-6 text-[13px] font-medium min-h-[20px] flex items-center">
                {children}
            </div>
        </div>
    );
}
