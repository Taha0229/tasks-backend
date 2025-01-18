import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";
import jwt from "jsonwebtoken";

const getAllTasks = asyncHandler(async (req, res) => {
  const user = req.user;
  const allTasks = await Task.find({ createdBy: user._id });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allTasks,
        `Tasks fetched successfully, user: ${user.username}`
      )
    );
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const user = req.user;

  const createdTask = await Task.create({
    title,
    description,
    status,
    createdBy: user,
  });

  if (!createdTask) {
    throw new ApiError(500, "Something went wrong while creating a new task");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdTask,
        `Task created for the user: ${user.username}`
      )
    );
});

export { getAllTasks, createTask };
