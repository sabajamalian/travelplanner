# Task 2.2: Event CRUD API

## Task Overview
**Estimated Time:** 3-4 hours  
**Priority:** High  
**Dependencies:** Task 2.1

**Description:** Implement the complete CRUD API for events with soft delete support.

## AI Implementation Prompts

### Prompt 1: Create Event Routes Structure
```
Create the event routes structure:

1. Create server/routes/events.js with:
   - Express Router setup
   - Import database connection
   - Import validation middleware
   - Import error handling utilities

2. Set up route structure:
   - GET /travels/:id/events - List active events for travel
   - GET /travels/:id/events/deleted - List deleted events for travel
   - POST /travels/:id/events - Create new event for travel
   - GET /events/:id - Get single event
   - PUT /events/:id - Update event
   - DELETE /events/:id - Soft delete event
   - POST /events/:id/restore - Restore deleted event

3. Implement proper HTTP status codes
4. Add request logging for debugging
5. Ensure routes are properly exported
```

### Prompt 2: Implement GET /api/travels/:id/events (List Active Events)
```
Implement the endpoint to list all active events for a specific travel:

1. Create GET /travels/:id/events endpoint that:
   - Validates travel ID parameter
   - Checks if travel exists and is not deleted
   - Queries database for events where travel_id = :id AND is_deleted = 0
   - Orders results by start_datetime ASC
   - Includes pagination support (limit/offset)
   - Supports filtering by date range, event type, and location
   - Returns proper JSON response format

2. Response format:
   ```json
   {
     "success": true,
     "data": [
       {
         "id": 1,
         "title": "Flight to Paris",
         "description": "Direct flight from London",
         "event_type_id": 2,
         "event_type_name": "Transportation",
         "event_type_color": "#17a2b8",
         "event_type_icon": "✈️",
         "start_datetime": "2024-06-15T08:00:00Z",
         "end_datetime": "2024-06-15T10:00:00Z",
         "location": "Heathrow Airport",
         "created_at": "2024-01-15T10:00:00Z",
         "updated_at": "2024-01-15T10:00:00Z"
       }
     ],
     "pagination": {
       "page": 1,
       "limit": 10,
       "total": 1,
       "pages": 1
     }
   }
   ```

3. Add error handling for:
   - Invalid travel ID
   - Travel not found
   - Travel is deleted
   - Database failures

4. Include input validation for query parameters
5. Test with sample data
```

### Prompt 3: Implement GET /api/travels/:id/events/deleted (List Deleted Events)
```
Implement the endpoint to list deleted events for a specific travel:

1. Create GET /travels/:id/events/deleted endpoint that:
   - Validates travel ID parameter
   - Checks if travel exists
   - Queries database for events where travel_id = :id AND is_deleted = 1
   - Orders results by deleted_at DESC
   - Includes pagination support
   - Shows deletion timestamp
   - Returns proper JSON response format

2. Response format:
   ```json
   {
     "success": true,
     "data": [
       {
         "id": 3,
         "title": "Deleted Event",
         "description": "Cancelled activity",
         "event_type_id": 3,
         "event_type_name": "Activity",
         "event_type_color": "#ffc107",
         "start_datetime": "2024-06-16T14:00:00Z",
         "end_datetime": "2024-06-16T16:00:00Z",
         "location": "Museum",
         "is_deleted": 1,
         "deleted_at": "2024-01-16T15:30:00Z",
         "created_at": "2024-01-15T10:00:00Z"
       }
     ],
     "pagination": {
       "page": 1,
       "limit": 10,
       "total": 1,
       "pages": 1
     }
   }
   ```

3. Add proper error handling
4. Include soft delete metadata
5. Test with deleted sample data
```

### Prompt 4: Implement POST /api/travels/:id/events (Create Event)
```
Implement the endpoint to create new events for a travel:

1. Create POST /travels/:id/events endpoint that:
   - Validates travel ID parameter
   - Checks if travel exists and is not deleted
   - Validates required fields (title, event_type_id, start_datetime, end_datetime)
   - Validates date formats and logic (start < end)
   - Sanitizes input data
   - Inserts new event into database
   - Returns created event with ID

2. Request validation:
   - title: required, string, max 255 chars
   - description: optional, string, max 1000 chars
   - event_type_id: required, valid event type ID
   - start_datetime: required, valid ISO datetime
   - end_datetime: required, valid ISO datetime, after start_datetime
   - location: optional, string, max 255 chars

3. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 4,
       "travel_id": 1,
       "title": "New Event",
       "description": "Exciting activity",
       "event_type_id": 3,
       "start_datetime": "2024-06-17T10:00:00Z",
       "end_datetime": "2024-06-17T12:00:00Z",
       "location": "City Center",
       "created_at": "2024-01-17T11:00:00Z",
       "updated_at": "2024-01-17T11:00:00Z"
     },
     "message": "Event created successfully"
   }
   ```

4. Add proper error handling for validation failures
5. Include database transaction support
6. Test with valid and invalid data
```

### Prompt 5: Implement GET /api/events/:id (Get Single Event)
```
Implement the endpoint to get a single event:

1. Create GET /events/:id endpoint that:
   - Validates event ID parameter
   - Queries database for event with given ID
   - Returns 404 if event not found
   - Returns 410 if event is soft deleted
   - Includes event type information
   - Returns proper JSON response format

2. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 1,
       "travel_id": 1,
       "title": "Flight to Paris",
       "description": "Direct flight from London",
       "event_type_id": 2,
       "event_type_name": "Transportation",
       "event_type_color": "#17a2b8",
       "event_type_icon": "✈️",
       "start_datetime": "2024-06-15T08:00:00Z",
       "end_datetime": "2024-06-15T10:00:00Z",
       "location": "Heathrow Airport",
       "created_at": "2024-01-15T10:00:00Z",
       "updated_at": "2024-01-15T10:00:00Z"
     }
   }
   ```

3. Add proper error handling:
   - Invalid ID format
   - Event not found
   - Soft deleted event
   - Database errors

4. Include related data (event type, travel info)
5. Test with existing and non-existing IDs
```

### Prompt 6: Implement PUT /api/events/:id (Update Event)
```
Implement the endpoint to update events:

1. Create PUT /events/:id endpoint that:
   - Validates event ID parameter
   - Checks if event exists and is not deleted
   - Validates update data
   - Updates only provided fields
   - Updates updated_at timestamp
   - Returns updated event

2. Request validation:
   - title: optional, string, max 255 chars
   - description: optional, string, max 1000 chars
   - event_type_id: optional, valid event type ID
   - start_datetime: optional, valid ISO datetime
   - end_datetime: optional, valid ISO datetime
   - location: optional, string, max 255 chars
   - Ensure start_datetime < end_datetime if both provided

3. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 1,
       "travel_id": 1,
       "title": "Updated Flight to Paris",
       "description": "Direct flight from London",
       "event_type_id": 2,
       "start_datetime": "2024-06-15T09:00:00Z",
       "end_datetime": "2024-06-15T11:00:00Z",
       "location": "Heathrow Airport",
       "created_at": "2024-01-15T10:00:00Z",
       "updated_at": "2024-01-17T14:30:00Z"
     },
     "message": "Event updated successfully"
   }
   ```

4. Add proper error handling
5. Include partial update support
6. Test with various update scenarios
```

### Prompt 7: Implement DELETE /api/events/:id (Soft Delete)
```
Implement the endpoint to soft delete events:

1. Create DELETE /events/:id endpoint that:
   - Validates event ID parameter
   - Checks if event exists and is not already deleted
   - Sets is_deleted = 1
   - Sets deleted_at = current timestamp
   - Updates updated_at timestamp
   - Returns success message with deletion timestamp

2. Soft delete logic:
   - Update events table
   - Set is_deleted = 1
   - Set deleted_at = NOW()
   - Set updated_at = NOW()
   - Don't actually delete the record

3. Response format:
   ```json
   {
     "success": true,
     "message": "Event soft deleted successfully",
     "deletedAt": "2024-01-17T16:45:00Z"
   }
   ```

4. Add proper error handling:
   - Invalid ID format
   - Event not found
   - Already deleted event
   - Database errors

5. Test soft delete functionality
6. Verify record still exists in database
```

### Prompt 8: Implement POST /api/events/:id/restore (Restore Event)
```
Implement the endpoint to restore deleted events:

1. Create POST /events/:id/restore endpoint that:
   - Validates event ID parameter
   - Checks if event exists and is deleted
   - Sets is_deleted = 0
   - Clears deleted_at timestamp
   - Updates updated_at timestamp
   - Returns restored event

2. Restore logic:
   - Update events table
   - Set is_deleted = 0
   - Set deleted_at = NULL
   - Set updated_at = NOW()

3. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 3,
       "travel_id": 1,
       "title": "Restored Event",
       "description": "Back from deletion",
       "event_type_id": 3,
       "start_datetime": "2024-06-16T14:00:00Z",
       "end_datetime": "2024-06-16T16:00:00Z",
       "location": "Museum",
       "created_at": "2024-01-15T10:00:00Z",
       "updated_at": "2024-01-17T17:00:00Z"
     },
     "message": "Event restored successfully"
   }
   ```

4. Add proper error handling:
   - Invalid ID format
   - Event not found
   - Event not deleted
   - Database errors

5. Test restore functionality
6. Verify record is active again
```

### Prompt 9: Add Event-Specific Validation
```
Enhance the event routes with event-specific validation:

1. Create event validation middleware:
   - Required field validation
   - DateTime format validation
   - DateTime logic validation (start < end)
   - Event type validation
   - Travel ID validation
   - Input sanitization

2. Create event-specific error handling:
   - Validation errors (400)
   - Not found errors (404)
   - Gone errors (410) for deleted items
   - Conflict errors (409) for overlapping events
   - Database errors (500)
   - Proper error messages

3. Add event conflict detection:
   - Check for overlapping events in same travel
   - Validate event times don't conflict
   - Provide helpful error messages
   - Allow override if needed

4. Test all validation scenarios
5. Ensure consistent error response format
```

### Prompt 10: Create Tests for Event Routes
```
Create comprehensive tests for event routes:

1. Create server/tests/routes/events.test.js with:
   - Test database setup
   - Test data initialization
   - Route testing utilities

2. Test all endpoints:
   - GET /travels/:id/events - list active events
   - GET /travels/:id/events/deleted - list deleted events
   - POST /travels/:id/events - create event
   - GET /events/:id - get single event
   - PUT /events/:id - update event
   - DELETE /events/:id - soft delete event
   - POST /events/:id/restore - restore event

3. Test error scenarios:
   - Invalid input data
   - Missing required fields
   - Non-existent IDs
   - Database errors
   - Validation failures
   - Event conflicts

4. Test soft delete functionality:
   - Verify records are marked deleted
   - Verify records can be restored
   - Verify deleted records don't appear in active list

5. Test event-specific features:
   - DateTime validation
   - Event type validation
   - Travel relationship validation
   - Conflict detection

6. Run all tests and ensure they pass
```

## Acceptance Criteria Checklist
- [ ] Create `server/routes/events.js` with all CRUD endpoints
- [ ] Implement GET `/api/travels/:id/events` (active events for travel)
- [ ] Implement GET `/api/travels/:id/events/deleted` (deleted events)
- [ ] Implement POST `/api/travels/:id/events` (create event)
- [ ] Implement GET `/api/events/:id` (get single event)
- [ ] Implement PUT `/api/events/:id` (update event)
- [ ] Implement DELETE `/api/events/:id` (soft delete)
- [ ] Implement POST `/api/events/:id/restore` (restore deleted event)
- [ ] Add proper error handling and validation
- [ ] Include soft delete logic with timestamps

## Files to Create/Modify
- `server/routes/events.js`
- `server/middleware/validation.js` (extend validation)
- `server/tests/routes/events.test.js`
- `server/middleware/eventValidation.js` (new)

## Important Notes
- **Ensure event format matches existing calendar requirements**
- **Test soft delete functionality thoroughly**
- **Include proper validation for all inputs**
- **Add comprehensive error handling**
- **Test all endpoints with various scenarios**
- **Include pagination for list endpoints**
- **Add request logging for debugging**
- **Ensure consistent response format**
- **Implement event conflict detection**
- **Validate event type relationships**
