interface PriorityCheckboxProps {
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  onToggle: () => void;
}

const getPriorityColor = (priority?: 'low' | 'medium' | 'high'): string => {
  if (!priority) return '#D1D1D6'; // default gray
  
  const colors = {
    low: '#86868B',
    medium: '#F6BD16',
    high: '#FF3B30',
  };
  
  return colors[priority];
};

export function PriorityCheckbox({ completed, priority, onToggle }: PriorityCheckboxProps) {
  const borderColor = completed ? '#007AFF' : getPriorityColor(priority);
  const bgColor = completed ? '#007AFF' : 'transparent';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="flex-shrink-0"
    >
      <div
        className="w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center hover:opacity-70"
        style={{
          borderColor: borderColor,
          backgroundColor: bgColor,
        }}
      >
        {completed && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </button>
  );
}
