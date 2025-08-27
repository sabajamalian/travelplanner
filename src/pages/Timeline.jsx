import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import isSameDay from 'date-fns/isSameDay';
import isToday from 'date-fns/isToday';
import differenceInDays from 'date-fns/differenceInDays';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Timeline.css';
import { createEvent, updateEvent, deleteEvent, loadEventTypes } from '../services/calendarService';

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [travel, setTravel] = useState(null);
  const [events, setEvents] = useState([]);
  const [travelDates, setTravelDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [eventTypes, setEventTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Activity',
    location: '',
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    if (travelId) {
      fetchTravelData();
      fetchEvents();
      fetchEventTypes();
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
      
      // Generate travel dates array
      if (data.data.start_date && data.data.end_date) {
        const startDate = new Date(data.data.start_date);
        const endDate = new Date(data.data.end_date);
        const dates = generateTravelDates(startDate, endDate);
        setTravelDates(dates);
        
        // Set the selected date to the travel start date
        setSelectedDate(startDate);
      }
    } catch (err) {
      setError('Failed to load travel information');
    }
  };

  const generateTravelDates = (startDate, endDate) => {
    const dates = [];
    const daysDiff = differenceInDays(endDate, startDate) + 1;
    
    for (let i = 0; i < daysDiff; i++) {
      dates.push(addDays(startDate, i));
    }
    
    return dates;
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

  const handlePreviousPeriod = () => {
    const currentIndex = travelDates.findIndex(date => isSameDay(date, selectedDate));
    if (currentIndex > 0) {
      setSelectedDate(travelDates[currentIndex - 1]);
    }
  };

  const handleNextPeriod = () => {
    const currentIndex = travelDates.findIndex(date => isSameDay(date, selectedDate));
    if (currentIndex < travelDates.length - 1) {
      setSelectedDate(travelDates[currentIndex + 1]);
    }
  };

  const handleSelectSlot = slotInfo => {
    const startTime = new Date(slotInfo.start);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Default 1 hour duration
    
    setFormData({
      title: '',
      description: '',
      type: 'Activity',
      location: '',
      start: startTime,
      end: endTime,
    });
    
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSelectEvent = event => {
    setFormData({
      title: event.title,
      description: event.description || '',
      type: event.type,
      location: event.resource || '',
      start: new Date(event.start),
      end: new Date(event.end),
    });
    
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
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      },
    };
  };

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(event.start, date));
  };

  const renderHorizontalTravelTimeline = () => {
    if (!travelDates.length) return null;

    const currentIndex = travelDates.findIndex(date => isSameDay(date, selectedDate));

    return (
      <div className="horizontal-travel-timeline">
        <div className="timeline-dates-container">
          <div className="timeline-dates-scroll">
            {travelDates.map((date, index) => {
              const dayEvents = getEventsForDate(date);
              const isSelected = isSameDay(date, selectedDate);
              const isCurrentDay = isToday(date);
              const dayNumber = index + 1;
              
              return (
                <div
                  key={index}
                  className={`timeline-day-card ${isSelected ? 'selected' : ''} ${isCurrentDay ? 'today' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="day-header">
                    <span className="day-number">Day {dayNumber}</span>
                    <span className="day-date">{format(date, 'MMM d')}</span>
                  </div>
                  
                  <div className="day-events">
                    {dayEvents.length > 0 ? (
                      <div className="events-summary">
                        <span className="event-count">{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</span>
                        {dayEvents.slice(0, 2).map((event, eventIndex) => (
                          <div key={eventIndex} className="event-preview" style={{ backgroundColor: getEventStyle(event.type) }}>
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="more-events">+{dayEvents.length - 2} more</span>
                        )}
                      </div>
                    ) : (
                      <span className="no-events">No events</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="timeline-navigation">
          <button 
            className="nav-button" 
            onClick={handlePreviousPeriod}
            disabled={currentIndex === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>
          
          <div className="current-day-info">
            <span className="day-label">Day {currentIndex + 1} of {travelDates.length}</span>
            <span className="date-label">{format(selectedDate, 'EEEE, MMMM d')}</span>
          </div>
          
          <button 
            className="nav-button" 
            onClick={handleNextPeriod}
            disabled={currentIndex === travelDates.length - 1}
          >
            Next
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const getEventStyle = (eventType) => {
    const typeMapping = {
      'Accommodation': '#28a745',
      'Transportation': '#17a2b8',
      'Activity': '#ffc107',
      'Food': '#fd7e14',
      'Shopping': '#6f42c1',
      'Entertainment': '#e83e8c',
    };
    return typeMapping[eventType] || '#3174ad';
  };

  const fetchEventTypes = async () => {
    try {
      const types = await loadEventTypes();
      setEventTypes(types);
    } catch (err) {
      console.error('Failed to load event types:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form data
    if (formData.end <= formData.start) {
      alert('End time must be after start time');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Transform form data to match the expected format
      const eventData = {
        ...formData,
        resource: formData.location, // Map location to resource for the API
      };
      
      if (isEditing && selectedEvent) {
        // Update existing event
        const updatedEvent = await updateEvent(selectedEvent.id, eventData);
        setEvents(prev => prev.map(event => 
          event.id === selectedEvent.id ? updatedEvent : event
        ));
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        // Create new event
        const newEvent = await createEvent(eventData, travelId);
        setEvents(prev => [...prev, newEvent]);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
      
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save event:', err);
      alert('Failed to save event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent || !window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await deleteEvent(selectedEvent.id);
      setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
      handleCloseModal();
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert('Failed to delete event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <header className="timeline-header">
        <div className="header-content">
          <div className="travel-info">
            <h1>{travel.title}</h1>
            <p className="travel-subtitle">
              {travel.destination && `📍 ${travel.destination}`}
              {travel.description && ` • ${travel.description}`}
            </p>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message">
          <div className="success-content">
            <svg className="success-icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{isEditing ? 'Event updated successfully!' : 'Event created successfully!'}</span>
          </div>
        </div>
      )}

      <div className="timeline-content">
        <div className="horizontal-timeline-section">
          {renderHorizontalTravelTimeline()}
        </div>

        <div className="main-content">
          <div className="calendar-container">
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
        </div>
      </div>

      <div className="legend">
        <h3>Event Types</h3>
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

      {/* Event Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content event-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
              <button className="close-button" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="event-form">
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="title">Event Title *</label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter event title"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type">Event Type</label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="form-select"
                  >
                    <option value="Activity">Activity</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="start">Start Time *</label>
                  <input
                    type="datetime-local"
                    id="start"
                    value={format(formData.start, "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => handleInputChange('start', new Date(e.target.value))}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end">End Time *</label>
                  <input
                    type="datetime-local"
                    id="end"
                    value={format(formData.end, "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => handleInputChange('end', new Date(e.target.value))}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter location (optional)"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter event description (optional)"
                    rows="3"
                    className="form-textarea"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <div className="footer-actions">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="delete-button"
                    >
                      {isSubmitting ? 'Deleting...' : 'Delete Event'}
                    </button>
                  )}
                  
                  <div className="primary-actions">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={isSubmitting}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.title.trim()}
                      className="save-button"
                    >
                      {isSubmitting ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
