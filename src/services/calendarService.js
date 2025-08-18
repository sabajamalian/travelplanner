/**
 * Calendar Service Layer
 * Handles all API communication for calendar events and event types
 */

const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make API requests
const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Load events for a specific travel
 * @param {number} travelId - The ID of the travel
 * @returns {Promise<Array>} Array of events
 */
export const loadEvents = async (travelId) => {
  if (!travelId) {
    throw new Error('Travel ID is required');
  }

  try {
    const response = await makeRequest(`/events/travels/${travelId}/events`);
    return response.data || [];
  } catch (error) {
    console.error('Failed to load events:', error);
    throw error;
  }
};

/**
 * Create a new event
 * @param {Object} eventData - Event data to create
 * @param {number} travelId - The ID of the travel
 * @returns {Promise<Object>} Created event
 */
export const createEvent = async (eventData, travelId) => {
  if (!travelId) {
    throw new Error('Travel ID is required');
  }

  try {
    // Transform frontend event format to backend format
    const backendEventData = {
      title: eventData.title,
      description: eventData.description || '',
      event_type_id: getEventTypeId(eventData.type),
      start_datetime: eventData.start.toISOString(),
      end_datetime: eventData.end.toISOString(),
      location: eventData.resource || '',
    };

    const response = await makeRequest(`/events/travels/${travelId}/events`, {
      method: 'POST',
      body: JSON.stringify(backendEventData),
    });

    // Transform backend response to frontend format
    return transformBackendEventToFrontend(response.data);
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
};

/**
 * Update an existing event
 * @param {number} eventId - The ID of the event to update
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object>} Updated event
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    // Transform frontend event format to backend format
    const backendEventData = {
      title: eventData.title,
      description: eventData.description || '',
      event_type_id: getEventTypeId(eventData.type),
      start_datetime: eventData.start.toISOString(),
      end_datetime: eventData.end.toISOString(),
      location: eventData.resource || '',
    };

    const response = await makeRequest(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(backendEventData),
    });

    // Transform backend response to frontend format
    return transformBackendEventToFrontend(response.data);
  } catch (error) {
    console.error('Failed to update event:', error);
    throw error;
  }
};

/**
 * Delete an event
 * @param {number} eventId - The ID of the event to delete
 * @returns {Promise<Object>} Deletion response
 */
export const deleteEvent = async (eventId) => {
  try {
    const response = await makeRequest(`/events/${eventId}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Failed to delete event:', error);
    throw error;
  }
};

/**
 * Load available event types
 * @returns {Promise<Array>} Array of event types
 */
export const loadEventTypes = async () => {
  try {
    const response = await makeRequest('/event-types/');
    return response.data || [];
  } catch (error) {
    console.error('Failed to load event types:', error);
    throw error;
  }
};

/**
 * Load deleted events for a specific travel
 * @param {number} travelId - The ID of the travel
 * @returns {Promise<Array>} Array of deleted events
 */
export const loadDeletedEvents = async (travelId) => {
  if (!travelId) {
    throw new Error('Travel ID is required');
  }

  try {
    const response = await makeRequest(`/events/travels/${travelId}/events/deleted`);
    return response.data || [];
  } catch (error) {
    console.error('Failed to load deleted events:', error);
    throw error;
  }
};

/**
 * Restore a deleted event
 * @param {number} eventId - The ID of the event to restore
 * @returns {Promise<Object>} Restored event
 */
export const restoreEvent = async (eventId) => {
  try {
    const response = await makeRequest(`/events/${eventId}/restore`, {
      method: 'POST',
    });

    // Transform backend response to frontend format
    return transformBackendEventToFrontend(response.data);
  } catch (error) {
    console.error('Failed to restore event:', error);
    throw error;
  }
};

/**
 * Load travels for selection
 * @returns {Promise<Array>} Array of travels
 */
export const loadTravels = async () => {
  try {
    const response = await makeRequest('/travels/');
    return response.data || [];
  } catch (error) {
    console.error('Failed to load travels:', error);
    throw error;
  }
};

// Helper function to get event type ID from frontend type name
const getEventTypeId = (frontendType) => {
  // Map frontend event types to backend event type IDs
  const typeMapping = {
    'Planning': 22, // Business Conference
    'Sightseeing': 10, // Tour
    'Food': 12, // Restaurant
    'Culture': 8, // Museum
    'Shopping': 15, // Shopping
    'Entertainment': 17, // Entertainment
  };
  
  return typeMapping[frontendType] || 22; // Default to Business Conference
};

// Helper function to get frontend type name from backend event type
const getFrontendType = (backendEventType) => {
  // Map backend event type IDs to frontend event types
  const typeMapping = {
    22: 'Planning', // Business Conference
    10: 'Sightseeing', // Tour
    12: 'Food', // Restaurant
    8: 'Culture', // Museum
    15: 'Shopping', // Shopping
    17: 'Entertainment', // Entertainment
  };
  
  return typeMapping[backendEventType] || 'Planning';
};

// Helper function to transform backend event to frontend format
const transformBackendEventToFrontend = (backendEvent) => {
  return {
    id: backendEvent.id,
    title: backendEvent.title,
    start: new Date(backendEvent.start_datetime),
    end: new Date(backendEvent.end_datetime),
    resource: backendEvent.location || '',
    type: getFrontendType(backendEvent.event_type_id),
    description: backendEvent.description || '',
    event_type_id: backendEvent.event_type_id,
    travel_id: backendEvent.travel_id,
  };
};

// Helper function to transform frontend event to backend format
const transformFrontendEventToBackend = (frontendEvent) => {
  return {
    title: frontendEvent.title,
    description: frontendEvent.description || '',
    event_type_id: getEventTypeId(frontendEvent.type),
    start_datetime: frontendEvent.start.toISOString(),
    end_datetime: frontendEvent.end.toISOString(),
    location: frontendEvent.resource || '',
  };
};

// Export transformation helpers for use in other components
export { transformBackendEventToFrontend, transformFrontendEventToBackend };
