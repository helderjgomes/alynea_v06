import { WeekCalendarView } from './WeekCalendarView';
import { WeekKanbanView } from './WeekKanbanView';

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

interface WeekPlanViewProps {
  tasks: Task[];
  timeblocks?: Timeblock[];
  onToggle: (id: string) => void;
  onTaskClick: (id: string) => void;
  onUpdateTask: (task: Task) => void;
  onTimeblockClick?: (id: string) => void;
  onAddTimeblock?: (date: string, startTime: string) => void;
  viewMode: 'calendar' | 'kanban';
}

export function WeekPlanView({ 
  tasks, 
  timeblocks = [],
  onToggle, 
  onTaskClick, 
  onUpdateTask, 
  onTimeblockClick,
  onAddTimeblock,
  viewMode 
}: WeekPlanViewProps) {
  // If calendar mode, render the calendar view
  if (viewMode === 'calendar') {
    return (
      <div className="h-full overflow-hidden">
        <WeekCalendarView
          tasks={tasks}
          timeblocks={timeblocks}
          onToggle={onToggle}
          onTaskClick={onTaskClick}
          onUpdateTask={onUpdateTask}
          onTimeblockClick={onTimeblockClick}
          onAddTimeblock={onAddTimeblock}
        />
      </div>
    );
  }

  // Render kanban view
  return (
    <div className="h-full overflow-hidden">
      <WeekKanbanView
        tasks={tasks}
        onToggle={onToggle}
        onTaskClick={onTaskClick}
        onUpdateTask={onUpdateTask}
      />
    </div>
  );
}