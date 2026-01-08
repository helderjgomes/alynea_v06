import { RefreshCcw, Plus, Pause } from 'lucide-react';
import { PriorityCheckbox } from './PriorityCheckbox';
import { HabitTrackingCalendar } from './HabitTrackingCalendar';

interface CheckIn {
  id: string;
  habitId: string;
  date: string;
  amount: number;
  completed: boolean;
}

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency?: string;
  frequencyType?: 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom';
  customDays?: boolean[];
  targetAmount?: number;
  targetUnit?: string;
  targetPeriod?: 'day' | 'week' | 'month';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  relatedGoal?: string;
  area?: string;
  color?: string;
  icon?: string;
  isPaused?: boolean;
  pausedDate?: string;
  completedToday?: boolean;
  isActiveToday?: boolean;
  checkIns?: CheckIn[];
}

interface HabitsViewProps {
  habits?: Habit[];
  onHabitToggle?: (id: string) => void;
  onHabitClick?: (id: string) => void;
  onAddHabit?: () => void;
}

export function HabitsView({ 
  habits = [], 
  onHabitToggle, 
  onHabitClick,
  onAddHabit 
}: HabitsViewProps) {
  // Group habits by time of day
  const groupHabitsByTime = () => {
    const groups: Record<string, Habit[]> = {
      morning: [],
      afternoon: [],
      evening: [],
      anytime: [],
    };

    habits.forEach(habit => {
      if (!habit.isPaused && habit.isActiveToday) {
        const time = habit.timeOfDay || 'anytime';
        groups[time].push(habit);
      }
    });

    return groups;
  };

  const habitGroups = groupHabitsByTime();
  const pausedHabits = habits.filter(h => h.isPaused);
  const activeHabits = habits.filter(h => !h.isPaused);

  const timeLabels = {
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    anytime: 'Anytime',
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-1.5">
            <RefreshCcw size={20} strokeWidth={1.5} className="text-[#007AFF]" />
            <h2 className="text-[22px] text-[#1D1D1F]">Habits</h2>
          </div>
          <p className="text-[13px] text-[#86868B] leading-relaxed">
            Regular practices to support your goals
          </p>
        </div>

        {/* Today's Habits - Grouped by Time of Day */}
        {activeHabits.some(h => h.isActiveToday) && (
          <div className="mb-8">
            <div className="mb-4">
              <h3 className="text-[13px] text-[#86868B] uppercase tracking-wide font-medium">
                Today
              </h3>
            </div>

            <div className="space-y-6">
              {(Object.keys(habitGroups) as Array<keyof typeof habitGroups>).map((timeKey) => {
                const timeHabits = habitGroups[timeKey];
                if (timeHabits.length === 0) return null;

                return (
                  <div key={timeKey}>
                    <div className="mb-2">
                      <h4 className="text-[12px] text-[#86868B] font-medium">
                        {timeLabels[timeKey]}
                      </h4>
                    </div>

                    <div className="bg-white rounded-xl overflow-hidden border border-black/[0.06]">
                      {timeHabits.map((habit, index) => (
                        <div key={habit.id}>
                          <div
                            className="group flex items-center gap-3 px-4 py-3 hover:bg-black/[0.02] transition-colors cursor-pointer"
                            onClick={() => onHabitClick?.(habit.id)}
                          >
                            {/* Checkbox */}
                            <div onClick={(e) => e.stopPropagation()}>
                              <PriorityCheckbox
                                completed={habit.completedToday || false}
                                onToggle={() => onHabitToggle?.(habit.id)}
                              />
                            </div>

                            {/* Habit Info */}
                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-[14px] leading-snug mb-0.5 ${
                                  habit.completedToday
                                    ? 'text-[#86868B] line-through'
                                    : 'text-[#1D1D1F]'
                                }`}
                              >
                                {habit.name}
                              </div>
                              
                              {/* Progress indicator if has target */}
                              {habit.targetAmount && !habit.completedToday && (
                                <div className="text-[12px] text-[#86868B]">
                                  0/{habit.targetAmount} {habit.targetUnit}
                                </div>
                              )}

                              {/* Frequency if no target */}
                              {!habit.targetAmount && habit.frequency && !habit.completedToday && (
                                <div className="text-[12px] text-[#86868B]">
                                  {habit.frequency}
                                </div>
                              )}
                            </div>

                            {/* Related Goal Badge */}
                            {habit.relatedGoal && !habit.completedToday && (
                              <div className="flex-shrink-0">
                                <div className="px-2 py-0.5 bg-[#007AFF]/10 text-[#007AFF] text-[11px] rounded-md">
                                  Goal
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Divider */}
                          {index < timeHabits.length - 1 && (
                            <div className="h-px bg-black/[0.04] mx-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Habits Section with Tracking */}
        {activeHabits.length > 0 && (
          <div className="mb-8">
            <div className="mb-3">
              <h3 className="text-[13px] text-[#86868B] uppercase tracking-wide font-medium">
                All Habits
              </h3>
            </div>

            <div className="space-y-0">
              {activeHabits.map((habit, index) => (
                <div key={habit.id}>
                  <button
                    onClick={() => onHabitClick?.(habit.id)}
                    className="w-full group flex items-start gap-3 py-3.5 px-1 hover:bg-black/[0.02] transition-colors text-left rounded-lg"
                  >
                    {/* Left Side */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="text-[14px] text-[#1D1D1F] leading-snug">
                          {habit.name}
                        </div>
                        
                        {/* Status Indicator */}
                        {habit.isActiveToday && (
                          <div
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              habit.completedToday ? 'bg-[#007AFF]' : 'bg-[#D1D1D6]'
                            }`}
                          />
                        )}

                        {/* Related Goal Badge */}
                        {habit.relatedGoal && (
                          <div className="px-1.5 py-0.5 bg-[#007AFF]/10 text-[#007AFF] text-[10px] rounded">
                            Goal
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-[12px] text-[#86868B]">
                          {habit.frequency}
                          {habit.targetAmount && ` · ${habit.targetAmount} ${habit.targetUnit}`}
                          {habit.timeOfDay && habit.timeOfDay !== 'anytime' && ` · ${timeLabels[habit.timeOfDay]}`}
                        </div>
                      </div>

                      {/* Tracking Calendar */}
                      <HabitTrackingCalendar 
                        checkIns={habit.checkIns} 
                        targetAmount={habit.targetAmount}
                      />
                    </div>
                  </button>

                  {/* Divider */}
                  {index < activeHabits.length - 1 && (
                    <div className="h-px bg-black/[0.06] mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paused Habits */}
        {pausedHabits.length > 0 && (
          <div className="mb-8">
            <div className="mb-3">
              <h3 className="text-[13px] text-[#86868B] uppercase tracking-wide font-medium flex items-center gap-2">
                <Pause size={12} strokeWidth={2} />
                Paused
              </h3>
            </div>

            <div className="space-y-0">
              {pausedHabits.map((habit, index) => (
                <div key={habit.id}>
                  <button
                    onClick={() => onHabitClick?.(habit.id)}
                    className="w-full group flex items-center gap-3 py-3 px-1 hover:bg-black/[0.02] transition-colors text-left rounded-lg opacity-60"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] text-[#1D1D1F] leading-snug mb-0.5">
                        {habit.name}
                      </div>
                      <div className="text-[12px] text-[#86868B]">
                        {habit.frequency}
                      </div>
                    </div>
                  </button>

                  {index < pausedHabits.length - 1 && (
                    <div className="h-px bg-black/[0.06] mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Habit Button */}
        <button
          onClick={onAddHabit}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-[14px] text-[#007AFF] hover:bg-black/[0.02] transition-colors rounded-lg"
        >
          <Plus size={16} strokeWidth={2} />
          <span>New Habit</span>
        </button>

        {/* Empty State */}
        {habits.length === 0 && (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/[0.03] mb-4">
              <RefreshCcw size={28} strokeWidth={1.5} className="text-[#86868B]" />
            </div>
            <h3 className="text-[15px] text-[#1D1D1F] mb-1">No habits yet</h3>
            <p className="text-[13px] text-[#86868B] mb-6 max-w-xs mx-auto leading-relaxed">
              Create practices you want to maintain regularly
            </p>
            <button
              onClick={onAddHabit}
              className="inline-flex items-center gap-2 px-4 py-2 text-[14px] text-[#007AFF] hover:bg-black/[0.02] transition-colors rounded-lg"
            >
              <Plus size={16} strokeWidth={2} />
              <span>Add Your First Habit</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
