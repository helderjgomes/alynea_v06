import { Inbox, Calendar, CalendarDays, Folder, ChevronRight, Plus, CalendarRange, Target, RefreshCcw, Settings } from 'lucide-react';

type View = 'inbox' | 'today' | 'upcoming' | 'weekplan' | 'projects' | 'goals' | 'habits';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isCollapsed: boolean;
  selectedProject?: string | null;
  onProjectClick?: (projectId: string) => void;
  onSettingsClick?: () => void;
}

export function Sidebar({ currentView, onViewChange, isCollapsed, selectedProject, onProjectClick, onSettingsClick }: SidebarProps) {
  const navItems = [
    { id: 'inbox' as View, label: 'Inbox', icon: Inbox, count: 12 },
    { id: 'today' as View, label: 'Today', icon: Calendar, count: 5 },
    { id: 'upcoming' as View, label: 'Upcoming', icon: CalendarDays, count: 8 },
    { id: 'weekplan' as View, label: 'Planning', icon: CalendarRange, count: 15 },
  ];

  const projects = [
    { id: 'work', name: 'Work', color: '#5B8FF9' },
    { id: 'personal', name: 'Personal', color: '#61DDAA' },
    { id: 'ideas', name: 'Ideas', color: '#F6BD16' },
  ];

  if (isCollapsed) {
    return (
      <div className="w-16 h-full bg-[#F5F5F4]/80 backdrop-blur-xl border-r border-black/[0.06] flex flex-col items-center py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center mb-1 transition-all ${
              currentView === item.id
                ? 'bg-[#007AFF]/10 text-[#007AFF]'
                : 'text-[#86868B] hover:bg-black/[0.04]'
            }`}
          >
            <item.icon size={18} strokeWidth={1.5} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-52 h-full bg-[#F5F5F4]/80 backdrop-blur-xl border-r border-black/[0.06] flex flex-col">
      {/* Sidebar Header */}
      <div className="px-4 py-4">
        <h1 className="text-[20px] tracking-tight text-[#1D1D1F] font-medium">
          Alynea
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-all group ${
                currentView === item.id
                  ? 'bg-[#007AFF]/10 text-[#007AFF]'
                  : 'text-[#1D1D1F] hover:bg-black/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <item.icon size={16} strokeWidth={1.5} />
                <span className="text-[14px]">{item.label}</span>
              </div>
              <span
                className={`text-[12px] tabular-nums ${
                  currentView === item.id ? 'text-[#007AFF]/70' : 'text-[#86868B]'
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Focus Section - Goals & Habits */}
        <div className="mt-6">
          <div className="px-2.5 py-1.5">
            <h2 className="text-[11px] uppercase tracking-wide text-[#86868B] font-medium">
              Focus
            </h2>
          </div>

          <div className="space-y-0.5 mt-1">
            <button
              onClick={() => onViewChange('goals')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all ${
                currentView === 'goals'
                  ? 'bg-[#007AFF]/10 text-[#007AFF]'
                  : 'text-[#1D1D1F] hover:bg-black/[0.04]'
              }`}
            >
              <Target size={16} strokeWidth={1.5} />
              <span className="text-[14px]">Goals</span>
            </button>

            <button
              onClick={() => onViewChange('habits')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all ${
                currentView === 'habits'
                  ? 'bg-[#007AFF]/10 text-[#007AFF]'
                  : 'text-[#1D1D1F] hover:bg-black/[0.04]'
              }`}
            >
              <RefreshCcw size={16} strokeWidth={1.5} />
              <span className="text-[14px]">Habits</span>
            </button>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-2.5 py-1.5">
            <h2 className="text-[11px] uppercase tracking-wide text-[#86868B] font-medium">
              Projects
            </h2>
            <button className="text-[#86868B] hover:text-[#1D1D1F] transition-colors">
              <Plus size={14} strokeWidth={2} />
            </button>
          </div>

          <div className="space-y-0.5 mt-1">
            {projects.map((project) => {
              const isSelected = currentView === 'projects' && selectedProject === project.name;
              
              return (
                <button
                  key={project.id}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all group ${
                    isSelected
                      ? 'bg-[#007AFF]/10 text-[#007AFF]'
                      : 'text-[#1D1D1F] hover:bg-black/[0.04]'
                  }`}
                  onClick={() => onProjectClick?.(project.id)}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-[14px]">{project.name}</span>
                  <ChevronRight
                    size={12}
                    className={`ml-auto transition-opacity ${
                      isSelected ? 'text-[#007AFF] opacity-100' : 'text-[#86868B] opacity-0 group-hover:opacity-100'
                    }`}
                    strokeWidth={2}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-2 border-t border-black/[0.06]">
        <button 
          onClick={onSettingsClick}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-black/[0.04] transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#007AFF] to-[#5B8FF9] flex items-center justify-center text-white text-[13px] font-medium">
            JD
          </div>
          <div className="flex-1 text-left">
            <div className="text-[13px] text-[#1D1D1F]">John Doe</div>
            <div className="text-[11px] text-[#86868B]">john@example.com</div>
          </div>
          <Settings size={14} className="text-[#86868B]" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}