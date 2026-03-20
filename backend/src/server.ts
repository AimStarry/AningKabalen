import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { connectDB }  from './database/connection';
import { errorHandler, notFound } from './middleware/errorHandler';

import authRoutes         from './routes/auth';
import userRoutes         from './routes/users';
import categoryRoutes     from './routes/categories';
import listingRoutes      from './routes/listings';
import reservationRoutes  from './routes/reservations';
import transactionRoutes  from './routes/transactions';
import reviewRoutes       from './routes/reviews';
import notificationRoutes from './routes/notifications';
import addressRoutes      from './routes/addresses';
import orderRoutes        from './routes/orders';

const app  = express();
const PORT = process.env.PORT ?? 5000;
const isDev = process.env.NODE_ENV !== 'production';

// ── Security & Parsing ─────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:4200',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (!isDev) app.use(morgan('combined'));
else        app.use(morgan('dev'));

// ── Rate Limiting ──────────────────────────────────────────────
// In development: very generous limits so testing is easy.
// In production: tighten these.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 2000 : 300,
  message: { success: false, message: 'Too many requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 500 : 30,   // was 20 — far too low for development
  message: { success: false, message: 'Too many auth attempts, please wait.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);
app.use('/api/auth', authLimiter);

// ── Static uploads ─────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'AningKabalen API is running 🌾', timestamp: new Date().toISOString() });
});

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/categories',    categoryRoutes);
app.use('/api/listings',      listingRoutes);
app.use('/api/reservations',  reservationRoutes);
app.use('/api/transactions',  transactionRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/addresses',     addressRoutes);
app.use('/api/orders',        orderRoutes);

// ── Error handling ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  AningKabalen API running on http://localhost:${PORT}`);
    console.log(`📋  Health: http://localhost:${PORT}/api/health\n`);
  });
});

export default app;
