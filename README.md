# Travel Planner

A comprehensive travel planning application with an interactive calendar interface for managing travel events and schedules.

## Features

### 🗓️ Smart Calendar Interface
- **Daily Timeline View**: View your travel schedule in a detailed daily timeline format
- **Travel-Aware Navigation**: Automatically jumps to the first day of a selected travel
- **Boundary-Aware Navigation**: Date navigation respects travel start and end dates
- **Visual Progress Tracking**: See your progress through the travel with a progress bar

### 🚀 Travel Management
- **Travel Selection**: Dropdown menu to select from available travels
- **Automatic Date Jumping**: Selecting a travel automatically navigates to its start date
- **Travel Information Display**: Shows travel details, destination, and date range
- **Quick Navigation**: Jump to start, end, or today (if within travel range)

### 📅 Event Management
- **Interactive Event Creation**: Click on time slots to create new events
- **Event Types**: Categorized events (Planning, Sightseeing, Food, Culture, Shopping, Entertainment)
- **Event Editing**: Modify existing events with a user-friendly modal
- **Event Deletion**: Remove events with confirmation

### 🎨 User Experience
- **Responsive Design**: Works on desktop and mobile devices
- **Visual Feedback**: Disabled navigation when at travel boundaries
- **Loading States**: Clear indication when data is being fetched
- **Error Handling**: User-friendly error messages and retry options

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+ (for backend)
- SQLite (included)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travelplanner
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

4. **Set up the database**
   ```bash
   cd database
   sqlite3 travelplanner.db < schema.sql
   sqlite3 travelplanner.db < test-data.sql
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   python -m uvicorn main:app --reload --port 5555
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## Usage

### Selecting a Travel
1. Use the dropdown menu in the header to select a travel
2. The calendar automatically jumps to the first day of the selected travel
3. All events for that travel are displayed on the timeline

### Navigating the Calendar
- **Previous/Next Day**: Use the arrow buttons or click on yesterday/tomorrow circles
- **Quick Navigation**: Use the Start, Today, and End buttons for instant navigation
- **Travel Boundaries**: Navigation is automatically limited to the travel's date range

### Managing Events
1. **Create Event**: Click on any time slot in the calendar
2. **Edit Event**: Click on an existing event
3. **Delete Event**: Use the delete button in the edit modal

## Technical Details

### Frontend Architecture
- **React 18** with functional components and hooks
- **React Big Calendar** for the calendar interface
- **Date-fns** for date manipulation
- **Custom hooks** for state management and API communication

### Backend Architecture
- **FastAPI** for the REST API
- **SQLite** database with proper indexing
- **Pydantic** for data validation
- **Middleware** for CORS, logging, and error handling

### Database Schema
- **Travels**: Store travel information with start/end dates
- **Events**: Store individual events with timing and location
- **Event Types**: Categorize events for better organization

## API Endpoints

- `GET /api/travels/` - List all travels
- `GET /api/events/travels/{id}/events` - Get events for a specific travel
- `POST /api/events/travels/{id}/events` - Create a new event
- `PUT /api/events/{id}` - Update an event
- `DELETE /api/events/{id}` - Delete an event

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.