import { Inbox } from 'lucide-react';
import { DurationPicker } from './DurationPicker';
import { PriorityCheckbox } from './PriorityCheckbox';

interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: string;
  project?: string;
  priority?: 'low' | 'medium' | 'high';
  duration?: string;
}

interface InboxViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onTaskClick: (id: string) => void;
  onUpdateTask?: (task: Task) => void;
}

export function InboxView({ tasks, onToggle, onTaskClick, onUpdateTask }: InboxViewProps) {
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-1">
            <Inbox size={20} strokeWidth={1.5} className="text-[#007AFF]" />
            <h2 className="text-[22px] text-[#1D1D1F]">Inbox</h2>
          </div>
          <p className="text-[13px] text-[#86868B]">
            All your tasks in one place
          </p>
        </div>

        {/* Active Tasks Card */}
        <div className="bg-white rounded-xl overflow-hidden border border-black/[0.06] mb-4">
          {/* Card Header */}
          <div className="px-4 py-2.5 border-b border-black/[0.06] bg-[#FAFAF9]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] text-[#1D1D1F]">Active Tasks</h3>
              </div>
              <div className="text-[13px] text-[#86868B] tabular-nums">
                {activeTasks.length} {activeTasks.length === 1 ? 'task' : 'tasks'}
              </div>
            </div>
          </div>

          {/* Tasks List */}
          {activeTasks.length > 0 ? (
            <div>
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center gap-2.5 px-4 py-2 hover:bg-black/[0.02] transition-colors cursor-pointer border-b border-black/[0.04] last:border-0"
                  onClick={() => onTaskClick(task.id)}
                >
                  <PriorityCheckbox
                    completed={task.completed}
                    priority={task.priority}
                    onToggle={() => onToggle(task.id)}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] leading-snug text-[#1D1D1F]">
                      {task.title}
                    </div>
                    {task.notes && (
                      <div className="text-[12px] text-[#86868B] leading-relaxed mt-0.5 line-clamp-1">
                        {task.notes}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {task.project && (
                        <div className="text-[12px] text-[#86868B]">
                          {task.project}
                        </div>
                      )}
                      {task.dueDate && (
                        <>
                          {task.project && <span className="text-[#D1D1D6]">•</span>}
                          <div className="text-[12px] text-[#86868B]">
                            {task.dueDate}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Duration Picker - Aligned Right & Vertically Centered */}
                  <div className="flex items-center flex-shrink-0">
                    <DurationPicker
                      duration={task.duration}
                      onDurationChange={(duration) => {
                        onUpdateTask?.({ ...task, duration });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-[13px] text-[#86868B]">
                No active tasks
              </p>
            </div>
          )}
        </div>

        {/* Completed Tasks Card */}
        {completedTasks.length > 0 && (
          <div className="bg-white rounded-xl overflow-hidden border border-black/[0.06]">
            {/* Card Header */}
            <div className="px-4 py-2.5 border-b border-black/[0.06] bg-[#FAFAF9]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] text-[#1D1D1F]">Completed</h3>
                </div>
                <div className="text-[13px] text-[#86868B] tabular-nums">
                  {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'}
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div>
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-start gap-2.5 px-4 py-2 hover:bg-black/[0.02] transition-colors cursor-pointer border-b border-black/[0.04] last:border-0"
                  onClick={() => onTaskClick(task.id)}
                >
                  <PriorityCheckbox
                    completed={task.completed}
                    priority={task.priority}
                    onToggle={() => onToggle(task.id)}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] leading-snug text-[#86868B] line-through">
                      {task.title}
                    </div>
                    {task.notes && (
                      <div className="text-[12px] text-[#86868B] leading-relaxed mt-0.5 line-clamp-1">
                        {task.notes}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {task.project && (
                        <div className="text-[12px] text-[#86868B]">
                          {task.project}
                        </div>
                      )}
                      {task.dueDate && (
                        <>
                          {task.project && <span className="text-[#D1D1D6]">•</span>}
                          <div className="text-[12px] text-[#86868B]">
                            {task.dueDate}
                          </div>
                        </>
                      )}
                      {task.duration && (
                        <>
                          {task.project && <span className="text-[#D1D1D6]">•</span>}
                          <div className="text-[12px] text-[#86868B]">
                            {task.duration}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}