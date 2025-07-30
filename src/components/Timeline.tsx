import React, { useEffect, useRef, useState, useCallback } from 'react';
import EventCard from './EventCard';
import EventModal from './EventModal';
import { Event } from '../pages/Planner';

interface TimelineProps {
  events: Event[];
  currentTime: Date;
  selectedDate: Date;
  onEventCreate: (event: Event) => void;
}

const Timeline: React.FC<TimelineProps> = ({ events, currentTime, selectedDate, onEventCreate }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragStart, setDragStart] = useState<{ hour: number; minute: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ hour: number; minute: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
  const isCurrentTimeOnSelectedDate = useCallback(() => {
    return currentTime.toDateString() === selectedDate.toDateString();
  }, [currentTime, selectedDate]);

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

  // Calculate event positions and widths for overlapping events
  const calculateEventLayout = () => {
    const eventGroups: Event[][] = [];
    const processedEvents = new Set<string>();

    filteredEvents.forEach(event => {
      if (processedEvents.has(event.id)) return;

      const overlappingEvents = [event];
      processedEvents.add(event.id);

              // Find all events that overlap with this event
        filteredEvents.forEach(otherEvent => {
          if (otherEvent.id === event.id || processedEvents.has(otherEvent.id)) return;

          const eventStart = event.hour * 60 + event.minute;
          const eventEnd = eventStart + (event.duration || 60); // Use duration or default to 1 hour
          const otherStart = otherEvent.hour * 60 + otherEvent.minute;
          const otherEnd = otherStart + (otherEvent.duration || 60);

          // Check if events overlap
          if (eventStart < otherEnd && eventEnd > otherStart) {
            overlappingEvents.push(otherEvent);
            processedEvents.add(otherEvent.id);
          }
        });

      if (overlappingEvents.length > 0) {
        eventGroups.push(overlappingEvents);
      }
    });

    return eventGroups;
  };

  const eventGroups = calculateEventLayout();

  // Convert mouse position to time and round to nearest hour or half-hour
  const getTimeFromPosition = (clientY: number) => {
    if (!timelineRef.current) return { hour: 0, minute: 0 };
    
    const rect = timelineRef.current.getBoundingClientRect();
    const scrollTop = timelineRef.current.scrollTop;
    const relativeY = clientY - rect.top + scrollTop;
    
    // Account for the py-4 padding (16px top and bottom)
    const adjustedY = relativeY - 16;
    
    let hour = Math.floor(adjustedY / 48);
    const rawMinute = Math.floor((adjustedY % 48) / 48 * 60);
    
    // Round to nearest 30-minute interval
    let roundedMinute;
    if (rawMinute < 15) {
      roundedMinute = 0; // Round down to hour
    } else if (rawMinute < 45) {
      roundedMinute = 30; // Round to half-hour
    } else {
      roundedMinute = 0; // Round up to next hour
      hour = Math.min(23, hour + 1);
    }
    
    return { hour: Math.max(0, Math.min(23, hour)), minute: roundedMinute };
  };

  // Handle mouse down for drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    const time = getTimeFromPosition(e.clientY);
    setDragStart(time);
    setDragEnd(time);
    setIsDragging(true);
  };

  // Handle mouse move for drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const time = getTimeFromPosition(e.clientY);
    setDragEnd(time);
  };

  // Handle mouse up for drag end
  const handleMouseUp = () => {
    if (!isDragging || !dragStart || !dragEnd) return;
    
    setIsDragging(false);
    
    // Ensure start is before end
    const start = dragStart.hour * 60 + dragStart.minute;
    const end = dragEnd.hour * 60 + dragEnd.minute;
    
    if (start === end) {
      // Single click - create 1-hour event
      setIsModalOpen(true);
      // Modal will handle the event creation
    } else {
      // Drag - create event with custom duration
      setIsModalOpen(true);
      // Modal will handle the event creation
    }
    
    setDragStart(null);
    setDragEnd(null);
  };

  // Handle modal save
  const handleModalSave = (eventData: any) => {
    const newEvent: Event = {
      ...eventData,
      hour: parseInt(eventData.startTime.split(':')[0]),
      minute: parseInt(eventData.startTime.split(':')[1])
    };
    
    onEventCreate(newEvent);
    setIsModalOpen(false);
  };

  return (
    <div 
      className="relative h-[calc(100vh-200px)] overflow-y-auto max-w-5xl mx-auto px-4 timeline-container" 
      ref={timelineRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >
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
        {eventGroups.map((group, groupIndex) => {
          const isOverlapping = group.length > 1;
          const isMobile = window.innerWidth < 768;
          
          // On mobile, allow partial overlap for better readability
          const eventWidth = isOverlapping 
            ? (isMobile ? 'calc(100% - 32px)' : `calc((100% - 32px) / ${group.length})`)
            : 'calc(100% - 32px)';
          
          return group.map((event, eventIndex) => {
            const eventPosition = (event.hour * 48) + (event.minute / 60) * 48;
            const isPast = isCurrentTimeOnSelectedDate() && 
                          (currentTime.getHours() > event.hour || 
                           (currentTime.getHours() === event.hour && currentTime.getMinutes() > event.minute));

            // Calculate left position with overlap on mobile
            let leftPosition;
            if (isOverlapping && isMobile) {
              // On mobile, stack events with slight overlap
              leftPosition = `calc(8px + (${eventIndex} * 20px))`;
            } else if (isOverlapping) {
              // On desktop, divide width equally
              leftPosition = `calc(8px + (${eventIndex} * (100% - 32px) / ${group.length}))`;
            } else {
              leftPosition = '8px';
            }

            // Calculate event height based on duration
            const eventDuration = event.duration || 60;
            const eventHeight = Math.max(48, (eventDuration / 60) * 48); // Minimum 48px height

            return (
              <div
                key={event.id}
                className={`absolute transition-opacity duration-300 ${
                  isPast ? 'opacity-70' : 'opacity-100'
                } ${isOverlapping && isMobile ? 'mobile-overlap' : ''}`}
                style={{
                  top: `${eventPosition}px`,
                  left: leftPosition,
                  width: eventWidth,
                  height: `${eventHeight}px`,
                  zIndex: isOverlapping ? (10 + eventIndex) : 5
                }}
              >
                <EventCard event={event} isOverlapping={isOverlapping} />
              </div>
            );
          });
        })}

        {/* Drag preview */}
        {isDragging && dragStart && dragEnd && (
          <div 
            className="absolute left-8 bg-primary/20 border border-primary rounded-lg z-20 pointer-events-none"
            style={{
              top: `${Math.min(dragStart.hour * 48 + dragStart.minute * 0.8, dragEnd.hour * 48 + dragEnd.minute * 0.8) + 16}px`,
              height: `${Math.abs((dragEnd.hour * 48 + dragEnd.minute * 0.8) - (dragStart.hour * 48 + dragStart.minute * 0.8))}px`,
              minHeight: '24px'
            }}
          >
            <div className="p-2 text-xs text-primary font-medium">
              {dragStart.hour.toString().padStart(2, '0')}:{dragStart.minute.toString().padStart(2, '0')} - {dragEnd.hour.toString().padStart(2, '0')}:{dragEnd.minute.toString().padStart(2, '0')}
            </div>
          </div>
        )}
      </div>

      {/* Event Creation Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        initialData={dragStart && dragEnd ? {
          startHour: Math.min(dragStart.hour, dragEnd.hour),
          startMinute: Math.min(dragStart.hour, dragEnd.hour) === dragStart.hour ? dragStart.minute : dragEnd.minute,
          endHour: Math.max(dragStart.hour, dragEnd.hour),
          endMinute: Math.max(dragStart.hour, dragEnd.hour) === dragStart.hour ? dragStart.minute : dragEnd.minute,
          date: selectedDate
        } : undefined}
      />
    </div>
  );
};

export default Timeline; 