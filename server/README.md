# TaskFlow Server

Express + Prisma + Passport, structured MVC-style.

```
src/
├── config/         passport.js (Google strategy + session serialize), database.js (Prisma singleton)
├── controllers/    request/response logic — no raw SQL, no route definitions
├── middleware/      authMiddleware (requireAuth), validators (express-validator), errorHandler
├── routes/          only wires "verb + path -> controller"
├── utils/           ApiError, apiResponse (success/failure envelope), asyncHandler
├── app.js           middleware pipeline + route mounting
└── server.js        boots the HTTP server
```

## Why each piece exists

- **`asyncHandler`** — Express doesn't catch rejected promises from async route
  handlers by default. Wrapping every controller means one `throw new ApiError(...)`
  anywhere reliably lands in `errorHandler.js`, instead of needing a try/catch in
  every single controller function.
- **`ApiError`** — carries an HTTP status code with the error itself, so
  `errorHandler.js` doesn't need to guess "was this a 404 or a 500?" from a message
  string.
- **`validators.js`** — request shape is checked *before* it reaches a controller.
  Controllers can assume `req.body.title` exists and is a non-empty string.
- **Session in SQLite, not memory** — the default in-memory session store loses every
  logged-in user on a server restart (and leaks memory over time). A DB-backed store
  survives restarts and is what you'd actually deploy.

## Commands

```bash
npm run dev              # nodemon, restarts on file change
npm run prisma:studio    # GUI for the SQLite database
npm run prisma:migrate   # create/apply a new migration after editing schema.prisma
```

## Testing endpoints manually

Since auth is cookie-based, use a REST client that persists cookies across requests
(Postman does this automatically inside one Collection). Rough order:

1. `GET /auth/google` in a browser (not Postman — needs the real Google login UI).
2. Once redirected to the dashboard, your browser holds the session cookie. Copy it
   into Postman's cookie jar for `localhost:5000`, or just test authenticated routes
   via the browser's dev tools / the actual frontend.
3. `GET /tasks`, `POST /tasks`, etc. will now return real data instead of `401`.
