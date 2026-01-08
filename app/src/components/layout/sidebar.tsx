'use client';

import * as React from 'react';
import {
    Inbox,
    Calendar,
    ListTodo,
    Target,
    Repeat,
    Folder,
    Plus,
    Settings,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarItem } from '../ui/sidebar-item';
import { SectionHeader } from '../ui/section-header';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';

export type ViewId = 'inbox' | 'today' | 'planning' | 'goals' | 'habits';

export interface Project {
    id: string;
    name: string;
    color: string;
}

export interface SidebarProps {
    currentView: ViewId;
    onViewChange: (view: ViewId) => void;
    projects?: Project[];
    onProjectClick?: (id: string) => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
    taskCounts?: {
        inbox: number;
        today: number;
    };
    className?: string;
}

const navItems: { id: ViewId; label: string; icon: typeof Inbox }[] = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'planning', label: 'Planning', icon: ListTodo },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'habits', label: 'Habits', icon: Repeat },
];

export function Sidebar({
    currentView,
    onViewChange,
    projects = [],
    onProjectClick,
    isCollapsed = false,
    onToggleCollapse,
    taskCounts = { inbox: 0, today: 0 },
    className,
}: SidebarProps) {
    // Collapsed view
    if (isCollapsed) {
        return (
            <div
                className={cn(
                    'w-16 h-full bg-[#F5F5F4]/80 backdrop-blur-xl',
                    'border-r border-black/[0.06] flex flex-col items-center py-4',
                    className
                )}
            >
                <button
                    onClick={onToggleCollapse}
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 hover:bg-black/[0.04] transition-colors"
                >
                    <ChevronRight size={18} strokeWidth={1.5} className="text-[#86868B]" />
                </button>

                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center mb-1 transition-all',
                            currentView === item.id
                                ? 'bg-[#007AFF]/10 text-[#007AFF]'
                                : 'text-[#86868B] hover:bg-black/[0.04]'
                        )}
                    >
                        <item.icon size={18} strokeWidth={1.5} />
                    </button>
                ))}
            </div>
        );
    }

    // Expanded view
    return (
        <div
            className={cn(
                'w-52 h-full bg-[#F5F5F4]/80 backdrop-blur-xl',
                'border-r border-black/[0.06] flex flex-col',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-2">
                    <Avatar initials="HG" size="sm" />
                    <span className="text-[14px] font-medium text-[#1D1D1F]">Alynea</span>
                </div>
                <button
                    onClick={onToggleCollapse}
                    className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                >
                    <ChevronLeft size={14} strokeWidth={2} className="text-[#86868B]" />
                </button>
            </div>

            {/* Navigation */}
            <div className="px-2 mt-1">
                <SectionHeader title="Focus" />
                <div className="space-y-0.5 mt-1">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            count={
                                item.id === 'inbox'
                                    ? taskCounts.inbox
                                    : item.id === 'today'
                                        ? taskCounts.today
                                        : undefined
                            }
                            active={currentView === item.id}
                            onClick={() => onViewChange(item.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Projects */}
            <div className="px-2 mt-4">
                <SectionHeader
                    title="Projects"
                    action={
                        <Button variant="ghost" size="icon" className="w-5 h-5">
                            <Plus size={12} strokeWidth={2} className="text-[#86868B]" />
                        </Button>
                    }
                />
                <div className="space-y-0.5 mt-1">
                    {projects.map((project) => (
                        <button
                            key={project.id}
                            onClick={() => onProjectClick?.(project.id)}
                            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[#1D1D1F] hover:bg-black/[0.04] transition-colors"
                        >
                            <Folder
                                size={14}
                                strokeWidth={1.5}
                                style={{ color: project.color }}
                            />
                            <span className="text-[14px]">{project.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto px-2 pb-3">
                <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[#86868B] hover:bg-black/[0.04] transition-colors">
                    <Settings size={16} strokeWidth={1.5} />
                    <span className="text-[14px]">Settings</span>
                </button>
            </div>
        </div>
    );
}
