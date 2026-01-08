'use client';

/**
 * Inbox Page
 * 
 * Core task capture and triage view.
 * Shows all incomplete tasks without a specific due date or project filter.
 */

import { useEffect } from 'react';
import { TopBar } from '@/components/app-shell';
import { TaskList, TaskEditor, QuickAdd } from '@/components/tasks';
import { useTaskStore } from '@/stores';
import type { Task } from '@/types/database';

export default function InboxPage() {
  const {
    tasks,
    projects,
    isLoading,
    selectedTaskId,
    fetchTasks,
    fetchProjects,
    addTask,
    updateTask,
    toggleComplete,
    selectTask,
  } = useTaskStore();

  // Fetch data on mount
  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;
  const projectsMap = new Map(projects.map((p) => [p.id, p]));

  const handleSelectTask = (task: Task) => {
    selectTask(task.id === selectedTaskId ? null : task.id);
  };

  return (
    <div className="inbox-page">
      <TopBar
        title="Inbox"
        onAddTask={() => {
          const title = prompt('Task title:');
          if (title) addTask(title);
        }}
      />

      <div className="inbox-content">
        <div className="task-list-container">
          <QuickAdd onAdd={addTask} />

          {isLoading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <TaskList
              tasks={tasks}
              projects={projectsMap}
              selectedTaskId={selectedTaskId}
              onToggleComplete={toggleComplete}
              onSelectTask={handleSelectTask}
            />
          )}
        </div>

        {selectedTask && (
          <TaskEditor
            task={selectedTask}
            projects={projects}
            onUpdate={updateTask}
            onClose={() => selectTask(null)}
          />
        )}
      </div>

      <style jsx>{`
        .inbox-page {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        .inbox-content {
          display: flex;
          flex: 1;
          min-height: 0;
        }

        .task-list-container {
          flex: 1;
          overflow-y: auto;
          min-width: 0;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-12);
          color: var(--color-text-secondary);
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
