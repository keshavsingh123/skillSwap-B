import { ApiError } from "../utils/ApiError.js";

export function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  const response = {
    success: false,
    message: statusCode === 500 ? "Internal server error" : error.message,
  };

  if (error.details) {
    response.details = error.details;
  }

  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
}
