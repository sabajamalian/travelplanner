# Task 3.1: API Service Layer

## Task Overview
**Estimated Time:** 2-3 hours  
**Priority:** High  
**Dependencies:** Task 2.4

**Description:** Create the frontend API service layer for communicating with the backend.

## AI Implementation Prompts

### Prompt 1: Create Base API Configuration
```
Create the base API configuration and setup:

1. Create src/services/api.js with:
   - Base URL configuration for backend API
   - Default headers setup
   - Request/response interceptors
   - Error handling utilities
   - HTTP method implementations

2. Configure base settings:
   - API_BASE_URL: 'http://localhost:3001/api'
   - Default headers: Content-Type, Accept
   - Timeout configuration (30 seconds)
   - Retry logic for failed requests
   - Request logging for debugging

3. Implement base HTTP methods:
   - GET: for retrieving data
   - POST: for creating data
   - PUT: for updating data
   - DELETE: for deleting data
   - PATCH: for partial updates

4. Add request/response interceptors:
   - Add authentication headers (if needed)
   - Handle common error responses
   - Log requests and responses
   - Transform response data

5. Test basic API configuration
```

### Prompt 2: Implement Core HTTP Methods
```
Implement the core HTTP methods with proper error handling:

1. Create GET method implementation:
   - Accept endpoint and query parameters
   - Handle URL encoding for query params
   - Add proper error handling
   - Return parsed JSON response
   - Handle different response statuses

2. Create POST method implementation:
   - Accept endpoint and request body
   - Serialize request body to JSON
   - Add proper error handling
   - Return parsed JSON response
   - Handle validation errors

3. Create PUT method implementation:
   - Accept endpoint and request body
   - Serialize request body to JSON
   - Add proper error handling
   - Return parsed JSON response
   - Handle update conflicts

4. Create DELETE method implementation:
   - Accept endpoint
   - Add proper error handling
   - Return parsed JSON response
   - Handle deletion confirmations

5. Test all HTTP methods with backend
```

### Prompt 3: Add Soft Delete Specific Methods
```
Implement soft delete specific API methods:

1. Create softDelete method:
   - Wrapper around DELETE method
   - Handle soft delete responses
   - Extract deletion timestamp
   - Return consistent response format
   - Handle soft delete errors

2. Create restore method:
   - Wrapper around POST method
   - Handle restore responses
   - Extract restoration confirmation
   - Return consistent response format
   - Handle restore errors

3. Create getDeleted method:
   - Wrapper around GET method
   - Handle deleted items responses
   - Extract soft delete metadata
   - Return consistent response format
   - Handle empty deleted lists

4. Implement response formatting:
   - Standardize success responses
   - Extract data from responses
   - Handle pagination metadata
   - Format error messages

5. Test soft delete methods with backend
```

### Prompt 4: Implement Error Handling
```
Create comprehensive error handling for the API service:

1. Create error handling utilities:
   - Network error detection
   - HTTP status code handling
   - Validation error parsing
   - Server error handling
   - Timeout error handling

2. Implement error response parsing:
   - Extract error messages from responses
   - Handle different error formats
   - Provide user-friendly error messages
   - Log detailed error information
   - Return consistent error objects

3. Add retry logic:
   - Retry failed requests (up to 3 times)
   - Exponential backoff for retries
   - Skip retries for certain error types
   - Log retry attempts
   - Handle retry exhaustion

4. Create error types:
   - NetworkError: connection issues
   - ValidationError: input validation failures
   - ServerError: backend server issues
   - TimeoutError: request timeouts
   - NotFoundError: resource not found

5. Test error handling with various scenarios
```

### Prompt 5: Create API Endpoint Constants
```
Create constants for all API endpoints:

1. Create src/services/endpoints.js with:
   - Travel endpoints
   - Event endpoints
   - Event type endpoints
   - Attachment endpoints
   - Health check endpoints

2. Define endpoint constants:
   ```javascript
   export const TRAVEL_ENDPOINTS = {
     LIST: '/travels',
     LIST_DELETED: '/travels/deleted',
     CREATE: '/travels',
     GET: (id) => `/travels/${id}`,
     UPDATE: (id) => `/travels/${id}`,
     DELETE: (id) => `/travels/${id}`,
     RESTORE: (id) => `/travels/${id}/restore`
   };
   
   export const EVENT_ENDPOINTS = {
     LIST: (travelId) => `/travels/${travelId}/events`,
     LIST_DELETED: (travelId) => `/travels/${travelId}/events/deleted`,
     CREATE: (travelId) => `/travels/${travelId}/events`,
     GET: (id) => `/events/${id}`,
     UPDATE: (id) => `/events/${id}`,
     DELETE: (id) => `/events/${id}`,
     RESTORE: (id) => `/events/${id}/restore`
   };
   ```

3. Add event type endpoints:
   - List active event types
   - List deleted event types
   - Create event type
   - Get single event type
   - Update event type
   - Soft delete event type
   - Restore event type

4. Add attachment endpoints:
   - Upload file for event
   - Get attachment details
   - List event attachments
   - Soft delete attachment
   - Restore attachment

5. Test endpoint constants with API calls
```

### Prompt 6: Add Request/Response Interceptors
```
Implement request and response interceptors:

1. Create request interceptors:
   - Add common headers
   - Add authentication tokens (if needed)
   - Log outgoing requests
   - Add request timestamps
   - Handle request transformations

2. Create response interceptors:
   - Parse JSON responses
   - Handle common response patterns
   - Log incoming responses
   - Add response timestamps
   - Handle response transformations

3. Implement logging:
   - Request method and URL
   - Request headers and body
   - Response status and body
   - Request/response timing
   - Error details

4. Add data transformation:
   - Convert snake_case to camelCase
   - Parse ISO date strings
   - Handle nested objects
   - Transform arrays consistently
   - Normalize response format

5. Test interceptors with various API calls
```

### Prompt 7: Implement Request Caching
```
Add request caching for better performance:

1. Create caching utilities:
   - In-memory cache storage
   - Cache key generation
   - Cache expiration logic
   - Cache invalidation
   - Cache size management

2. Implement cache strategies:
   - GET requests: cache responses
   - POST/PUT/DELETE: invalidate related caches
   - Cache by endpoint and parameters
   - Set appropriate TTL values
   - Handle cache misses gracefully

3. Add cache management:
   - Clear specific caches
   - Clear all caches
   - Cache statistics
   - Cache debugging
   - Memory usage monitoring

4. Implement cache invalidation:
   - Invalidate travel caches on updates
   - Invalidate event caches on changes
   - Invalidate event type caches on updates
   - Smart cache invalidation
   - Partial cache updates

5. Test caching with repeated requests
```

### Prompt 8: Add Request Logging and Debugging
```
Implement comprehensive logging and debugging:

1. Create logging utilities:
   - Request logging
   - Response logging
   - Error logging
   - Performance logging
   - Debug logging

2. Implement debug mode:
   - Enable/disable debug logging
   - Log request details
   - Log response details
   - Log timing information
   - Log error details

3. Add performance monitoring:
   - Request timing
   - Response timing
   - Cache hit rates
   - Error rates
   - Performance metrics

4. Create debugging helpers:
   - Request/response inspection
   - Error stack traces
   - Cache state inspection
   - Network status checking
   - API health checking

5. Test logging and debugging features
```

### Prompt 9: Create API Service Tests
```
Create comprehensive tests for the API service:

1. Create src/tests/services/api.test.js with:
   - Mock backend responses
   - Test HTTP methods
   - Test error handling
   - Test interceptors
   - Test caching

2. Test HTTP methods:
   - GET method functionality
   - POST method functionality
   - PUT method functionality
   - DELETE method functionality
   - Error handling for each method

3. Test soft delete methods:
   - softDelete functionality
   - restore functionality
   - getDeleted functionality
   - Error handling for soft delete operations

4. Test error scenarios:
   - Network errors
   - Validation errors
   - Server errors
   - Timeout errors
   - Retry logic

5. Test caching functionality:
   - Cache storage
   - Cache retrieval
   - Cache invalidation
   - Cache expiration
   - Memory management

6. Run all tests and ensure they pass
```

### Prompt 10: Integrate with Existing Calendar
```
Ensure API service doesn't break existing calendar functionality:

1. Test API service integration:
   - Verify calendar still renders
   - Check event display functionality
   - Test event creation flow
   - Test event editing flow
   - Test event deletion flow

2. Validate API responses:
   - Check response format compatibility
   - Verify data structure matches expectations
   - Test error handling integration
   - Validate loading states
   - Check error state display

3. Test performance:
   - Ensure no performance degradation
   - Check memory usage
   - Validate cache effectiveness
   - Test network request efficiency
   - Monitor response times

4. Verify existing features:
   - Calendar navigation
   - Event interactions
   - Styling and layout
   - User interactions
   - Responsive behavior

5. Document any integration issues
```

## Acceptance Criteria Checklist
- [ ] Create `src/services/api.js` with base API configuration
- [ ] Implement HTTP methods (GET, POST, PUT, DELETE)
- [ ] Add soft delete specific methods (softDelete, restore, getDeleted)
- [ ] Implement proper error handling and response parsing
- [ ] Add request/response interceptors for common headers
- [ ] Create API endpoint constants
- [ ] Add basic request logging for debugging
- [ ] Ensure API service doesn't break existing calendar functionality

## Files to Create/Modify
- `src/services/api.js`
- `src/services/endpoints.js`
- `src/services/errorHandler.js`
- `src/tests/services/api.test.js`

## Important Notes
- **Ensure API service doesn't break existing calendar functionality**
- **Test thoroughly with backend endpoints**
- **Include proper error handling for all scenarios**
- **Add request logging for debugging**
- **Implement caching for better performance**
- **Handle all HTTP status codes properly**
- **Add retry logic for failed requests**
- **Include comprehensive testing**
- **Validate response format compatibility**
- **Monitor performance impact**
