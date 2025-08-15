# Task 2.4: File Upload API

## Task Overview
**Estimated Time:** 3-4 hours  
**Priority:** Medium  
**Dependencies:** Task 2.3

**Description:** Implement file upload functionality for event attachments.

## AI Implementation Prompts

### Prompt 1: Create File Upload Routes Structure
```
Create the file upload routes structure:

1. Create server/routes/attachments.js with:
   - Express Router setup
   - Import database connection
   - Import multer middleware for file handling
   - Import validation middleware
   - Import error handling utilities

2. Set up route structure:
   - POST /events/:id/attachments - Upload file for event
   - GET /attachments/:id - Get attachment details
   - DELETE /attachments/:id - Soft delete attachment
   - POST /attachments/:id/restore - Restore deleted attachment
   - GET /events/:id/attachments - List attachments for event

3. Implement proper HTTP status codes
4. Add request logging for debugging
5. Ensure routes are properly exported
```

### Prompt 2: Set Up File Upload Middleware
```
Set up multer middleware for file handling:

1. Create server/middleware/upload.js with:
   - Multer configuration for file uploads
   - File size limits (e.g., 10MB max)
   - File type filtering (images, documents, etc.)
   - File naming strategy (unique names)
   - Storage configuration (local file system)

2. Configure multer with:
   - dest: './uploads/' directory
   - fileFilter: allowed file types
   - limits: file size restrictions
   - filename: custom naming function
   - preserveExtension: true

3. Set up file type validation:
   - Images: jpg, jpeg, png, gif, webp
   - Documents: pdf, doc, docx, txt
   - Archives: zip, rar, 7z
   - Reject unsafe file types

4. Create uploads directory if it doesn't exist
5. Test file upload functionality
```

### Prompt 3: Implement POST /api/events/:id/attachments (Upload File)
```
Implement the endpoint to upload files for events:

1. Create POST /events/:id/attachments endpoint that:
   - Validates event ID parameter
   - Checks if event exists and is not deleted
   - Handles file upload using multer
   - Validates file type and size
   - Generates unique filename
   - Saves file metadata to database
   - Returns attachment information

2. Request handling:
   - Accept multipart/form-data
   - Validate file presence
   - Check file size limits
   - Validate file type
   - Generate unique filename
   - Save file to uploads directory

3. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 1,
       "event_id": 1,
       "file_name": "original_name.jpg",
       "file_path": "uploads/unique_filename.jpg",
       "file_type": "image/jpeg",
       "file_size": 1024000,
       "created_at": "2024-01-17T11:00:00Z"
     },
     "message": "File uploaded successfully"
   }
   ```

4. Add proper error handling for:
   - Invalid event ID
   - Event not found
   - File too large
   - Invalid file type
   - Upload failures

5. Test file upload with various file types
```

### Prompt 4: Implement GET /api/attachments/:id (Get Attachment Details)
```
Implement the endpoint to get attachment details:

1. Create GET /attachments/:id endpoint that:
   - Validates attachment ID parameter
   - Queries database for attachment with given ID
   - Returns 404 if attachment not found
   - Returns 410 if attachment is soft deleted
   - Includes file metadata and event information
   - Returns proper JSON response format

2. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 1,
       "event_id": 1,
       "event_title": "Flight to Paris",
       "file_name": "original_name.jpg",
       "file_path": "uploads/unique_filename.jpg",
       "file_type": "image/jpeg",
       "file_size": 1024000,
       "created_at": "2024-01-17T11:00:00Z",
       "updated_at": "2024-01-17T11:00:00Z"
     }
   }
   ```

3. Add proper error handling:
   - Invalid ID format
   - Attachment not found
   - Soft deleted attachment
   - Database errors

4. Include related event information
5. Test with existing and non-existing IDs
```

### Prompt 5: Implement GET /api/events/:id/attachments (List Event Attachments)
```
Implement the endpoint to list attachments for an event:

1. Create GET /events/:id/attachments endpoint that:
   - Validates event ID parameter
   - Checks if event exists and is not deleted
   - Queries database for attachments where event_id = :id AND is_deleted = 0
   - Orders results by created_at DESC
   - Includes pagination support
   - Returns proper JSON response format

2. Response format:
   ```json
   {
     "success": true,
     "data": [
       {
         "id": 1,
         "event_id": 1,
         "file_name": "boarding_pass.pdf",
         "file_path": "uploads/unique_filename.pdf",
         "file_type": "application/pdf",
         "file_size": 512000,
         "created_at": "2024-01-17T11:00:00Z"
       },
       {
         "id": 2,
         "event_id": 1,
         "file_name": "hotel_confirmation.jpg",
         "file_path": "uploads/unique_filename2.jpg",
         "file_type": "image/jpeg",
         "file_size": 1024000,
         "created_at": "2024-01-17T12:00:00Z"
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

3. Add error handling for:
   - Invalid event ID
   - Event not found
   - Event is deleted
   - Database failures

4. Include input validation for query parameters
5. Test with sample data
```

### Prompt 6: Implement DELETE /api/attachments/:id (Soft Delete)
```
Implement the endpoint to soft delete attachments:

1. Create DELETE /attachments/:id endpoint that:
   - Validates attachment ID parameter
   - Checks if attachment exists and is not already deleted
   - Sets is_deleted = 1
   - Sets deleted_at = current timestamp
   - Updates updated_at timestamp
   - Returns success message with deletion timestamp

2. Soft delete logic:
   - Update event_attachments table
   - Set is_deleted = 1
   - Set deleted_at = NOW()
   - Set updated_at = NOW()
   - Don't actually delete the file from disk

3. Response format:
   ```json
   {
     "success": true,
     "message": "Attachment soft deleted successfully",
     "deletedAt": "2024-01-17T16:45:00Z"
   }
   ```

4. Add proper error handling:
   - Invalid ID format
   - Attachment not found
   - Already deleted attachment
   - Database errors

5. Test soft delete functionality
6. Verify record still exists in database
```

### Prompt 7: Implement POST /api/attachments/:id/restore (Restore Attachment)
```
Implement the endpoint to restore deleted attachments:

1. Create POST /attachments/:id/restore endpoint that:
   - Validates attachment ID parameter
   - Checks if attachment exists and is deleted
   - Sets is_deleted = 0
   - Clears deleted_at timestamp
   - Updates updated_at timestamp
   - Returns restored attachment

2. Restore logic:
   - Update event_attachments table
   - Set is_deleted = 0
   - Set deleted_at = NULL
   - Set updated_at = NOW()

3. Response format:
   ```json
   {
     "success": true,
     "data": {
       "id": 1,
       "event_id": 1,
       "file_name": "restored_file.pdf",
       "file_path": "uploads/unique_filename.pdf",
       "file_type": "application/pdf",
       "file_size": 512000,
       "created_at": "2024-01-17T11:00:00Z",
       "updated_at": "2024-01-17T17:00:00Z"
     },
     "message": "Attachment restored successfully"
   }
   ```

4. Add proper error handling:
   - Invalid ID format
   - Attachment not found
   - Attachment not deleted
   - Database errors

5. Test restore functionality
6. Verify record is active again
```

### Prompt 8: Add File Management Utilities
```
Create file management utilities:

1. Create server/utils/fileManager.js with:
   - File cleanup functions
   - File validation utilities
   - File naming functions
   - File type detection
   - File size formatting

2. Implement file cleanup:
   - Remove orphaned files
   - Clean up deleted attachments
   - Validate file integrity
   - Handle file system errors

3. Create file validation:
   - File type checking
   - File size validation
   - File name sanitization
   - Security checks

4. Add file utilities:
   - Generate unique filenames
   - Format file sizes
   - Get file extensions
   - Validate file paths

5. Test all utility functions
```

### Prompt 9: Add File Upload Validation
```
Enhance the file upload routes with proper validation:

1. Create file upload validation middleware:
   - File presence validation
   - File size validation
   - File type validation
   - File name validation
   - Security validation

2. Create file-specific error handling:
   - Validation errors (400)
   - Not found errors (404)
   - Gone errors (410) for deleted items
   - File too large errors (413)
   - Unsupported file type errors (415)
   - Database errors (500)
   - Proper error messages

3. Add security measures:
   - File type whitelisting
   - File size limits
   - File name sanitization
   - Path traversal prevention
   - Malware scanning (if possible)

4. Test all validation scenarios
5. Ensure consistent error response format
```

### Prompt 10: Create Tests for File Upload Routes
```
Create comprehensive tests for file upload routes:

1. Create server/tests/routes/attachments.test.js with:
   - Test database setup
   - Test file system setup
   - Test data initialization
   - Route testing utilities

2. Test all endpoints:
   - POST /events/:id/attachments - upload file
   - GET /attachments/:id - get attachment details
   - GET /events/:id/attachments - list attachments
   - DELETE /attachments/:id - soft delete attachment
   - POST /attachments/:id/restore - restore attachment

3. Test error scenarios:
   - Invalid input data
   - Missing files
   - File too large
   - Invalid file types
   - Non-existent IDs
   - Database errors
   - File system errors

4. Test file upload functionality:
   - Various file types
   - Different file sizes
   - File naming conflicts
   - Upload directory creation

5. Test soft delete functionality:
   - Verify records are marked deleted
   - Verify records can be restored
   - Verify deleted records don't appear in active list

6. Test file management:
   - File cleanup
   - Orphaned file detection
   - File integrity validation

7. Run all tests and ensure they pass
```

## Acceptance Criteria Checklist
- [ ] Create `server/routes/attachments.js`
- [ ] Implement POST `/api/events/:id/attachments` (upload file)
- [ ] Implement DELETE `/api/attachments/:id` (soft delete)
- [ ] Implement POST `/api/attachments/:id/restore` (restore deleted attachment)
- [ ] Set up file storage directory (`uploads/`)
- [ ] Add file type and size validation
- [ ] Handle file metadata storage in database
- [ ] Implement proper file cleanup for deleted attachments

## Files to Create/Modify
- `server/routes/attachments.js`
- `server/middleware/upload.js` (multer configuration)
- `server/utils/fileManager.js` (file utilities)
- `server/tests/routes/attachments.test.js`
- `uploads/` directory

## Important Notes
- **Set up proper file type validation for security**
- **Implement file size limits to prevent abuse**
- **Use unique filenames to prevent conflicts**
- **Store file metadata in database for tracking**
- **Implement soft delete for file records**
- **Add proper error handling for file operations**
- **Test with various file types and sizes**
- **Include file cleanup utilities**
- **Validate file integrity and security**
- **Handle file system errors gracefully**
