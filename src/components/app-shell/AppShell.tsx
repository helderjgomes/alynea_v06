'use client';

/**
 * App Shell
 * 
 * Main layout with sidebar toggle state.
 */

import { useState } from 'react';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
  taskCount?: number;
}

export function AppShell({ children, taskCount = 0 }: AppShellProps) {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className="flex h-screen w-full bg-white font-sans text-[#1d1d1f] antialiased overflow-hidden">
      {sidebarVisible && <Sidebar taskCount={taskCount} />}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {children}
      </main>
    </div>
  );
}
