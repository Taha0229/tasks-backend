import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";
import jwt from "jsonwebtoken";

const getAllTasks = asyncHandler(async (req, res) => {
  const user = req.user;
  const allTasks = await Task.find({ createdBy: user._id });

  if (!allTasks.length > 0) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, [], "No tasks found, please create a new task")
      );
  }

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

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const user = req.user;

  const task = await Task.findOne({ _id: taskId, createdBy: user._id });

  if (!task) {
    throw new ApiError(404, `Task with ID ${taskId} not found`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, task, `Task with ID ${taskId} fetched successfully`)
    );
});

const updateTaskPartial = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const user = req.user;

  const { title, description, status } = req.body;

  if (!title && !description && !status) {
    throw new ApiError(
      400,
      "At least one of 'title', 'description', or 'status' must be provided for an update"
    );
  }

  const updatedTask = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!updatedTask) {
    throw new ApiError(
      404,
      "Task not found or you are not authorized to update it"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTask,
        `Task with ID ${taskId} updated successfully`
      )
    );
});

const updateTaskFull = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const user = req.user;
  const { title, description, status } = req.body;

  if (!title || !description || !status) {
    throw new ApiError(
      400,
      "All fields (title, description, status) are required for a full update"
    );
  }

  const updatedTask = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: user._id },
    { title, description, status },
    { new: true, runValidators: true }
  );

  if (!updatedTask) {
    throw new ApiError(
      404,
      "Task not found or you are not authorized to update it"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTask,
        `Task with ID ${taskId} fully updated successfully`
      )
    );
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const user = req.user;

  const deletedTask = await Task.findOneAndDelete({
    _id: taskId,
    createdBy: user._id,
  });

  if (!deletedTask) {
    throw new ApiError(404, "Task not found to be deleted");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedTask,
        `Task with ID ${taskId} deleted successfully`
      )
    );
});

export {
  getAllTasks,
  createTask,
  getTaskById,
  updateTaskPartial,
  updateTaskFull,
  deleteTask,
};
