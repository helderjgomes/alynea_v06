import { TaskItem } from './TaskItem';

interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: string;
  project?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onTaskClick: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onTaskClick }: TaskListProps) {
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="h-full overflow-auto">
      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="bg-white">
          {activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onClick={onTaskClick}
            />
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="mt-4">
          <div className="px-4 py-2 bg-[#FAFAF9]">
            <h3 className="text-[11px] uppercase tracking-wide text-[#86868B] font-medium">
              Completed ({completedTasks.length})
            </h3>
          </div>
          <div className="bg-white">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onClick={onTaskClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-[#F5F5F4] flex items-center justify-center mb-3">
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="12" stroke="#C7C7CC" strokeWidth="2" />
              <path
                d="M12 16L15 19L20 13"
                stroke="#C7C7CC"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-[15px] text-[#1D1D1F] mb-1">All Clear</h3>
          <p className="text-[13px] text-[#86868B] max-w-xs leading-relaxed">
            You don't have any tasks yet. Click the + button to create your first task.
          </p>
        </div>
      )}
    </div>
  );
}