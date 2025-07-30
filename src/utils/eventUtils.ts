import { Event } from '../pages/Planner';

export interface TimeSlot {
  start: number; // minutes from midnight
  end: number;   // minutes from midnight
}

export interface EventGroup {
  events: Event[];
  timeSlot: TimeSlot;
}

// Convert time string to minutes from midnight
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convert minutes from midnight to time string
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Get event time slot
export const getEventTimeSlot = (event: Event): TimeSlot => {
  const startMinutes = event.hour * 60 + event.minute;
  const endMinutes = timeToMinutes(event.endTime);
  return {
    start: startMinutes,
    end: endMinutes
  };
};

// Check if two time slots overlap
export const doTimeSlotsOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
  return slot1.start < slot2.end && slot1.end > slot2.start;
};

// Group overlapping events
export const groupOverlappingEvents = (events: Event[]): EventGroup[] => {
  const groups: EventGroup[] = [];
  const processedEvents = new Set<string>();

  events.forEach(event => {
    if (processedEvents.has(event.id)) return;

    const currentGroup: Event[] = [event];
    processedEvents.add(event.id);
    const groupTimeSlot = getEventTimeSlot(event);

    // Find all events that overlap with this group
    events.forEach(otherEvent => {
      if (otherEvent.id === event.id || processedEvents.has(otherEvent.id)) return;

      const otherTimeSlot = getEventTimeSlot(otherEvent);
      
      // Check if this event overlaps with any event in the current group
      const overlapsWithGroup = currentGroup.some(groupEvent => {
        const groupEventSlot = getEventTimeSlot(groupEvent);
        return doTimeSlotsOverlap(groupEventSlot, otherTimeSlot);
      });

      if (overlapsWithGroup) {
        currentGroup.push(otherEvent);
        processedEvents.add(otherEvent.id);
        
        // Update group time slot to cover all events
        groupTimeSlot.start = Math.min(groupTimeSlot.start, otherTimeSlot.start);
        groupTimeSlot.end = Math.max(groupTimeSlot.end, otherTimeSlot.end);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({
        events: currentGroup,
        timeSlot: groupTimeSlot
      });
    }
  });

  return groups;
};

// Calculate event position and dimensions
export const calculateEventLayout = (event: Event, group: EventGroup, isOverlapping: boolean, isMobile: boolean) => {
  const eventTimeSlot = getEventTimeSlot(event);
  const groupIndex = group.events.findIndex(e => e.id === event.id);
  
  // Calculate position - each 15-minute block is 12px high
  const startBlockIndex = Math.floor(eventTimeSlot.start / 15);
  const top = startBlockIndex * 12; // 12px per 15-minute block
  
  // Calculate height based on duration in 15-minute blocks
  const durationBlocks = Math.ceil((eventTimeSlot.end - eventTimeSlot.start) / 15);
  const height = Math.max(12, durationBlocks * 12); // Minimum 12px (one block)
  
  // Calculate width and left position
  let width: string;
  let left: string;
  
  if (isOverlapping) {
    if (isMobile) {
      // On mobile, stack events with slight overlap
      width = 'calc(100% - 32px)';
      left = `calc(8px + (${groupIndex} * 20px))`;
    } else {
      // On desktop, divide width equally
      width = `calc((100% - 32px) / ${group.events.length})`;
      left = `calc(8px + (${groupIndex} * (100% - 32px) / ${group.events.length}))`;
    }
  } else {
    width = 'calc(100% - 32px)';
    left = '8px';
  }
  
  return {
    top: `${top}px`,
    left,
    width,
    height: `${height}px`,
    zIndex: isOverlapping ? (10 + groupIndex) : 5
  };
};

// Validate event data
export const validateEvent = (event: Partial<Event>): string[] => {
  const errors: string[] = [];
  
  if (!event.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!event.startTime) {
    errors.push('Start time is required');
  }
  
  if (!event.endTime) {
    errors.push('End time is required');
  }
  
  if (event.startTime && event.endTime) {
    const startMinutes = timeToMinutes(event.startTime);
    const endMinutes = timeToMinutes(event.endTime);
    
    if (startMinutes >= endMinutes) {
      errors.push('End time must be after start time');
    }
  }
  
  return errors;
};

// Round time to nearest 15-minute interval
export const roundTimeToInterval = (hour: number, minute: number): { hour: number; minute: number } => {
  if (minute < 7.5) {
    return { hour, minute: 0 };
  } else if (minute < 22.5) {
    return { hour, minute: 15 };
  } else if (minute < 37.5) {
    return { hour, minute: 30 };
  } else if (minute < 52.5) {
    return { hour, minute: 45 };
  } else {
    return { hour: Math.min(23, hour + 1), minute: 0 };
  }
}; 