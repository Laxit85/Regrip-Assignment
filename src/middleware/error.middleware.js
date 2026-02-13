import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.userId || 'anonymous'
  });

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Resource already exists';
  }

  const isDevelopment = process.env.NODE_ENV !== 'production';

  res.status(statusCode).json({
    message,
    ...(isDevelopment && { stack: err.stack })
  });
};

export default errorHandler;
