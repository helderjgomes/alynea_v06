import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Filter, Briefcase, Calendar, Flag, Tag, CheckSquare, Clock, Star } from 'lucide-react';

interface FilterCondition {
  type: 'project' | 'priority' | 'dueDate' | 'status' | 'labels' | 'hasSubtasks' | 'created';
  values: string[];
}

interface Filter {
  id: string;
  name: string;
  color: string;
  icon?: string;
  isFavorite?: boolean;
  conditions: FilterCondition[];
  sortBy?: 'dueDate' | 'priority' | 'created' | 'alphabetical' | 'project';
  sortOrder?: 'asc' | 'desc';
}

interface FilterEditorProps {
  filter: Filter | null;
  onClose: () => void;
  onSave: (filter: Filter) => void;
  onDelete?: (id: string) => void;
}

const COLORS = [
  { name: 'Blue', value: '#007AFF' },
  { name: 'Green', value: '#34C759' },
  { name: 'Purple', value: '#AF52DE' },
  { name: 'Orange', value: '#FF9500' },
  { name: 'Red', value: '#FF3B30' },
  { name: 'Yellow', value: '#FFCC00' },
  { name: 'Gray', value: '#8E8E93' },
  { name: 'Pink', value: '#FF2D55' },
];

const ICONS = [
  { name: 'Filter', component: Filter },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Calendar', component: Calendar },
  { name: 'Flag', component: Flag },
  { name: 'Tag', component: Tag },
  { name: 'CheckSquare', component: CheckSquare },
  { name: 'Clock', component: Clock },
  { name: 'Star', component: Star },
];

const PROJECTS = ['Work', 'Personal', 'Ideas'];
const PRIORITIES = ['high', 'medium', 'low', 'none'];
const DUE_DATE_OPTIONS = ['Today', 'Tomorrow', 'This Week', 'Next Week', 'Overdue', 'No Date'];

export function FilterEditor({ filter, onClose, onSave, onDelete }: FilterEditorProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#007AFF');
  const [icon, setIcon] = useState<string | undefined>(undefined);
  const [isFavorite, setIsFavorite] = useState(false);
  const [conditions, setConditions] = useState<FilterCondition[]>([]);
  const [sortBy, setSortBy] = useState<Filter['sortBy']>('dueDate');
  const [sortOrder, setSortOrder] = useState<Filter['sortOrder']>('asc');

  useEffect(() => {
    if (filter) {
      setName(filter.name);
      setColor(filter.color);
      setIcon(filter.icon);
      setIsFavorite(filter.isFavorite || false);
      setConditions(filter.conditions || []);
      setSortBy(filter.sortBy || 'dueDate');
      setSortOrder(filter.sortOrder || 'asc');
    } else {
      // Reset for new filter
      setName('');
      setColor('#007AFF');
      setIcon(undefined);
      setIsFavorite(false);
      setConditions([]);
      setSortBy('dueDate');
      setSortOrder('asc');
    }
  }, [filter]);

  if (!filter) return null;

  const handleSave = () => {
    if (!name.trim()) return;

    const updatedFilter: Filter = {
      id: filter.id,
      name: name.trim(),
      color,
      icon,
      isFavorite,
      conditions,
      sortBy,
      sortOrder,
    };

    onSave(updatedFilter);
    onClose();
  };

  const handleAddCondition = () => {
    setConditions([...conditions, { type: 'project', values: [] }]);
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleConditionTypeChange = (index: number, type: FilterCondition['type']) => {
    const newConditions = [...conditions];
    newConditions[index] = { type, values: [] };
    setConditions(newConditions);
  };

  const handleConditionValuesChange = (index: number, values: string[]) => {
    const newConditions = [...conditions];
    newConditions[index].values = values;
    setConditions(newConditions);
  };

  const toggleValue = (index: number, value: string) => {
    const condition = conditions[index];
    const newValues = condition.values.includes(value)
      ? condition.values.filter((v) => v !== value)
      : [...condition.values, value];
    handleConditionValuesChange(index, newValues);
  };

  const getConditionOptions = (type: FilterCondition['type']) => {
    switch (type) {
      case 'project':
        return PROJECTS;
      case 'priority':
        return PRIORITIES;
      case 'dueDate':
        return DUE_DATE_OPTIONS;
      default:
        return [];
    }
  };

  const getConditionLabel = (type: FilterCondition['type']) => {
    switch (type) {
      case 'project':
        return 'Project';
      case 'priority':
        return 'Priority';
      case 'dueDate':
        return 'Due Date';
      case 'status':
        return 'Status';
      case 'labels':
        return 'Labels';
      case 'hasSubtasks':
        return 'Has Subtasks';
      case 'created':
        return 'Created';
      default:
        return type;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06]">
          <h2 className="text-[17px] font-semibold text-[#1D1D1F]">
            {filter.id === 'new' ? 'New Filter' : 'Edit Filter'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-black/[0.04] rounded-lg transition-colors"
          >
            <X size={18} className="text-[#86868B]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Name */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-[#86868B] mb-2">
              Filter Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., High Priority Work Tasks"
              className="w-full px-3 py-2 text-[15px] border border-black/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Color */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-[#86868B] mb-3">
              Color
            </label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    color === c.value ? 'ring-2 ring-offset-2 ring-[#007AFF] scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Icon (Optional) */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-[#86868B] mb-3">
              Icon (Optional)
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setIcon(undefined)}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${
                  !icon
                    ? 'border-[#007AFF] bg-[#007AFF]/5 text-[#007AFF]'
                    : 'border-black/[0.1] text-[#86868B] hover:border-[#007AFF]/50'
                }`}
              >
                <X size={16} />
              </button>
              {ICONS.map((iconItem) => {
                const IconComponent = iconItem.component;
                return (
                  <button
                    key={iconItem.name}
                    onClick={() => setIcon(iconItem.name)}
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${
                      icon === iconItem.name
                        ? 'border-[#007AFF] bg-[#007AFF]/5 text-[#007AFF]'
                        : 'border-black/[0.1] text-[#86868B] hover:border-[#007AFF]/50'
                    }`}
                    title={iconItem.name}
                  >
                    <IconComponent size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Favorite Toggle */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-black/[0.1] rounded-full peer-checked:bg-[#007AFF] transition-colors"></div>
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-[15px] text-[#1D1D1F]">Add to Favorites</span>
            </label>
          </div>

          {/* Conditions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[13px] font-medium text-[#86868B]">
                Conditions
              </label>
              <button
                onClick={handleAddCondition}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] text-[#007AFF] hover:bg-[#007AFF]/5 rounded-lg transition-colors"
              >
                <Plus size={14} />
                Add Condition
              </button>
            </div>

            <div className="space-y-3">
              {conditions.map((condition, index) => (
                <div key={index} className="border border-black/[0.1] rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <select
                      value={condition.type}
                      onChange={(e) =>
                        handleConditionTypeChange(index, e.target.value as FilterCondition['type'])
                      }
                      className="px-3 py-1.5 text-[13px] border border-black/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                    >
                      <option value="project">Project</option>
                      <option value="priority">Priority</option>
                      <option value="dueDate">Due Date</option>
                    </select>
                    <button
                      onClick={() => handleRemoveCondition(index)}
                      className="p-1.5 text-[#FF3B30] hover:bg-[#FF3B30]/5 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {getConditionOptions(condition.type).map((option) => (
                      <button
                        key={option}
                        onClick={() => toggleValue(index, option)}
                        className={`px-3 py-1.5 text-[13px] rounded-full transition-all ${
                          condition.values.includes(option)
                            ? 'bg-[#007AFF] text-white'
                            : 'bg-black/[0.04] text-[#1D1D1F] hover:bg-black/[0.08]'
                        }`}
                      >
                        {option === 'none' ? 'No Priority' : option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {conditions.length === 0 && (
                <div className="text-center py-8 text-[13px] text-[#86868B]">
                  No conditions yet. Add a condition to start filtering.
                </div>
              )}
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-[#86868B] mb-2">
              Sort By
            </label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as Filter['sortBy'])}
                className="flex-1 px-3 py-2 text-[13px] border border-black/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="created">Created</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="project">Project</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as Filter['sortOrder'])}
                className="px-3 py-2 text-[13px] border border-black/[0.1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-black/[0.06] bg-[#FAFAF9]">
          <div>
            {filter.id !== 'new' && onDelete && (
              <button
                onClick={() => {
                  onDelete(filter.id);
                  onClose();
                }}
                className="px-4 py-2 text-[13px] text-[#FF3B30] hover:bg-[#FF3B30]/5 rounded-lg transition-colors"
              >
                Delete Filter
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] text-[#1D1D1F] hover:bg-black/[0.04] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-4 py-2 text-[13px] bg-[#007AFF] text-white rounded-lg hover:bg-[#0051D5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {filter.id === 'new' ? 'Create Filter' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}