import { useState, useRef, useEffect } from 'react';

interface DurationPickerProps {
  duration?: string;
  onDurationChange: (duration: string) => void;
  compact?: boolean;
}

const DURATION_OPTIONS = [
  { value: '5m', label: '5 min' },
  { value: '10m', label: '10 min' },
  { value: '15m', label: '15 min' },
  { value: '20m', label: '20 min' },
  { value: '25m', label: '25 min' },
  { value: '30m', label: '30 min' },
  { value: '45m', label: '45 min' },
  { value: '1h', label: '1h' },
  { value: '2h', label: '2h' },
  { value: '3h', label: '3h' },
  { value: '4h', label: '4h' },
];

// Convert duration to minutes for comparison
const durationToMinutes = (duration: string): number => {
  if (!duration) return 0;
  if (duration.endsWith('h')) {
    return parseInt(duration) * 60;
  }
  return parseInt(duration);
};

// Get color based on duration
const getDurationColor = (duration?: string): string => {
  if (!duration) return '#D1D1D6'; // light gray outline
  
  const minutes = durationToMinutes(duration);
  
  if (minutes >= 60) return '#FF3B30'; // red
  if (minutes >= 30) return '#F6BD16'; // yellow
  return '#D1D1D6'; // light gray
};

export function DurationPicker({ duration, onDurationChange, compact = false }: DurationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (value: string) => {
    onDurationChange(value);
    setIsOpen(false);
  };

  const displayValue = duration || '—';
  const outlineColor = getDurationColor(duration);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center justify-center px-2 py-0.5 rounded-md transition-all hover:bg-black/[0.02] w-[50px]"
        style={{ 
          border: `0.5px solid ${outlineColor}`,
        }}
      >
        <span className="font-medium tabular-nums text-[12px] text-[#1D1D1F] text-center w-full">
          {displayValue}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-black/[0.06] py-1 z-50 min-w-[100px]">
          {DURATION_OPTIONS.map((option) => {
            const optionColor = getDurationColor(option.value);
            return (
              <button
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option.value);
                }}
                className={`w-full text-left px-3 py-1.5 text-[13px] transition-colors flex items-center gap-2 ${
                  duration === option.value
                    ? 'bg-black/[0.04]'
                    : 'hover:bg-black/[0.02]'
                }`}
              >
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: optionColor }}
                />
                <span className="text-[#1D1D1F] font-medium">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}