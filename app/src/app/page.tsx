'use client';

import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ViewId, Project } from '@/components/layout/sidebar';
import { InboxView } from '@/components/features/inbox-view';
import { TodayView } from '@/components/features/today-view';
import { GoalsView } from '@/components/features/goals-view';
import { HabitsView } from '@/components/features/habits-view';
import { TaskEditor } from '@/components/features/task-editor';

// Type definitions
interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: string;
  project?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  status: 'on_track' | 'at_risk' | 'off_track' | 'completed';
  progress: number;
  targetDate?: string;
}

interface Habit {
  id: string;
  name: string;
  isActive: boolean;
  checkins: string[];
}

// Mock data for demo
const mockProjects: Project[] = [
  { id: 'work', name: 'Work', color: '#5B8FF9' },
  { id: 'personal', name: 'Personal', color: '#61DDAA' },
  { id: 'ideas', name: 'Ideas', color: '#F6BD16' },
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Review design system documentation',
    notes: 'Check color tokens and typography scale',
    completed: false,
    dueDate: 'Today',
    project: 'Work',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Set up Supabase auth',
    completed: false,
    project: 'Work',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Buy groceries',
    completed: true,
    project: 'Personal',
  },
  {
    id: '4',
    title: 'Write blog post',
    notes: 'About productivity apps',
    completed: false,
    dueDate: 'Tomorrow',
    project: 'Ideas',
    priority: 'low',
  },
];

const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'Launch Alynea MVP',
    description: 'Complete core features and deploy to production',
    status: 'on_track',
    progress: 65,
    targetDate: 'Feb 2026',
  },
  {
    id: '2',
    title: 'Learn TypeScript',
    description: 'Master advanced TypeScript patterns',
    status: 'at_risk',
    progress: 40,
    targetDate: 'Mar 2026',
  },
];

const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Morning exercise',
    isActive: true,
    checkins: [
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    ],
  },
  {
    id: '2',
    name: 'Read for 30 minutes',
    isActive: true,
    checkins: [
      new Date().toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
    ],
  },
  {
    id: '3',
    name: 'Meditate',
    isActive: true,
    checkins: [],
  },
];

export default function HomePage() {
  const [currentView, setCurrentView] = React.useState<ViewId>('inbox');
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [goals] = React.useState<Goal[]>(initialGoals);
  const [habits, setHabits] = React.useState<Habit[]>(initialHabits);
  const [taskEditorOpen, setTaskEditorOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();

  const handleTaskToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleTaskClick = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setEditingTask(task);
      setTaskEditorOpen(true);
    }
  };

  const handleNewTask = () => {
    setEditingTask(undefined);
    setTaskEditorOpen(true);
  };

  const handleSaveTask = (taskData: {
    id?: string;
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    projectId?: string;
    projectName?: string;
  }) => {
    if (taskData.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
              ...t,
              title: taskData.title,
              notes: taskData.description,
              priority: taskData.priority,
              dueDate: taskData.dueDate,
              project: taskData.projectName,
            }
            : t
        )
      );
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title,
        notes: taskData.description,
        completed: false,
        dueDate: taskData.dueDate,
        project: taskData.projectName,
        priority: taskData.priority,
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleHabitCheck = (habitId: string, date: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const hasCheckin = h.checkins.includes(date);
        return {
          ...h,
          checkins: hasCheckin
            ? h.checkins.filter((d) => d !== date)
            : [...h.checkins, date],
        };
      })
    );
  };

  const inboxTasks = tasks.filter((t) => !t.completed);
  const todayTasks = tasks.filter((t) => t.dueDate === 'Today');
  const overdueTasks = tasks.filter((t) => t.dueDate === 'Overdue' && !t.completed);

  return (
    <>
      <AppShell
        currentView={currentView}
        onViewChange={setCurrentView}
        projects={mockProjects}
        taskCounts={{
          inbox: inboxTasks.length,
          today: todayTasks.length,
        }}
      >
        {currentView === 'inbox' && (
          <InboxView
            tasks={tasks}
            onTaskToggle={handleTaskToggle}
            onTaskClick={handleTaskClick}
            onNewTask={handleNewTask}
          />
        )}

        {currentView === 'today' && (
          <TodayView
            tasks={todayTasks}
            overdueTasks={overdueTasks}
            onTaskToggle={handleTaskToggle}
            onTaskClick={handleTaskClick}
            onNewTask={handleNewTask}
          />
        )}

        {currentView === 'goals' && (
          <GoalsView
            goals={goals}
            onGoalClick={(id) => console.log('Goal clicked:', id)}
            onNewGoal={() => console.log('New goal')}
          />
        )}

        {currentView === 'habits' && (
          <HabitsView
            habits={habits}
            onHabitClick={(id) => console.log('Habit clicked:', id)}
            onHabitCheck={handleHabitCheck}
            onNewHabit={() => console.log('New habit')}
          />
        )}

        {currentView === 'planning' && (
          <div className="h-full flex items-center justify-center">
            <p className="text-[14px] text-[#86868B]">
              Week Planning view coming soon...
            </p>
          </div>
        )}
      </AppShell>

      <TaskEditor
        open={taskEditorOpen}
        onOpenChange={setTaskEditorOpen}
        task={editingTask}
        projects={mockProjects}
        onSave={handleSaveTask}
        onDelete={editingTask?.id ? handleDeleteTask : undefined}
      />
    </>
  );
}
