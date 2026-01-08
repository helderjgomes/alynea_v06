'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Goal = Database['public']['Tables']['objectives']['Row'];
type GoalInsert = Database['public']['Tables']['objectives']['Insert'];
type GoalUpdate = Database['public']['Tables']['objectives']['Update'];

interface UseGoalsOptions {
    status?: Goal['status'];
}

interface UseGoalsReturn {
    goals: Goal[];
    isLoading: boolean;
    error: Error | null;
    addGoal: (goal: Omit<GoalInsert, 'workspace_id'>) => Promise<Goal | null>;
    updateGoal: (id: string, updates: GoalUpdate) => Promise<Goal | null>;
    deleteGoal: (id: string) => Promise<boolean>;
    updateProgress: (id: string, currentValue: number) => Promise<Goal | null>;
    refetch: () => Promise<void>;
}

export function useGoals(options: UseGoalsOptions = {}): UseGoalsReturn {
    const [goals, setGoals] = React.useState<Goal[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const supabase = createClient();

    const fetchGoals = React.useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            let query = supabase
                .from('objectives')
                .select('*')
                .order('created_at', { ascending: false });

            if (options.status) {
                query = query.eq('status', options.status);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;
            setGoals(data || []);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch goals'));
        } finally {
            setIsLoading(false);
        }
    }, [options.status, supabase]);

    React.useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    React.useEffect(() => {
        const channel = supabase
            .channel('objectives-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'objectives' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setGoals((prev) => [payload.new as Goal, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setGoals((prev) =>
                            prev.map((g) =>
                                g.id === (payload.new as Goal).id ? (payload.new as Goal) : g
                            )
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setGoals((prev) =>
                            prev.filter((g) => g.id !== (payload.old as { id: string }).id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const addGoal = async (goalData: Omit<GoalInsert, 'workspace_id'>): Promise<Goal | null> => {
        try {
            const { data, error: insertError } = await supabase
                .from('objectives')
                .insert({ ...goalData, workspace_id: 'default' } as GoalInsert)
                .select()
                .single();

            if (insertError) throw insertError;

            setGoals((prev) => [data, ...prev]);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to add goal'));
            return null;
        }
    };

    const updateGoal = async (id: string, updates: GoalUpdate): Promise<Goal | null> => {
        try {
            const previousGoal = goals.find((g) => g.id === id);
            setGoals((prev) =>
                prev.map((g) => (g.id === id ? { ...g, ...updates } as Goal : g))
            );

            const { data, error: updateError } = await supabase
                .from('objectives')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (updateError) {
                if (previousGoal) {
                    setGoals((prev) => prev.map((g) => (g.id === id ? previousGoal : g)));
                }
                throw updateError;
            }

            return data;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update goal'));
            return null;
        }
    };

    const deleteGoal = async (id: string): Promise<boolean> => {
        try {
            const previousGoal = goals.find((g) => g.id === id);
            setGoals((prev) => prev.filter((g) => g.id !== id));

            const { error: deleteError } = await supabase
                .from('objectives')
                .delete()
                .eq('id', id);

            if (deleteError) {
                if (previousGoal) {
                    setGoals((prev) => [previousGoal, ...prev]);
                }
                throw deleteError;
            }

            return true;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete goal'));
            return false;
        }
    };

    const updateProgress = async (id: string, currentValue: number): Promise<Goal | null> => {
        return updateGoal(id, { current_value: currentValue });
    };

    return {
        goals,
        isLoading,
        error,
        addGoal,
        updateGoal,
        deleteGoal,
        updateProgress,
        refetch: fetchGoals,
    };
}
