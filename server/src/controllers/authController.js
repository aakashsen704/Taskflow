// Handles the request/response side of auth. The actual OAuth mechanics live
// in config/passport.js — this file only reacts to the outcome (success,
// failure, logout) and talks to the client.

const { success, failure } = require("../utils/apiResponse");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// GET /auth/google — kicks off the redirect to Google.
// (No logic needed here; passport.authenticate("google") in the route handles it.)

// GET /auth/google/callback — Google redirects here after the user approves.
// passport.authenticate("google") middleware runs first and attaches req.user
// on success, or fails the request before this handler runs.
function googleCallback(req, res) {
  // Successful login: req.user is set, session cookie is already issued.
  res.redirect(`${CLIENT_URL}/dashboard`);
}

function googleFailure(req, res) {
  res.redirect(`${CLIENT_URL}/login?error=auth_failed`);
}

// GET /auth/me — lets the frontend ask "who am I / am I logged in?" on load,
// since it has no other way to inspect an HTTP-only cookie.
function getCurrentUser(req, res) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return failure(res, { message: "Not authenticated", statusCode: 401 });
  }
  const { id, name, email, profilePicture, createdAt } = req.user;
  return success(res, {
    message: "Current user fetched",
    data: { user: { id, name, email, profilePicture, createdAt } },
  });
}

// POST /auth/logout — destroys the session server-side and clears the cookie.
function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((sessErr) => {
      if (sessErr) return next(sessErr);
      res.clearCookie("connect.sid");
      return success(res, { message: "Logged out successfully" });
    });
  });
}

module.exports = { googleCallback, googleFailure, getCurrentUser, logout };
