import React, { useEffect, useRef } from 'react';
import EventCard from './EventCard';
import { Event } from '../pages/Planner';

interface TimelineProps {
  events: Event[];
  currentTime: Date;
  selectedDate: Date;
}

const Timeline: React.FC<TimelineProps> = ({ events, currentTime, selectedDate }) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Generate hours from 00:00 to 23:00
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Calculate current time position for the red line
  const getCurrentTimePosition = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    return (hour * 48) + (minute / 60) * 48; // 48px per hour (smaller)
  };

  // Check if current time is on selected date
  const isCurrentTimeOnSelectedDate = () => {
    return currentTime.toDateString() === selectedDate.toDateString();
  };

  // Scroll to appropriate position based on date
  useEffect(() => {
    if (timelineRef.current) {
      if (isCurrentTimeOnSelectedDate()) {
        // For today, center the current time
        const currentTimePosition = getCurrentTimePosition();
        const containerHeight = timelineRef.current.clientHeight;
        timelineRef.current.scrollTop = currentTimePosition - (containerHeight / 2);
      } else {
        // For past/future dates, scroll to 7 AM
        const sevenAMPosition = 7 * 48; // 7 AM * 48px per hour
        timelineRef.current.scrollTop = sevenAMPosition;
      }
    }
  }, [currentTime, selectedDate, isCurrentTimeOnSelectedDate]);

  // Filter events for selected date
  const filteredEvents = events.filter(event => {
    // For demo purposes, show all events on any date
    // In a real app, you'd filter by actual date
    return true;
  });

  return (
    <div className="relative h-[calc(100vh-200px)] overflow-y-auto max-w-5xl mx-auto px-4" ref={timelineRef}>
      <div className="relative border-l-2 border-gray-300 ml-20 py-4 bg-gradient-to-b from-transparent via-gray-50/30 to-transparent">
        {/* Current time indicator */}
        {isCurrentTimeOnSelectedDate() && (
          <div 
            className="absolute left-[-8px] w-[calc(100%+8px)] h-1 bg-red-500 z-10 shadow-sm"
            style={{ top: `${getCurrentTimePosition()}px` }}
          >
            <div className="absolute -left-3 -top-1.5 w-4 h-4 bg-red-500 rounded-full shadow-lg border-2 border-white"></div>
          </div>
        )}

        {/* Timeline hours */}
        {hours.map(hour => {
          const isKeyHour = hour === 0 || hour === 6 || hour === 12 || hour === 18;
          return (
            <div key={hour} className={`timeline-hour ${isKeyHour ? 'key-hour' : ''}`}>
              <span className={`timeline-time ${isKeyHour ? 'key-time' : ''}`}>
                {hour.toString().padStart(2, '0')}:00
              </span>
              <div className={`timeline-divider ${isKeyHour ? 'key-divider' : ''}`}></div>
            </div>
          );
        })}

        {/* Event cards */}
        {filteredEvents.map(event => {
          const eventPosition = (event.hour * 48) + (event.minute / 60) * 48;
          const isPast = isCurrentTimeOnSelectedDate() && 
                        (currentTime.getHours() > event.hour || 
                         (currentTime.getHours() === event.hour && currentTime.getMinutes() > event.minute));

          return (
            <div
              key={event.id}
              className={`absolute left-8 transition-opacity duration-300 ${
                isPast ? 'opacity-70' : 'opacity-100'
              }`}
              style={{ top: `${eventPosition}px` }}
            >
              <EventCard event={event} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline; 