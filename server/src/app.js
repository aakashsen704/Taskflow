// Assembles the Express app: middleware pipeline, session/auth setup, routes,
// and error handling — in the order each of those actually needs to run.

require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const passport = require("./config/passport");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// Trust the first proxy hop (needed if this is ever deployed behind
// Render/Railway/Nginx) so secure cookies work correctly.
app.set("trust proxy", 1);

// CORS must allow credentials, or the browser will silently drop the session
// cookie on every cross-origin (localhost:5173 -> localhost:5000) request.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Sessions are stored server-side in SQLite (not memory), so logins survive a
// server restart and scale past a single process later if needed.
app.use(
  session({
    store: new SQLiteStore({ db: "sessions.db", dir: path.join(__dirname, "..", "prisma") }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // JS on the page can never read this cookie
      secure: process.env.NODE_ENV === "production", // HTTPS-only in prod
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
