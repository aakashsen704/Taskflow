// Keeps every controller returning the exact same JSON shape, so the frontend
// never has to guess whether "data" or "results" or "task" holds the payload.

function success(res, { message = "Success", data = {}, statusCode = 200 } = {}) {
  return res.status(statusCode).json({ success: true, message, data });
}

function failure(res, { message = "Something went wrong", error = {}, statusCode = 500 } = {}) {
  return res.status(statusCode).json({ success: false, message, error });
}

module.exports = { success, failure };
