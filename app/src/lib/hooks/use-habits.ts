'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Habit = Database['public']['Tables']['habits']['Row'];
type HabitInsert = Database['public']['Tables']['habits']['Insert'];
type HabitUpdate = Database['public']['Tables']['habits']['Update'];
type HabitCheckinInsert = Database['public']['Tables']['habit_checkins']['Insert'];

interface HabitWithCheckins extends Habit {
    checkins: string[];
}

interface UseHabitsOptions {
    activeOnly?: boolean;
}

interface UseHabitsReturn {
    habits: HabitWithCheckins[];
    isLoading: boolean;
    error: Error | null;
    addHabit: (habit: Omit<HabitInsert, 'workspace_id'>) => Promise<Habit | null>;
    updateHabit: (id: string, updates: HabitUpdate) => Promise<Habit | null>;
    deleteHabit: (id: string) => Promise<boolean>;
    toggleCheckin: (habitId: string, date: string) => Promise<boolean>;
    refetch: () => Promise<void>;
}

export function useHabits(options: UseHabitsOptions = {}): UseHabitsReturn {
    const [habits, setHabits] = React.useState<HabitWithCheckins[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const supabase = createClient();

    const fetchHabits = React.useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            let query = supabase
                .from('habits')
                .select('*')
                .order('sort_order', { ascending: true });

            if (options.activeOnly !== false) {
                query = query.eq('is_active', true);
            }

            const { data: habitsData, error: fetchError } = await query;

            if (fetchError) throw fetchError;

            // Fetch checkins for the last 7 days
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            const startDateStr = startDate.toISOString().split('T')[0];

            const { data: checkinsData } = await supabase
                .from('habit_checkins')
                .select('habit_id, checkin_date')
                .gte('checkin_date', startDateStr);

            // Combine habits with their checkins
            const habitsWithCheckins: HabitWithCheckins[] = (habitsData || []).map(
                (habit) => ({
                    ...habit,
                    checkins: (checkinsData || [])
                        .filter((c) => c.habit_id === habit.id)
                        .map((c) => c.checkin_date),
                })
            );

            setHabits(habitsWithCheckins);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch habits'));
        } finally {
            setIsLoading(false);
        }
    }, [options.activeOnly, supabase]);

    React.useEffect(() => {
        fetchHabits();
    }, [fetchHabits]);

    const addHabit = async (habitData: Omit<HabitInsert, 'workspace_id'>): Promise<Habit | null> => {
        try {
            const { data, error: insertError } = await supabase
                .from('habits')
                .insert({ ...habitData, workspace_id: 'default' } as HabitInsert)
                .select()
                .single();

            if (insertError) throw insertError;

            setHabits((prev) => [...prev, { ...data, checkins: [] }]);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to add habit'));
            return null;
        }
    };

    const updateHabit = async (id: string, updates: HabitUpdate): Promise<Habit | null> => {
        try {
            const { data, error: updateError } = await supabase
                .from('habits')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;

            setHabits((prev) =>
                prev.map((h) =>
                    h.id === id ? { ...h, ...data } : h
                )
            );

            return data;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update habit'));
            return null;
        }
    };

    const deleteHabit = async (id: string): Promise<boolean> => {
        try {
            const { error: deleteError } = await supabase
                .from('habits')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            setHabits((prev) => prev.filter((h) => h.id !== id));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete habit'));
            return false;
        }
    };

    const toggleCheckin = async (habitId: string, date: string): Promise<boolean> => {
        try {
            const habit = habits.find((h) => h.id === habitId);
            if (!habit) return false;

            const hasCheckin = habit.checkins.includes(date);

            // Optimistic update
            setHabits((prev) =>
                prev.map((h) => {
                    if (h.id !== habitId) return h;
                    return {
                        ...h,
                        checkins: hasCheckin
                            ? h.checkins.filter((d) => d !== date)
                            : [...h.checkins, date],
                    };
                })
            );

            if (hasCheckin) {
                const { error } = await supabase
                    .from('habit_checkins')
                    .delete()
                    .eq('habit_id', habitId)
                    .eq('checkin_date', date);

                if (error) throw error;
            } else {
                const checkinData: HabitCheckinInsert = {
                    habit_id: habitId,
                    checkin_date: date,
                    workspace_id: 'default',
                };
                const { error } = await supabase.from('habit_checkins').insert(checkinData);

                if (error) throw error;
            }

            return true;
        } catch (err) {
            await fetchHabits();
            setError(err instanceof Error ? err : new Error('Failed to toggle checkin'));
            return false;
        }
    };

    return {
        habits,
        isLoading,
        error,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleCheckin,
        refetch: fetchHabits,
    };
}
