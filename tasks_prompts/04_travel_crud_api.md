# Task 2.1: Travel CRUD API

## Task Overview
**Estimated Time:** 3-4 hours  
**Priority:** High  
**Dependencies:** Task 1.3

**Description:** Implement the complete CRUD API for travels with soft delete support.

## AI Implementation Prompts

### Prompt 1: Create Travel Routes Structure
```
Create the travel routes structure:

1. Create server/routes/travels.js with:
   - Express Router setup
   - Import database connection
   - Import validation middleware
   - Import error handling utilities

2. Set up route structure:
   - GET / - List all active travels
   - GET /deleted - List deleted travels
   - POST / - Create new travel
   - GET /:id - Get single travel
   - PUT /:id - Update travel
   - DELETE /:id - Soft delete travel
   - POST /:id/restore - Restore deleted travel

3. Implement proper HTTP status codes
4. Add request logging for debugging
5. Ensure routes are properly exported
```

### Prompt 2: Implement GET /api/travels (List Active Travels)
```
Implement the endpoint to list all active travels:

1. Create GET / endpoint that:
   - Queries database for travels where is_deleted = 0
   - Orders results by created_at DESC
   - Includes pagination support (limit/offset)
   - Supports basic filtering (title, destination, date range)
   - Returns proper JSON response format

2. Response format:
   ```json
   {
     "success": true,
     "data": [
       {
         "id": 1,
         "title": "Paris Trip",
         "description": "Weekend getaway",
         "start_date": "2024-06-15",
         "end_date": "2024-06-17",
         "destination": "Paris, France",
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

3. Add error handling for database failures
4. Include input validation for query parameters
5. Test with sample data
```

### Prompt 3: Implement GET /api/travels/deleted (List Deleted Travels)
```
Implement the endpoint to list deleted travels:

1. Create GET /deleted endpoint that:
   - Queries database for travels where is_deleted = 1
   - Orders results by deleted_at DESC
   - Includes pagination support
   - Shows deletion timestamp and reason (if available)
   - Returns proper JSON response format

2. Response format:
   ```json
   {
     "success": true,
     "data": [
       {
         "id": 2,
         "title": "Deleted Trip",
         "description": "Cancelled trip",
         "start_date": "2024-07-01",
         "end_date": "2024-07-05",
         "destination": "London, UK",
         "is_deleted": 1,
         "deleted_at": "2024-01-16T15:30:00Z",
         "created_at": "2024-01-10T09:00:00Z"
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

### Prompt 4: Implement POST /api/travels (Create Travel)
```
Implement the endpoint to create new travels:

1. Create POST / endpoint that:
   - Validates required fields (title, start_date, end_date)
   - Validates date formats (ISO strings)
   - Ensures start_date < end_date
   - Sanitizes input data
   - Inserts new travel into database
   - Returns created travel with ID

2. Request validation:
   - title: required, string, max 255 chars
   - description: optional, string, max 1000 chars
   - start_date: required, valid ISO date
   - end_date: required, valid ISO date, after start_date
   - destination: optional, string, max 255 chars

3. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 3,
       "title": "New Trip",
       "description": "Adventure time",
       "start_date": "2024-08-01",
       "end_date": "2024-08-07",
       "destination": "Tokyo, Japan",
       "created_at": "2024-01-17T11:00:00Z",
       "updated_at": "2024-01-17T11:00:00Z"
     },
     "message": "Travel created successfully"
   }
   ```

4. Add proper error handling for validation failures
5. Include database transaction support
6. Test with valid and invalid data
```

### Prompt 5: Implement GET /api/travels/:id (Get Single Travel)
```
Implement the endpoint to get a single travel:

1. Create GET /:id endpoint that:
   - Validates travel ID parameter
   - Queries database for travel with given ID
   - Returns 404 if travel not found
   - Returns 410 if travel is soft deleted
   - Includes related events count
   - Returns proper JSON response format

2. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 1,
       "title": "Paris Trip",
       "description": "Weekend getaway",
       "start_date": "2024-06-15",
       "end_date": "2024-06-17",
       "destination": "Paris, France",
       "events_count": 7,
       "created_at": "2024-01-15T10:00:00Z",
       "updated_at": "2024-01-15T10:00:00Z"
     }
   }
   ```

3. Add proper error handling:
   - Invalid ID format
   - Travel not found
   - Soft deleted travel
   - Database errors

4. Include related data if requested
5. Test with existing and non-existing IDs
```

### Prompt 6: Implement PUT /api/travels/:id (Update Travel)
```
Implement the endpoint to update travels:

1. Create PUT /:id endpoint that:
   - Validates travel ID parameter
   - Checks if travel exists and is not deleted
   - Validates update data
   - Updates only provided fields
   - Updates updated_at timestamp
   - Returns updated travel

2. Request validation:
   - title: optional, string, max 255 chars
   - description: optional, string, max 1000 chars
   - start_date: optional, valid ISO date
   - end_date: optional, valid ISO date
   - destination: optional, string, max 255 chars
   - Ensure start_date < end_date if both provided

3. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 1,
       "title": "Updated Paris Trip",
       "description": "Extended weekend getaway",
       "start_date": "2024-06-15",
       "end_date": "2024-06-18",
       "destination": "Paris, France",
       "created_at": "2024-01-15T10:00:00Z",
       "updated_at": "2024-01-17T14:30:00Z"
     },
     "message": "Travel updated successfully"
   }
   ```

4. Add proper error handling
5. Include partial update support
6. Test with various update scenarios
```

### Prompt 7: Implement DELETE /api/travels/:id (Soft Delete)
```
Implement the endpoint to soft delete travels:

1. Create DELETE /:id endpoint that:
   - Validates travel ID parameter
   - Checks if travel exists and is not already deleted
   - Sets is_deleted = 1
   - Sets deleted_at = current timestamp
   - Updates updated_at timestamp
   - Returns success message with deletion timestamp

2. Soft delete logic:
   - Update travels table
   - Set is_deleted = 1
   - Set deleted_at = NOW()
   - Set updated_at = NOW()
   - Don't actually delete the record

3. Response format:
   ```json
   {
     "success": true,
     "message": "Travel soft deleted successfully",
     "deletedAt": "2024-01-17T16:45:00Z"
   }
   ```

4. Add proper error handling:
   - Invalid ID format
   - Travel not found
   - Already deleted travel
   - Database errors

5. Test soft delete functionality
6. Verify record still exists in database
```

### Prompt 8: Implement POST /api/travels/:id/restore (Restore Travel)
```
Implement the endpoint to restore deleted travels:

1. Create POST /:id/restore endpoint that:
   - Validates travel ID parameter
   - Checks if travel exists and is deleted
   - Sets is_deleted = 0
   - Clears deleted_at timestamp
   - Updates updated_at timestamp
   - Returns restored travel

2. Restore logic:
   - Update travels table
   - Set is_deleted = 0
   - Set deleted_at = NULL
   - Set updated_at = NOW()

3. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 2,
       "title": "Restored Trip",
       "description": "Back from deletion",
       "start_date": "2024-07-01",
       "end_date": "2024-07-05",
       "destination": "London, UK",
       "created_at": "2024-01-10T09:00:00Z",
       "updated_at": "2024-01-17T17:00:00Z"
     },
     "message": "Travel restored successfully"
   }
   ```

4. Add proper error handling:
   - Invalid ID format
   - Travel not found
   - Travel not deleted
   - Database errors

5. Test restore functionality
6. Verify record is active again
```

### Prompt 9: Add Validation and Error Handling
```
Enhance the travel routes with proper validation and error handling:

1. Create validation middleware:
   - Required field validation
   - Date format validation
   - Date range validation
   - String length validation
   - Input sanitization

2. Create error handling:
   - Validation errors (400)
   - Not found errors (404)
   - Gone errors (410) for deleted items
   - Database errors (500)
   - Proper error messages

3. Add request logging:
   - Request method and URL
   - Request body
   - Response status
   - Response time
   - Error details

4. Test all error scenarios
5. Ensure consistent error response format
```

### Prompt 10: Create Tests for Travel Routes
```
Create comprehensive tests for travel routes:

1. Create server/tests/routes/travels.test.js with:
   - Test database setup
   - Test data initialization
   - Route testing utilities

2. Test all endpoints:
   - GET / - list active travels
   - GET /deleted - list deleted travels
   - POST / - create travel
   - GET /:id - get single travel
   - PUT /:id - update travel
   - DELETE /:id - soft delete travel
   - POST /:id/restore - restore travel

3. Test error scenarios:
   - Invalid input data
   - Missing required fields
   - Non-existent IDs
   - Database errors
   - Validation failures

4. Test soft delete functionality:
   - Verify records are marked deleted
   - Verify records can be restored
   - Verify deleted records don't appear in active list

5. Run all tests and ensure they pass
```

## Acceptance Criteria Checklist
- [ ] Create `server/routes/travels.js` with all CRUD endpoints
- [ ] Implement GET `/api/travels` (active travels only)
- [ ] Implement GET `/api/travels/deleted` (deleted travels)
- [ ] Implement POST `/api/travels` (create travel)
- [ ] Implement GET `/api/travels/:id` (get single travel)
- [ ] Implement PUT `/api/travels/:id` (update travel)
- [ ] Implement DELETE `/api/travels/:id` (soft delete)
- [ ] Implement POST `/api/travels/:id/restore` (restore deleted travel)
- [ ] Add proper error handling and validation
- [ ] Include soft delete logic with timestamps

## Files to Create/Modify
- `server/routes/travels.js`
- `server/middleware/validation.js` (basic validation)
- `server/tests/routes/travels.test.js` (basic tests)
- `server/middleware/errorHandler.js` (extend if needed)

## Important Notes
- **Ensure event format matches existing calendar requirements**
- **Test soft delete functionality thoroughly**
- **Include proper validation for all inputs**
- **Add comprehensive error handling**
- **Test all endpoints with various scenarios**
- **Include pagination for list endpoints**
- **Add request logging for debugging**
- **Ensure consistent response format**
