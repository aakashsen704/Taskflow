# TaskFlow Client

React + Vite + Tailwind CSS.

```
src/
├── components/    reusable pieces — Navbar, Sidebar, TaskCard, TaskForm, SearchBar,
│                  Modal, ProtectedRoute, Layout
├── pages/         one folder per route — Login, Dashboard, TaskDetails, Profile, NotFound
├── context/        AuthContext — holds the logged-in user for the whole app
├── hooks/          useAuth — typed access to AuthContext
├── services/       api.js (Axios instance), authService.js, taskService.js
├── App.jsx         route table
└── main.jsx        mounts <App /> inside <BrowserRouter> + <AuthProvider>
```

## Design system

Not a default Tailwind look — a small token set lives in `tailwind.config.js`:
warm paper background, ink text, a single teal accent, and priority colors (high/medium/low)
used consistently across badges and card borders. Typography pairs **Fraunces** (display,
headings) with **Inter** (body/UI) and **JetBrains Mono** (dates, task IDs) — the mono dates
and the "punch hole" on each `TaskCard` are a deliberate nod to a library card-catalog, since
a task list is really just a personal catalog of things to do.

## Why a `services/` layer instead of calling Axios in components

Every component that needs data calls a function like `taskService.getTasks()` instead of
building its own Axios request. If the API's response shape ever changes, there's exactly
one place to update it — and components stay focused on rendering, not on
`data.data.tasks` unwrapping logic.

## Auth flow on the frontend

`AuthContext` calls `GET /auth/me` once on mount to check for an existing session cookie.
`ProtectedRoute` reads that context: shows a spinner while checking, redirects to `/login`
if there's no user, otherwise renders the page. Logging in doesn't happen "in React" at
all — clicking "Continue with Google" is a plain `<a href="http://localhost:5000/auth/google">`,
a full page navigation, because the OAuth redirect dance has to happen outside the SPA.

## Commands

```bash
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```
