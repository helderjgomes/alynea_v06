'use client';

/**
 * App Shell
 * 
 * Main layout wrapper with sidebar navigation.
 * Apple HIG inspired: calm, narrow sidebar with content-focused main area.
 */

import { useState } from 'react';
import { Sidebar } from './Sidebar';

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="app-shell">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <main className="main-content">
                {children}
            </main>

            <style jsx>{`
        .app-shell {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .main-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
      `}</style>
        </div>
    );
}
