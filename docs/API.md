# TaskFlow API Reference

Base URL: `http://localhost:5000`

All responses use one envelope:

```json
// success
{ "success": true, "message": "...", "data": { } }

// failure
{ "success": false, "message": "...", "error": { } }
```

All `/tasks/*` routes require an active session (send cookies — `withCredentials: true`
on the client, or a cookie jar in Postman). Unauthenticated requests get `401`.

---

## Auth

### `GET /auth/google`
Starts the OAuth flow. Redirects the browser to Google's consent screen. Not an
API call in the AJAX sense — navigate the browser to this URL directly.

### `GET /auth/google/callback`
Google redirects here after consent. Exchanges the code, creates/loads the user,
starts a session, then redirects to `${CLIENT_URL}/dashboard`.

### `GET /auth/me`
Returns the currently logged-in user, or `401` if there's no valid session.

```json
{
  "success": true,
  "message": "Current user fetched",
  "data": {
    "user": { "id": 1, "name": "Ada Lovelace", "email": "ada@example.com", "profilePicture": "https://...", "createdAt": "2026-01-01T00:00:00.000Z" }
  }
}
```

### `POST /auth/logout`
Destroys the session and clears the cookie.

---

## Tasks

Every route below is prefixed `/tasks` and requires auth.

### `GET /tasks`
Query params (all optional):

| Param      | Values                                   |
|------------|-------------------------------------------|
| `search`   | matches title or description               |
| `status`   | `PENDING` \| `COMPLETED`                    |
| `priority` | `HIGH` \| `MEDIUM` \| `LOW`                 |
| `sortBy`   | `createdAt` \| `updatedAt` \| `dueDate` \| `priority` \| `title` |
| `order`    | `asc` \| `desc` (default `desc`)            |

Returns `{ tasks: [...], stats: { total, pending, completed } }`.

### `GET /tasks/:id`
Returns a single task. `404` if it doesn't exist or belongs to another user.

### `POST /tasks`
Body:
```json
{
  "title": "Write report",
  "description": "Optional",
  "priority": "HIGH",
  "status": "PENDING",
  "dueDate": "2026-08-20"
}
```
Only `title` is required. Returns the created task, `201`.

### `PUT /tasks/:id`
Same body shape as create; any subset of fields. Returns the updated task.

### `PATCH /tasks/:id/status`
Body: `{ "status": "COMPLETED" }`. Quick toggle used by the "mark complete" checkbox.

### `DELETE /tasks/:id`
Returns `{ "id": 12 }` on success.

---

## Error codes

| Code | Meaning |
|------|---------|
| 401  | No valid session |
| 404  | Resource not found / not yours |
| 422  | Validation failed (see `error` array for per-field messages) |
| 500  | Unexpected server error |
