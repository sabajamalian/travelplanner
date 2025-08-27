import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import TravelsList from './pages/TravelsList';
import Timeline from './pages/Timeline';
import NewTravel from './pages/NewTravel';
import './styles/App.css';

function App() {
  return (
    <div className='app'>
      <Navigation />
      <Routes>
        <Route path="/travels" element={<TravelsList />} />
        <Route path="/new-travel" element={<NewTravel />} />
        <Route path="/timeline/:travelId" element={<Timeline />} />
        <Route path="/" element={<Navigate to="/travels" replace />} />
      </Routes>
    </div>
  );
}

export default App;
