'use client';

/**
 * App Shell
 * 
 * Main layout with sidebar.
 */

import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-full bg-white font-sans text-[#1d1d1f] antialiased overflow-hidden">
      <Sidebar counts={{ inbox: 12, today: 5, upcoming: 8, planning: 15 }} />
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA]">
        {children}
      </main>
    </div>
  );
}
