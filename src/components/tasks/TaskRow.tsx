'use client';

/**
 * TaskRow
 * 
 * Task item with project tag badge and date.
 * Matches the provided Inbox design.
 */

import { Circle, CheckCircle2 } from 'lucide-react';
import type { Task, Project } from '@/types/database';

interface TaskRowProps {
  task: Task;
  project?: Project | null;
  isSelected?: boolean;
  onToggle: () => void;
  onClick: () => void;
}

// Project color mapping
const projectColors: Record<string, { bg: string; text: string }> = {
  'Work': { bg: 'bg-[#007AFF]/10', text: 'text-[#007AFF]' },
  'Personal': { bg: 'bg-[#34C759]/10', text: 'text-[#34C759]' },
  'Ideas': { bg: 'bg-[#AF52DE]/10', text: 'text-[#AF52DE]' },
};

export function TaskRow({ task, project, isSelected = false, onToggle, onClick }: TaskRowProps) {
  const isCompleted = task.status === 'done';

  const formatDueDate = (date: string | null) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const projectName = project?.name || 'Inbox';
  const colors = projectColors[projectName] || { bg: 'bg-[#8E8E93]/10', text: 'text-[#8E8E93]' };

  return (
    <div
      onClick={onClick}
      className={`group flex items-start gap-3 px-4 py-3 transition-all cursor-pointer border-b border-[#F2F2F7] last:border-b-0 ${isSelected ? "bg-[#F2F2F7]" : "hover:bg-[#FAFAFA]"
        }`}
    >
      {/* Completion Toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`shrink-0 mt-0.5 transition-colors ${isCompleted
            ? "text-[#34C759]"
            : "text-[#D1D1D6] hover:text-[#8E8E93]"
          }`}
      >
        {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`text-[14px] font-medium leading-tight ${isCompleted
            ? "text-[#8E8E93] line-through"
            : "text-[#1d1d1f]"
          }`}>
          {task.title}
        </div>
        {task.description && !isCompleted && (
          <div className="text-[12px] text-[#8E8E93] mt-0.5 line-clamp-1">
            {task.description}
          </div>
        )}
      </div>

      {/* Meta: Project tag + Date */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
          {projectName}
        </span>
        {task.due_date && (
          <>
            <span className="text-[#D1D1D6]">•</span>
            <span className="text-[12px] text-[#8E8E93]">
              {formatDueDate(task.due_date)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
