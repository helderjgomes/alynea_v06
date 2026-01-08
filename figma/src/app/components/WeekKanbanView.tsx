import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Calendar, Folder, Flag, Plus } from 'lucide-react';
import { PlanningSidebar } from './PlanningSidebar';
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
  startTime?: string;
  endTime?: string;
  duration?: string;
}

interface WeekKanbanViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onTaskClick: (id: string) => void;
  onUpdateTask: (task: Task) => void;
}

interface DayColumn {
  name: string;
  shortName: string;
  date: string;
  dateKey: string;
  isToday: boolean;
}

function KanbanTaskCard({
  task,
  onToggle,
  onTaskClick,
  onUpdateTask,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onTaskClick: (id: string) => void;
  onUpdateTask?: (task: Task) => void;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'KANBAN_TASK',
    item: { task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const priorityColors = {
    low: '#86868B',
    medium: '#F6BD16',
    high: '#FF3B30',
  };

  return (
    <div
      ref={drag}
      onClick={() => onTaskClick(task.id)}
      className="bg-white rounded-lg p-3 mb-2 cursor-pointer transition-all hover:shadow-sm border border-black/[0.06]"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex items-start gap-2.5 mb-2">
        {/* Priority Checkbox */}
        <PriorityCheckbox
          completed={task.completed}
          priority={task.priority}
          onToggle={() => onToggle(task.id)}
        />

        {/* Task Title */}
        <div className="flex-1 min-w-0">
          <div
            className={`text-[13px] leading-snug ${
              task.completed ? 'text-[#86868B] line-through' : 'text-[#1D1D1F]'
            }`}
          >
            {task.title}
          </div>
        </div>

        {/* Duration Picker - Top Right */}
        {!task.completed && (
          <div className="flex-shrink-0">
            <DurationPicker
              duration={task.duration}
              onDurationChange={(duration) => {
                onUpdateTask?.({ ...task, duration });
              }}
              compact
            />
          </div>
        )}
      </div>

      {/* Task Notes */}
      {task.notes && !task.completed && (
        <div className="text-[12px] text-[#86868B] leading-relaxed mb-2 line-clamp-2">
          {task.notes}
        </div>
      )}

      {/* Metadata */}
      {(task.project || task.priority || task.startTime) && !task.completed && (
        <div className="flex items-center gap-2 flex-wrap">
          {task.project && (
            <div className="flex items-center gap-1 text-[11px] text-[#86868B]">
              <Folder size={10} strokeWidth={2} />
              <span>{task.project}</span>
            </div>
          )}
          {task.startTime && (
            <div className="flex items-center gap-1 text-[11px] text-[#86868B]">
              <Calendar size={10} strokeWidth={2} />
              <span>{task.startTime}</span>
            </div>
          )}
          {task.priority && (
            <Flag
              size={11}
              strokeWidth={2}
              style={{ color: priorityColors[task.priority] }}
              fill={task.priority === 'high' ? priorityColors[task.priority] : 'none'}
            />
          )}
        </div>
      )}
    </div>
  );
}

function KanbanColumn({
  day,
  tasks,
  onToggle,
  onTaskClick,
  onDrop,
  onUpdateTask,
}: {
  day: DayColumn;
  tasks: Task[];
  onToggle: (id: string) => void;
  onTaskClick: (id: string) => void;
  onDrop: (task: Task, dayKey: string) => void;
  onUpdateTask?: (task: Task) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'KANBAN_TASK',
    drop: (item: { task: Task }) => {
      onDrop(item.task, day.dateKey);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="flex-shrink-0 w-72 flex flex-col">
      {/* Column Header */}
      <div className="sticky top-0 z-10 bg-white pb-3">
        <div className="flex items-baseline justify-between mb-1">
          <div className="flex items-baseline gap-2">
            <h3
              className={`text-[15px] font-medium ${
                day.isToday ? 'text-[#007AFF]' : 'text-[#1D1D1F]'
              }`}
            >
              {day.shortName}
            </h3>
            <span className="text-[12px] text-[#86868B]">{day.date}</span>
          </div>
          {activeTasks.length > 0 && (
            <span className="text-[12px] text-[#86868B] tabular-nums">
              {activeTasks.length}
            </span>
          )}
        </div>
        {day.isToday && (
          <div className="w-8 h-0.5 bg-[#007AFF] rounded-full" />
        )}
      </div>

      {/* Drop Zone */}
      <div
        ref={drop}
        className={`flex-1 rounded-lg transition-colors min-h-[400px] ${
          isOver ? 'bg-[#007AFF]/5' : ''
        }`}
      >
        {/* Active Tasks */}
        {activeTasks.length > 0 ? (
          <div className="pb-2">
            {activeTasks.map((task) => (
              <KanbanTaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onTaskClick={onTaskClick}
                onUpdateTask={onUpdateTask}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 px-3">
            <p className="text-[12px] text-[#86868B] italic text-center">
              No tasks
            </p>
          </div>
        )}

        {/* Add Task Button */}
        <button className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-[12px] text-[#86868B] hover:text-[#007AFF] transition-colors rounded-lg hover:bg-black/[0.02]">
          <Plus size={13} strokeWidth={2} />
          <span>Add task</span>
        </button>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mt-4 pt-3 border-t border-black/[0.06]">
            <div className="px-1 py-1 mb-2">
              <span className="text-[10px] uppercase tracking-wide text-[#86868B] font-medium">
                Completed ({completedTasks.length})
              </span>
            </div>
            {completedTasks.map((task) => (
              <KanbanTaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onTaskClick={onTaskClick}
                onUpdateTask={onUpdateTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function WeekKanbanView({
  tasks,
  onToggle,
  onTaskClick,
  onUpdateTask,
}: WeekKanbanViewProps) {
  const getWeekDays = (): DayColumn[] => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    const days: DayColumn[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      const isToday = date.toDateString() === today.toDateString();

      days.push({
        name: date.toLocaleDateString('en-US', { weekday: 'long' }),
        shortName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dateKey: date.toDateString(),
        isToday,
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  // Group tasks by day
  const tasksByDay = tasks.reduce((acc, task) => {
    if (task.dueDate) {
      const taskDate = new Date(task.dueDate).toDateString();
      if (!acc[taskDate]) {
        acc[taskDate] = [];
      }
      acc[taskDate].push(task);
    }
    return acc;
  }, {} as Record<string, Task[]>);

  // Get unscheduled tasks (tasks without a due date)
  const unscheduledTasks = tasks.filter((task) => !task.dueDate && !task.completed);

  const handleDrop = (task: Task, dayKey: string) => {
    const targetDay = weekDays.find((d) => d.dateKey === dayKey);
    if (!targetDay) return;

    const updatedTask = {
      ...task,
      dueDate: targetDay.date,
    };

    onUpdateTask(updatedTask);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full bg-white">
        {/* Kanban Columns */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6">
            <div className="flex gap-4 pb-6">
              {weekDays.map((day) => {
                const dayTasks = tasksByDay[day.dateKey] || [];

                return (
                  <KanbanColumn
                    key={day.dateKey}
                    day={day}
                    tasks={dayTasks}
                    onToggle={onToggle}
                    onTaskClick={onTaskClick}
                    onDrop={handleDrop}
                    onUpdateTask={onUpdateTask}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Planning Sidebar */}
        <PlanningSidebar
          unscheduledTasks={unscheduledTasks}
          onToggle={onToggle}
          onTaskClick={onTaskClick}
        />
      </div>
    </DndProvider>
  );
}