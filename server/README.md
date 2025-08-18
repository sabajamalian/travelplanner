# Travel Planner Backend Server

This is the Python FastAPI backend server for the Travel Planner application.

## Technology Stack
- **Framework:** FastAPI 0.104.1
- **ASGI Server:** Uvicorn
- **Database:** SQLite with SQLAlchemy ORM
- **CORS:** Built-in FastAPI CORS support
- **Testing:** pytest with async support

## Setup Instructions

### 1. Create Python Virtual Environment
```bash
# Navigate to server directory
cd server

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies
```bash
# Make sure virtual environment is activated
pip install -r requirements.txt
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# Default settings:
# FASTAPI_APP=main.py
# PORT=5000
# DATABASE_PATH=./travelplanner.db
# UPLOAD_PATH=./uploads
# LOG_LEVEL=info
```

### 4. Run the Server
```bash
# Development mode
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --port 5000

# The server will be available at http://localhost:5000
# API documentation will be available at http://localhost:5000/docs
```

### 5. Run Tests
```bash
# Run all tests
pytest

# Run tests with async support
pytest --asyncio-mode=auto

# Run specific test file
pytest tests/test_health.py
```

## Project Structure
```
server/
├── main.py                # Main FastAPI application
├── requirements.txt       # Python dependencies
├── config/               # Configuration files
├── database/             # Database models and connection
├── middleware/           # Custom middleware
├── routes/               # API route definitions
├── tests/                # Test files
├── utils/                # Utility functions
└── logs/                 # Log files
```

## API Endpoints

### Health Checks
- `GET /health` - Server status
- `GET /health/db` - Database connection status

### Travels
- `GET /api/travels` - List active travels
- `POST /api/travels` - Create new travel
- `GET /api/travels/{id}` - Get travel details
- `PUT /api/travels/{id}` - Update travel
- `DELETE /api/travels/{id}` - Soft delete travel

### Events
- `GET /api/travels/{id}/events` - List events for travel
- `POST /api/travels/{id}/events` - Create event for travel
- `GET /api/events/{id}` - Get event details
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Soft delete event

## FastAPI Features

- **Automatic API Documentation** - Available at `/docs` (Swagger UI) and `/redoc` (ReDoc)
- **Request/Response Validation** - Built-in Pydantic validation
- **Async Support** - Native async/await support for better performance
- **Type Hints** - Full Python type hint support
- **OpenAPI Standard** - Industry-standard API specification

## Development Notes

- **Port:** Backend runs on port 5000 to avoid conflicts with frontend (port 3000)
- **Database:** SQLite database file is created automatically if it doesn't exist
- **CORS:** Configured to allow frontend communication from localhost:3000
- **File Uploads:** Supported for event attachments with size and type validation
- **Error Handling:** Comprehensive error handling with proper HTTP status codes
- **Logging:** Request/response logging for debugging
- **Async:** All endpoints support async operations for better performance

## Troubleshooting

### Common Issues

1. **Port already in use:**
   - Change PORT in .env file
   - Kill process using the port: `lsof -ti:5000 | xargs kill -9`

2. **Database connection errors:**
   - Check DATABASE_PATH in .env
   - Ensure write permissions in server directory

3. **Import errors:**
   - Make sure virtual environment is activated
   - Reinstall dependencies: `pip install -r requirements.txt`

4. **CORS issues:**
   - Check CORS configuration in main.py
   - Verify frontend URL in CORS settings

5. **Async test issues:**
   - Use `pytest --asyncio-mode=auto` for async tests
   - Ensure all async functions are properly awaited
