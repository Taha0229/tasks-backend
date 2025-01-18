import { Router } from "express";
import {
  getAllTasks,
  createTask,
  getTaskById,
  updateTaskFull,
  updateTaskPartial,
  deleteTask,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// securing all the routes
router.use(verifyJWT);

// Task routes
router.route("/tasks").get(getAllTasks);
router.route("/task").post(createTask);

router
  .route("/task/:taskId")
  .get(getTaskById) // Get a specific task
  .patch(updateTaskPartial) // Partially update a task
  .put(updateTaskFull) // Fully update a task
  .delete(deleteTask); // Delete a task

export default router;
