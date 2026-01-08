'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

interface UseTasksOptions {
    projectId?: string;
    status?: Task['status'];
    dueDate?: 'today' | 'overdue' | 'upcoming';
}

interface UseTasksReturn {
    tasks: Task[];
    isLoading: boolean;
    error: Error | null;
    addTask: (task: Omit<TaskInsert, 'workspace_id'>) => Promise<Task | null>;
    updateTask: (id: string, updates: TaskUpdate) => Promise<Task | null>;
    deleteTask: (id: string) => Promise<boolean>;
    toggleTask: (id: string) => Promise<Task | null>;
    refetch: () => Promise<void>;
}

export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const supabase = createClient();

    const fetchTasks = React.useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            let query = supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (options.projectId) {
                query = query.eq('project_id', options.projectId);
            }

            if (options.status) {
                query = query.eq('status', options.status);
            }

            if (options.dueDate === 'today') {
                const today = new Date().toISOString().split('T')[0];
                query = query.eq('due_date', today);
            } else if (options.dueDate === 'overdue') {
                const today = new Date().toISOString().split('T')[0];
                query = query.lt('due_date', today).neq('status', 'done');
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;
            setTasks(data || []);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
        } finally {
            setIsLoading(false);
        }
    }, [options.projectId, options.status, options.dueDate, supabase]);

    React.useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    React.useEffect(() => {
        const channel = supabase
            .channel('tasks-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'tasks' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setTasks((prev) => [payload.new as Task, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setTasks((prev) =>
                            prev.map((t) =>
                                t.id === (payload.new as Task).id ? (payload.new as Task) : t
                            )
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setTasks((prev) =>
                            prev.filter((t) => t.id !== (payload.old as { id: string }).id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const addTask = async (taskData: Omit<TaskInsert, 'workspace_id'>): Promise<Task | null> => {
        try {
            // TODO: Get workspace_id from auth context
            const { data, error: insertError } = await supabase
                .from('tasks')
                .insert({ ...taskData, workspace_id: 'default' } as TaskInsert)
                .select()
                .single();

            if (insertError) throw insertError;

            setTasks((prev) => [data, ...prev]);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to add task'));
            return null;
        }
    };

    const updateTask = async (id: string, updates: TaskUpdate): Promise<Task | null> => {
        try {
            const previousTask = tasks.find((t) => t.id === id);
            setTasks((prev) =>
                prev.map((t) => (t.id === id ? { ...t, ...updates } as Task : t))
            );

            const { data, error: updateError } = await supabase
                .from('tasks')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (updateError) {
                if (previousTask) {
                    setTasks((prev) => prev.map((t) => (t.id === id ? previousTask : t)));
                }
                throw updateError;
            }

            return data;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update task'));
            return null;
        }
    };

    const deleteTask = async (id: string): Promise<boolean> => {
        try {
            const previousTask = tasks.find((t) => t.id === id);
            setTasks((prev) => prev.filter((t) => t.id !== id));

            const { error: deleteError } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (deleteError) {
                if (previousTask) {
                    setTasks((prev) => [previousTask, ...prev]);
                }
                throw deleteError;
            }

            return true;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete task'));
            return false;
        }
    };

    const toggleTask = async (id: string): Promise<Task | null> => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return null;

        const newStatus = task.status === 'done' ? 'todo' : 'done';
        const completedAt = newStatus === 'done' ? new Date().toISOString() : null;

        return updateTask(id, { status: newStatus, completed_at: completedAt });
    };

    return {
        tasks,
        isLoading,
        error,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        refetch: fetchTasks,
    };
}
