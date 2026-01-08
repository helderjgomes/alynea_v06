'use client';

/**
 * Sidebar
 * 
 * Navigation with counts and user profile at bottom.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inbox, Calendar, Clock, FolderKanban, Lightbulb, User } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface SidebarProps {
  counts?: {
    inbox?: number;
    today?: number;
    upcoming?: number;
    planning?: number;
  };
}

export function Sidebar({ counts = {} }: SidebarProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: '/', label: 'Inbox', icon: <Inbox size={16} />, count: counts.inbox },
    { href: '/today', label: 'Today', icon: <Calendar size={16} />, count: counts.today },
    { href: '/upcoming', label: 'Upcoming', icon: <Clock size={16} />, count: counts.upcoming },
    { href: '/planning', label: 'Planning', icon: <Lightbulb size={16} />, count: counts.planning },
  ];

  return (
    <aside className="w-60 h-full bg-[#FAFAFA] border-r border-[#E5E5EA] flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-14 px-5 flex items-center">
        <span className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">
          Alynea
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${isActive
                  ? "bg-[#007AFF] text-white"
                  : "text-[#48484A] hover:bg-[#E5E5EA]/50"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? "text-white" : "text-[#8E8E93]"}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-medium">{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-[11px] font-medium ${isActive ? "text-white/80" : "text-[#8E8E93]"
                  }`}>
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}

        {/* Projects Section */}
        <div className="pt-6">
          <h3 className="px-3 pb-2 text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
            Projects
          </h3>
          <Link
            href="/projects/work"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#48484A] hover:bg-[#E5E5EA]/50 transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-[#007AFF]" />
            <span className="text-[13px] font-medium">Work</span>
          </Link>
          <Link
            href="/projects/personal"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#48484A] hover:bg-[#E5E5EA]/50 transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-[#34C759]" />
            <span className="text-[13px] font-medium">Personal</span>
          </Link>
          <Link
            href="/projects/ideas"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#48484A] hover:bg-[#E5E5EA]/50 transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-[#AF52DE]" />
            <span className="text-[13px] font-medium">Ideas</span>
          </Link>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-[#E5E5EA]">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#E5E5EA]/50 cursor-pointer transition-all">
          <div className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center text-white text-[11px] font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-[#1d1d1f] truncate">John Doe</div>
            <div className="text-[11px] text-[#8E8E93] truncate">john@example.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
