import React, { useState } from 'react';
import { Event } from '../pages/Planner';

interface EventCardProps {
  event: Event;
  isOverlapping?: boolean;
  onClick?: (event: Event) => void;
}

// Color variants for different event types with gradient backgrounds
const eventColors = [
  'border-l-4 border-l-primary',
  'border-l-4 border-l-secondary',
  'border-l-4 border-l-accent',
  'border-l-4 border-l-purple-500',
  'border-l-4 border-l-orange-500',
  'border-l-4 border-l-teal-500',
];

const EventCard: React.FC<EventCardProps> = ({ event, isOverlapping = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the timeline
    if (onClick) {
      onClick(event);
    }
  };

  const colorIndex = parseInt(event.id) % eventColors.length;
  const eventColor = eventColors[colorIndex];

  return (
    <div
      className={`event-card w-full h-full ${eventColor} ${
        isOverlapping ? 'overlapping' : ''
      } ${isHovered ? 'scale-105 shadow-lg' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="flex flex-col h-full justify-center space-y-1">
        {/* Title */}
        <p className="font-semibold text-text-primary text-sm leading-tight truncate">
          {event.title}
        </p>
        
        {/* Time */}
        <p className="text-xs text-text-secondary truncate">
          {event.startTime} - {event.endTime}
        </p>
      </div>
    </div>
  );
};

export default EventCard; 