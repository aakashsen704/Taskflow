// Routes only wire an HTTP verb + path to a handler. No business logic here —
// that's the whole point of separating routes from controllers.

const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");

const router = express.Router();

// Step 1: browser hits this, gets redirected to Google's consent screen.
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google redirects back here with a code; passport exchanges it for
// tokens behind the scenes before authController.googleCallback ever runs.
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
    session: true,
  }),
  authController.googleCallback
);

router.get("/google/failure", authController.googleFailure);

router.get("/me", authController.getCurrentUser);

router.post("/logout", authController.logout);

module.exports = router;
