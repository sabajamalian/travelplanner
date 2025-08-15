const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Travel Planner API is running' });
});

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Travel Planner server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`🔧 API: http://localhost:${PORT}/api/health`);
});
