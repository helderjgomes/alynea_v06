interface CheckIn {
  id: string;
  habitId: string;
  date: string;
  amount: number;
  completed: boolean;
}

interface HabitTrackingCalendarProps {
  checkIns?: CheckIn[];
  targetAmount?: number;
}

export function HabitTrackingCalendar({ checkIns = [], targetAmount }: HabitTrackingCalendarProps) {
  // Generate last 30 days
  const getDaysArray = () => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const days = getDaysArray();

  const getCheckInForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return checkIns.find(ci => ci.date === dateString);
  };

  const getCellColor = (date: Date) => {
    const checkIn = getCheckInForDate(date);
    
    if (!checkIn || !checkIn.completed) {
      return 'bg-black/[0.04]'; // Not done - light gray
    }
    
    if (targetAmount && checkIn.amount) {
      const percentage = (checkIn.amount / targetAmount) * 100;
      if (percentage >= 100) {
        return 'bg-[#007AFF]'; // Completed - blue
      } else if (percentage >= 50) {
        return 'bg-[#007AFF]/40'; // Partial - light blue
      } else {
        return 'bg-[#007AFF]/20'; // Minimal - very light blue
      }
    }
    
    return 'bg-[#007AFF]'; // Completed (no target)
  };

  const getTooltipText = (date: Date) => {
    const checkIn = getCheckInForDate(date);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (!checkIn || !checkIn.completed) {
      return `${dateStr}: Not completed`;
    }
    
    if (checkIn.amount) {
      return `${dateStr}: ${checkIn.amount}${targetAmount ? `/${targetAmount}` : ''}`;
    }
    
    return `${dateStr}: Completed`;
  };

  return (
    <div className="flex gap-[3px]">
      {days.map((day, index) => (
        <div
          key={index}
          className={`w-2.5 h-2.5 rounded-sm ${getCellColor(day)} transition-colors`}
          title={getTooltipText(day)}
        />
      ))}
    </div>
  );
}
