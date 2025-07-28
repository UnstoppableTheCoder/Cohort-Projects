class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    data = null,
    success = null,
    stack = ""
  ) {
    // Validate statusCode
    if (
      typeof statusCode !== "number" ||
      statusCode < 400 ||
      statusCode > 599
    ) {
      throw new Error("Invalid statusCode for ApiError");
    }

    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.success = success === null ? false : success;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else if (process.env.NODE_ENV !== "production") {
      // this: refers to the current error object being created.
      // this.constructor: tells captureStackTrace to exclude the constructor from the stack trace.
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Customize JSON serialization for this class.
  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
      data: this.data,
    };
  }
}

export default ApiError;
