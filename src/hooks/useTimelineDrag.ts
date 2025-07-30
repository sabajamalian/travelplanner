import { useState, useCallback, useRef } from 'react';

interface HoverState {
  isHovering: boolean;
  hoverTime: { hour: number; minute: number } | null;
  selectedBlocks: { hour: number; minute: number }[];
  isSelecting: boolean;
}

interface UseTimelineHoverProps {
  onHover?: (time: { hour: number; minute: number } | null) => void;
  onBlockSelect?: (blocks: { hour: number; minute: number }[]) => void;
  onSelectionComplete?: (startTime: { hour: number; minute: number }, endTime: { hour: number; minute: number }) => void;
}

export const useTimelineHover = ({
  onHover,
  onBlockSelect,
  onSelectionComplete
}: UseTimelineHoverProps) => {
  const [hoverState, setHoverState] = useState<HoverState>({
    isHovering: false,
    hoverTime: null,
    selectedBlocks: [],
    isSelecting: false
  });

  const isModalOpenRef = useRef(false);

  // Convert mouse position to time with error handling
  const getTimeFromPosition = useCallback((clientY: number, containerRect: DOMRect, scrollTop: number) => {
    try {
      const relativeY = clientY - containerRect.top + scrollTop;
      const adjustedY = relativeY - 16; // Account for padding
      
      const hour = Math.floor(adjustedY / 48);
      const rawMinute = Math.floor((adjustedY % 48) / 48 * 60);
      
      // Round to nearest 15-minute interval
      let roundedMinute;
      let finalHour = hour;
      
      if (rawMinute < 7.5) {
        roundedMinute = 0;
      } else if (rawMinute < 22.5) {
        roundedMinute = 15;
      } else if (rawMinute < 37.5) {
        roundedMinute = 30;
      } else if (rawMinute < 52.5) {
        roundedMinute = 45;
      } else {
        roundedMinute = 0;
        finalHour = Math.min(23, hour + 1);
      }
      
      return {
        hour: Math.max(0, Math.min(23, finalHour)),
        minute: roundedMinute
      };
    } catch (error) {
      console.error('Error calculating time from position:', error);
      return { hour: 0, minute: 0 };
    }
  }, []);

  // Handle mouse move for hover
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isModalOpenRef.current) return;

    // Don't update hover if clicking on an event card
    if ((e.target as HTMLElement).closest('.event-card')) {
      setHoverState(prev => ({ ...prev, isHovering: false, hoverTime: null }));
      onHover?.(null);
      return;
    }

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    
    const time = getTimeFromPosition(e.clientY, rect, scrollTop);
    
    setHoverState(prev => ({ ...prev, isHovering: true, hoverTime: time }));
    onHover?.(time);
  }, [getTimeFromPosition, onHover]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setHoverState(prev => ({ ...prev, isHovering: false, hoverTime: null }));
    onHover?.(null);
  }, [onHover]);

  // Handle click to select/deselect blocks
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isModalOpenRef.current) return;

    // Don't select if clicking on an event card
    if ((e.target as HTMLElement).closest('.event-card')) {
      return;
    }

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    
    const clickedTime = getTimeFromPosition(e.clientY, rect, scrollTop);
    
    setHoverState(prev => {
      const newSelectedBlocks = [...prev.selectedBlocks];
      const blockKey = `${clickedTime.hour}:${clickedTime.minute}`;
      
      // Check if block is already selected
      const existingIndex = newSelectedBlocks.findIndex(
        block => `${block.hour}:${block.minute}` === blockKey
      );
      
      if (existingIndex >= 0) {
        // Remove block if already selected
        newSelectedBlocks.splice(existingIndex, 1);
      } else {
        // Add block if not selected
        newSelectedBlocks.push(clickedTime);
      }
      
      // Sort blocks by time
      newSelectedBlocks.sort((a, b) => {
        const aMinutes = a.hour * 60 + a.minute;
        const bMinutes = b.hour * 60 + b.minute;
        return aMinutes - bMinutes;
      });
      
      onBlockSelect?.(newSelectedBlocks);
      
      return {
        ...prev,
        selectedBlocks: newSelectedBlocks,
        isSelecting: newSelectedBlocks.length > 0
      };
    });
  }, [getTimeFromPosition, onBlockSelect]);

  // Handle double click to complete selection
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (isModalOpenRef.current) return;

    // Don't complete if clicking on an event card
    if ((e.target as HTMLElement).closest('.event-card')) {
      return;
    }

    setHoverState(prev => {
      if (prev.selectedBlocks.length >= 2) {
        const startTime = prev.selectedBlocks[0];
        const endTime = prev.selectedBlocks[prev.selectedBlocks.length - 1];
        
        // Add 15 minutes to end time to make it inclusive
        const endMinutes = endTime.hour * 60 + endTime.minute + 15;
        const adjustedEndTime = {
          hour: Math.floor(endMinutes / 60),
          minute: endMinutes % 60
        };
        
        onSelectionComplete?.(startTime, adjustedEndTime);
        
        return {
          ...prev,
          selectedBlocks: [],
          isSelecting: false
        };
      }
      return prev;
    });
  }, [onSelectionComplete]);

  const setModalOpen = useCallback((isOpen: boolean) => {
    isModalOpenRef.current = isOpen;
  }, []);

  return {
    hoverState,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      onDoubleClick: handleDoubleClick
    },
    setModalOpen
  };
}; 