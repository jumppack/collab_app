import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// 404 Route handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Express 5 Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error encountered:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Format error response
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      // If validation error from Zod or other details are attached, expose them
      details: err.details || null,
    },
  });
});

export default app;
