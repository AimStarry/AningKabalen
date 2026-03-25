const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode ?? 500;
  let message    = err.message    ?? 'Internal Server Error';

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry — that value already exists.';
  }
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication error.';
  }

  console.error(`[${new Date().toISOString()}] ${statusCode} — ${message}`);
  if (process.env.NODE_ENV !== 'production') console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

const notFound = (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
};

module.exports = { errorHandler, notFound };
