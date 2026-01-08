import { Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: string;
  project?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface WeekViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onTaskClick: (id: string) => void;
}

export function WeekView({ tasks, onToggle, onTaskClick }: WeekViewProps) {
  // Group tasks by date
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const getDateKey = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  // Mock task distribution
  const tasksByDate = weekDays.reduce((acc, date) => {
    const dateKey = getDateKey(date);
    acc[dateKey] = tasks.filter((task) => task.dueDate === dateKey && !task.completed);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Week Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-1">
            <Calendar size={20} strokeWidth={1.5} className="text-[#007AFF]" />
            <h2 className="text-[22px] text-[#1D1D1F]">Upcoming</h2>
          </div>
          <p className="text-[13px] text-[#86868B]">
            {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} -{' '}
            {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Week Days */}
        <div className="space-y-4">
          {weekDays.map((date, index) => {
            const dateKey = getDateKey(date);
            const dayTasks = tasksByDate[dateKey] || [];

            return (
              <div key={index} className="bg-white rounded-xl overflow-hidden border border-black/[0.06]">
                {/* Day Header */}
                <div
                  className={`px-4 py-2.5 border-b border-black/[0.06] ${
                    isToday(date) ? 'bg-[#007AFF]/5' : 'bg-[#FAFAF9]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[15px] text-[#1D1D1F] mb-0">
                        {date.toLocaleDateString('en-US', { weekday: 'long' })}
                        {isToday(date) && (
                          <span className="ml-2 text-[12px] text-[#007AFF] font-medium">
                            Today
                          </span>
                        )}
                      </h3>
                      <p className="text-[12px] text-[#86868B]">
                        {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-[13px] text-[#86868B] tabular-nums">
                      {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                    </div>
                  </div>
                </div>

                {/* Day Tasks */}
                {dayTasks.length > 0 ? (
                  <div>
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className="group flex items-start gap-2.5 px-4 py-2 hover:bg-black/[0.02] transition-colors cursor-pointer border-b border-black/[0.04] last:border-0"
                        onClick={() => onTaskClick(task.id)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggle(task.id);
                          }}
                          className="mt-[1px] flex-shrink-0"
                        >
                          <div className="w-4 h-4 rounded-full border-2 border-[#D1D1D6] hover:border-[#007AFF]/50 transition-all" />
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] leading-snug text-[#1D1D1F]">
                            {task.title}
                          </div>
                          {task.notes && (
                            <div className="text-[12px] text-[#86868B] leading-relaxed mt-0.5 line-clamp-1">
                              {task.notes}
                            </div>
                          )}
                          {task.project && (
                            <div className="text-[12px] text-[#86868B] mt-1">
                              {task.project}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-[13px] text-[#86868B]">
                      No tasks scheduled
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}