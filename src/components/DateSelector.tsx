import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const generateWeekDates = (centerDate: Date): Date[] => {
    const dates: Date[] = [];
    const startOfWeek = new Date(centerDate);
    startOfWeek.setDate(centerDate.getDate() - 3);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = date.getDate();
    
    return {
      date,
      dayName,
      dayNumber,
      isToday,
      isSelected
    };
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    onDateChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    onDateChange(newDate);
  };

  const weekDates = generateWeekDates(selectedDate);

  return (
    <div className="flex items-center justify-center gap-2 p-4 bg-white/95 backdrop-blur-sm border-b border-divider shadow-sm">
      <button
        onClick={handlePreviousWeek}
        className="p-2 text-gray-500 hover:text-primary cursor-pointer transition-colors duration-200 ease-in-out"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {weekDates.map((date, index) => {
          const formattedDate = formatDate(date);
          return (
            <button
              key={index}
              onClick={() => onDateChange(date)}
              className={`date-button ${
                formattedDate.isSelected
                  ? 'date-button-active scale-110'
                  : formattedDate.isToday
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'date-button-inactive'
              }`}
            >
              <div className="text-xs font-medium">{formattedDate.dayName}</div>
              <div className="text-sm font-semibold">{formattedDate.dayNumber}</div>
            </button>
          );
        })}
      </div>
      
      <button
        onClick={handleNextWeek}
        className="p-2 text-gray-500 hover:text-primary cursor-pointer transition-colors duration-200 ease-in-out"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default DateSelector; 