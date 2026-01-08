'use client';

/**
 * Top Bar
 * 
 * View title, search, sidebar toggle.
 * Clean, minimal header.
 */

import { Search, Sidebar as SidebarIcon } from 'lucide-react';

interface TopBarProps {
  title: string;
  onToggleSidebar?: () => void;
}

export function TopBar({ title, onToggleSidebar }: TopBarProps) {
  return (
    <header className="h-12 border-b border-[#E5E5EA]/60 px-4 flex items-center justify-between shrink-0 bg-white">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 hover:bg-[#F2F2F7] rounded-md text-[#8E8E93] transition-colors"
          >
            <SidebarIcon size={15} />
          </button>
        )}
        <h2 className="text-[14px] font-bold text-[#1d1d1f] tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C7C7CC]" />
          <input
            type="text"
            placeholder="Search"
            className="bg-[#F2F2F7]/80 border-none text-[12px] rounded-md pl-8 pr-3 py-1 w-44 focus:bg-white transition-all outline-none placeholder-[#C7C7CC]"
          />
        </div>
      </div>
    </header>
  );
}
