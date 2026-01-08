'use client';

/**
 * Sidebar
 * 
 * Apple HIG navigation with traffic lights.
 * Clean, narrow, semantic colors for projects.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inbox, Calendar, Clock } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface Project {
  id: string;
  name: string;
  color: string;
}

interface SidebarProps {
  taskCount?: number;
  projects?: Project[];
}

const navItems: NavItem[] = [
  { href: '/', label: 'Inbox', icon: <Inbox size={14} /> },
  { href: '/today', label: 'Today', icon: <Calendar size={14} /> },
  { href: '/upcoming', label: 'Upcoming', icon: <Clock size={14} /> },
];

export function Sidebar({ taskCount = 0, projects = [] }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-[#F2F2F7]/95 backdrop-blur-xl border-r border-[#D1D1D6]/50 flex flex-col shrink-0">
      {/* Traffic Lights */}
      <div className="h-12 px-4 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
      </div>

      {/* Navigation */}
      <div className="flex-1 px-2 space-y-6 overflow-y-auto pt-2">
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-all outline-none group ${isActive
                    ? "bg-[#007AFF]/10 text-[#007AFF] font-medium"
                    : "hover:bg-[#E5E5EA]/50 text-[#48484A]"
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? "text-[#007AFF]" : "text-[#8E8E93]"}>
                    {item.icon}
                  </span>
                  <span className="text-[12px] tracking-tight">{item.label}</span>
                </div>
                {item.label === 'Inbox' && taskCount > 0 && (
                  <span className={`text-[10px] font-medium ${isActive ? "text-[#007AFF]" : "opacity-40"}`}>
                    {taskCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Projects */}
        {projects.length > 0 && (
          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest">
              Projects
            </h3>
            <nav className="space-y-0.5">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all hover:bg-[#E5E5EA]/50 text-[#48484A]"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-[12px] tracking-tight">{project.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}
