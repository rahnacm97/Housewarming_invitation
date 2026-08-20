const express = require('express');
const cors = require('cors');
const rsvpRoutes = require('./routes/rsvp.routes');

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for simplicity in testing/hosting, can lock down in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-password']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve a basic API status health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// API Routes
app.use('/api/rsvp', rsvpRoutes);

// Catch 404 for api and fallback
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
