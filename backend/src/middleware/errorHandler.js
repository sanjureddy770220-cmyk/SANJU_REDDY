// backend/src/middleware/errorHandler.js
import { ZodError } from 'zod';
import multer from 'multer';

export function errorHandler(err, req, res, next) {
  console.error('⚠️ Express Error Handler caught:', err);

  // Multer errors (e.g. file size exceeded)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File Too Large',
        message: 'Image size exceeds the 10MB limit. Please upload an image under 10MB.'
      });
    }
    return res.status(400).json({
      error: 'Upload Error',
      message: err.message
    });
  }

  // Zod Validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input parameters',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Standard or custom errors
  const status = err.status || err.statusCode || 500;
  return res.status(status).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred. Please try again later.'
  });
}

