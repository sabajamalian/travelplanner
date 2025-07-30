import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DateSelector from '../components/DateSelector';
import Timeline from '../components/Timeline';

export interface Event {
  id: string;
  title: string;
  time: string;
  hour: number;
  minute: number;
}

const Planner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timezone, setTimezone] = useState<string>('EST');
  const [isLocalTime, setIsLocalTime] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Sample events data
  const [events] = useState<Event[]>([
    { id: '1', title: 'Breakfast at Tiffany\'s', time: '08:00', hour: 8, minute: 0 },
    { id: '2', title: 'City Tour', time: '10:30', hour: 10, minute: 30 },
    { id: '3', title: 'Lunch at Central Park', time: '12:00', hour: 12, minute: 0 },
    { id: '4', title: 'Museum Visit', time: '14:00', hour: 14, minute: 0 },
    { id: '5', title: 'Shopping', time: '16:30', hour: 16, minute: 30 },
    { id: '6', title: 'Dinner Reservation', time: '19:00', hour: 19, minute: 0 },
  ]);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimezoneToggle = () => {
    setIsLocalTime(!isLocalTime);
  };

  const handleTimezoneChange = (newTimezone: string) => {
    setTimezone(newTimezone);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg mx-4 my-4 shadow-xl border border-white/20">
      <Header 
        timezone={timezone} 
        isLocalTime={isLocalTime} 
        onTimezoneToggle={handleTimezoneToggle}
        onTimezoneChange={handleTimezoneChange}
      />
      <DateSelector 
        selectedDate={selectedDate} 
        onDateChange={handleDateChange} 
      />
      <Timeline 
        events={events} 
        currentTime={currentTime}
        selectedDate={selectedDate}
      />
      </div>
    </div>
  );
};

export default Planner; 