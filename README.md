# Travel Planner Frontend

A modern, minimalist, and elegant travel planner frontend built with React, TypeScript, and Tailwind CSS. Features a vertical timeline with horizontal date navigation and timezone support.

## Features

- **Vertical Timeline**: 24-hour timeline with event cards positioned at their respective times
- **Horizontal Date Navigation**: Scrollable week view with smooth navigation
- **Timezone Support**: Toggle between local and home time
- **Current Time Indicator**: Blue line showing current time on the timeline
- **Responsive Design**: Mobile-friendly with touch gestures
- **Modern UI**: Clean, minimalist design with smooth animations

## Design Highlights

- **Color Palette**: Soft muted blue (#4A90E2) with light gray backgrounds
- **Typography**: Inter and Poppins fonts for modern readability
- **Animations**: Smooth hover effects and transitions
- **Mobile-First**: Responsive design that works on all devices

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd travelplanner
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Timezone selector
│   ├── DateSelector.tsx    # Horizontal date navigation
│   ├── Timeline.tsx        # Vertical timeline with hours
│   └── EventCard.tsx       # Individual event cards
├── pages/
│   └── Planner.tsx         # Main planner page
├── App.tsx                 # Root component
├── index.tsx              # Entry point
└── index.css              # Global styles and Tailwind
```

## Usage

- **Date Navigation**: Use the horizontal date selector to navigate between days
- **Timezone Toggle**: Click the timezone indicator in the header to switch between local and home time
- **Event Interaction**: Hover over event cards to see details, click for more information
- **Timeline Scrolling**: Scroll vertically to view different times of day
- **Current Time**: The blue line indicates the current time on the timeline

## Technologies Used

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **CSS Animations**: Smooth transitions and hover effects

## Customization

The application is built with customization in mind:

- **Colors**: Easily modify the color palette in `tailwind.config.js`
- **Events**: Add, remove, or modify events in the `Planner.tsx` component
- **Styling**: Customize components using Tailwind classes
- **Timezone**: Extend timezone support by modifying the Header component

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is open source and available under the [MIT License](LICENSE). 