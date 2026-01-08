'use client';

/**
 * TaskEditor
 * 
 * Sheet-style task editor inspired by Apple Notes/Reminders.
 * Not a modal - appears as a side panel or inline sheet.
 * 
 * Fields: Title (large), Notes, Due date, Project, Priority
 * Auto-saves on blur.
 */

import { useState, useEffect, useRef } from 'react';
import { X, Calendar, Flag, FolderKanban } from 'lucide-react';
import type { Task, Project, TaskUpdate } from '@/types/database';

interface TaskEditorProps {
    task: Task | null;
    projects: Project[];
    onUpdate: (id: string, updates: TaskUpdate) => void;
    onClose: () => void;
}

export function TaskEditor({ task, projects, onUpdate, onClose }: TaskEditorProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [projectId, setProjectId] = useState<string | null>(null);
    const [priority, setPriority] = useState<1 | 2 | 3 | 4>(4);

    const titleRef = useRef<HTMLInputElement>(null);
    const hasChanges = useRef(false);

    // Sync state when task changes
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setDueDate(task.due_date || '');
            setProjectId(task.project_id);
            setPriority(task.priority);
            hasChanges.current = false;

            // Focus title on open
            setTimeout(() => titleRef.current?.focus(), 100);
        }
    }, [task?.id]);

    // Auto-save on blur or changes
    const saveChanges = () => {
        if (!task || !hasChanges.current) return;

        const updates: TaskUpdate = {};
        if (title !== task.title) updates.title = title;
        if (description !== (task.description || '')) updates.description = description || null;
        if (dueDate !== (task.due_date || '')) {
            updates.due_date = dueDate || null;
            updates.due_type = dueDate ? 'date' : 'none';
        }
        if (projectId !== task.project_id) updates.project_id = projectId;
        if (priority !== task.priority) updates.priority = priority;

        if (Object.keys(updates).length > 0) {
            onUpdate(task.id, updates);
        }
        hasChanges.current = false;
    };

    const handleChange = () => {
        hasChanges.current = true;
    };

    if (!task) return null;

    const priorityLabels = ['', 'Urgent', 'High', 'Medium', 'Low'];

    return (
        <aside className="task-editor">
            <header className="editor-header">
                <span className="editor-label">Task Details</span>
                <button className="close-button" onClick={onClose} aria-label="Close">
                    <X size={16} strokeWidth={1.5} />
                </button>
            </header>

            <div className="editor-content">
                <input
                    ref={titleRef}
                    type="text"
                    className="title-input"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); handleChange(); }}
                    onBlur={saveChanges}
                    placeholder="Task title"
                />

                <textarea
                    className="notes-input"
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); handleChange(); }}
                    onBlur={saveChanges}
                    placeholder="Notes..."
                    rows={4}
                />

                <div className="editor-fields">
                    <label className="field">
                        <Calendar size={16} strokeWidth={1.5} />
                        <span>Due Date</span>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => { setDueDate(e.target.value); handleChange(); }}
                            onBlur={saveChanges}
                        />
                    </label>

                    <label className="field">
                        <FolderKanban size={16} strokeWidth={1.5} />
                        <span>Project</span>
                        <select
                            value={projectId || ''}
                            onChange={(e) => { setProjectId(e.target.value || null); handleChange(); saveChanges(); }}
                        >
                            <option value="">None</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className="field">
                        <Flag size={16} strokeWidth={1.5} />
                        <span>Priority</span>
                        <select
                            value={priority}
                            onChange={(e) => { setPriority(Number(e.target.value) as 1 | 2 | 3 | 4); handleChange(); saveChanges(); }}
                        >
                            <option value={4}>Low</option>
                            <option value={3}>Medium</option>
                            <option value={2}>High</option>
                            <option value={1}>Urgent</option>
                        </select>
                    </label>
                </div>
            </div>

            <style jsx>{`
        .task-editor {
          width: 320px;
          background: var(--color-bg-primary);
          border-left: 1px solid var(--color-divider);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          border-bottom: 1px solid var(--color-divider);
        }

        .editor-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-secondary);
        }

        .close-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .close-button:hover {
          background: var(--color-divider);
          color: var(--color-text-primary);
        }

        .editor-content {
          flex: 1;
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          overflow-y: auto;
        }

        .title-input {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text-primary);
          border: none;
          background: transparent;
          outline: none;
          padding: 0;
          width: 100%;
        }

        .title-input::placeholder {
          color: var(--color-text-tertiary);
        }

        .notes-input {
          font-size: 14px;
          color: var(--color-text-primary);
          border: none;
          background: var(--color-bg-tertiary);
          border-radius: var(--radius-md);
          padding: var(--space-3);
          outline: none;
          resize: vertical;
          min-height: 80px;
          font-family: var(--font-sans);
          line-height: 1.5;
        }

        .notes-input::placeholder {
          color: var(--color-text-tertiary);
        }

        .editor-fields {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding-top: var(--space-2);
          border-top: 1px solid var(--color-divider);
        }

        .field {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: 13px;
          color: var(--color-text-secondary);
        }

        .field span {
          flex: 1;
        }

        .field input,
        .field select {
          font-size: 13px;
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
          background: var(--color-bg-primary);
          border-radius: var(--radius-sm);
          padding: var(--space-1) var(--space-2);
          outline: none;
          min-width: 120px;
        }

        .field input:focus,
        .field select:focus {
          border-color: var(--color-accent);
        }
      `}</style>
        </aside>
    );
}
