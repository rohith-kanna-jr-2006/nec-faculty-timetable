const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin === '*' ? true : allowedOrigin,
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// Mount API
app.use('/api', apiRoutes);

// Root Welcome / Ping
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NEC Faculty Timetable API Service is running.',
    healthEndpoint: '/api/health',
  });
});

// Centralized 404 and Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
