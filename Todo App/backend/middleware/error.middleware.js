import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let normalizedError = err;

  // Normalize non-ApiError errors into ApiError instances
  if (!(normalizedError instanceof ApiError)) {
    const isMongooseError =
      normalizedError instanceof mongoose.Error.ValidationError ||
      normalizedError instanceof mongoose.Error.CastError;

    const statusCode =
      normalizedError.statusCode || (isMongooseError ? 400 : 500);
    const message =
      typeof normalizedError.message === "string"
        ? normalizedError.message
        : "Something went wrong";

    const errors = Array.isArray(normalizedError?.errors)
      ? normalizedError.errors
      : normalizedError?.errors
      ? [normalizedError.errors]
      : [];

    normalizedError = new ApiError(
      statusCode,
      message,
      errors,
      null,
      false,
      normalizedError.stack || err.stack
    );
  }

  // Log the error using the logger utility
  console.error({
    statusCode: normalizedError.statusCode,
    message: normalizedError.message,
    errors: normalizedError.errors,
    stack: normalizedError.stack,
    path: req.originalUrl,
    method: req.method,
  });

  // Build response object safely
  const response = normalizedError.toJSON();

  if (process.env.NODE_ENV === "development" && normalizedError.stack) {
    response.stack = normalizedError.stack;
  }

  return res.status(response.statusCode || 500).json(response);
};

export { errorHandler };
