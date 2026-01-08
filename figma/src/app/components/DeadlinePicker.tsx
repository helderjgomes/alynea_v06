import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface DeadlinePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const relativeOptions = [
  { label: '3 days after date', value: '3-days', date: '11 Jan' },
  { label: '1 week after date', value: '1-week', date: '15 Jan' },
  { label: '1 month after date', value: '1-month', date: '8 Feb' },
];

export function DeadlinePicker({ value, onChange }: DeadlinePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
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

  const handleRelativeSelect = (option: typeof relativeOptions[0]) => {
    onChange(option.date);
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

  const febDays = [
    [null, null, null, null, null, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, null, null],
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full text-left px-2.5 py-1.5 rounded-md text-[13px] text-[#86868B] hover:bg-black/[0.04] transition-all flex items-center justify-between"
        >
          <span>Deadline</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-[#86868B]"
          >
            <path
              d="M6 3V9M3 6H9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : (
        <>
          <div className="mb-1">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] text-[#86868B]">Deadline</label>
            </div>
          </div>

          <div
            className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-black/[0.06] z-50 overflow-hidden"
            style={{
              boxShadow:
                '0 10px 30px -10px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Input */}
            <div className="p-2 border-b border-black/[0.06]">
              <div className="flex items-center gap-2 px-2 py-1.5 border border-black/[0.08] rounded-md">
                <Calendar size={14} strokeWidth={2} className="text-[#86868B]" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a deadline"
                  className="flex-1 text-[13px] text-[#1D1D1F] placeholder-[#86868B] border-none outline-none bg-transparent"
                  autoFocus
                />
              </div>
            </div>

            {/* Relative Options */}
            <div className="p-2 border-b border-black/[0.06]">
              {relativeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleRelativeSelect(option)}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] text-[#1D1D1F] hover:bg-black/[0.04] transition-colors"
                >
                  <Calendar size={14} strokeWidth={2} className="text-[#AF52DE]" />
                  <span className="flex-1 text-left">{option.label}</span>
                  <span className="text-[11px] text-[#86868B]">{option.date}</span>
                </button>
              ))}
            </div>

            {/* Calendar - Jan */}
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

              {/* Calendar days - Jan */}
              <div className="space-y-1 mb-4">
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

              {/* Calendar - Feb */}
              <div>
                <h4 className="text-[13px] font-medium text-[#1D1D1F] mb-2">Feb</h4>
                <div className="space-y-1">
                  {febDays.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-1">
                      {week.map((day, dayIndex) => (
                        <button
                          key={dayIndex}
                          onClick={() => day && handleDateClick(day)}
                          disabled={!day}
                          className={`h-7 flex items-center justify-center text-[13px] rounded-md transition-colors ${
                            day
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
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
