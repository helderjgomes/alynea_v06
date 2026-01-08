import { useState, useRef, useEffect } from 'react';
import { Calendar, Sun, Briefcase, CalendarDays, Circle, Clock, Repeat } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const quickOptions = [
  { label: 'Today', value: 'Today', icon: Calendar, color: '#34C759' },
  { label: 'Tomorrow', value: 'Tomorrow', icon: Sun, color: '#FF9500', detail: 'Fri' },
  { label: 'This weekend', value: 'This weekend', icon: Briefcase, color: '#007AFF', detail: 'Sat' },
  { label: 'Next week', value: 'Next week', icon: CalendarDays, color: '#AF52DE', detail: 'Mon 12 Jan' },
  { label: 'No Date', value: '', icon: Circle, color: '#86868B' },
];

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(8);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleQuickSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
    onChange(`${day} Jan`);
    setIsOpen(false);
  };

  const daysInMonth = [
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, null],
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-2.5 py-1.5 rounded-md text-[13px] transition-all flex items-center gap-1.5 ${
          value ? 'bg-white text-[#1D1D1F]' : 'text-[#86868B] hover:bg-black/[0.04]'
        }`}
      >
        <Calendar size={12} strokeWidth={2} className="text-[#34C759]" />
        <span className="flex-1">{value || 'Add date'}</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-black/[0.06] z-50 overflow-hidden"
          style={{
            boxShadow:
              '0 10px 30px -10px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Quick Options */}
          <div className="p-2 border-b border-black/[0.06]">
            {quickOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleQuickSelect(option.value)}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                  value === option.value
                    ? 'bg-black/[0.06] text-[#1D1D1F]'
                    : 'text-[#1D1D1F] hover:bg-black/[0.04]'
                }`}
              >
                <option.icon size={14} strokeWidth={2} style={{ color: option.color }} />
                <span className="flex-1 text-left">{option.label}</span>
                {option.detail && (
                  <span className="text-[11px] text-[#86868B]">{option.detail}</span>
                )}
              </button>
            ))}
          </div>

          {/* Calendar */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-medium text-[#1D1D1F]">Jan 2026</h3>
              <div className="flex gap-1">
                <button className="w-6 h-6 rounded-md hover:bg-black/[0.06] flex items-center justify-center transition-colors">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-[#86868B]"
                  >
                    <path
                      d="M7.5 3L4.5 6L7.5 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="w-6 h-6 rounded-md hover:bg-black/[0.06] flex items-center justify-center transition-colors">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-[#86868B]"
                  >
                    <path
                      d="M4.5 3L7.5 6L4.5 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div
                  key={i}
                  className="text-center text-[11px] text-[#86868B] font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="space-y-1">
              {daysInMonth.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day, dayIndex) => (
                    <button
                      key={dayIndex}
                      onClick={() => day && handleDateClick(day)}
                      disabled={!day}
                      className={`h-7 flex items-center justify-center text-[13px] rounded-md transition-colors ${
                        day === selectedDate
                          ? 'bg-[#007AFF] text-white'
                          : day
                          ? 'text-[#1D1D1F] hover:bg-black/[0.04]'
                          : 'text-transparent'
                      }`}
                    >
                      {day || ''}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Feb preview */}
            <div className="mt-4">
              <h4 className="text-[13px] font-medium text-[#1D1D1F] mb-2">Feb</h4>
              <div className="grid grid-cols-7 gap-1">
                <div className="h-7" />
                {[1].map((day) => (
                  <button
                    key={day}
                    className="h-7 flex items-center justify-center text-[13px] rounded-md text-[#1D1D1F] hover:bg-black/[0.04] transition-colors"
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time and Repeat */}
          <div className="border-t border-black/[0.06] p-2 space-y-1">
            <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] text-[#86868B] hover:bg-black/[0.04] transition-colors">
              <Clock size={14} strokeWidth={2} />
              <span>Time</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] text-[#86868B] hover:bg-black/[0.04] transition-colors">
              <Repeat size={14} strokeWidth={2} />
              <span>Repeat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
