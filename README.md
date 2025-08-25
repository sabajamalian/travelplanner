# Travel Planner

A modern, minimalistic travel planning application built with React and FastAPI.

## Features

### ✈️ Travels List Page
- **Modern Card Interface**: Beautiful, responsive travel cards with hover effects
- **Smart Status Indicators**: Visual status showing if travels are upcoming, ongoing, or completed
- **Search & Filter**: Search by title/description and filter by destination
- **Duration Calculation**: Automatic calculation of travel duration
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### 📅 Timeline Page
- **Daily Calendar View**: Interactive daily schedule for each travel
- **Event Management**: View and manage events within each travel
- **Navigation**: Easy navigation between dates with visual date circles
- **Event Types**: Color-coded events for different categories (accommodation, transportation, activities, etc.)

### 🎨 Design Features
- **Minimalistic UI**: Clean, modern interface with smooth animations
- **Gradient Backgrounds**: Beautiful color schemes throughout the application
- **Hover Effects**: Interactive elements with smooth transitions
- **Responsive Layout**: Adapts to all screen sizes

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- SQLite

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

4. **Start the backend server**
   ```bash
   cd server
   python3 main.py
   ```
   The backend will run on `http://localhost:5555`

5. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## Usage

### Viewing Travels
1. Navigate to the main page - you'll see all your travels displayed as beautiful cards
2. Use the search bar to find specific travels by title or description
3. Use the destination filter to narrow down travels by location
4. Each card shows:
   - Travel status (upcoming/ongoing/completed)
   - Duration in days
   - Destination with location icon
   - Date range with formatted dates
   - Click hint to view timeline

### Viewing Timeline
1. Click on any travel card to navigate to its timeline page
2. The timeline shows a daily calendar view for that specific travel
3. Navigate between dates using the arrow buttons or date circles
4. View events color-coded by type
5. Use the "New Event" button to add events (functionality coming soon)

### Navigation
- **My Travels**: View all your travels
- **New Travel**: Create a new travel (functionality coming soon)
- **Back to Travels**: Return to the travels list from any timeline

## API Endpoints

The application uses the following backend API endpoints:

- `GET /api/travels/` - List all travels
- `GET /api/travels/{id}` - Get specific travel details
- `GET /api/events/travels/{travelId}/events` - Get events for a specific travel

## Project Structure

```
travelplanner/
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── Navigation.jsx
│   ├── pages/
│   │   ├── TravelsList.jsx      # Main travels list page
│   │   └── Timeline.jsx         # Timeline view for specific travel
│   ├── styles/
│   │   ├── TravelsList.css      # Styles for travels list
│   │   ├── Timeline.css         # Styles for timeline
│   │   └── Navigation.css       # Navigation styles
│   ├── App.jsx                  # Main app with routing
│   └── main.jsx                 # App entry point
├── server/                      # Backend API server
└── package.json
```

## Technologies Used

### Frontend
- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **React Big Calendar** - Calendar component for timeline view
- **date-fns** - Date manipulation utilities
- **Vite** - Fast build tool and dev server

### Backend
- **FastAPI** - Modern Python web framework
- **SQLite** - Lightweight database
- **Pydantic** - Data validation

### Styling
- **CSS3** - Modern CSS with gradients, animations, and responsive design
- **CSS Grid & Flexbox** - Modern layout techniques
- **CSS Custom Properties** - Dynamic styling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- [ ] Create new travel functionality
- [ ] Edit travel details
- [ ] Delete travels
- [ ] Event creation and editing
- [ ] File attachments for events
- [ ] Travel sharing and collaboration
- [ ] Mobile app version
- [ ] Offline support
- [ ] Travel templates
- [ ] Export to calendar formats