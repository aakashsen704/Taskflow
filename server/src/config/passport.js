// Passport.js does exactly two jobs for us:
//   1. Drives the OAuth 2.0 "dance" with Google (redirect, callback, token exchange).
//   2. Decides what goes into the session (serializeUser) and how to load it back
//      on every subsequent request (deserializeUser).
//
// It never touches our database directly — that's delegated to authController,
// keeping "how OAuth works" separate from "what we do with the user".

const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const prisma = require("./database");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // `profile` is the decoded, already-verified OpenID Connect payload —
        // Passport verified Google's signature for us before we ever see this.
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const profilePicture = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no public email"), null);
        }

        // Find-or-create: first login creates the row, every login after just
        // reads it. Keyed on googleId, not email, because googleId is immutable.
        const user = await prisma.user.upsert({
          where: { googleId },
          update: { name, profilePicture },
          create: { googleId, name, email, profilePicture },
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Only the user's primary key goes into the session cookie's server-side store —
// never the whole profile. Keeps the session payload tiny.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// On every authenticated request, Passport calls this to turn the stored id back
// into a full user object, attached to req.user by the time it reaches a route.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
