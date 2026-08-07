// A thrown ApiError carries its own HTTP status code, so errorHandler.js can
// respond correctly without string-matching error messages.

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

module.exports = ApiError;
