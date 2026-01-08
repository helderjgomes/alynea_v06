import { useState } from 'react';
import { X, Target, CheckCircle2, Link2 } from 'lucide-react';

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

interface LifeArea {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Habit {
  id: string;
  name: string;
  relatedGoal?: string;
}

interface GoalEditorProps {
  goal: Goal | null;
  goals: Goal[];
  lifeAreas: LifeArea[];
  tasks: Task[];
  habits: Habit[];
  onClose: () => void;
  onSave: (goal: Goal) => void;
}

export function GoalEditor({ goal, goals, lifeAreas, tasks, habits, onClose, onSave }: GoalEditorProps) {
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [metricType, setMetricType] = useState<'binary' | 'numeric'>(goal?.metricType || 'numeric');
  const [currentValue, setCurrentValue] = useState(goal?.currentValue?.toString() || '0');
  const [targetValue, setTargetValue] = useState(goal?.targetValue?.toString() || '1');
  const [status, setStatus] = useState<'on_track' | 'at_risk' | 'off_track' | 'completed'>(
    goal?.status || 'on_track'
  );
  const [timeframeType, setTimeframeType] = useState<'this_week' | 'this_month' | 'this_quarter' | 'this_year' | 'ongoing' | 'custom'>(
    goal?.timeframeType || 'this_quarter'
  );
  const [customTimeframe, setCustomTimeframe] = useState(goal?.timeframe || '');
  const [area, setArea] = useState(goal?.area || '');
  const [parentGoal, setParentGoal] = useState(goal?.parentGoal || '');

  if (!goal) return null;

  const handleSave = () => {
    // Build timeframe string
    let timeframeString = '';
    if (timeframeType === 'custom') {
      timeframeString = customTimeframe;
    } else {
      const timeframeMap = {
        this_week: 'This Week',
        this_month: 'This Month',
        this_quarter: 'Q1 2026',
        this_year: '2026',
        ongoing: 'Ongoing',
      };
      timeframeString = timeframeMap[timeframeType];
    }

    onSave({
      ...goal,
      title,
      description: description || undefined,
      metricType,
      currentValue: parseFloat(currentValue) || 0,
      targetValue: parseFloat(targetValue) || 1,
      status,
      timeframe: timeframeString,
      timeframeType,
      area: area || undefined,
      parentGoal: parentGoal || undefined,
    });
    onClose();
  };

  // Get linked items
  const linkedHabits = habits.filter(h => h.relatedGoal === goal.id);
  const linkedTasks = tasks.filter(t => false); // Tasks don't have relatedGoal yet - placeholder

  // Available parent goals (exclude self and children)
  const availableParentGoals = goals.filter(g => g.id !== goal.id && g.parentGoal !== goal.id && g.id !== 'new');

  const statusColors = {
    on_track: { bg: 'bg-[#34C759]/10', text: 'text-[#34C759]', border: 'border-[#34C759]/30' },
    at_risk: { bg: 'bg-[#FF9500]/10', text: 'text-[#FF9500]', border: 'border-[#FF9500]/30' },
    off_track: { bg: 'bg-[#FF3B30]/10', text: 'text-[#FF3B30]', border: 'border-[#FF3B30]/30' },
    completed: { bg: 'bg-[#007AFF]/10', text: 'text-[#007AFF]', border: 'border-[#007AFF]/30' },
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow:
            '0 20px 60px -15px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2.5 text-[#007AFF]">
            <Target size={18} strokeWidth={1.5} />
            <span className="text-[15px] font-medium">
              {goal.id === 'new' ? 'New Goal' : 'Edit Goal'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md hover:bg-black/[0.06] flex items-center justify-center transition-colors"
          >
            <X size={16} strokeWidth={2} className="text-[#86868B]" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Goal Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to achieve?"
                className="w-full text-[17px] text-[#1D1D1F] placeholder-[#C7C7CC] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context or details..."
                rows={2}
                className="w-full text-[14px] text-[#1D1D1F] placeholder-[#C7C7CC] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all resize-none"
              />
            </div>

            {/* Metric Type */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Metric Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMetricType('numeric')}
                  className={`flex-1 px-3 py-2 text-[13px] rounded-md transition-all ${
                    metricType === 'numeric'
                      ? 'bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/30'
                      : 'bg-black/[0.04] text-[#86868B] hover:bg-black/[0.08] border border-transparent'
                  }`}
                >
                  Numeric (e.g., 45/100)
                </button>
                <button
                  onClick={() => setMetricType('binary')}
                  className={`flex-1 px-3 py-2 text-[13px] rounded-md transition-all ${
                    metricType === 'binary'
                      ? 'bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/30'
                      : 'bg-black/[0.04] text-[#86868B] hover:bg-black/[0.08] border border-transparent'
                  }`}
                >
                  Binary (Done/Not Done)
                </button>
              </div>
            </div>

            {/* Progress (for numeric type) */}
            {metricType === 'numeric' && (
              <div>
                <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                  Progress
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    placeholder="0"
                    className="w-24 text-[14px] text-[#1D1D1F] placeholder-[#C7C7CC] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                  />
                  <span className="text-[14px] text-[#86868B]">/</span>
                  <input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder="100"
                    className="w-24 text-[14px] text-[#1D1D1F] placeholder-[#C7C7CC] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                  />
                  <div className="flex-1 ml-3">
                    <div className="h-2 bg-black/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#007AFF] transition-all"
                        style={{
                          width: `${Math.min(100, (parseFloat(currentValue) / parseFloat(targetValue)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Status
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['on_track', 'at_risk', 'off_track', 'completed'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-3 py-2 text-[12px] rounded-md transition-all capitalize ${
                      status === s
                        ? `${statusColors[s].bg} ${statusColors[s].text} border ${statusColors[s].border}`
                        : 'bg-black/[0.04] text-[#86868B] hover:bg-black/[0.08] border border-transparent'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeframe */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Timeframe
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {(['this_week', 'this_month', 'this_quarter', 'this_year', 'ongoing', 'custom'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTimeframeType(type)}
                    className={`px-3 py-2 text-[13px] rounded-md transition-all capitalize ${
                      timeframeType === type
                        ? 'bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/30'
                        : 'bg-black/[0.04] text-[#86868B] hover:bg-black/[0.08] border border-transparent'
                    }`}
                  >
                    {type.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
              
              {timeframeType === 'custom' && (
                <input
                  type="text"
                  value={customTimeframe}
                  onChange={(e) => setCustomTimeframe(e.target.value)}
                  placeholder="e.g., Summer 2026"
                  className="w-full text-[14px] text-[#1D1D1F] placeholder-[#C7C7CC] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                />
              )}
            </div>

            {/* Life Area */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Life Area (Optional)
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full text-[14px] text-[#1D1D1F] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all bg-white"
              >
                <option value="">None</option>
                {lifeAreas.map((lifeArea) => (
                  <option key={lifeArea.id} value={lifeArea.id}>
                    {lifeArea.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Parent Goal */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Parent Goal (Optional)
              </label>
              <select
                value={parentGoal}
                onChange={(e) => setParentGoal(e.target.value)}
                className="w-full text-[14px] text-[#1D1D1F] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all bg-white"
              >
                <option value="">None</option>
                {availableParentGoals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
              <p className="text-[12px] text-[#86868B] mt-2">
                Make this a sub-goal of another goal (max 2 levels deep)
              </p>
            </div>

            {/* Linked Items */}
            {goal.id !== 'new' && (linkedHabits.length > 0 || linkedTasks.length > 0) && (
              <div className="pt-2 border-t border-black/[0.06]">
                <div className="flex items-center gap-2 mb-3">
                  <Link2 size={14} strokeWidth={2} className="text-[#007AFF]" />
                  <h3 className="text-[13px] text-[#86868B] uppercase tracking-wide font-medium">
                    Linked Items
                  </h3>
                </div>

                {linkedHabits.length > 0 && (
                  <div className="mb-3">
                    <div className="text-[12px] text-[#86868B] mb-2">Habits ({linkedHabits.length})</div>
                    <div className="space-y-1">
                      {linkedHabits.map((habit) => (
                        <div
                          key={habit.id}
                          className="flex items-center gap-2 px-3 py-2 bg-black/[0.02] rounded-lg"
                        >
                          <CheckCircle2 size={14} strokeWidth={2} className="text-[#007AFF]" />
                          <span className="text-[13px] text-[#1D1D1F]">{habit.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {linkedTasks.length > 0 && (
                  <div>
                    <div className="text-[12px] text-[#86868B] mb-2">Tasks ({linkedTasks.length})</div>
                    <div className="space-y-1">
                      {linkedTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-2 px-3 py-2 bg-black/[0.02] rounded-lg"
                        >
                          <div className="w-3 h-3 rounded-sm border-2 border-[#D1D1D6]" />
                          <span className="text-[13px] text-[#1D1D1F]">{task.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Helper Text */}
            <div className="pt-2">
              <p className="text-[12px] text-[#86868B] leading-relaxed">
                Goals provide direction for habits and tasks. Progress is tracked calmly without pressure.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-black/[0.06] bg-[#FAFAF9] flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[14px] text-[#1D1D1F] hover:bg-black/[0.06] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-4 py-2 text-[14px] text-white bg-[#007AFF] hover:bg-[#0051D5] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
          >
            Save Goal
          </button>
        </div>
      </div>
    </div>
  );
}
