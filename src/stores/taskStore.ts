/**
 * Task Store (Zustand)
 * 
 * Single-user task state management with Supabase persistence.
 * Handles CRUD operations and optimistic updates.
 */

import { create } from 'zustand';
import { supabase, WORKSPACE_ID } from '@/lib/supabase';
import type { Task, Project, TaskUpdate } from '@/types/database';

interface TaskState {
    // Data
    tasks: Task[];
    projects: Project[];

    // UI State
    isLoading: boolean;
    selectedTaskId: string | null;

    // Actions
    fetchTasks: () => Promise<void>;
    fetchProjects: () => Promise<void>;
    addTask: (title: string) => Promise<void>;
    updateTask: (id: string, updates: TaskUpdate) => Promise<void>;
    toggleComplete: (id: string, completed: boolean) => Promise<void>;
    selectTask: (id: string | null) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    projects: [],
    isLoading: false,
    selectedTaskId: null,

    fetchTasks: async () => {
        set({ isLoading: true });

        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('workspace_id', WORKSPACE_ID)
            .neq('status', 'done') // Hide completed by default
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Failed to fetch tasks:', error);
        } else {
            set({ tasks: data || [] });
        }

        set({ isLoading: false });
    },

    fetchProjects: async () => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('workspace_id', WORKSPACE_ID)
            .eq('status', 'active')
            .order('name');

        if (error) {
            console.error('Failed to fetch projects:', error);
        } else {
            set({ projects: data || [] });
        }
    },

    addTask: async (title: string) => {
        const tempId = `temp-${Date.now()}`;
        const newTask: Task = {
            id: tempId,
            workspace_id: WORKSPACE_ID,
            title,
            status: 'todo',
            priority: 4,
            due_type: 'none',
            start_type: 'none',
            project_id: null,
            section_id: null,
            parent_task_id: null,
            description: null,
            due_date: null,
            due_datetime: null,
            start_date: null,
            start_datetime: null,
            completed_at: null,
            assignee_member_id: null,
            duration_minutes: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Optimistic update
        set((state) => ({ tasks: [newTask, ...state.tasks] }));

        const { data, error } = await supabase
            .from('tasks')
            .insert({
                workspace_id: WORKSPACE_ID,
                title,
                status: 'todo',
                priority: 4,
                due_type: 'none',
                start_type: 'none',
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to add task:', error);
            // Rollback
            set((state) => ({ tasks: state.tasks.filter((t) => t.id !== tempId) }));
        } else if (data) {
            // Replace temp with real
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === tempId ? data : t)),
            }));
        }
    },

    updateTask: async (id: string, updates: TaskUpdate) => {
        // Optimistic update
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
            ),
        }));

        const { error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Failed to update task:', error);
            // Could rollback here, but for simplicity we'll refetch
            get().fetchTasks();
        }
    },

    toggleComplete: async (id: string, completed: boolean) => {
        const updates: TaskUpdate = {
            status: completed ? 'done' : 'todo',
            completed_at: completed ? new Date().toISOString() : null,
        };

        // Optimistic: remove from list if completing
        if (completed) {
            set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
                selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
            }));
        }

        const { error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Failed to toggle task:', error);
            get().fetchTasks();
        }
    },

    selectTask: (id: string | null) => {
        set({ selectedTaskId: id });
    },
}));
