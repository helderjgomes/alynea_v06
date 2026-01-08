'use client';

import * as React from 'react';
import { TopBar } from '@/components/layout/topbar';
import { Plus, Repeat, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Habit {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    checkins: string[]; // Array of date strings where habit was completed
    area?: string;
}

interface HabitsViewProps {
    habits: Habit[];
    onHabitClick: (id: string) => void;
    onHabitCheck: (id: string, date: string) => void;
    onNewHabit: () => void;
}

function getLast7Days(): string[] {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
    }
    return days;
}

function formatDayLabel(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
}

export function HabitsView({
    habits,
    onHabitClick,
    onHabitCheck,
    onNewHabit,
}: HabitsViewProps) {
    const activeHabits = habits.filter((h) => h.isActive);
    const last7Days = getLast7Days();
    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="h-full flex flex-col">
            <TopBar
                title="Habits"
                subtitle={`${activeHabits.length} active habits`}
                actions={
                    <button
                        onClick={onNewHabit}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-[#007AFF] hover:bg-[#007AFF]/5 transition-colors"
                    >
                        <Plus size={14} strokeWidth={2} />
                        New Habit
                    </button>
                }
            />

            <div className="flex-1 overflow-y-auto px-4 py-2">
                {/* Day Headers */}
                <div className="flex items-center gap-2 mb-3 pl-[200px]">
                    {last7Days.map((day) => (
                        <div
                            key={day}
                            className={cn(
                                'w-8 h-6 flex items-center justify-center text-[11px] font-medium',
                                day === todayStr ? 'text-[#007AFF]' : 'text-[#86868B]'
                            )}
                        >
                            {formatDayLabel(day)}
                        </div>
                    ))}
                </div>

                {/* Habit Rows */}
                <div className="space-y-2">
                    {activeHabits.map((habit) => {
                        const streakCount = calculateStreak(habit.checkins);

                        return (
                            <div
                                key={habit.id}
                                className="flex items-center gap-2 p-3 bg-white rounded-xl border border-black/[0.04] hover:border-black/[0.08] transition-colors"
                            >
                                {/* Habit Info */}
                                <button
                                    onClick={() => onHabitClick(habit.id)}
                                    className="w-[180px] flex-shrink-0 text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        <Repeat size={14} strokeWidth={1.5} className="text-[#007AFF]" />
                                        <span className="text-[14px] text-[#1D1D1F] truncate">
                                            {habit.name}
                                        </span>
                                    </div>
                                    {streakCount > 0 && (
                                        <span className="text-[11px] text-[#86868B] mt-0.5 block">
                                            {streakCount} day streak
                                        </span>
                                    )}
                                </button>

                                {/* Check-in Buttons */}
                                <div className="flex items-center gap-2">
                                    {last7Days.map((day) => {
                                        const isChecked = habit.checkins.includes(day);
                                        const isToday = day === todayStr;

                                        return (
                                            <button
                                                key={day}
                                                onClick={() => onHabitCheck(habit.id, day)}
                                                className={cn(
                                                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                                                    isChecked
                                                        ? 'bg-[#34C759] text-white'
                                                        : isToday
                                                            ? 'bg-[#007AFF]/10 border-2 border-dashed border-[#007AFF]/30 hover:bg-[#007AFF]/20'
                                                            : 'bg-black/[0.02] hover:bg-black/[0.04]'
                                                )}
                                            >
                                                {isChecked && <Check size={14} strokeWidth={3} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {activeHabits.length === 0 && (
                    <div className="py-12 text-center">
                        <Repeat size={32} strokeWidth={1} className="mx-auto text-[#C7C7CC] mb-3" />
                        <p className="text-[14px] text-[#86868B]">No habits yet</p>
                        <button
                            onClick={onNewHabit}
                            className="mt-2 text-[14px] text-[#007AFF] hover:underline"
                        >
                            Create your first habit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function calculateStreak(checkins: string[]): number {
    if (checkins.length === 0) return 0;

    const sortedDates = [...checkins].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Must have checked in today or yesterday to have a streak
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
        return 0;
    }

    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = Math.round(
            (prevDate.getTime() - currDate.getTime()) / 86400000
        );

        if (diffDays === 1) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}
