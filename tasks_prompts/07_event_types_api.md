# Task 2.3: Event Types API

## Task Overview
**Estimated Time:** 2-3 hours  
**Priority:** Medium  
**Dependencies:** Task 2.2

**Description:** Implement the CRUD API for event types with soft delete support.

## AI Implementation Prompts

### Prompt 1: Create Event Types Routes Structure
```
Create the event types routes structure:

1. Create server/routes/eventTypes.js with:
   - Express Router setup
   - Import database connection
   - Import validation middleware
   - Import error handling utilities

2. Set up route structure:
   - GET / - List all active event types
   - GET /deleted - List deleted event types
   - POST / - Create new event type
   - GET /:id - Get single event type
   - PUT /:id - Update event type
   - DELETE /:id - Soft delete event type
   - POST /:id/restore - Restore deleted event type

3. Implement proper HTTP status codes
4. Add request logging for debugging
5. Ensure routes are properly exported
```

### Prompt 2: Implement GET /api/event-types (List Active Event Types)
```
Implement the endpoint to list all active event types:

1. Create GET / endpoint that:
   - Queries database for event types where is_deleted = 0
   - Orders results by category ASC, then name ASC
   - Includes pagination support (limit/offset)
   - Supports filtering by category
   - Returns proper JSON response format

2. Response format:
   ```json
   {
     "success": true,
     "data": [
       {
         "id": 1,
         "name": "Accommodation",
         "category": "accommodation",
         "color": "#28a745",
         "icon": "🏨",
         "created_at": "2024-01-15T10:00:00Z",
         "updated_at": "2024-01-15T10:00:00Z"
       },
       {
         "id": 2,
         "name": "Transportation",
         "category": "transportation",
         "color": "#17a2b8",
         "icon": "✈️",
         "created_at": "2024-01-15T10:00:00Z",
         "updated_at": "2024-01-15T10:00:00Z"
       }
     ],
     "pagination": {
       "page": 1,
       "limit": 10,
       "total": 2,
       "pages": 1
     }
   }
   ```

3. Add error handling for database failures
4. Include input validation for query parameters
5. Test with sample data
```

### Prompt 3: Implement GET /api/event-types/deleted (List Deleted Event Types)
```
Implement the endpoint to list deleted event types:

1. Create GET /deleted endpoint that:
   - Queries database for event types where is_deleted = 1
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
         "id": 7,
         "name": "Deleted Type",
         "category": "other",
         "color": "#6c757d",
         "icon": "❓",
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

### Prompt 4: Implement POST /api/event-types (Create Event Type)
```
Implement the endpoint to create new event types:

1. Create POST / endpoint that:
   - Validates required fields (name, category, color)
   - Validates color format (hex color)
   - Checks for duplicate names in same category
   - Sanitizes input data
   - Inserts new event type into database
   - Returns created event type with ID

2. Request validation:
   - name: required, string, max 100 chars, unique per category
   - category: required, string, max 50 chars
   - color: required, valid hex color (#RRGGBB)
   - icon: optional, string, max 10 chars (emoji)

3. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 8,
       "name": "Wellness",
       "category": "health",
       "color": "#20c997",
       "icon": "🧘",
       "created_at": "2024-01-17T11:00:00Z",
       "updated_at": "2024-01-17T11:00:00Z"
     },
     "message": "Event type created successfully"
   }
   ```

4. Add proper error handling for validation failures
5. Include duplicate name checking
6. Test with valid and invalid data
```

### Prompt 5: Implement GET /api/event-types/:id (Get Single Event Type)
```
Implement the endpoint to get a single event type:

1. Create GET /:id endpoint that:
   - Validates event type ID parameter
   - Queries database for event type with given ID
   - Returns 404 if event type not found
   - Returns 410 if event type is soft deleted
   - Includes usage count (how many events use this type)
   - Returns proper JSON response format

2. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 1,
       "name": "Accommodation",
       "category": "accommodation",
       "color": "#28a745",
       "icon": "🏨",
       "usage_count": 5,
       "created_at": "2024-01-15T10:00:00Z",
       "updated_at": "2024-01-15T10:00:00Z"
     }
   }
   ```

3. Add proper error handling:
   - Invalid ID format
   - Event type not found
   - Soft deleted event type
   - Database errors

4. Include usage statistics
5. Test with existing and non-existing IDs
```

### Prompt 6: Implement PUT /api/event-types/:id (Update Event Type)
```
Implement the endpoint to update event types:

1. Create PUT /:id endpoint that:
   - Validates event type ID parameter
   - Checks if event type exists and is not deleted
   - Validates update data
   - Updates only provided fields
   - Updates updated_at timestamp
   - Returns updated event type

2. Request validation:
   - name: optional, string, max 100 chars, unique per category
   - category: optional, string, max 50 chars
   - color: optional, valid hex color
   - icon: optional, string, max 10 chars

3. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 1,
       "name": "Updated Accommodation",
       "category": "accommodation",
       "color": "#28a745",
       "icon": "🏨",
       "created_at": "2024-01-15T10:00:00Z",
       "updated_at": "2024-01-17T14:30:00Z"
     },
     "message": "Event type updated successfully"
   }
   ```

4. Add proper error handling
5. Include partial update support
6. Test with various update scenarios
```

### Prompt 7: Implement DELETE /api/event-types/:id (Soft Delete)
```
Implement the endpoint to soft delete event types:

1. Create DELETE /:id endpoint that:
   - Validates event type ID parameter
   - Checks if event type exists and is not already deleted
   - Checks if event type is in use by any events
   - Sets is_deleted = 1
   - Sets deleted_at = current timestamp
   - Updates updated_at timestamp
   - Returns success message with deletion timestamp

2. Soft delete logic:
   - Check if event type is used by any events
   - If in use, return error (cannot delete in-use types)
   - If not in use, mark as deleted
   - Update event_types table
   - Set is_deleted = 1
   - Set deleted_at = NOW()
   - Set updated_at = NOW()

3. Response format:
   ```json
   {
     "success": true,
     "message": "Event type soft deleted successfully",
     "deletedAt": "2024-01-17T16:45:00Z"
   }
   ```

4. Add proper error handling:
   - Invalid ID format
   - Event type not found
   - Already deleted event type
   - Event type in use (cannot delete)
   - Database errors

5. Test soft delete functionality
6. Verify record still exists in database
```

### Prompt 8: Implement POST /api/event-types/:id/restore (Restore Event Type)
```
Implement the endpoint to restore deleted event types:

1. Create POST /:id/restore endpoint that:
   - Validates event type ID parameter
   - Checks if event type exists and is deleted
   - Sets is_deleted = 0
   - Clears deleted_at timestamp
   - Updates updated_at timestamp
   - Returns restored event type

2. Restore logic:
   - Update event_types table
   - Set is_deleted = 0
   - Set deleted_at = NULL
   - Set updated_at = NOW()

3. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 7,
       "name": "Restored Type",
       "category": "other",
       "color": "#6c757d",
       "icon": "❓",
       "created_at": "2024-01-15T10:00:00Z",
       "updated_at": "2024-01-17T17:00:00Z"
     },
     "message": "Event type restored successfully"
   }
   ```

4. Add proper error handling:
   - Invalid ID format
   - Event type not found
   - Event type not deleted
   - Database errors

5. Test restore functionality
6. Verify record is active again
```

### Prompt 9: Add Event Type-Specific Validation
```
Enhance the event type routes with type-specific validation:

1. Create event type validation middleware:
   - Required field validation
   - Color format validation (hex colors)
   - Name uniqueness validation per category
   - Category validation (allowed categories)
   - Icon validation (emoji support)
   - Input sanitization

2. Create event type-specific error handling:
   - Validation errors (400)
   - Not found errors (404)
   - Gone errors (410) for deleted items
   - Conflict errors (409) for duplicate names
   - Database errors (500)
   - Proper error messages

3. Add category validation:
   - Predefined category list
   - Category format validation
   - Category-specific rules
   - Custom category support

4. Test all validation scenarios
5. Ensure consistent error response format
```

### Prompt 10: Create Tests for Event Type Routes
```
Create comprehensive tests for event type routes:

1. Create server/tests/routes/eventTypes.test.js with:
   - Test database setup
   - Test data initialization
   - Route testing utilities

2. Test all endpoints:
   - GET / - list active event types
   - GET /deleted - list deleted event types
   - POST / - create event type
   - GET /:id - get single event type
   - PUT /:id - update event type
   - DELETE /:id - soft delete event type
   - POST /:id/restore - restore event type

3. Test error scenarios:
   - Invalid input data
   - Missing required fields
   - Non-existent IDs
   - Database errors
   - Validation failures
   - Duplicate names
   - In-use event types

4. Test soft delete functionality:
   - Verify records are marked deleted
   - Verify records can be restored
   - Verify deleted records don't appear in active list
   - Test deletion of in-use types

5. Test event type-specific features:
   - Color validation
   - Category validation
   - Name uniqueness
   - Icon support

6. Run all tests and ensure they pass
```

## Acceptance Criteria Checklist
- [ ] Create `server/routes/eventTypes.js` with all CRUD endpoints
- [ ] Implement GET `/api/event-types` (active event types)
- [ ] Implement GET `/api/event-types/deleted` (deleted event types)
- [ ] Implement POST `/api/event-types` (create event type)
- [ ] Implement PUT `/api/event-types/:id` (update event type)
- [ ] Implement DELETE `/api/event-types/:id` (soft delete)
- [ ] Implement POST `/api/event-types/:id/restore` (restore deleted event type)
- [ ] Add proper error handling and validation
- [ ] Ensure event types include colors/icons for existing calendar styling

## Files to Create/Modify
- `server/routes/eventTypes.js`
- `server/tests/routes/eventTypes.test.js`
- `server/middleware/eventTypeValidation.js` (new)

## Important Notes
- **Ensure event types include colors/icons for existing calendar styling**
- **Test soft delete functionality thoroughly**
- **Include proper validation for all inputs**
- **Add comprehensive error handling**
- **Test all endpoints with various scenarios**
- **Include pagination for list endpoints**
- **Add request logging for debugging**
- **Ensure consistent response format**
- **Validate color formats (hex colors)**
- **Check for duplicate names per category**
- **Prevent deletion of in-use event types**
