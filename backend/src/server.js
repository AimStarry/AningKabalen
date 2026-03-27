require('dotenv/config');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

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

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:4200',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (!isDev) app.use(morgan('combined'));
else app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 2000 : 300,
  message: { success: false, message: 'Too many requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 500 : 30,
  message: { success: false, message: 'Too many auth attempts, please wait.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);
app.use('/api/auth', authLimiter);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'AningKabalen API is running 🌾', timestamp: new Date().toISOString() });
});

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

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  AningKabalen API running on http://localhost:${PORT}`);
    console.log(`📋  Health: http://localhost:${PORT}/api/health\n`);
  });
});

module.exports = app;
