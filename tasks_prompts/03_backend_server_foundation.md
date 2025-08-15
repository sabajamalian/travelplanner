# Task 1.3: Backend Server Foundation

## Task Overview
**Estimated Time:** 2-3 hours  
**Priority:** High  
**Dependencies:** Task 1.2

**Description:** Set up the basic Express.js server with database connection.

## AI Implementation Prompts

### Prompt 1: Create Server Directory Structure
```
Create the backend server directory structure:

1. Create the following directory structure:
   - server/
   - server/routes/
   - server/middleware/
   - server/database/
   - server/tests/
   - server/config/
   - server/utils/
   - server/logs/

2. Create package.json for the server with:
   - name: "travelplanner-server"
   - version: "1.0.0"
   - main: "app.js"
   - scripts: start, dev, test
   - dependencies: express, cors, better-sqlite3, multer
   - devDependencies: nodemon, jest, supertest

3. Ensure server directory is separate from frontend
4. Set up proper .gitignore for server files
```

### Prompt 2: Set Up Express.js Server
```
Create the main Express.js server application:

1. Create server/app.js with:
   - Express.js setup with proper middleware
   - CORS configuration for frontend communication
   - JSON body parsing middleware
   - Static file serving for uploads
   - Basic error handling middleware
   - Request logging middleware
   - Security headers middleware

2. Configure server settings:
   - Port configuration (default 3001)
   - Environment variable support
   - Development vs production modes
   - Graceful shutdown handling

3. Set up basic health check endpoint:
   - GET /health - server status
   - GET /health/db - database connection status

4. Ensure server can start without errors
```

### Prompt 3: Database Connection Setup
```
Set up SQLite database connection:

1. Create server/database/db.js with:
   - better-sqlite3 connection setup
   - Database file path configuration
   - Foreign key constraints enabled
   - Connection error handling
   - Database initialization functions

2. Implement database connection management:
   - Connection pooling (if needed)
   - Connection status checking
   - Database file creation if not exists
   - Schema initialization from files

3. Create database utility functions:
   - runQuery() - for INSERT/UPDATE/DELETE
   - getQuery() - for SELECT single row
   - getAllQuery() - for SELECT multiple rows
   - transaction support

4. Test database connection and basic operations
```

### Prompt 4: Basic Middleware Setup
```
Create essential middleware for the server:

1. Create server/middleware/errorHandler.js:
   - Global error handling
   - Proper HTTP status codes
   - Error logging
   - Client-safe error messages

2. Create server/middleware/logger.js:
   - Request logging
   - Response logging
   - Error logging
   - Performance timing

3. Create server/middleware/validation.js:
   - Basic request validation
   - Input sanitization
   - Required field checking
   - Data type validation

4. Create server/middleware/cors.js:
   - CORS configuration
   - Allowed origins
   - Allowed methods
   - Allowed headers

5. Test all middleware functions
```

### Prompt 5: Server Configuration
```
Set up server configuration and environment:

1. Create server/config/config.js with:
   - Environment variables
   - Database configuration
   - Server settings
   - CORS settings
   - File upload settings

2. Create .env.example file with:
   - PORT=3001
   - NODE_ENV=development
   - DATABASE_PATH=./travelplanner.db
   - UPLOAD_PATH=./uploads
   - LOG_LEVEL=info

3. Create server startup script:
   - Environment validation
   - Database connection check
   - Port availability check
   - Graceful startup sequence

4. Test configuration loading and validation
```

### Prompt 6: Basic Testing Setup
```
Set up basic testing infrastructure:

1. Create server/tests/setup.js:
   - Test database setup
   - Test data initialization
   - Test utilities
   - Mock configurations

2. Create basic health check tests:
   - Server startup test
   - Database connection test
   - Health endpoint test
   - Error handling test

3. Set up Jest configuration:
   - Test environment
   - Coverage reporting
   - Test timeouts
   - Mock configurations

4. Create test scripts in package.json
5. Run basic tests to ensure setup works
```

## Acceptance Criteria Checklist
- [ ] Create `server/` directory structure
- [ ] Set up Express.js with basic middleware (CORS, JSON parsing)
- [ ] Configure SQLite connection using `better-sqlite3`
- [ ] Create database connection module
- [ ] Set up basic error handling middleware
- [ ] Create server startup script
- [ ] Test database connection
- [ ] Ensure server doesn't interfere with existing frontend calendar

## Files to Create/Modify
- `server/package.json`
- `server/app.js` (or `app.ts`)
- `server/database/db.js` (or `db.ts`)
- `server/middleware/` (directory with middleware files)
- `server/config/config.js`
- `server/tests/` (directory with test files)
- `server/README.md`
- `.env.example`

## Important Notes
- **Ensure server doesn't interfere with existing frontend calendar**
- **Use port 3001 to avoid conflicts with frontend (port 3000)**
- **Test database connection thoroughly**
- **Set up proper error handling from the start**
- **Include logging for debugging**
- **Create health check endpoints for monitoring**
- **Set up environment configuration for flexibility**
