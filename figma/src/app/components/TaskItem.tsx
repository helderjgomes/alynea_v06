import { Calendar, Folder, Flag } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: string;
  project?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onClick: (id: string) => void;
}

export function TaskItem({ task, onToggle, onClick }: TaskItemProps) {
  const priorityColors = {
    low: '#86868B',
    medium: '#F6BD16',
    high: '#FF3B30',
  };

  return (
    <div
      className="group flex items-start gap-2.5 px-4 py-2 hover:bg-black/[0.02] transition-colors cursor-pointer border-b border-black/[0.04] last:border-0"
      onClick={() => onClick(task.id)}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        className="mt-[1px] flex-shrink-0"
      >
        <div
          className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
            task.completed
              ? 'bg-[#007AFF] border-[#007AFF]'
              : 'border-[#D1D1D6] hover:border-[#007AFF]/50'
          }`}
        >
          {task.completed && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div
          className={`text-[14px] leading-snug mb-0.5 ${
            task.completed ? 'text-[#86868B] line-through' : 'text-[#1D1D1F]'
          }`}
        >
          {task.title}
        </div>

        {task.notes && !task.completed && (
          <div className="text-[12px] text-[#86868B] leading-relaxed mb-1 line-clamp-1">
            {task.notes}
          </div>
        )}

        {/* Metadata */}
        {(task.dueDate || task.project || task.priority) && !task.completed && (
          <div className="flex items-center gap-2.5 mt-1">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-[12px] text-[#86868B]">
                <Calendar size={11} strokeWidth={2} />
                <span>{task.dueDate}</span>
              </div>
            )}
            {task.project && (
              <div className="flex items-center gap-1 text-[12px] text-[#86868B]">
                <Folder size={11} strokeWidth={2} />
                <span>{task.project}</span>
              </div>
            )}
            {task.priority && (
              <div className="flex items-center gap-1 text-[12px]">
                <Flag
                  size={11}
                  strokeWidth={2}
                  style={{ color: priorityColors[task.priority] }}
                  fill={task.priority === 'high' ? priorityColors[task.priority] : 'none'}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}