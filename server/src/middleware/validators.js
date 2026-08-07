// Input validation lives here, not in controllers — a controller should be
// able to assume req.body is already well-formed by the time it runs.

const { body, validationResult, param } = require("express-validator");
const { failure } = require("../utils/apiResponse");

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return failure(res, {
      message: "Validation failed",
      statusCode: 422,
      error: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

const taskIdParam = [
  param("id").isInt({ min: 1 }).withMessage("Task id must be a positive integer"),
  handleValidation,
];

const createTaskRules = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 200 }),
  body("description").optional({ nullable: true }).isLength({ max: 2000 }),
  body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH"]),
  body("status").optional().isIn(["PENDING", "COMPLETED"]),
  body("dueDate").optional({ nullable: true }).isISO8601().withMessage("dueDate must be a valid date"),
  handleValidation,
];

const updateTaskRules = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty").isLength({ max: 200 }),
  body("description").optional({ nullable: true }).isLength({ max: 2000 }),
  body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH"]),
  body("status").optional().isIn(["PENDING", "COMPLETED"]),
  body("dueDate").optional({ nullable: true }).isISO8601(),
  handleValidation,
];

const updateStatusRules = [
  body("status").isIn(["PENDING", "COMPLETED"]).withMessage("status must be PENDING or COMPLETED"),
  handleValidation,
];

module.exports = {
  taskIdParam,
  createTaskRules,
  updateTaskRules,
  updateStatusRules,
};
