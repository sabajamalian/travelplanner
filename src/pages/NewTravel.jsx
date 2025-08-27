import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import '../styles/NewTravel.css';

const NewTravel = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Tomorrow
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Travel title is required');
      return false;
    }
    
    if (!formData.start_date || !formData.end_date) {
      setError('Start and end dates are required');
      return false;
    }
    
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (endDate <= startDate) {
      setError('End date must be after start date');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5555/api/travels/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          destination: formData.destination.trim() || null,
          start_date: formData.start_date,
          end_date: formData.end_date,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create travel');
      }
      
      const result = await response.json();
      
      // Redirect to the new travel's timeline
      navigate(`/timeline/${result.data.id}`);
      
    } catch (err) {
      setError(err.message || 'Failed to create travel. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/travels');
  };

  return (
    <div className="new-travel-container">
      <div className="new-travel-content">
        <form onSubmit={handleSubmit} className="travel-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Travel Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter travel title (e.g., 'Summer Vacation in Europe')"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your travel plans, goals, or any special notes..."
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
              type="text"
              id="destination"
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              placeholder="Where are you traveling to? (e.g., 'Paris, France')"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date *</label>
              <input
                type="date"
                id="start_date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date *</label>
              <input
                type="date"
                id="end_date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Travel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTravel;
