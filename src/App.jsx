import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './styles/App.css';

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

// Test events for demonstration
const testEvents = [
  {
    id: 1,
    title: 'Morning Coffee & Planning',
    start: new Date(2024, 0, 15, 8, 0), // January 15, 2024 at 8:00 AM
    end: new Date(2024, 0, 15, 9, 0), // January 15, 2024 at 9:00 AM
    resource: 'Hotel Lobby',
    type: 'Planning',
  },
  {
    id: 2,
    title: 'City Walking Tour',
    start: new Date(2024, 0, 15, 9, 30),
    end: new Date(2024, 0, 15, 12, 0),
    resource: 'City Center',
    type: 'Sightseeing',
  },
  {
    id: 3,
    title: 'Lunch at Local Restaurant',
    start: new Date(2024, 0, 15, 12, 0),
    end: new Date(2024, 0, 15, 13, 30),
    resource: 'Downtown Area',
    type: 'Food',
  },
  {
    id: 4,
    title: 'Museum Visit',
    start: new Date(2024, 0, 15, 14, 0),
    end: new Date(2024, 0, 15, 16, 0),
    resource: 'National Museum',
    type: 'Culture',
  },
  {
    id: 5,
    title: 'Shopping & Souvenirs',
    start: new Date(2024, 0, 15, 16, 30),
    end: new Date(2024, 0, 15, 18, 0),
    resource: 'Market District',
    type: 'Shopping',
  },
  {
    id: 6,
    title: 'Dinner Reservation',
    start: new Date(2024, 0, 15, 19, 0),
    end: new Date(2024, 0, 15, 21, 0),
    resource: 'Fine Dining Restaurant',
    type: 'Food',
  },
  {
    id: 7,
    title: 'Evening Entertainment',
    start: new Date(2024, 0, 15, 21, 30),
    end: new Date(2024, 0, 15, 23, 0),
    resource: 'Theater District',
    type: 'Entertainment',
  },
];

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 0, 15));
  const [events, setEvents] = useState(testEvents);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSaveEvent = eventData => {
    if (isEditing && selectedEvent) {
      // Update existing event
      setEvents(
        events.map(event =>
          event.id === selectedEvent.id ? { ...event, ...eventData } : event
        )
      );
    } else {
      // Create new event
      const newEvent = {
        id: Date.now(),
        ...eventData,
      };
      setEvents([...events, newEvent]);
    }
    handleCloseModal();
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      handleCloseModal();
    }
  };

  const eventStyleGetter = event => {
    let backgroundColor = '#3174ad';

    switch (event.type) {
      case 'Planning':
        backgroundColor = '#28a745';
        break;
      case 'Sightseeing':
        backgroundColor = '#17a2b8';
        break;
      case 'Food':
        backgroundColor = '#ffc107';
        break;
      case 'Culture':
        backgroundColor = '#6f42c1';
        break;
      case 'Shopping':
        backgroundColor = '#fd7e14';
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

  return (
    <div className='app'>
      <header className='app-header'>
        <h1>Travel Planner - Daily Schedule</h1>
        <p>Plan your perfect day with our interactive calendar</p>
        <p className='instructions'>
          💡 Click on any time slot to create a new event!
        </p>
      </header>

      <div className='calendar-container'>
        {/* Calendar Header */}
        <div className='calendar-header'>
          <button className='nav-arrow left' onClick={handlePreviousDay}>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M15 18L9 12L15 6'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>

          <div className='date-navigation'>
            <div
              className='date-circle yesterday'
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            >
              <span className='date-day'>
                {format(subDays(selectedDate, 1), 'd')}
              </span>
              <span className='date-month'>
                {format(subDays(selectedDate, 1), 'MMM')}
              </span>
            </div>

            <div className='date-circle current' onClick={handleToday}>
              <span className='date-day'>{format(selectedDate, 'd')}</span>
              <span className='date-month'>{format(selectedDate, 'MMM')}</span>
              <span className='date-year'>{format(selectedDate, 'yyyy')}</span>
            </div>

            <div
              className='date-circle tomorrow'
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            >
              <span className='date-day'>
                {format(addDays(selectedDate, 1), 'd')}
              </span>
              <span className='date-month'>
                {format(addDays(selectedDate, 1), 'MMM')}
              </span>
            </div>
          </div>

          <button className='nav-arrow right' onClick={handleNextDay}>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M9 18L15 12L9 6'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          style={{ height: 600 }}
          views={['day']}
          view='day'
          date={selectedDate}
          onNavigate={handleDateChange}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          eventPropGetter={eventStyleGetter}
          step={60}
          timeslots={1}
          min={new Date(2024, 0, 15, 6, 0)} // 6:00 AM
          max={new Date(2024, 0, 15, 23, 59)} // 11:59 PM
          toolbar={false}
          showMultiDayTimes={false}
          dayLayoutAlgorithm='no-overlap'
        />
      </div>

      <div className='legend'>
        <h3>Event Types:</h3>
        <div className='legend-items'>
          <div className='legend-item'>
            <span className='legend-color planning'></span>
            <span>Planning</span>
          </div>
          <div className='legend-item'>
            <span className='legend-color sightseeing'></span>
            <span>Sightseeing</span>
          </div>
          <div className='legend-item'>
            <span className='legend-color food'></span>
            <span>Food</span>
          </div>
          <div className='legend-item'>
            <span className='legend-color culture'></span>
            <span>Culture</span>
          </div>
          <div className='legend-item'>
            <span className='legend-color shopping'></span>
            <span>Shopping</span>
          </div>
          <div className='legend-item'>
            <span className='legend-color entertainment'></span>
            <span>Entertainment</span>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showModal && (
        <EventModal
          slot={selectedSlot}
          event={selectedEvent}
          isEditing={isEditing}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
}

// Event Modal Component
function EventModal({ slot, event, isEditing, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    type: event?.type || 'Planning',
    resource: event?.resource || '',
    start: slot
      ? format(slot.start, "yyyy-MM-dd'T'HH:mm")
      : event
        ? format(event.start, "yyyy-MM-dd'T'HH:mm")
        : '',
    end: slot
      ? format(slot.end, "yyyy-MM-dd'T'HH:mm")
      : event
        ? format(event.end, "yyyy-MM-dd'T'HH:mm")
        : '',
  });

  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      ...formData,
      start: new Date(formData.start),
      end: new Date(formData.end),
    });
  };

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
          <button className='close-button' onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='title'>Event Title:</label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              required
              placeholder='Enter event title'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='type'>Event Type:</label>
            <select
              id='type'
              name='type'
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value='Planning'>Planning</option>
              <option value='Sightseeing'>Sightseeing</option>
              <option value='Food'>Food</option>
              <option value='Culture'>Culture</option>
              <option value='Shopping'>Shopping</option>
              <option value='Entertainment'>Entertainment</option>
            </select>
          </div>

          <div className='form-group'>
            <label htmlFor='resource'>Location:</label>
            <input
              type='text'
              id='resource'
              name='resource'
              value={formData.resource}
              onChange={handleChange}
              placeholder='Enter location'
            />
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='start'>Start Time:</label>
              <input
                type='datetime-local'
                id='start'
                name='start'
                value={formData.start}
                onChange={handleChange}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='end'>End Time:</label>
              <input
                type='datetime-local'
                id='end'
                name='end'
                value={formData.end}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className='modal-actions'>
            {isEditing && (
              <button
                type='button'
                className='delete-button'
                onClick={onDelete}
              >
                Delete Event
              </button>
            )}
            <button type='button' className='cancel-button' onClick={onClose}>
              Cancel
            </button>
            <button type='submit' className='save-button'>
              {isEditing ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
