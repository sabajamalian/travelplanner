import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import '../styles/TravelsList.css';

const TravelsList = () => {
  const [travels, setTravels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5555/api/travels/');
      if (!response.ok) {
        throw new Error('Failed to fetch travels');
      }
      const data = await response.json();
      setTravels(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTravelClick = (travelId) => {
    navigate(`/timeline/${travelId}`);
  };

  const filteredTravels = travels.filter(travel => {
    const matchesSearch = travel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (travel.description && travel.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getDuration = (startDate, endDate) => {
    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 'N/A';
    }
  };

  const getStatusColor = (startDate, endDate) => {
    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const now = new Date();
      
      if (now < start) return '#3b82f6'; // Upcoming - Blue
      if (now >= start && now <= end) return '#10b981'; // Ongoing - Green
      return '#6b7280'; // Past - Gray
    } catch {
      return '#6b7280';
    }
  };

  const getStatusText = (startDate, endDate) => {
    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const now = new Date();
      
      if (now < start) return 'Upcoming';
      if (now >= start && now <= end) return 'Ongoing';
      return 'Completed';
    } catch {
      return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="travels-list-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your travels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="travels-list-container">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchTravels} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="travels-list-container">
      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search travels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {filteredTravels.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✈️</div>
          <h3>No travels found</h3>
          <p>
            {searchTerm 
              ? 'Try adjusting your search'
              : 'Start planning your next adventure!'
            }
          </p>
          {!searchTerm && (
            <button 
              className="new-travel-button empty-state-button"
              onClick={() => navigate('/new-travel')}
            >
              Create Your First Travel
            </button>
          )}
        </div>
      ) : (
        <div className="travels-grid">
          {filteredTravels.map((travel) => (
            <div 
              key={travel.id} 
              className="travel-card"
              onClick={() => handleTravelClick(travel.id)}
            >
              <div className="travel-card-header">
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(travel.start_date, travel.end_date) }}
                >
                  {getStatusText(travel.start_date, travel.end_date)}
                </div>
                <div className="travel-dates">
                  <span className="date-label">Duration</span>
                  <span className="duration">{getDuration(travel.start_date, travel.end_date)} days</span>
                </div>
              </div>
              
              <div className="travel-content">
                <h3 className="travel-title">{travel.title}</h3>
                {travel.description && (
                  <p className="travel-description">{travel.description}</p>
                )}
                {travel.destination && (
                  <div className="travel-destination">
                    <span className="destination-icon">📍</span>
                    <span>{travel.destination}</span>
                  </div>
                )}
              </div>
              
              <div className="travel-footer">
                <div className="date-range">
                  <div className="date-item">
                    <span className="date-label">From</span>
                    <span className="date-value">
                      {format(parseISO(travel.start_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="date-separator">→</div>
                  <div className="date-item">
                    <span className="date-label">To</span>
                    <span className="date-value">
                      {format(parseISO(travel.end_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="click-hint">
                  Click to view timeline →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelsList;
