/**
 * Custom Hook for Calendar Events Management
 * Handles events state, loading states, and CRUD operations
 */

import { useState, useEffect, useCallback } from 'react';
import {
  loadEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  loadEventTypes,
  loadTravels,
  loadDeletedEvents,
  restoreEvent,
} from '../services/calendarService';

export const useCalendarEvents = (selectedTravelId) => {
  // State management
  const [events, setEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [travels, setTravels] = useState([]);
  const [deletedEvents, setDeletedEvents] = useState([]);
  
  // Loading states
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingEventTypes, setIsLoadingEventTypes] = useState(false);
  const [isLoadingTravels, setIsLoadingTravels] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  
  // Error states
  const [eventsError, setEventsError] = useState(null);
  const [eventTypesError, setEventTypesError] = useState(null);
  const [travelsError, setTravelsError] = useState(null);
  const [operationError, setOperationError] = useState(null);

  // Load events when travel changes
  useEffect(() => {
    if (selectedTravelId) {
      loadEventsForTravel(selectedTravelId);
    } else {
      setEvents([]);
      setDeletedEvents([]);
    }
  }, [selectedTravelId]);

  // Load event types on component mount
  useEffect(() => {
    loadEventTypesData();
  }, []);

  // Load travels on component mount
  useEffect(() => {
    loadTravelsData();
  }, []);

  /**
   * Load events for a specific travel
   */
  const loadEventsForTravel = useCallback(async (travelId) => {
    if (!travelId) return;

    setIsLoadingEvents(true);
    setEventsError(null);

    try {
      console.log('Loading events for travel ID:', travelId);
      const eventsData = await loadEvents(travelId);
      console.log('Events loaded:', eventsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to load events:', error);
      setEventsError(error.message);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  /**
   * Load event types data
   */
  const loadEventTypesData = useCallback(async () => {
    setIsLoadingEventTypes(true);
    setEventTypesError(null);

    try {
      const eventTypesData = await loadEventTypes();
      setEventTypes(eventTypesData);
    } catch (error) {
      setEventTypesError(error.message);
      console.error('Failed to load event types:', error);
    } finally {
      setIsLoadingEventTypes(false);
    }
  }, []);

  /**
   * Load travels data
   */
  const loadTravelsData = useCallback(async () => {
    setIsLoadingTravels(true);
    setTravelsError(null);

    try {
      const travelsData = await loadTravels();
      setTravels(travelsData);
    } catch (error) {
      setTravelsError(error.message);
      console.error('Failed to load travels:', error);
    } finally {
      setIsLoadingTravels(false);
    }
  }, []);

  /**
   * Load deleted events for a specific travel
   */
  const loadDeletedEventsForTravel = useCallback(async (travelId) => {
    if (!travelId) return;

    try {
      const deletedEventsData = await loadDeletedEvents(travelId);
      setDeletedEvents(deletedEventsData);
    } catch (error) {
      console.error('Failed to load deleted events:', error);
    }
  }, []);

  /**
   * Create a new event
   */
  const createNewEvent = useCallback(async (eventData) => {
    if (!selectedTravelId) {
      throw new Error('No travel selected');
    }

    setIsCreatingEvent(true);
    setOperationError(null);

    try {
      const newEvent = await createEvent(eventData, selectedTravelId);
      
      // Optimistic update
      setEvents(prevEvents => [...prevEvents, newEvent]);
      
      return newEvent;
    } catch (error) {
      setOperationError(error.message);
      console.error('Failed to create event:', error);
      throw error;
    } finally {
      setIsCreatingEvent(false);
    }
  }, [selectedTravelId]);

  /**
   * Update an existing event
   */
  const updateExistingEvent = useCallback(async (eventId, eventData) => {
    setIsUpdatingEvent(true);
    setOperationError(null);

    try {
      const updatedEvent = await updateEvent(eventId, eventData);
      
      // Optimistic update
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId ? updatedEvent : event
        )
      );
      
      return updatedEvent;
    } catch (error) {
      setOperationError(error.message);
      console.error('Failed to update event:', error);
      throw error;
    } finally {
      setIsUpdatingEvent(false);
    }
  }, []);

  /**
   * Delete an event
   */
  const deleteExistingEvent = useCallback(async (eventId) => {
    setIsDeletingEvent(true);
    setOperationError(null);

    try {
      await deleteEvent(eventId);
      
      // Optimistic update
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      
      // Refresh deleted events list
      if (selectedTravelId) {
        loadDeletedEventsForTravel(selectedTravelId);
      }
      
      return true;
    } catch (error) {
      setOperationError(error.message);
      console.error('Failed to delete event:', error);
      throw error;
    } finally {
      setIsDeletingEvent(false);
    }
  }, [selectedTravelId, loadDeletedEventsForTravel]);

  /**
   * Restore a deleted event
   */
  const restoreDeletedEvent = useCallback(async (eventId) => {
    try {
      const restoredEvent = await restoreEvent(eventId);
      
      // Add back to events list
      setEvents(prevEvents => [...prevEvents, restoredEvent]);
      
      // Remove from deleted events list
      setDeletedEvents(prevDeleted => 
        prevDeleted.filter(event => event.id !== eventId)
      );
      
      return restoredEvent;
    } catch (error) {
      setOperationError(error.message);
      console.error('Failed to restore event:', error);
      throw error;
    }
  }, []);

  /**
   * Refresh events data
   */
  const refreshEvents = useCallback(() => {
    if (selectedTravelId) {
      loadEventsForTravel(selectedTravelId);
    }
  }, [selectedTravelId, loadEventsForTravel]);

  /**
   * Clear operation errors
   */
  const clearOperationError = useCallback(() => {
    setOperationError(null);
  }, []);

  /**
   * Get event type by ID
   */
  const getEventTypeById = useCallback((eventTypeId) => {
    return eventTypes.find(type => type.id === eventTypeId);
  }, [eventTypes]);

  /**
   * Get travel by ID
   */
  const getTravelById = useCallback((travelId) => {
    return travels.find(travel => travel.id === travelId);
  }, [travels]);

  return {
    // State
    events,
    eventTypes,
    travels,
    deletedEvents,
    
    // Loading states
    isLoadingEvents,
    isLoadingEventTypes,
    isLoadingTravels,
    isCreatingEvent,
    isUpdatingEvent,
    isDeletingEvent,
    
    // Error states
    eventsError,
    eventTypesError,
    travelsError,
    operationError,
    
    // Actions
    createNewEvent,
    updateExistingEvent,
    deleteExistingEvent,
    restoreDeletedEvent,
    refreshEvents,
    loadDeletedEventsForTravel,
    clearOperationError,
    
    // Helpers
    getEventTypeById,
    getTravelById,
  };
};
