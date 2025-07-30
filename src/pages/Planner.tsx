import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DateSelector from '../components/DateSelector';
import Scheduler from '../components/Scheduler';

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
    { 
      id: '1', 
      title: 'Breakfast at Tiffany\'s', 
      startTime: '08:00', 
      endTime: '09:00', 
      hour: 8, 
      minute: 0, 
      duration: 60,
      location: 'Tiffany & Co. Flagship Store',
      description: 'Enjoy a luxurious breakfast at the iconic Tiffany store on 5th Avenue'
    },
    { 
      id: '2', 
      title: 'City Tour', 
      startTime: '10:30', 
      endTime: '12:00', 
      hour: 10, 
      minute: 30, 
      duration: 90,
      location: 'Times Square',
      description: 'Guided walking tour of Manhattan\'s most famous landmarks'
    },
    { 
      id: '3', 
      title: 'Lunch at Central Park', 
      startTime: '12:00', 
      endTime: '13:00', 
      hour: 12, 
      minute: 0, 
      duration: 60,
      location: 'Central Park Boathouse',
      description: 'Scenic lunch with views of the lake and park'
    },
    { 
      id: '4', 
      title: 'Museum Visit', 
      startTime: '14:00', 
      endTime: '16:00', 
      hour: 14, 
      minute: 0, 
      duration: 120,
      location: 'Metropolitan Museum of Art',
      description: 'Explore world-class art collections and exhibitions'
    },
    { 
      id: '5', 
      title: 'Shopping', 
      startTime: '16:30', 
      endTime: '18:00', 
      hour: 16, 
      minute: 30, 
      duration: 90,
      location: 'Fifth Avenue',
      description: 'Browse luxury boutiques and flagship stores'
    },
    { 
      id: '6', 
      title: 'Dinner Reservation', 
      startTime: '19:00', 
      endTime: '21:00', 
      hour: 19, 
      minute: 0, 
      duration: 120,
      location: 'Le Bernardin',
      description: 'Fine dining experience at one of NYC\'s top restaurants'
    },
    // Add some overlapping events for testing
    { 
      id: '7', 
      title: 'Coffee Meeting', 
      startTime: '10:00', 
      endTime: '11:00', 
      hour: 10, 
      minute: 0, 
      duration: 60,
      location: 'Starbucks Reserve',
      description: 'Business meeting with potential client'
    },
    { 
      id: '8', 
      title: 'Team Standup', 
      startTime: '09:30', 
      endTime: '10:00', 
      hour: 9, 
      minute: 30, 
      duration: 30,
      location: 'Office',
      description: 'Daily team sync meeting'
    },
    { 
      id: '9', 
      title: 'Client Call', 
      startTime: '15:00', 
      endTime: '16:00', 
      hour: 15, 
      minute: 0, 
      duration: 60,
      location: 'Conference Room A',
      description: 'Project review and planning session'
    },
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

  const handleEventEdit = (eventToEdit: Event) => {
    // For now, we'll just log the edit action
    // In a real app, you might open an edit modal or navigate to an edit page
    console.log('Edit event:', eventToEdit);
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
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
      <div className="h-[calc(100vh-200px)]">
        <Scheduler 
          events={events} 
          onEventCreate={handleEventCreate}
          onEventEdit={handleEventEdit}
          onEventDelete={handleEventDelete}
        />
      </div>
      </div>
    </div>
  );
};

export default Planner; 