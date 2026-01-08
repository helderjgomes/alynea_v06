'use client';

/**
 * Sidebar
 * 
 * Apple HIG inspired navigation sidebar.
 * Calm, narrow, collapsible. Content-first.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Inbox,
    Sun,
    Calendar,
    FolderKanban,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
    shortcut?: string;
}

const navItems: NavItem[] = [
    { href: '/', label: 'Inbox', icon: Inbox, shortcut: '⌘1' },
    { href: '/today', label: 'Today', icon: Sun, shortcut: '⌘2' },
    { href: '/upcoming', label: 'Upcoming', icon: Calendar, shortcut: '⌘3' },
    { href: '/projects', label: 'Projects', icon: FolderKanban, shortcut: '⌘4' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!collapsed && <span className="logo">Alynea</span>}
                <button
                    className="collapse-toggle"
                    onClick={onToggle}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon size={18} strokeWidth={1.5} />
                            {!collapsed && (
                                <>
                                    <span className="nav-label">{item.label}</span>
                                    {item.shortcut && (
                                        <span className="nav-shortcut">{item.shortcut}</span>
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <style jsx>{`
        .sidebar {
          width: var(--sidebar-width);
          background: var(--color-bg-secondary);
          border-right: 1px solid var(--color-divider);
          display: flex;
          flex-direction: column;
          transition: width var(--transition-normal);
          flex-shrink: 0;
        }

        .sidebar.collapsed {
          width: 52px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          height: 52px;
        }

        .logo {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          color: var(--color-text-primary);
          letter-spacing: -0.01em;
        }

        .collapse-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .collapse-toggle:hover {
          background: var(--color-divider);
          color: var(--color-text-primary);
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--space-2);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all var(--transition-fast);
          cursor: pointer;
        }

        .nav-item:hover {
          background: rgba(0, 0, 0, 0.04);
          color: var(--color-text-primary);
        }

        .nav-item.active {
          background: rgba(0, 0, 0, 0.06);
          color: var(--color-text-primary);
        }

        .sidebar.collapsed .nav-item {
          justify-content: center;
          padding: var(--space-2);
        }

        .nav-label {
          flex: 1;
        }

        .nav-shortcut {
          font-size: 11px;
          color: var(--color-text-tertiary);
          font-weight: 400;
        }
      `}</style>
        </aside>
    );
}
