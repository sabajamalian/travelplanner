import React, { useEffect, useRef, useState, useCallback } from 'react';
import EventCard from './EventCard';
import EventModal from './EventModal';
import EventDetailModal from './EventDetailModal';
import { Event } from '../pages/Planner';
import { useTimelineSelection } from '../hooks/useTimelineSelection';
import { groupOverlappingEvents, calculateEventLayout } from '../utils/eventUtils';

interface TimelineProps {
  events: Event[];
  currentTime: Date;
  selectedDate: Date;
  onEventCreate: (event: Event) => void;
  onEventEdit?: (event: Event) => void;
  onEventDelete?: (eventId: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ events, currentTime, selectedDate, onEventCreate, onEventEdit, onEventDelete }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [modalTimeData, setModalTimeData] = useState<{startHour: number, startMinute: number, endHour: number, endMinute: number} | null>(null);

  // Use the new simple selection hook
  const { selectionState, handlers, clearSelection, setModalOpen } = useTimelineSelection({
    onSelectionChange: (blocks) => {
      console.log('Selected blocks:', blocks);
    },
    onSelectionComplete: (startTime, endTime) => {
      setModalTimeData({
        startHour: startTime.hour,
        startMinute: startTime.minute,
        endHour: endTime.hour,
        endMinute: endTime.minute
      });
      setIsModalOpen(true);
    }
  });

  // Generate 15-minute blocks from 00:00 to 23:45
  const timeBlocks = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      timeBlocks.push({ hour, minute });
    }
  }

  // Check if current time is on selected date
  const isCurrentTimeOnSelectedDate = useCallback(() => {
    return currentTime.toDateString() === selectedDate.toDateString();
  }, [currentTime, selectedDate]);

  // Calculate current time position for the red line
  const getCurrentTimePosition = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Calculate position based on 15-minute blocks (12px each)
    const totalMinutes = hour * 60 + minute;
    const blockIndex = Math.floor(totalMinutes / 15);
    return blockIndex * 12; // 12px per 15-minute block
  }, []);

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
        const sevenAMBlockIndex = 7 * 4; // 7 AM = 28 blocks (7 hours * 4 blocks per hour)
        const sevenAMPosition = sevenAMBlockIndex * 12; // 12px per block
        timelineRef.current.scrollTop = sevenAMPosition;
      }
    }
  }, [currentTime, selectedDate, isCurrentTimeOnSelectedDate]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter events for selected date
  const filteredEvents = events.filter(event => {
    // For demo purposes, show all events on any date
    // In a real app, you'd filter by actual date
    return true;
  });

  // Group overlapping events using the utility
  const eventGroups = groupOverlappingEvents(filteredEvents);

  // Update modal state in selection hook
  useEffect(() => {
    setModalOpen(isModalOpen || isDetailModalOpen);
  }, [isModalOpen, isDetailModalOpen, setModalOpen]);

  // Handle modal save
  const handleModalSave = (eventData: any) => {
    const newEvent: Event = {
      ...eventData,
      hour: parseInt(eventData.startTime.split(':')[0]),
      minute: parseInt(eventData.startTime.split(':')[1])
    };
    
    onEventCreate(newEvent);
    setIsModalOpen(false);
    setModalTimeData(null);
    clearSelection();
  };

  // Handle event click to show details
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  // Handle event edit
  const handleEventEdit = (event: Event) => {
    if (onEventEdit) {
      onEventEdit(event);
    }
  };

  // Handle event delete
  const handleEventDelete = (eventId: string) => {
    if (onEventDelete) {
      onEventDelete(eventId);
    }
  };

  return (
    <div 
      className="relative h-[calc(100vh-200px)] overflow-y-auto max-w-5xl mx-auto px-4 timeline-container" 
      ref={timelineRef}
      {...handlers}
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

        {/* Timeline 15-minute blocks */}
        {timeBlocks.map((block, index) => {
          const isKeyHour = block.hour === 0 || block.hour === 6 || block.hour === 12 || block.hour === 18;
          const isFullHour = block.minute === 0;
          const isHalfHour = block.minute === 30;
          const isQuarterHour = block.minute === 15 || block.minute === 45;
          
          return (
            <div 
              key={`${block.hour}-${block.minute}`} 
              className={`timeline-block ${isKeyHour && isFullHour ? 'key-hour' : ''}`}
            >
              {isFullHour && (
                <span className={`timeline-time ${isKeyHour ? 'key-time' : ''}`}>
                  {block.hour.toString().padStart(2, '0')}:00
                </span>
              )}
              {isHalfHour && (
                <span className="timeline-time-half">
                  {block.hour.toString().padStart(2, '0')}:30
                </span>
              )}
              {isQuarterHour && (
                <span className="timeline-time-quarter">
                  {block.hour.toString().padStart(2, '0')}:{block.minute}
                </span>
              )}
              <div className={`timeline-divider ${isKeyHour && isFullHour ? 'key-divider' : isFullHour ? 'hour-divider' : 'quarter-divider'}`}></div>
            </div>
          );
        })}

        {/* Event cards */}
        {eventGroups.map((group, groupIndex) => {
          const isOverlapping = group.events.length > 1;
          
          return group.events.map((event, eventIndex) => {
            const layout = calculateEventLayout(event, group, isOverlapping, isMobile);
            const isPast = isCurrentTimeOnSelectedDate() && 
                          (currentTime.getHours() > event.hour || 
                           (currentTime.getHours() === event.hour && currentTime.getMinutes() > event.minute));

            return (
              <div
                key={event.id}
                className={`absolute transition-opacity duration-300 ${
                  isPast ? 'opacity-70' : 'opacity-100'
                } ${isOverlapping && isMobile ? 'mobile-overlap' : ''}`}
                style={{
                  top: layout.top,
                  left: layout.left,
                  width: layout.width,
                  height: layout.height,
                  zIndex: layout.zIndex
                }}
              >
                <EventCard 
                  event={event} 
                  isOverlapping={isOverlapping} 
                  onClick={handleEventClick}
                />
              </div>
            );
          });
        })}




      </div>

      {/* Event Creation Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalTimeData(null);
          clearSelection();
        }}
        onSave={handleModalSave}
        initialData={modalTimeData ? {
          ...modalTimeData,
          date: selectedDate
        } : undefined}
      />

      {/* Event Detail Modal */}
      <EventDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onEdit={handleEventEdit}
        onDelete={handleEventDelete}
      />
    </div>
  );
};

export default Timeline; 