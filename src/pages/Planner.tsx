import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DateSelector from '../components/DateSelector';
import Timeline from '../components/Timeline';

export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
  hour: number;
  minute: number;
  duration?: number; // in minutes
}

const Planner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timezone, setTimezone] = useState<string>('EST');
  const [isLocalTime, setIsLocalTime] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Sample events data
  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'Breakfast at Tiffany\'s', startTime: '08:00', endTime: '09:00', hour: 8, minute: 0, duration: 60 },
    { id: '2', title: 'City Tour', startTime: '10:30', endTime: '12:00', hour: 10, minute: 30, duration: 90 },
    { id: '3', title: 'Lunch at Central Park', startTime: '12:00', endTime: '13:00', hour: 12, minute: 0, duration: 60 },
    { id: '4', title: 'Museum Visit', startTime: '14:00', endTime: '16:00', hour: 14, minute: 0, duration: 120 },
    { id: '5', title: 'Shopping', startTime: '16:30', endTime: '18:00', hour: 16, minute: 30, duration: 90 },
    { id: '6', title: 'Dinner Reservation', startTime: '19:00', endTime: '21:00', hour: 19, minute: 0, duration: 120 },
    // Add some overlapping events for testing
    { id: '7', title: 'Coffee Meeting', startTime: '10:00', endTime: '11:00', hour: 10, minute: 0, duration: 60 },
    { id: '8', title: 'Team Standup', startTime: '09:30', endTime: '10:00', hour: 9, minute: 30, duration: 30 },
    { id: '9', title: 'Client Call', startTime: '15:00', endTime: '16:00', hour: 15, minute: 0, duration: 60 },
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

  const handleEventCreate = (newEvent: Event) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
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
        onEventCreate={handleEventCreate}
      />
      </div>
    </div>
  );
};

export default Planner; 