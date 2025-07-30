import React from 'react';
import TimezoneSelector from './TimezoneSelector';

interface HeaderProps {
  timezone: string;
  isLocalTime: boolean;
  onTimezoneToggle: () => void;
  onTimezoneChange: (timezone: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  timezone, 
  isLocalTime, 
  onTimezoneToggle, 
  onTimezoneChange 
}) => {
  return (
    <header className="flex justify-end items-center gap-2 p-4 border-b border-divider bg-white/95 backdrop-blur-sm shadow-sm">
      <TimezoneSelector
        timezone={timezone}
        isLocalTime={isLocalTime}
        onTimezoneChange={onTimezoneChange}
        onLocalTimeToggle={onTimezoneToggle}
      />
    </header>
  );
};

export default Header; 