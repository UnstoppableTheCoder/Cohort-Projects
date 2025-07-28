class ApiResponse {
  constructor(statusCode, message = null, data = null, success = null) {
    // Validate statusCode
    if (typeof statusCode !== "number" || statusCode >= 400) {
      throw new Error("Invalid statusCode for ApiResponse");
    }

    this.statusCode = statusCode;
    this.data = data;
    this.message = message ?? (statusCode < 400 ? "Success" : "Error");
    this.success = success ?? statusCode < 400;
  }

  // Customize JSON serialization for this class.
  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    };
  }
}

export default ApiResponse;
