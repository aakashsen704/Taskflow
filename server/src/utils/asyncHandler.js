// Wraps an async controller so any thrown error (or rejected promise) is passed
// to next(err) automatically, instead of every controller needing its own
// try/catch. Without this, a thrown error inside an async function would crash
// the process instead of reaching errorHandler.js.

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
