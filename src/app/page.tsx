'use client';

/**
 * Inbox Page
 * 
 * Core task capture with modal editor and keyboard navigation.
 */

import { useEffect, useRef, useCallback } from 'react';
import { TopBar } from '@/components/app-shell';
import { TaskRow, TaskModal, QuickAdd, QuickAddRef } from '@/components/tasks';
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

  const quickAddRef = useRef<QuickAddRef>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') target.blur();
        return;
      }

      const currentIndex = tasks.findIndex(t => t.id === selectedTaskId);
      const activeTask = tasks.find(t => t.id === selectedTaskId);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < tasks.length - 1) {
            selectTask(tasks[currentIndex + 1].id);
          } else if (selectedTaskId === null && tasks.length > 0) {
            selectTask(tasks[0].id);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            selectTask(tasks[currentIndex - 1].id);
          }
          break;
        case ' ':
          e.preventDefault();
          if (activeTask) {
            toggleComplete(activeTask.id, activeTask.status !== 'done');
          }
          break;
        case 'n':
          if (e.metaKey) {
            e.preventDefault();
            quickAddRef.current?.focus();
          }
          break;
        case 'Escape':
          selectTask(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTaskId, tasks, selectTask, toggleComplete]);

  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const projectsMap = new Map(projects.map(p => [p.id, p]));

  const handleAddTask = useCallback((title: string) => {
    addTask(title).then(() => {
      // Select the newly created task
      const latestTask = tasks[tasks.length - 1];
      if (latestTask) selectTask(latestTask.id);
    });
  }, [addTask, tasks, selectTask]);

  return (
    <>
      <TopBar title="Inbox" />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto py-10 px-12">
          <div className="space-y-[1px]">
            {isLoading ? (
              <div className="py-12 text-center text-[#8E8E93] text-[14px]">
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[15px] text-[#8E8E93] font-medium">No tasks yet</p>
                <p className="text-[13px] text-[#C7C7CC] mt-1">Press ⌘N to create your first task</p>
              </div>
            ) : (
              tasks.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  project={task.project_id ? projectsMap.get(task.project_id) : null}
                  isSelected={task.id === selectedTaskId}
                  onToggle={() => toggleComplete(task.id, task.status !== 'done')}
                  onClick={() => selectTask(task.id)}
                />
              ))
            )}

            <QuickAdd ref={quickAddRef} onAdd={addTask} />
          </div>
        </div>
      </div>

      {/* Modal Task Editor */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          projects={projects}
          onUpdate={updateTask}
          onClose={() => selectTask(null)}
        />
      )}
    </>
  );
}
