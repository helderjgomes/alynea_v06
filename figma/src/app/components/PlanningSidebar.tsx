import { ListTodo, Target, CheckCircle2, StickyNote, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: string;
  project?: string;
  priority?: 'low' | 'medium' | 'high';
  startTime?: string;
  endTime?: string;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  deadline?: string;
}

interface Habit {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
}

interface Note {
  id: string;
  title: string;
  preview: string;
}

interface PlanningSidebarProps {
  unscheduledTasks?: Task[];
  onToggle?: (id: string) => void;
  onTaskClick?: (id: string) => void;
}

export function PlanningSidebar({ unscheduledTasks = [], onToggle, onTaskClick }: PlanningSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['tasks']));

  // Mock data for goals, habits, and notes
  const goals: Goal[] = [
    { id: 'g1', title: 'Complete Q1 roadmap', progress: 65, deadline: 'Jan 31' },
    { id: 'g2', title: 'Launch new feature', progress: 40, deadline: 'Feb 15' },
  ];

  const habits: Habit[] = [
    { id: 'h1', title: 'Morning meditation', streak: 12, completedToday: true },
    { id: 'h2', title: 'Read for 30 min', streak: 8, completedToday: false },
    { id: 'h3', title: 'Exercise', streak: 5, completedToday: true },
  ];

  const notes: Note[] = [
    { id: 'n1', title: 'Meeting notes', preview: 'Discussed project timeline...' },
    { id: 'n2', title: 'Ideas for blog post', preview: 'Remote work productivity tips...' },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const sections = [
    {
      id: 'tasks',
      title: 'Tasks',
      icon: ListTodo,
      count: unscheduledTasks.length,
      content: (
        <div className="space-y-1">
          {unscheduledTasks.length > 0 ? (
            unscheduledTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-2 px-3 py-2 hover:bg-black/[0.02] transition-colors cursor-pointer rounded-md"
                onClick={() => onTaskClick?.(task.id)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle?.(task.id);
                  }}
                  className="mt-[1px] flex-shrink-0"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-[#D1D1D6] hover:border-[#007AFF]/50 transition-all" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] leading-snug text-[#1D1D1F] line-clamp-2">
                    {task.title}
                  </div>
                  {task.project && (
                    <div className="text-[11px] text-[#86868B] mt-0.5">
                      {task.project}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-center">
              <p className="text-[12px] text-[#86868B] italic">No unscheduled tasks</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'goals',
      title: 'Goals',
      icon: Target,
      count: goals.length,
      content: (
        <div className="space-y-2">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="px-3 py-2 hover:bg-black/[0.02] transition-colors cursor-pointer rounded-md"
            >
              <div className="text-[13px] text-[#1D1D1F] mb-2 leading-snug">
                {goal.title}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#007AFF] rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <span className="text-[11px] text-[#86868B] tabular-nums">
                  {goal.progress}%
                </span>
              </div>
              {goal.deadline && (
                <div className="text-[11px] text-[#86868B] mt-1">
                  Due {goal.deadline}
                </div>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'habits',
      title: 'Habits',
      icon: CheckCircle2,
      count: habits.length,
      content: (
        <div className="space-y-1">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between px-3 py-2 hover:bg-black/[0.02] transition-colors cursor-pointer rounded-md"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <button className="flex-shrink-0">
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                      habit.completedToday
                        ? 'bg-[#34C759] border-[#34C759]'
                        : 'border-[#D1D1D6] hover:border-[#34C759]/50'
                    }`}
                  >
                    {habit.completedToday && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6L5 8.5L9.5 3.5"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </button>
                <span className="text-[13px] text-[#1D1D1F] truncate">
                  {habit.title}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#86868B] flex-shrink-0">
                <span className="tabular-nums">{habit.streak}</span>
                <span>🔥</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'notes',
      title: 'Notes',
      icon: StickyNote,
      count: notes.length,
      content: (
        <div className="space-y-1">
          {notes.map((note) => (
            <div
              key={note.id}
              className="px-3 py-2 hover:bg-black/[0.02] transition-colors cursor-pointer rounded-md"
            >
              <div className="text-[13px] text-[#1D1D1F] font-medium mb-0.5 line-clamp-1">
                {note.title}
              </div>
              <div className="text-[11px] text-[#86868B] leading-relaxed line-clamp-2">
                {note.preview}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="w-64 border-l border-black/[0.06] flex flex-col bg-[#FAFAF9]">
      <div className="flex-1 overflow-auto">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const Icon = section.icon;

          return (
            <div key={section.id} className="border-b border-black/[0.06]">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon size={14} strokeWidth={2} className="text-[#86868B]" />
                  <h3 className="text-[13px] font-medium text-[#1D1D1F]">
                    {section.title}
                  </h3>
                  <span className="text-[11px] text-[#86868B] tabular-nums">
                    {section.count}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown size={14} className="text-[#86868B]" strokeWidth={2} />
                ) : (
                  <ChevronRight size={14} className="text-[#86868B]" strokeWidth={2} />
                )}
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="pb-3">
                  {section.content}
                  {/* Add Button */}
                  <div className="px-3 pt-2">
                    <button className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[12px] text-[#86868B] hover:text-[#007AFF] transition-colors rounded-md hover:bg-black/[0.02]">
                      <Plus size={12} strokeWidth={2} />
                      <span>Add {section.title.toLowerCase().slice(0, -1)}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
