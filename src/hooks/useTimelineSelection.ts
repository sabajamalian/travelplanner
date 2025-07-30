import { useState, useCallback, useRef } from 'react';

interface TimeBlock {
  hour: number;
  minute: number;
}

interface SelectionState {
  selectedBlocks: TimeBlock[];
  hoverBlock: TimeBlock | null;
}

interface UseTimelineSelectionProps {
  onSelectionChange?: (blocks: TimeBlock[]) => void;
  onSelectionComplete?: (startTime: TimeBlock, endTime: TimeBlock) => void;
}

export const useTimelineSelection = ({
  onSelectionChange,
  onSelectionComplete
}: UseTimelineSelectionProps) => {
  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedBlocks: [],
    hoverBlock: null
  });

  const isModalOpenRef = useRef(false);

  // Convert mouse position to 15-minute time block
  const getTimeBlockFromPosition = useCallback((clientY: number, containerRect: DOMRect, scrollTop: number): TimeBlock => {
    const relativeY = clientY - containerRect.top + scrollTop;
    const adjustedY = relativeY - 16; // Account for padding
    
    // Each 15-minute block is 12px high (48px per hour ÷ 4)
    const blockIndex = Math.floor(adjustedY / 12);
    const hour = Math.floor(blockIndex / 4);
    const minute = (blockIndex % 4) * 15;
    
    return {
      hour: Math.max(0, Math.min(23, hour)),
      minute
    };
  }, []);

  // Handle mouse move for hover
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isModalOpenRef.current) return;

    // Don't update hover if over event cards
    if ((e.target as HTMLElement).closest('.event-card')) {
      setSelectionState(prev => ({ ...prev, hoverBlock: null }));
      return;
    }

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    
    const timeBlock = getTimeBlockFromPosition(e.clientY, rect, scrollTop);
    setSelectionState(prev => ({ ...prev, hoverBlock: timeBlock }));
  }, [getTimeBlockFromPosition]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setSelectionState(prev => ({ ...prev, hoverBlock: null }));
  }, []);

  // Handle click to immediately create 15-minute event
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isModalOpenRef.current) return;

    // Don't create event if clicking on event cards
    if ((e.target as HTMLElement).closest('.event-card')) {
      return;
    }

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    
    const clickedBlock = getTimeBlockFromPosition(e.clientY, rect, scrollTop);
    
    // Calculate end time (15 minutes later)
    const endMinutes = clickedBlock.hour * 60 + clickedBlock.minute + 15;
    const endBlock = {
      hour: Math.floor(endMinutes / 60),
      minute: endMinutes % 60
    };
    
    // Immediately complete selection with 15-minute duration
    onSelectionComplete?.(clickedBlock, endBlock);
  }, [getTimeBlockFromPosition, onSelectionComplete]);



  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectionState(prev => ({
      ...prev,
      selectedBlocks: []
    }));
  }, []);

  // Set modal open state
  const setModalOpen = useCallback((isOpen: boolean) => {
    isModalOpenRef.current = isOpen;
  }, []);

  return {
    selectionState,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick
    },
    clearSelection,
    setModalOpen
  };
}; 