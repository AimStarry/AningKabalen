require('dotenv/config');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { connectDB } = require('./database/connection');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const listingRoutes = require('./routes/listings');
const reservationRoutes = require('./routes/reservations');
const transactionRoutes = require('./routes/transactions');
const reviewRoutes = require('./routes/reviews');
const notificationRoutes = require('./routes/notifications');
const addressRoutes = require('./routes/addresses');
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contacts');

const app = express();
const PORT = process.env.PORT ?? 5000;
const isDev = process.env.NODE_ENV !== 'production';

// Supports:
// CLIENT_URL=http://localhost:4200,https://aningkabalen.site,https://www.aningkabalen.site
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(origin => origin.trim())
  : ['http://localhost:4200'];

// 1. HELMET
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// 2. CORS
const corsOptions = {
  origin: true,
  credentials: true
};

app.use(cors(corsOptions));

// 3. PREFLIGHT
app.options('*', cors(corsOptions));

// 4. BODY PARSERS
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// 5. LOGGING
if (!isDev) {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// 6. RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 2000 : 300,
  message: {
    success: false,
    message: 'Too many requests, please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 500 : 30,
  message: {
    success: false,
    message: 'Too many auth attempts, please wait.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', limiter);
app.use('/api/auth', authLimiter);

// 7. HEALTH CHECK
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'AningKabalen API is running 🌾',
    timestamp: new Date().toISOString(),
    allowedOrigins
  });
});

// 8. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contacts', contactRoutes);

// 9. ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

// 10. START SERVER
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 AningKabalen API running on port ${PORT}`);
    console.log(`📋 Allowed Origins: ${allowedOrigins.join(', ')}\n`);
  });
});

module.exports = app;