// Last stop for every error in the app (thrown in a controller, passed via
// asyncHandler, or from a bug elsewhere). Centralizing this means controllers
// never format error JSON themselves — they just `throw new ApiError(...)`.

const { failure } = require("../utils/apiResponse");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  return failure(res, {
    message,
    statusCode,
    error: process.env.NODE_ENV === "development" ? { stack: err.stack } : {},
  });
}

function notFound(req, res) {
  return failure(res, {
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    statusCode: 404,
  });
}

module.exports = { errorHandler, notFound };
