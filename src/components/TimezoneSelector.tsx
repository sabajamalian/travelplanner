import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

interface TimezoneSelectorProps {
  timezone: string;
  isLocalTime: boolean;
  onTimezoneChange: (timezone: string) => void;
  onLocalTimeToggle: () => void;
}

const timezones = [
  { value: 'EST', label: 'Eastern Standard Time', offset: '-5' },
  { value: 'PST', label: 'Pacific Standard Time', offset: '-8' },
  { value: 'CST', label: 'Central Standard Time', offset: '-6' },
  { value: 'MST', label: 'Mountain Standard Time', offset: '-7' },
  { value: 'GMT', label: 'Greenwich Mean Time', offset: '0' },
  { value: 'CET', label: 'Central European Time', offset: '+1' },
  { value: 'JST', label: 'Japan Standard Time', offset: '+9' },
  { value: 'AEST', label: 'Australian Eastern Time', offset: '+10' },
];

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  timezone,
  isLocalTime,
  onTimezoneChange,
  onLocalTimeToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedTimezone = timezones.find(tz => tz.value === timezone) || timezones[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-500" />
        
        {/* Timezone Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary cursor-pointer transition-colors duration-200 ease-in-out px-2 py-1 rounded-md hover:bg-gray-50"
          >
            <span>{selectedTimezone.value}</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48">
              <div className="py-1">
                {timezones.map((tz) => (
                  <button
                    key={tz.value}
                    onClick={() => {
                      onTimezoneChange(tz.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                      timezone === tz.value ? 'bg-primary/10 text-primary' : 'text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{tz.value}</div>
                    <div className="text-xs text-gray-500">
                      {tz.label} (UTC{tz.offset})
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Local/Home Toggle */}
        <button
          onClick={onLocalTimeToggle}
          className="text-xs text-gray-500 hover:text-primary cursor-pointer transition-colors duration-200 ease-in-out px-2 py-1 rounded-md hover:bg-gray-50"
        >
          ({isLocalTime ? 'Local' : 'Home'})
        </button>
      </div>
    </div>
  );
};

export default TimezoneSelector; 