const express = require("express");
const taskController = require("../controllers/taskController");
const requireAuth = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const {
  taskIdParam,
  createTaskRules,
  updateTaskRules,
  updateStatusRules,
} = require("../middleware/validators");

const router = express.Router();

// Every route below requires a logged-in session — applied once here instead
// of repeating `requireAuth` on each line.
router.use(requireAuth);

router.get("/", asyncHandler(taskController.getTasks));
router.get("/:id", taskIdParam, asyncHandler(taskController.getTaskById));
router.post("/", createTaskRules, asyncHandler(taskController.createTask));
router.put("/:id", taskIdParam, updateTaskRules, asyncHandler(taskController.updateTask));
router.patch(
  "/:id/status",
  taskIdParam,
  updateStatusRules,
  asyncHandler(taskController.updateTaskStatus)
);
router.delete("/:id", taskIdParam, asyncHandler(taskController.deleteTask));

module.exports = router;
