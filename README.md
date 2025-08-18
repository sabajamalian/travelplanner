# Travel Planner - Daily Schedule

A beautiful and interactive travel planning application built with React frontend and Python FastAPI backend. This application displays a horizontal single-day view with hourly events, perfect for planning your daily travel itinerary.

## Features

- **Single Day View**: Horizontal timeline showing hourly events from 6:00 AM to 11:59 PM
- **Color-Coded Events**: Different event types are displayed with distinct colors
- **Interactive Event Creation**: Click on any time slot to create new events
- **Event Editing**: Click on existing events to edit or delete them
- **Test Events**: Pre-populated with sample travel activities
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful gradient background with clean, modern styling
- **Backend API**: Full CRUD operations for travels and events
- **Database Storage**: SQLite database with SQLAlchemy ORM
- **Auto Documentation**: Automatic API documentation with Swagger UI

## Event Types

- 🟢 **Planning** - Morning coffee and planning sessions
- 🔵 **Sightseeing** - City tours and exploration activities
- 🟡 **Food** - Restaurant visits and dining experiences
- 🟣 **Culture** - Museum visits and cultural activities
- 🟠 **Shopping** - Souvenir shopping and market visits
- 🟣 **Entertainment** - Evening shows and entertainment

## Interactive Features

### Creating New Events
- **Click on any time slot** in the calendar to open the event creation modal
- Fill in the event details:
  - Event title
  - Event type (from predefined categories)
  - Location
  - Start and end times
- Click "Create Event" to add it to your schedule

### Editing Existing Events
- **Click on any existing event** to open the edit modal
- Modify any event details
- Click "Update Event" to save changes
- Click "Delete Event" to remove the event

### Calendar Navigation
- Use the calendar navigation to switch between different dates
- All events are tied to specific dates and times

## Getting Started

### Prerequisites

- **Frontend**: Node.js (version 14 or higher)
- **Backend**: Python 3.8 or higher
- npm or yarn package manager
- pip (Python package manager)

### Installation

1. Clone or download this repository
2. Navigate to the project directory

#### Frontend Setup
```bash
# Install frontend dependencies
npm install
# or
yarn install
```

#### Backend Setup
```bash
# Navigate to server directory
cd server

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Copy environment configuration
cp .env.example .env
# Edit .env file with your settings

# Return to project root
cd ..
```

### Running the Application

#### Start Backend Server
```bash
# From project root
npm run server
# or
cd server && python main.py
```

The backend server will start at `http://localhost:5000`
API documentation will be available at `http://localhost:5000/docs`

#### Start Frontend Development Server
```bash
# In a new terminal, from project root
npm run dev
# or
yarn dev
```

The frontend application will open automatically in your browser at `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Big Calendar** - Professional calendar component with event handling
- **date-fns** - Modern date utility library
- **Vite** - Fast build tool and dev server
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Python 3.8+** - Modern Python runtime
- **FastAPI 0.104** - Modern, fast web framework with automatic documentation
- **Uvicorn** - Lightning-fast ASGI server
- **SQLAlchemy** - Python SQL toolkit and ORM
- **SQLite** - Lightweight database
- **Built-in CORS** - Cross-origin resource sharing support

### Architecture
- **Separate Frontend/Backend** - Independent services communicating via REST API
- **RESTful API** - Standard HTTP endpoints for all operations
- **Database ORM** - Object-relational mapping for data operations
- **CORS Support** - Secure cross-origin communication
- **Async Support** - Native async/await for better performance
- **Auto Documentation** - OpenAPI/Swagger documentation generation

## Customization

### Adding New Event Types

To add new event types, modify the `eventStyleGetter` function in `src/App.jsx` and add new cases for colors:

```javascript
case 'NewType':
  backgroundColor = '#your-color-here'
  break
```

Also update the select options in the `EventModal` component.

### Modifying Event Properties

Events have the following properties:
- `id` - Unique identifier
- `title` - Event name
- `type` - Event category
- `resource` - Location
- `start` - Start date/time
- `end` - End date/time

### Styling

Customize the appearance by modifying the CSS files:
- `src/index.css` - Global styles
- `src/App.css` - Application-specific styles including modal and form styles

## API Documentation

The backend provides a RESTful API for managing travels and events:

- **Base URL**: `http://localhost:5000/api`
- **Health Check**: `GET /health`
- **Travels**: `GET /travels`, `POST /travels`, `PUT /travels/:id`, `DELETE /travels/:id`
- **Events**: `GET /travels/:id/events`, `POST /travels/:id/events`, `PUT /events/:id`, `DELETE /events/:id`

For detailed API documentation, see the `server/README.md` file.

## Browser Support

This application is designed for modern browsers and uses:
- Flexbox for layout
- CSS Grid for advanced layouts
- Modern CSS features like gradients and shadows
- ES6+ JavaScript features

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this application.