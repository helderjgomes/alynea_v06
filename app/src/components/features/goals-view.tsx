'use client';

import * as React from 'react';
import { TopBar } from '@/components/layout/topbar';
import { Badge } from '@/components/ui/badge';
import { Plus, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Goal {
    id: string;
    title: string;
    description?: string;
    status: 'on_track' | 'at_risk' | 'off_track' | 'completed';
    progress: number; // 0-100
    targetDate?: string;
    area?: string;
}

interface GoalsViewProps {
    goals: Goal[];
    onGoalClick: (id: string) => void;
    onNewGoal: () => void;
}

const statusColors = {
    on_track: 'success',
    at_risk: 'warning',
    off_track: 'destructive',
    completed: 'secondary',
} as const;

const statusLabels = {
    on_track: 'On Track',
    at_risk: 'At Risk',
    off_track: 'Off Track',
    completed: 'Completed',
};

export function GoalsView({ goals, onGoalClick, onNewGoal }: GoalsViewProps) {
    const activeGoals = goals.filter((g) => g.status !== 'completed');
    const completedGoals = goals.filter((g) => g.status === 'completed');

    return (
        <div className="h-full flex flex-col">
            <TopBar
                title="Goals"
                subtitle={`${activeGoals.length} active goals`}
                actions={
                    <button
                        onClick={onNewGoal}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-[#007AFF] hover:bg-[#007AFF]/5 transition-colors"
                    >
                        <Plus size={14} strokeWidth={2} />
                        New Goal
                    </button>
                }
            />

            <div className="flex-1 overflow-y-auto px-4 py-2">
                {/* Active Goals */}
                <div className="grid gap-3">
                    {activeGoals.map((goal) => (
                        <button
                            key={goal.id}
                            onClick={() => onGoalClick(goal.id)}
                            className="w-full text-left p-4 bg-white rounded-xl border border-black/[0.04] hover:border-black/[0.08] transition-colors group"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Target size={16} strokeWidth={1.5} className="text-[#007AFF]" />
                                        <h3 className="text-[15px] font-medium text-[#1D1D1F] truncate">
                                            {goal.title}
                                        </h3>
                                    </div>
                                    {goal.description && (
                                        <p className="text-[13px] text-[#86868B] mt-1 line-clamp-2">
                                            {goal.description}
                                        </p>
                                    )}
                                </div>
                                <Badge variant={statusColors[goal.status]} size="sm">
                                    {statusLabels[goal.status]}
                                </Badge>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3">
                                <div className="flex items-center justify-between text-[11px] text-[#86868B] mb-1">
                                    <span>Progress</span>
                                    <span>{goal.progress}%</span>
                                </div>
                                <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-all',
                                            goal.status === 'on_track' && 'bg-[#34C759]',
                                            goal.status === 'at_risk' && 'bg-[#F6BD16]',
                                            goal.status === 'off_track' && 'bg-[#FF3B30]',
                                            goal.status === 'completed' && 'bg-[#007AFF]'
                                        )}
                                        style={{ width: `${goal.progress}%` }}
                                    />
                                </div>
                            </div>

                            {goal.targetDate && (
                                <div className="text-[11px] text-[#86868B] mt-2">
                                    Target: {goal.targetDate}
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {activeGoals.length === 0 && (
                    <div className="py-12 text-center">
                        <Target size={32} strokeWidth={1} className="mx-auto text-[#C7C7CC] mb-3" />
                        <p className="text-[14px] text-[#86868B]">No goals yet</p>
                        <button
                            onClick={onNewGoal}
                            className="mt-2 text-[14px] text-[#007AFF] hover:underline"
                        >
                            Create your first goal
                        </button>
                    </div>
                )}

                {/* Completed Goals */}
                {completedGoals.length > 0 && (
                    <div className="mt-6">
                        <details>
                            <summary className="text-[12px] text-[#86868B] cursor-pointer mb-2">
                                Completed ({completedGoals.length})
                            </summary>
                            <div className="grid gap-2 opacity-60">
                                {completedGoals.map((goal) => (
                                    <button
                                        key={goal.id}
                                        onClick={() => onGoalClick(goal.id)}
                                        className="w-full text-left p-3 bg-white rounded-xl border border-black/[0.04]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Target size={14} className="text-[#86868B]" />
                                            <span className="text-[14px] text-[#86868B] line-through">
                                                {goal.title}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
}
