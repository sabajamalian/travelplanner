import React, { useState } from 'react';
import { Event } from '../pages/Planner';

interface EventCardProps {
  event: Event;
}

// Color variants for different event types
const eventColors = [
  'border-l-4 border-l-primary bg-primary/5',
  'border-l-4 border-l-secondary bg-secondary/5',
  'border-l-4 border-l-accent bg-accent/5',
  'border-l-4 border-l-purple-500 bg-purple-50',
  'border-l-4 border-l-orange-500 bg-orange-50',
  'border-l-4 border-l-teal-500 bg-teal-50',
];

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // In a real app, this would open a modal with event details
    console.log('Event clicked:', event.title);
  };

  const colorIndex = parseInt(event.id) % eventColors.length;
  const eventColor = eventColors[colorIndex];

  return (
    <div
      className={`event-card ${eventColor} ${
        isHovered ? 'scale-105 shadow-lg' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="flex flex-col">
        <p className="font-medium text-text-primary text-sm leading-tight">
          {event.title}
        </p>
        <p className="text-xs text-text-secondary mt-1">
          {event.startTime} - {event.endTime}
        </p>
        {event.location && (
          <p className="text-xs text-text-secondary mt-1">
            📍 {event.location}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventCard; 