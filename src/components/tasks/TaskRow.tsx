'use client';

/**
 * TaskRow
 * 
 * Apple HIG task row with semantic priority colors.
 * Subtle hover states, chevron on selection.
 */

import { Circle, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Task, Project } from '@/types/database';

interface TaskRowProps {
  task: Task;
  project?: Project | null;
  isSelected?: boolean;
  onToggle: () => void;
  onClick: () => void;
}

const priorityColors: Record<number, string> = {
  1: "text-[#FF3B30]", // Urgent - SystemRed
  2: "text-[#FF9500]", // High - SystemOrange
  3: "text-[#007AFF]", // Medium - SystemBlue
  4: "text-[#8E8E93]", // Low - SystemGray
};

const priorityLabels: Record<number, string> = {
  1: "Urgent",
  2: "High",
  3: "Medium",
  4: "Low",
};

export function TaskRow({ task, project, isSelected = false, onToggle, onClick }: TaskRowProps) {
  const isCompleted = task.status === 'done';

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isCompleted;

  const formatDueDate = (date: string | null) => {
    if (!date) return null;
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-4 px-3 py-3.5 rounded-lg transition-all cursor-default relative overflow-hidden ${isSelected ? "bg-[#F2F2F7]" : "hover:bg-[#F2F2F7]/40"
        }`}
      tabIndex={0}
    >
      {/* Completion Toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`shrink-0 transition-colors ${isCompleted
            ? "text-[#34C759]"
            : "text-[#C7C7CC] group-hover:text-[#AEAEB2]"
          }`}
      >
        {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`text-[15px] font-medium truncate ${isCompleted
            ? "text-[#C7C7CC] line-through font-normal"
            : "text-[#1d1d1f]"
          }`}>
          {task.title}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {project && (
            <span className="text-[11px] text-[#8E8E93] font-medium tracking-tight opacity-70 uppercase">
              {project.name}
            </span>
          )}
          {task.priority < 4 && !isCompleted && (
            <span className={`text-[10px] font-bold uppercase tracking-tighter ${priorityColors[task.priority]}`}>
              {priorityLabels[task.priority]}
            </span>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 shrink-0">
        {task.due_date && (
          <span className={`text-[12px] font-medium tracking-tight ${isOverdue ? 'text-[#FF3B30]' : 'text-[#AEAEB2]'
            }`}>
            {formatDueDate(task.due_date)}
          </span>
        )}
        <ChevronRight
          size={14}
          className={`text-[#D1D1D6] transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    </div>
  );
}
