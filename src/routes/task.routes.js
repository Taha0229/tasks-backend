import { Router } from "express";
import { getAllTasks, createTask } from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// secured routes
router.route("/task").post(verifyJWT, createTask);
router.route("/tasks").get(verifyJWT, getAllTasks);
router.route("/task/:taskId").get();
router.route("/task/:taskId").patch();
router.route("/task/:taskId").put();

export default router;
