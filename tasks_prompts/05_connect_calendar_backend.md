# Task 4.1: Connect Existing Calendar to Backend

## Task Overview
**Estimated Time:** 2-3 hours  
**Priority:** High  
**Dependencies:** Task 3.3

**Description:** Connect the existing timeline calendar to the backend API while preserving all current functionality.

## AI Implementation Prompts

### Prompt 1: Analyze Existing Calendar Implementation
```
Analyze the current calendar implementation to understand how to integrate with the backend:

1. Examine the current calendar component:
   - How events are currently stored and managed
   - What data structure is used for events
   - How events are created, edited, and deleted
   - What props and state the calendar uses
   - How the calendar handles date changes

2. Identify integration points:
   - Where to replace hardcoded test events
   - How to load events from the backend
   - How to save events to the backend
   - How to handle loading states
   - How to manage error states

3. Document the current event format:
   - Required fields for events
   - Optional fields and their purposes
   - How events are styled and colored
   - How events are positioned in time slots

4. Preserve all existing functionality while adding backend integration
```

### Prompt 2: Create Calendar Service Layer
```
Create a service layer to handle calendar API communication:

1. Create src/services/calendarService.js with:
   - loadEvents(travelId) - Load events for a specific travel
   - createEvent(eventData) - Create new event
   - updateEvent(eventId, eventData) - Update existing event
   - deleteEvent(eventId) - Delete event
   - loadEventTypes() - Load available event types

2. Implement proper error handling:
   - Network errors
   - Validation errors
   - Server errors
   - Timeout handling

3. Add loading state management:
   - Loading indicators
   - Skeleton loading states
   - Progress tracking for operations

4. Include retry logic for failed requests
5. Add request caching for better performance
6. Ensure all functions return promises
```

### Prompt 3: Create Calendar Events Hook
```
Create a custom hook to manage calendar events:

1. Create src/hooks/useCalendarEvents.js with:
   - events state management
   - loading states for different operations
   - error state management
   - CRUD operations for events
   - Event filtering and search

2. Implement the hook with:
   - useState for events, loading, errors
   - useEffect for initial data loading
   - Functions for create, update, delete
   - Event validation before API calls
   - Optimistic updates for better UX

3. Include proper error handling:
   - Display error messages
   - Retry failed operations
   - Fallback to cached data
   - User-friendly error notifications

4. Add event synchronization:
   - Real-time updates (if needed)
   - Conflict resolution
   - Data consistency checks
```

### Prompt 4: Replace Hardcoded Events with API Calls
```
Replace the hardcoded test events with dynamic API loading:

1. Modify the existing calendar component:
   - Remove hardcoded testEvents array
   - Add useEffect to load events when component mounts
   - Add useEffect to reload events when travel changes
   - Add loading state while events are being fetched

2. Update event loading logic:
   - Load events for the currently selected travel
   - Handle empty travel selection gracefully
   - Show appropriate loading indicators
   - Display "no events" message when appropriate

3. Preserve existing event display:
   - Keep all current styling and colors
   - Maintain event positioning and layout
   - Preserve event interaction patterns
   - Keep existing event tooltips and information

4. Test that events load correctly from the backend
```

### Prompt 5: Integrate Event Creation with Backend
```
Connect the existing event creation functionality to the backend:

1. Modify the existing event creation modal:
   - Keep all current form fields and validation
   - Add travel selection if not already present
   - Connect form submission to backend API
   - Add loading state during submission
   - Handle success and error responses

2. Update event creation flow:
   - Validate event data before submission
   - Show loading indicator during API call
   - Display success message on completion
   - Handle validation errors from backend
   - Refresh events list after successful creation

3. Preserve existing user experience:
   - Keep current modal design and layout
   - Maintain form validation behavior
   - Preserve error message display
   - Keep current form field styling

4. Test event creation end-to-end
```

### Prompt 6: Integrate Event Editing with Backend
```
Connect the existing event editing functionality to the backend:

1. Modify the existing event editing modal:
   - Keep all current form fields and validation
   - Load existing event data from state
   - Connect form submission to backend API
   - Add loading state during submission
   - Handle success and error responses

2. Update event editing flow:
   - Load current event data into form
   - Validate changes before submission
   - Show loading indicator during API call
   - Display success message on completion
   - Handle validation errors from backend
   - Refresh events list after successful update

3. Preserve existing user experience:
   - Keep current modal design and layout
   - Maintain form validation behavior
   - Preserve error message display
   - Keep current form field styling

4. Test event editing end-to-end
```

### Prompt 7: Integrate Event Deletion with Backend
```
Connect the existing event deletion functionality to the backend:

1. Modify the existing event deletion flow:
   - Keep current confirmation dialog
   - Connect deletion to backend API
   - Add loading state during deletion
   - Handle success and error responses
   - Refresh events list after successful deletion

2. Update deletion confirmation:
   - Show loading state during API call
   - Display success message on completion
   - Handle deletion errors gracefully
   - Provide retry options for failed deletions

3. Preserve existing user experience:
   - Keep current confirmation dialog design
   - Maintain deletion confirmation flow
   - Preserve error message display
   - Keep current styling and layout

4. Test event deletion end-to-end
```

### Prompt 8: Add Event Type Integration
```
Integrate event types with the existing calendar:

1. Load event types from backend:
   - Fetch event types when calendar loads
   - Store event types in component state
   - Use event types for event creation and editing
   - Apply event type colors to calendar events

2. Update event styling:
   - Use backend event type colors
   - Maintain existing event appearance
   - Ensure colors work well with current design
   - Add event type icons if supported

3. Enhance event forms:
   - Add event type selection dropdown
   - Show event type colors in selection
   - Validate event type selection
   - Preserve existing form layout

4. Test event type integration
```

### Prompt 9: Handle Calendar State Management
```
Manage calendar state with backend integration:

1. Update calendar state management:
   - Sync events with backend data
   - Handle loading states properly
   - Manage error states gracefully
   - Preserve user selections and preferences

2. Implement optimistic updates:
   - Update UI immediately for better UX
   - Revert changes if API calls fail
   - Show loading states during operations
   - Handle conflicts gracefully

3. Add data synchronization:
   - Refresh events when needed
   - Handle concurrent updates
   - Maintain data consistency
   - Preserve user's current view

4. Test state management thoroughly
```

### Prompt 10: Verify Calendar Functionality
```
After backend integration, verify that all existing calendar features still work:

1. Test basic calendar functionality:
   - Calendar renders correctly
   - Hourly view displays properly
   - Events show in correct time slots
   - Date navigation works as expected

2. Test event interactions:
   - Click to create events still works
   - Event editing functions properly
   - Event deletion works correctly
   - Event styling is preserved

3. Test backend integration:
   - Events load from backend
   - Events save to backend
   - Events update in backend
   - Events delete from backend

4. Test error handling:
   - Network errors are handled gracefully
   - Validation errors are displayed properly
   - Loading states work correctly
   - Fallback behavior is appropriate

5. Ensure no existing functionality is broken
```

## Acceptance Criteria Checklist
- [ ] Replace hardcoded test events with API calls
- [ ] Implement event loading from backend for selected travel
- [ ] Preserve all existing calendar styling and behavior
- [ ] Maintain hourly view and event display
- [ ] Keep existing event creation by clicking on time slots
- [ ] Preserve custom event colors and styling
- [ ] Ensure calendar still shows events in correct time slots
- [ ] Test that all existing PoC features still work

## Files to Create/Modify
- `src/components/calendar/Calendar.jsx` (enhance existing)
- `src/hooks/useCalendarEvents.js` (new)
- `src/services/calendarService.js` (new)
- `src/services/api.js` (extend if needed)

## Important Notes
- **Preserve all existing calendar functionality**
- **Maintain current styling and user experience**
- **Test thoroughly after each integration step**
- **Handle loading and error states gracefully**
- **Ensure events display correctly in time slots**
- **Maintain existing event interaction patterns**
- **Preserve calendar performance and responsiveness**
- **Add backend integration without breaking existing features**
