import { Target, Plus, ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';

interface Goal {
  id: string;
  title: string;
  description?: string;
  metricType?: 'binary' | 'numeric';
  currentValue?: number;
  targetValue?: number;
  status?: 'on_track' | 'at_risk' | 'off_track' | 'completed';
  timeframe?: string;
  timeframeType?: 'this_week' | 'this_month' | 'this_quarter' | 'this_year' | 'ongoing' | 'custom';
  area?: string;
  parentGoal?: string;
}

interface GoalsViewProps {
  goals?: Goal[];
  onGoalClick?: (id: string) => void;
  onAddGoal?: () => void;
}

export function GoalsView({ goals = [], onGoalClick, onAddGoal }: GoalsViewProps) {
  const [collapsedGoals, setCollapsedGoals] = useState<Set<string>>(new Set());

  const toggleGoal = (goalId: string) => {
    setCollapsedGoals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(goalId)) {
        newSet.delete(goalId);
      } else {
        newSet.add(goalId);
      }
      return newSet;
    });
  };

  // Group goals by timeframe
  const groupGoalsByTimeframe = () => {
    const groups: Record<string, Goal[]> = {
      this_quarter: [],
      this_year: [],
      ongoing: [],
      other: [],
    };

    goals.forEach(goal => {
      // Only show parent goals (no parentGoal property)
      if (!goal.parentGoal) {
        const type = goal.timeframeType || 'other';
        if (type === 'this_quarter' || type === 'this_year' || type === 'ongoing') {
          groups[type].push(goal);
        } else {
          groups.other.push(goal);
        }
      }
    });

    return groups;
  };

  const goalGroups = groupGoalsByTimeframe();

  const timeframeLabels = {
    this_quarter: 'This Quarter',
    this_year: 'This Year',
    ongoing: 'Ongoing',
    other: 'Other',
  };

  const statusColors = {
    on_track: { bg: 'bg-[#34C759]/10', text: 'text-[#34C759]', border: 'border-[#34C759]/30' },
    at_risk: { bg: 'bg-[#FF9500]/10', text: 'text-[#FF9500]', border: 'border-[#FF9500]/30' },
    off_track: { bg: 'bg-[#FF3B30]/10', text: 'text-[#FF3B30]', border: 'border-[#FF3B30]/30' },
    completed: { bg: 'bg-[#007AFF]/10', text: 'text-[#007AFF]', border: 'border-[#007AFF]/30' },
  };

  const getSubGoals = (parentId: string) => {
    return goals.filter(g => g.parentGoal === parentId);
  };

  const renderProgressBar = (goal: Goal) => {
    if (goal.metricType === 'binary') {
      return (
        <div className="flex items-center gap-2">
          {goal.currentValue === goal.targetValue ? (
            <div className="w-5 h-5 rounded-full bg-[#007AFF] flex items-center justify-center">
              <Check size={14} strokeWidth={2.5} className="text-white" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-[#D1D1D6]" />
          )}
        </div>
      );
    }

    if (goal.metricType === 'numeric' && goal.targetValue) {
      const percentage = Math.min(100, ((goal.currentValue || 0) / goal.targetValue) * 100);
      return (
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-1 h-2 bg-black/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#007AFF] transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-[12px] text-[#86868B] tabular-nums w-16 text-right">
            {goal.currentValue || 0}/{goal.targetValue}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderGoalRow = (goal: Goal, isSubGoal: boolean = false) => {
    const subGoals = getSubGoals(goal.id);
    const hasSubGoals = subGoals.length > 0;
    const isCollapsed = collapsedGoals.has(goal.id);
    const statusColor = statusColors[goal.status || 'on_track'];

    return (
      <div key={goal.id}>
        <div
          onClick={() => {
            if (hasSubGoals) {
              toggleGoal(goal.id);
            } else {
              onGoalClick?.(goal.id);
            }
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (hasSubGoals) {
                toggleGoal(goal.id);
              } else {
                onGoalClick?.(goal.id);
              }
            }
          }}
          className={`w-full group flex items-center gap-3 py-3 px-1 hover:bg-black/[0.02] transition-colors cursor-pointer rounded-lg ${
            isSubGoal ? 'pl-8' : ''
          }`}
        >
          {/* Chevron for expandable goals */}
          <div className="flex-shrink-0 w-5">
            {hasSubGoals && (
              <ChevronDown
                size={16}
                strokeWidth={2}
                className={`text-[#86868B] transition-transform ${
                  isCollapsed ? '-rotate-90' : ''
                }`}
              />
            )}
          </div>

          {/* Goal Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-[14px] text-[#1D1D1F] leading-snug font-medium">
                {goal.title}
              </div>

              {/* Status Badge */}
              <div
                className={`px-2 py-0.5 text-[11px] rounded-md ${statusColor.bg} ${statusColor.text} ${statusColor.border} border capitalize flex-shrink-0`}
              >
                {goal.status?.replace('_', ' ')}
              </div>

              {/* Sub-goals counter */}
              {hasSubGoals && (
                <div className="px-2 py-0.5 bg-black/[0.06] text-[#86868B] text-[11px] rounded-md flex-shrink-0">
                  {subGoals.length} sub-goal{subGoals.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Description */}
            {goal.description && (
              <div className="text-[12px] text-[#86868B] mb-2 line-clamp-1">
                {goal.description}
              </div>
            )}

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              {renderProgressBar(goal)}
            </div>
          </div>

          {/* Quick Edit Button */}
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGoalClick?.(goal.id);
              }}
              className="px-2 py-1 text-[12px] text-[#007AFF] hover:bg-[#007AFF]/10 rounded-md transition-colors"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Sub-goals */}
        {hasSubGoals && !isCollapsed && (
          <div className="space-y-0">
            {subGoals.map(subGoal => renderGoalRow(subGoal, true))}
          </div>
        )}

        {/* Divider */}
        {!isSubGoal && <div className="h-px bg-black/[0.06] mx-1" />}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-1.5">
            <Target size={20} strokeWidth={1.5} className="text-[#007AFF]" />
            <h2 className="text-[22px] text-[#1D1D1F]">Goals</h2>
          </div>
          <p className="text-[13px] text-[#86868B] leading-relaxed">
            Long-term aspirations that guide your habits and tasks
          </p>
        </div>

        {/* Goals grouped by timeframe */}
        <div className="space-y-8">
          {(Object.keys(goalGroups) as Array<keyof typeof goalGroups>).map((timeframeKey) => {
            const timeframeGoals = goalGroups[timeframeKey];
            if (timeframeGoals.length === 0) return null;

            return (
              <div key={timeframeKey}>
                <div className="mb-3">
                  <h3 className="text-[13px] text-[#86868B] uppercase tracking-wide font-medium">
                    {timeframeLabels[timeframeKey]}
                  </h3>
                </div>

                <div className="space-y-0">
                  {timeframeGoals.map(goal => renderGoalRow(goal))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Goal Button */}
        <button
          onClick={onAddGoal}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 px-4 text-[14px] text-[#007AFF] hover:bg-black/[0.02] transition-colors rounded-lg"
        >
          <Plus size={16} strokeWidth={2} />
          <span>New Goal</span>
        </button>

        {/* Empty State */}
        {goals.length === 0 && (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/[0.03] mb-4">
              <Target size={28} strokeWidth={1.5} className="text-[#86868B]" />
            </div>
            <h3 className="text-[15px] text-[#1D1D1F] mb-1">No goals yet</h3>
            <p className="text-[13px] text-[#86868B] mb-6 max-w-xs mx-auto leading-relaxed">
              Set meaningful goals to guide your progress
            </p>
            <button
              onClick={onAddGoal}
              className="inline-flex items-center gap-2 px-4 py-2 text-[14px] text-[#007AFF] hover:bg-black/[0.02] transition-colors rounded-lg"
            >
              <Plus size={16} strokeWidth={2} />
              <span>Add Your First Goal</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}