import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Clock } from 'lucide-react';
import { PlanningSidebar } from './PlanningSidebar';

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

interface Timeblock {
  id: string;
  label?: string;
  startTime: string;
  endTime: string;
  date: string;
  color: string;
  taskIds: string[];
  isLocked?: boolean;
  isExternal?: boolean;
  externalSource?: 'google' | 'outlook' | 'apple';
}

interface WeekCalendarViewProps {
  tasks: Task[];
  timeblocks?: Timeblock[];
  onToggle: (id: string) => void;
  onTaskClick: (id: string) => void;
  onUpdateTask: (task: Task) => void;
  onTimeblockClick?: (id: string) => void;
  onAddTimeblock?: (date: string, startTime: string) => void;
}

interface DayColumn {
  name: string;
  shortName: string;
  date: string;
  dateKey: string;
  isToday: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const WORK_HOURS = Array.from({ length: 14 }, (_, i) => i + 6); // 6 AM to 8 PM

function ScheduledTaskBlock({
  task,
  onTaskClick,
}: {
  task: Task;
  onTaskClick: (id: string) => void;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'SCHEDULED_TASK',
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

  const projectColors: Record<string, string> = {
    Work: '#007AFF',
    Personal: '#34C759',
    Ideas: '#AF52DE',
  };

  const backgroundColor = task.project
    ? projectColors[task.project] || '#007AFF'
    : '#007AFF';

  return (
    <div
      ref={drag}
      onClick={() => onTaskClick(task.id)}
      className="absolute inset-x-0 mx-0.5 px-2 py-1 rounded-md text-white text-[11px] leading-tight cursor-pointer transition-opacity overflow-hidden"
      style={{
        backgroundColor,
        opacity: isDragging ? 0.5 : 1,
        zIndex: 10,
      }}
    >
      <div className="font-medium truncate">{task.title}</div>
      {task.startTime && task.endTime && (
        <div className="text-white/80 text-[10px]">
          {task.startTime} - {task.endTime}
        </div>
      )}
    </div>
  );
}

function UnscheduledTask({
  task,
  onToggle,
  onTaskClick,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onTaskClick: (id: string) => void;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'UNSCHEDULED_TASK',
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
      className="flex items-start gap-2.5 px-3 py-2 hover:bg-black/[0.02] transition-colors cursor-move border-b border-black/[0.04] last:border-0"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onTaskClick(task.id)}
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

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className={`text-[13px] leading-snug ${task.completed ? 'text-[#86868B] line-through' : 'text-[#1D1D1F]'}`}>
          {task.title}
        </div>
        {task.priority && !task.completed && (
          <div className="flex items-center gap-1 mt-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: priorityColors[task.priority] }}
            />
            <span className="text-[11px] text-[#86868B] capitalize">
              {task.priority}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function TimeSlot({
  day,
  hour,
  onDrop,
}: {
  day: DayColumn;
  hour: number;
  onDrop: (task: Task, day: string, hour: number) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['UNSCHEDULED_TASK', 'SCHEDULED_TASK'],
    drop: (item: { task: Task }) => {
      onDrop(item.task, day.dateKey, hour);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`h-14 border-b border-r border-black/[0.04] transition-colors relative ${
        isOver ? 'bg-[#007AFF]/5' : 'hover:bg-black/[0.02]'
      }`}
    />
  );
}

function TimeblockBlock({
  timeblock,
  tasks,
  onClick,
}: {
  timeblock: Timeblock;
  tasks: Task[];
  onClick: (id: string) => void;
}) {
  const linkedTasks = tasks.filter((t) => timeblock.taskIds.includes(t.id));

  return (
    <div
      onClick={() => onClick(timeblock.id)}
      className={`absolute inset-x-0 mx-0.5 px-2.5 py-2 rounded-lg text-white text-[11px] leading-tight cursor-pointer transition-all overflow-hidden ${
        timeblock.isExternal ? 'border-2 border-dashed border-white/30' : ''
      }`}
      style={{
        backgroundColor: timeblock.color,
        opacity: timeblock.isExternal ? 0.7 : 0.9,
        zIndex: 5,
      }}
    >
      <div className="flex items-start justify-between gap-1.5 mb-1">
        {timeblock.label && (
          <div className="font-semibold truncate flex-1">{timeblock.label}</div>
        )}
        {timeblock.isLocked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="white" opacity="0.8">
            <path d="M10 5h-1V3.5C9 1.57 7.43 0 5.5 0S2 1.57 2 3.5V5H1c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1h9c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zM3.5 3.5c0-1.1.9-2 2-2s2 .9 2 2V5h-4V3.5z" />
          </svg>
        )}
        {timeblock.isExternal && (
          <div className="text-[9px] uppercase tracking-wider opacity-70">
            {timeblock.externalSource}
          </div>
        )}
      </div>
      <div className="text-white/90 text-[10px] mb-1.5">
        {timeblock.startTime} - {timeblock.endTime}
      </div>
      {linkedTasks.length > 0 && (
        <div className="space-y-0.5 mt-1.5">
          {linkedTasks.slice(0, 2).map((task) => (
            <div key={task.id} className="text-[10px] text-white/80 truncate flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm border border-white/50 flex-shrink-0" />
              {task.title}
            </div>
          ))}
          {linkedTasks.length > 2 && (
            <div className="text-[9px] text-white/70 italic">
              +{linkedTasks.length - 2} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function WeekCalendarView({ tasks, timeblocks, onToggle, onTaskClick, onUpdateTask, onTimeblockClick, onAddTimeblock }: WeekCalendarViewProps) {
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

  // Separate scheduled and unscheduled tasks
  const scheduledTasks = tasks.filter((task) => task.startTime && !task.completed);
  const unscheduledTasks = tasks.filter((task) => !task.startTime && !task.completed);

  // Group scheduled tasks by day
  const tasksByDay = scheduledTasks.reduce((acc, task) => {
    if (task.dueDate) {
      const taskDate = new Date(task.dueDate).toDateString();
      if (!acc[taskDate]) {
        acc[taskDate] = [];
      }
      acc[taskDate].push(task);
    }
    return acc;
  }, {} as Record<string, Task[]>);

  const handleDrop = (task: Task, dayKey: string, hour: number) => {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endHour = Math.min(hour + 1, 23);
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;

    // Find the date for this dayKey
    const targetDay = weekDays.find((d) => d.dateKey === dayKey);
    if (!targetDay) return;

    const updatedTask = {
      ...task,
      startTime,
      endTime,
      dueDate: targetDay.date,
    };

    onUpdateTask(updatedTask);
  };

  const getTaskPosition = (task: Task, hour: number) => {
    if (!task.startTime) return null;

    const [startHour] = task.startTime.split(':').map(Number);
    if (startHour !== hour) return null;

    const [endHour] = (task.endTime || task.startTime).split(':').map(Number);
    const duration = endHour - startHour || 1;
    const height = duration * 56; // 56px per hour (h-14)

    return { top: 0, height };
  };

  const getTimeblockPosition = (timeblock: Timeblock, hour: number) => {
    const [startHour, startMin] = timeblock.startTime.split(':').map(Number);
    const [endHour, endMin] = timeblock.endTime.split(':').map(Number);
    
    if (startHour !== hour) return null;
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const durationMinutes = endMinutes - startMinutes;
    
    const height = (durationMinutes / 60) * 56; // 56px per hour
    const topOffset = (startMin / 60) * 56; // Offset within the hour
    
    return { top: topOffset, height };
  };

  // Group timeblocks by date (ISO string format YYYY-MM-DD)
  const timeblocksByDay = (timeblocks || []).reduce((acc, timeblock) => {
    // Convert YYYY-MM-DD to Date object then to DateString for consistency
    const dateObj = new Date(timeblock.date + 'T00:00:00');
    const dateKey = dateObj.toDateString();
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(timeblock);
    return acc;
  }, {} as Record<string, Timeblock[]>);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full bg-white">
        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[800px]">
            {/* Day Headers */}
            <div className="sticky top-0 z-20 bg-white border-b border-black/[0.06]">
              <div className="grid grid-cols-[60px_repeat(7,1fr)]">
                <div className="h-14 border-r border-black/[0.04]" />
                {weekDays.map((day) => (
                  <div
                    key={day.dateKey}
                    className="h-14 border-r border-black/[0.04] flex flex-col items-center justify-center"
                  >
                    <div
                      className={`text-[11px] uppercase tracking-wide font-medium ${
                        day.isToday ? 'text-[#007AFF]' : 'text-[#86868B]'
                      }`}
                    >
                      {day.shortName}
                    </div>
                    <div
                      className={`text-[17px] mt-0.5 ${
                        day.isToday
                          ? 'text-white bg-[#007AFF] w-7 h-7 rounded-full flex items-center justify-center'
                          : 'text-[#1D1D1F]'
                      }`}
                    >
                      {day.date.split(' ')[1]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Grid */}
            <div className="relative">
              {WORK_HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)]">
                  {/* Time Label */}
                  <div className="h-14 border-r border-black/[0.04] flex items-start justify-end pr-2 pt-1">
                    <span className="text-[11px] text-[#86868B]">
                      {hour === 0
                        ? '12 AM'
                        : hour === 12
                        ? '12 PM'
                        : hour > 12
                        ? `${hour - 12} PM`
                        : `${hour} AM`}
                    </span>
                  </div>

                  {/* Day Columns */}
                  {weekDays.map((day) => {
                    const dayTasks = tasksByDay[day.dateKey] || [];
                    const tasksAtHour = dayTasks.filter(
                      (task) => task.startTime?.startsWith(`${hour.toString().padStart(2, '0')}:`)
                    );

                    const dayTimeblocks = timeblocksByDay[day.dateKey] || [];
                    const timeblocksAtHour = dayTimeblocks.filter(
                      (timeblock) => timeblock.startTime?.startsWith(`${hour.toString().padStart(2, '0')}:`)
                    );

                    return (
                      <div key={`${day.dateKey}-${hour}`} className="relative">
                        <TimeSlot day={day} hour={hour} onDrop={handleDrop} />
                        {tasksAtHour.map((task) => {
                          const position = getTaskPosition(task, hour);
                          if (!position) return null;

                          return (
                            <div
                              key={task.id}
                              style={{ height: position.height }}
                              className="absolute top-0 left-0 right-0"
                            >
                              <ScheduledTaskBlock task={task} onTaskClick={onTaskClick} />
                            </div>
                          );
                        })}
                        {timeblocksAtHour.map((timeblock) => {
                          const position = getTimeblockPosition(timeblock, hour);
                          if (!position) return null;

                          return (
                            <div
                              key={timeblock.id}
                              style={{ top: position.top, height: position.height }}
                              className="absolute left-0 right-0"
                            >
                              <TimeblockBlock timeblock={timeblock} tasks={tasks} onClick={onTimeblockClick || (() => {})} />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Planning Sidebar - replaces old Unscheduled Tasks Sidebar */}
        <PlanningSidebar
          unscheduledTasks={unscheduledTasks}
          onToggle={onToggle}
          onTaskClick={onTaskClick}
        />
      </div>
    </DndProvider>
  );
}