'use client';

/**
 * Inbox Page
 * 
 * Shows Active Tasks and Completed sections with counts.
 * Matches the provided Inbox design.
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { TaskRow, TaskModal, QuickAdd, QuickAddRef } from '@/components/tasks';
import { useTaskStore } from '@/stores';

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

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  // Split into active and completed
  const { activeTasks, completedTasks } = useMemo(() => {
    const active = tasks.filter(t => t.status !== 'done');
    const completed = tasks.filter(t => t.status === 'done');
    return { activeTasks: active, completedTasks: completed };
  }, [tasks]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') target.blur();
        return;
      }

      const allTasks = [...activeTasks, ...completedTasks];
      const currentIndex = allTasks.findIndex(t => t.id === selectedTaskId);
      const activeTask = allTasks.find(t => t.id === selectedTaskId);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < allTasks.length - 1) {
            selectTask(allTasks[currentIndex + 1].id);
          } else if (selectedTaskId === null && allTasks.length > 0) {
            selectTask(allTasks[0].id);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            selectTask(allTasks[currentIndex - 1].id);
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
  }, [selectedTaskId, activeTasks, completedTasks, selectTask, toggleComplete]);

  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const projectsMap = new Map(projects.map(p => [p.id, p]));

  return (
    <>
      {/* Header */}
      <div className="h-14 px-6 flex items-center border-b border-[#E5E5EA] bg-white shrink-0">
        <h1 className="text-[17px] font-semibold text-[#1d1d1f]">Inbox</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        <div className="max-w-3xl mx-auto py-6">
          {isLoading ? (
            <div className="py-12 text-center text-[#8E8E93] text-[14px]">
              Loading tasks...
            </div>
          ) : (
            <>
              {/* All Tasks Summary */}
              <div className="px-6 pb-4 text-[13px] text-[#8E8E93]">
                All your tasks in one place
              </div>

              {/* Active Tasks Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between px-6 py-3">
                  <h2 className="text-[13px] font-semibold text-[#1d1d1f]">Active Tasks</h2>
                  <span className="text-[12px] text-[#8E8E93]">{activeTasks.length} tasks</span>
                </div>

                <div className="bg-white border-y border-[#E5E5EA]">
                  {activeTasks.length === 0 ? (
                    <div className="py-8 text-center text-[#8E8E93] text-[13px]">
                      No active tasks
                    </div>
                  ) : (
                    activeTasks.map(task => (
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

                  {/* Quick Add */}
                  <div className="border-t border-[#F2F2F7]">
                    <QuickAdd ref={quickAddRef} onAdd={addTask} />
                  </div>
                </div>
              </div>

              {/* Completed Section */}
              {completedTasks.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-6 py-3">
                    <h2 className="text-[13px] font-semibold text-[#1d1d1f]">Completed</h2>
                    <span className="text-[12px] text-[#8E8E93]">{completedTasks.length} tasks</span>
                  </div>

                  <div className="bg-white border-y border-[#E5E5EA]">
                    {completedTasks.map(task => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        project={task.project_id ? projectsMap.get(task.project_id) : null}
                        isSelected={task.id === selectedTaskId}
                        onToggle={() => toggleComplete(task.id, task.status !== 'done')}
                        onClick={() => selectTask(task.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
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
