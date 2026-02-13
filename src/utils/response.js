// Utility functions for standardized API responses

export const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = { message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const response = { message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};
