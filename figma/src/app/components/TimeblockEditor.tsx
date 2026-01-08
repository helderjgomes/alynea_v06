import { useState } from 'react';
import { X, Clock, Trash2, Plus, Lock, LockOpen, Check } from 'lucide-react';

interface Timeblock {
  id: string;
  label?: string;
  startTime: string;
  endTime: string;
  date: string;
  color: string;
  taskIds: string[];
  isLocked?: boolean;
  isExternal?: boolean;
  externalSource?: 'google' | 'outlook' | 'apple';
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TimeblockEditorProps {
  timeblock: Timeblock | null;
  tasks: Task[];
  onClose: () => void;
  onSave: (timeblock: Timeblock) => void;
  onDelete: (id: string) => void;
}

const COLOR_OPTIONS = [
  { name: 'Blue', value: '#007AFF' },
  { name: 'Green', value: '#34C759' },
  { name: 'Purple', value: '#AF52DE' },
  { name: 'Orange', value: '#FF9500' },
  { name: 'Red', value: '#FF2D55' },
  { name: 'Yellow', value: '#FFCC00' },
  { name: 'Gray', value: '#8E8E93' },
  { name: 'Pink', value: '#FF375F' },
];

export function TimeblockEditor({
  timeblock,
  tasks,
  onClose,
  onSave,
  onDelete,
}: TimeblockEditorProps) {
  const [label, setLabel] = useState(timeblock?.label || '');
  const [startTime, setStartTime] = useState(timeblock?.startTime || '09:00');
  const [endTime, setEndTime] = useState(timeblock?.endTime || '10:00');
  const [color, setColor] = useState(timeblock?.color || '#007AFF');
  const [taskIds, setTaskIds] = useState<string[]>(timeblock?.taskIds || []);
  const [isLocked, setIsLocked] = useState(timeblock?.isLocked || false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTaskPicker, setShowTaskPicker] = useState(false);

  if (!timeblock) return null;

  // Calculate duration
  const calculateDuration = () => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 0) return '0m';
    
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const handleSave = () => {
    onSave({
      ...timeblock,
      label: label || undefined,
      startTime,
      endTime,
      color,
      taskIds,
      isLocked,
    });
    onClose();
  };

  const handleDelete = () => {
    if (timeblock.id !== 'new') {
      onDelete(timeblock.id);
    }
    onClose();
  };

  const addTask = (taskId: string) => {
    if (!taskIds.includes(taskId)) {
      setTaskIds([...taskIds, taskId]);
    }
    setShowTaskPicker(false);
  };

  const removeTask = (taskId: string) => {
    setTaskIds(taskIds.filter((id) => id !== taskId));
  };

  const selectedTasks = tasks.filter((t) => taskIds.includes(t.id));
  const availableTasks = tasks.filter((t) => !taskIds.includes(t.id) && !t.completed);

  const isExternal = timeblock.isExternal;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow:
            '0 20px 60px -15px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2.5 text-[#007AFF]">
            <Clock size={18} strokeWidth={1.5} />
            <span className="text-[15px] font-medium">
              {timeblock.id === 'new' ? 'New Time Block' : 'Edit Time Block'}
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
            {/* External Calendar Badge */}
            {isExternal && (
              <div className="px-3 py-2 bg-black/[0.04] rounded-lg border border-dashed border-black/[0.1]">
                <div className="flex items-center gap-2">
                  <div className="text-[12px] text-[#86868B] uppercase tracking-wide">
                    {timeblock.externalSource} Calendar
                  </div>
                  <div className="text-[12px] text-[#86868B]">•</div>
                  <div className="text-[12px] text-[#86868B]">Read-only</div>
                </div>
              </div>
            )}

            {/* Label */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Label (Optional)
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Deep Work, Meeting, Focus Time"
                disabled={isExternal}
                className="w-full text-[15px] text-[#1D1D1F] placeholder-[#C7C7CC] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all disabled:bg-black/[0.02] disabled:text-[#86868B]"
                autoFocus={!isExternal}
              />
            </div>

            {/* Time Range */}
            <div>
              <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                Time
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={isExternal}
                  className="flex-1 text-[14px] text-[#1D1D1F] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all disabled:bg-black/[0.02] disabled:text-[#86868B]"
                />
                <span className="text-[14px] text-[#86868B]">to</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={isExternal}
                  className="flex-1 text-[14px] text-[#1D1D1F] px-3 py-2.5 border border-black/[0.1] rounded-lg outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all disabled:bg-black/[0.02] disabled:text-[#86868B]"
                />
              </div>
              <div className="mt-2 text-[12px] text-[#86868B]">
                Duration: <span className="text-[#1D1D1F] font-medium">{calculateDuration()}</span>
              </div>
            </div>

            {/* Color */}
            {!isExternal && (
              <div>
                <label className="block text-[13px] text-[#86868B] mb-2 font-medium">
                  Color
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {COLOR_OPTIONS.map((colorOption) => (
                    <button
                      key={colorOption.value}
                      onClick={() => setColor(colorOption.value)}
                      className="relative w-9 h-9 rounded-lg transition-all hover:scale-110"
                      style={{ backgroundColor: colorOption.value }}
                      title={colorOption.name}
                    >
                      {color === colorOption.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check size={16} strokeWidth={3} className="text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] text-[#86868B] font-medium">
                  Tasks ({selectedTasks.length})
                </label>
                {!isExternal && (
                  <button
                    onClick={() => setShowTaskPicker(!showTaskPicker)}
                    className="text-[12px] text-[#007AFF] hover:text-[#0051D5] flex items-center gap-1"
                  >
                    <Plus size={14} strokeWidth={2} />
                    Add Task
                  </button>
                )}
              </div>

              {/* Task Picker Dropdown */}
              {showTaskPicker && availableTasks.length > 0 && (
                <div className="mb-3 max-h-48 overflow-y-auto border border-black/[0.1] rounded-lg">
                  {availableTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => addTask(task.id)}
                      className="w-full text-left px-3 py-2.5 hover:bg-black/[0.04] transition-colors border-b border-black/[0.06] last:border-b-0"
                    >
                      <div className="text-[13px] text-[#1D1D1F]">{task.title}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Tasks List */}
              {selectedTasks.length > 0 ? (
                <div className="space-y-1">
                  {selectedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 px-3 py-2.5 bg-black/[0.02] rounded-lg group"
                    >
                      <div className="w-3 h-3 rounded-sm border-2 border-[#D1D1D6] flex-shrink-0" />
                      <div className="flex-1 text-[13px] text-[#1D1D1F] truncate">
                        {task.title}
                      </div>
                      {!isExternal && (
                        <button
                          onClick={() => removeTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/[0.06] rounded"
                        >
                          <X size={14} strokeWidth={2} className="text-[#86868B]" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-6 text-center text-[12px] text-[#86868B] bg-black/[0.02] rounded-lg">
                  No tasks linked to this time block
                </div>
              )}
            </div>

            {/* Locked Toggle */}
            {!isExternal && (
              <div>
                <button
                  onClick={() => setIsLocked(!isLocked)}
                  className="w-full flex items-center justify-between px-3 py-3 bg-black/[0.02] hover:bg-black/[0.04] rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {isLocked ? (
                      <Lock size={16} strokeWidth={2} className="text-[#007AFF]" />
                    ) : (
                      <LockOpen size={16} strokeWidth={2} className="text-[#86868B]" />
                    )}
                    <div>
                      <div className="text-[13px] text-[#1D1D1F] font-medium text-left">
                        Lock Time Block
                      </div>
                      <div className="text-[11px] text-[#86868B] text-left">
                        Won't move with auto-scheduling
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      isLocked ? 'bg-[#007AFF]' : 'bg-black/[0.1]'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        isLocked ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </div>
                </button>
              </div>
            )}

            {/* Delete Button */}
            {!isExternal && timeblock.id !== 'new' && (
              <div className="pt-2">
                {showDeleteConfirm ? (
                  <div className="space-y-2">
                    <div className="text-[13px] text-[#86868B] text-center">
                      Delete this time block?
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-3 py-2 text-[13px] text-[#1D1D1F] bg-black/[0.04] hover:bg-black/[0.08] rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 px-3 py-2 text-[13px] text-white bg-[#FF3B30] hover:bg-[#FF2D22] rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-[13px] text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} strokeWidth={2} />
                    Delete Time Block
                  </button>
                )}
              </div>
            )}
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
          {!isExternal && (
            <button
              onClick={handleSave}
              disabled={!startTime || !endTime}
              className="px-4 py-2 text-[14px] text-white bg-[#007AFF] hover:bg-[#0051D5] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
