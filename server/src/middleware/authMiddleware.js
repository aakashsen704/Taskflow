// Gatekeeper for every protected route. `req.isAuthenticated()` is added by
// Passport's session middleware — it's true only if a valid session cookie
// deserialized back into a real user (see config/passport.js).

const { failure } = require("../utils/apiResponse");

function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return failure(res, {
    message: "You must be logged in to do that",
    statusCode: 401,
  });
}

module.exports = requireAuth;
