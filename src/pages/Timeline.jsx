import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Timeline.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Timeline = () => {
  const { travelId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [travel, setTravel] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (travelId) {
      fetchTravelData();
      fetchEvents();
    }
  }, [travelId]);

  const fetchTravelData = async () => {
    try {
      const response = await fetch(`http://localhost:5555/api/travels/${travelId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch travel data');
      }
      const data = await response.json();
      setTravel(data.data);
      
      // Set the selected date to the travel start date
      if (data.data.start_date) {
        setSelectedDate(new Date(data.data.start_date));
      }
    } catch (err) {
      setError('Failed to load travel information');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:5555/api/events/travels/${travelId}/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      
      // Transform backend events to frontend format
      const transformedEvents = data.data.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_datetime),
        end: new Date(event.end_datetime),
        resource: event.location || '',
        type: getEventTypeName(event.event_type_id),
        description: event.description || '',
        event_type_id: event.event_type_id,
        travel_id: event.travel_id,
      }));
      
      setEvents(transformedEvents);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const getEventTypeName = (eventTypeId) => {
    const typeMapping = {
      1: 'Accommodation',
      4: 'Transportation',
      10: 'Activity',
      12: 'Food',
      15: 'Shopping',
      17: 'Entertainment',
    };
    return typeMapping[eventTypeId] || 'Activity';
  };

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const handlePreviousDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleSelectSlot = slotInfo => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSelectEvent = event => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
    setSelectedEvent(null);
    setIsEditing(false);
  };

  const eventStyleGetter = event => {
    let backgroundColor = '#3174ad';

    switch (event.type) {
      case 'Accommodation':
        backgroundColor = '#28a745';
        break;
      case 'Transportation':
        backgroundColor = '#17a2b8';
        break;
      case 'Activity':
        backgroundColor = '#ffc107';
        break;
      case 'Food':
        backgroundColor = '#fd7e14';
        break;
      case 'Shopping':
        backgroundColor = '#6f42c1';
        break;
      case 'Entertainment':
        backgroundColor = '#e83e8c';
        break;
      default:
        backgroundColor = '#3174ad';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  if (isLoading) {
    return (
      <div className="timeline-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="timeline-container">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!travel) {
    return (
      <div className="timeline-container">
        <div className="error-container">
          <h2>Travel not found</h2>
          <p>The travel you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/travels')} className="retry-button">
            Back to Travels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <header className="timeline-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => navigate('/travels')}
          >
            ← Back to Travels
          </button>
          <div className="travel-info">
            <h1>{travel.title}</h1>
            <p className="travel-subtitle">
              {travel.destination && `📍 ${travel.destination}`}
              {travel.description && ` • ${travel.description}`}
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="new-event-button"
            onClick={() => setShowModal(true)}
          >
            + New Event
          </button>
        </div>
      </header>

      <div className="calendar-container">
        <div className="calendar-header">
          <button className="nav-arrow left" onClick={handlePreviousDay}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="date-navigation">
            <div className="date-circle yesterday" onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
              <span className="date-day">{format(subDays(selectedDate, 1), 'd')}</span>
              <span className="date-month">{format(subDays(selectedDate, 1), 'MMM')}</span>
            </div>

            <div className="date-circle current" onClick={handleToday}>
              <span className="date-day">{format(selectedDate, 'd')}</span>
              <span className="date-month">{format(selectedDate, 'MMM')}</span>
              <span className="date-year">{format(selectedDate, 'yyyy')}</span>
            </div>

            <div className="date-circle tomorrow" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
              <span className="date-day">{format(addDays(selectedDate, 1), 'd')}</span>
              <span className="date-month">{format(addDays(selectedDate, 1), 'MMM')}</span>
            </div>
          </div>

          <button className="nav-arrow right" onClick={handleNextDay}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          views={['day']}
          view="day"
          date={selectedDate}
          onNavigate={handleDateChange}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          eventPropGetter={eventStyleGetter}
          step={60}
          timeslots={1}
          min={new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 6, 0)}
          max={new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59)}
          toolbar={false}
          showMultiDayTimes={false}
          dayLayoutAlgorithm="no-overlap"
        />
      </div>

      <div className="legend">
        <h3>Event Types:</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color accommodation"></span>
            <span>Accommodation</span>
          </div>
          <div className="legend-item">
            <span className="legend-color transportation"></span>
            <span>Transportation</span>
          </div>
          <div className="legend-item">
            <span className="legend-color activity"></span>
            <span>Activity</span>
          </div>
          <div className="legend-item">
            <span className="legend-color food"></span>
            <span>Food</span>
          </div>
          <div className="legend-item">
            <span className="legend-color shopping"></span>
            <span>Shopping</span>
          </div>
          <div className="legend-item">
            <span className="legend-color entertainment"></span>
            <span>Entertainment</span>
          </div>
        </div>
      </div>

      {/* Event Modal would go here - simplified for now */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Event Details</h2>
              <button className="close-button" onClick={handleCloseModal}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Event modal functionality would be implemented here.</p>
              <p>This is a simplified version for demonstration.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
