import { useState } from 'react';
import { X, RefreshCcw } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency?: string;
  frequencyType?: 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom';
  customDays?: boolean[]; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
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
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  progress?: string;
  timeframe?: string;
}

interface LifeArea {
  id: string;
  name: string;
  color: string;
}

interface HabitEditorProps {
  habit: Habit | null;
  goals: Goal[];
  lifeAreas: LifeArea[];
  onClose: () => void;
  onSave: (habit: Habit) => void;
}

export function HabitEditor({ habit, goals, lifeAreas, onClose, onSave }: HabitEditorProps) {
  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [frequencyType, setFrequencyType] = useState<'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom'>(
    habit?.frequencyType || 'daily'
  );
  const [customDays, setCustomDays] = useState<boolean[]>(
    habit?.customDays || [false, false, false, false, false, false, false]
  );
  const [targetAmount, setTargetAmount] = useState(habit?.targetAmount?.toString() || '');
  const [targetUnit, setTargetUnit] = useState(habit?.targetUnit || 'minutes');
  const [targetPeriod, setTargetPeriod] = useState<'day' | 'week' | 'month'>(habit?.targetPeriod || 'day');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>(
    habit?.timeOfDay || 'anytime'
  );
  const [relatedGoal, setRelatedGoal] = useState(habit?.relatedGoal || '');
  const [area, setArea] = useState(habit?.area || '');
  const [isPaused, setIsPaused] = useState(habit?.isPaused || false);

  if (!habit) return null;

  const handleSave = () => {
    // Build frequency string
    let frequencyString = '';
    if (frequencyType === 'custom') {
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const selectedDays = customDays
        .map((selected, i) => (selected ? dayNames[i] : null))
        .filter(Boolean);
      frequencyString = selectedDays.join(', ');
    } else {
      frequencyString = frequencyType.charAt(0).toUpperCase() + frequencyType.slice(1);
    }

    onSave({
      ...habit,
      name,
      description: description || undefined,
      frequency: frequencyString,
      frequencyType,
      customDays,
      targetAmount: targetAmount ? parseFloat(targetAmount) : undefined,
      targetUnit: targetAmount ? targetUnit : undefined,
      targetPeriod: targetAmount ? targetPeriod : undefined,
      timeOfDay,
      relatedGoal: relatedGoal || undefined,
      area: area || undefined,
      isPaused,
      pausedDate: isPaused ? new Date().toISOString() : undefined,
      isActiveToday: !isPaused,
      completedToday: habit.completedToday || false,
    });
    onClose();
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleCustomDay = (index: number) => {
    setCustomDays(prev => prev.map((day, i) => (i === index ? !day : day)));
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
            <RefreshCcw size={18} strokeWidth={1.5} />
            <span className="text-[15px] font-medium">
              {habit.id === 'new' ? 'New Habit' : 'Edit Habit'}
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
            {/* Habit Name */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Habit Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What practice do you want to maintain?"
                className="w-full text-[17px] text-[#1D1D1F] placeholder-[#C7C7CC] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Description / Notes
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any details or motivation..."
                rows={2}
                className="w-full text-[14px] text-[#1D1D1F] placeholder-[#C7C7CC] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all resize-none"
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Frequency
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {(['daily', 'weekdays', 'weekends', 'weekly', 'custom'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFrequencyType(type)}
                    className={`px-3 py-1.5 text-[13px] rounded-md transition-all ${
                      frequencyType === type
                        ? 'bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/30'
                        : 'bg-black/[0.04] text-[#86868B] hover:bg-black/[0.08] border border-transparent'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Custom Days Selector */}
              {frequencyType === 'custom' && (
                <div className="flex gap-2 mt-3">
                  {dayNames.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => toggleCustomDay(index)}
                      className={`flex-1 px-2 py-2 text-[13px] rounded-md transition-all ${
                        customDays[index]
                          ? 'bg-[#007AFF] text-white'
                          : 'bg-black/[0.04] text-[#86868B] hover:bg-black/[0.08]'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Target per Session */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Target per Session (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0"
                  className="w-24 text-[14px] text-[#1D1D1F] placeholder-[#C7C7CC] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                />
                <input
                  type="text"
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value)}
                  placeholder="minutes"
                  className="flex-1 text-[14px] text-[#1D1D1F] placeholder-[#C7C7CC] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                />
              </div>
              <p className="text-[12px] text-[#86868B] mt-2">
                Examples: 30 minutes, 5 pages, 2 km, 10 reps
              </p>
            </div>

            {/* Time of Day */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Time of Day
              </label>
              <div className="flex flex-wrap gap-2">
                {(['morning', 'afternoon', 'evening', 'anytime'] as const).map((time) => (
                  <button
                    key={time}
                    onClick={() => setTimeOfDay(time)}
                    className={`px-3 py-1.5 text-[13px] rounded-md transition-all ${
                      timeOfDay === time
                        ? 'bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/30'
                        : 'bg-black/[0.04] text-[#86868B] hover:bg-black/[0.08] border border-transparent'
                    }`}
                  >
                    {time.charAt(0).toUpperCase() + time.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Related Goal */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Related Goal (Optional)
              </label>
              <select
                value={relatedGoal}
                onChange={(e) => setRelatedGoal(e.target.value)}
                className="w-full text-[14px] text-[#1D1D1F] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all bg-white"
              >
                <option value="">None</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
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

            {/* Pause Habit */}
            <div className="pt-2 border-t border-black/[0.06]">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <div className="text-[14px] text-[#1D1D1F] mb-0.5">Pause this habit</div>
                  <div className="text-[12px] text-[#86868B]">
                    Won't appear in Today view while paused
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isPaused}
                    onChange={(e) => setIsPaused(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-black/[0.1] peer-checked:bg-[#007AFF] rounded-full transition-colors"></div>
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                </div>
              </label>
            </div>

            {/* Helper Text */}
            <div className="pt-2">
              <p className="text-[12px] text-[#86868B] leading-relaxed">
                Progress is tracked gently with visual check-ins. No streaks or pressure—just consistent practice.
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
            disabled={!name.trim()}
            className="px-4 py-2 text-[14px] text-white bg-[#007AFF] hover:bg-[#0051D5] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
          >
            Save Habit
          </button>
        </div>
      </div>
    </div>
  );
}
