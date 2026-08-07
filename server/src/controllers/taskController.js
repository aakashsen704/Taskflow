// Every query here is scoped with `userId: req.user.id` — that single line is
// what guarantees one user can never see or touch another user's tasks. It's
// enforced at the data-access layer, not just hidden in the UI.

const prisma = require("../config/database");
const ApiError = require("../utils/ApiError");
const { success } = require("../utils/apiResponse");

// GET /tasks?search=&status=&priority=&sortBy=&order=
async function getTasks(req, res) {
  const { search, status, priority, sortBy = "createdAt", order = "desc" } = req.query;

  const where = {
    userId: req.user.id,
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {}),
  };

  const allowedSortFields = ["createdAt", "updatedAt", "dueDate", "priority", "title"];
  const orderBy = {
    [allowedSortFields.includes(sortBy) ? sortBy : "createdAt"]: order === "asc" ? "asc" : "desc",
  };

  const tasks = await prisma.task.findMany({ where, orderBy });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
  };

  return success(res, { message: "Tasks fetched", data: { tasks, stats } });
}

// GET /tasks/:id
async function getTaskById(req, res) {
  const task = await prisma.task.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
  });
  if (!task) throw new ApiError(404, "Task not found");
  return success(res, { message: "Task fetched", data: { task } });
}

// POST /tasks
async function createTask(req, res) {
  const { title, description, priority, status, dueDate } = req.body;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority: priority || "MEDIUM",
      status: status || "PENDING",
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: req.user.id,
    },
  });

  return success(res, { message: "Task created", data: { task }, statusCode: 201 });
}

// PUT /tasks/:id
async function updateTask(req, res) {
  const existing = await prisma.task.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
  });
  if (!existing) throw new ApiError(404, "Task not found");

  const { title, description, priority, status, dueDate } = req.body;

  const task = await prisma.task.update({
    where: { id: existing.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(priority !== undefined ? { priority } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
    },
  });

  return success(res, { message: "Task updated", data: { task } });
}

// PATCH /tasks/:id/status — quick toggle used by the "mark complete/pending" UI
async function updateTaskStatus(req, res) {
  const existing = await prisma.task.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
  });
  if (!existing) throw new ApiError(404, "Task not found");

  const task = await prisma.task.update({
    where: { id: existing.id },
    data: { status: req.body.status },
  });

  return success(res, { message: "Task status updated", data: { task } });
}

// DELETE /tasks/:id
async function deleteTask(req, res) {
  const existing = await prisma.task.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
  });
  if (!existing) throw new ApiError(404, "Task not found");

  await prisma.task.delete({ where: { id: existing.id } });

  return success(res, { message: "Task deleted", data: { id: existing.id } });
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
