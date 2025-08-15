# Travel Planner - Daily Schedule

A beautiful and interactive travel planning application built with React and React Big Calendar. This application displays a horizontal single-day view with hourly events, perfect for planning your daily travel itinerary.

## Features

- **Single Day View**: Horizontal timeline showing hourly events from 6:00 AM to 11:59 PM
- **Color-Coded Events**: Different event types are displayed with distinct colors
- **Interactive Event Creation**: Click on any time slot to create new events
- **Event Editing**: Click on existing events to edit or delete them
- **Test Events**: Pre-populated with sample travel activities
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful gradient background with clean, modern styling

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

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will open automatically in your browser at `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

## Technology Stack

- **React 18** - Modern React with hooks
- **React Big Calendar** - Professional calendar component with event handling
- **date-fns** - Modern date utility library
- **Vite** - Fast build tool and dev server
- **CSS3** - Modern styling with gradients and animations

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
