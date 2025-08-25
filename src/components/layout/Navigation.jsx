import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Navigation.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/travels" className="brand-link">
            ✈️ Travel Planner
          </Link>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/travels" 
            className={`nav-link ${location.pathname === '/travels' ? 'active' : ''}`}
          >
            My Travels
          </Link>
          <Link 
            to="/new-travel" 
            className={`nav-link ${location.pathname === '/new-travel' ? 'active' : ''}`}
          >
            New Travel
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
