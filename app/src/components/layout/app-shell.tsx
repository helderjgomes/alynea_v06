'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar, type ViewId, type Project } from './sidebar';

export interface AppShellProps {
    children: React.ReactNode;
    currentView: ViewId;
    onViewChange: (view: ViewId) => void;
    projects?: Project[];
    onProjectClick?: (id: string) => void;
    taskCounts?: {
        inbox: number;
        today: number;
    };
    className?: string;
}

export function AppShell({
    children,
    currentView,
    onViewChange,
    projects,
    onProjectClick,
    taskCounts,
    className,
}: AppShellProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

    return (
        <div className={cn('flex h-screen bg-white', className)}>
            {/* Sidebar */}
            <Sidebar
                currentView={currentView}
                onViewChange={onViewChange}
                projects={projects}
                onProjectClick={onProjectClick}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                taskCounts={taskCounts}
            />

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">{children}</main>
        </div>
    );
}
