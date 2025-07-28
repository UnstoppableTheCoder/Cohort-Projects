import mongoose from "mongoose";
import Todo from "../models/todo.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createTodoSchema,
  updateTodoSchema,
} from "../validators/todo.validator.js";

export const createTodo = asyncHandler(async (req, res) => {
  // Check if req.body is present
  if (!req.body) {
    throw new ApiError(400, "Request body is missing");
  }

  // Validate request body
  const { error, value } = createTodoSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  let { task } = value;
  task = task.trim();

  let newTodo;
  try {
    newTodo = new Todo({
      task,
      isDone: false,
      userId: req.user._id,
    });

    await newTodo.save();
  } catch (error) {
    throw new ApiError(500, "Failed to save todo");
  }

  // Return response after successful save
  return res
    .status(201)
    .json(
      new ApiResponse(201, "Todo saved successfully", { createdTodo: newTodo })
    );
});

export const getTodos = asyncHandler(async (req, res) => {
  let todos;

  try {
    todos = await Todo.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
  } catch (error) {
    throw new ApiError(500, "Failed to fetch todos");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Todos fetched successfully", { todos }));
});

export const updateTodo = asyncHandler(async (req, res) => {
  // Check if req.body exists
  if (!req.body) {
    throw new ApiError(400, "Request body is missing");
  }

  const todoId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(todoId)) {
    throw new ApiError(400, "Invalid Todo ID");
  }

  if (!todoId) {
    throw new ApiError(400, "Todo ID is missing");
  }

  // validate
  const { error, value } = updateTodoSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  // Get data from value
  let { task } = value;
  task = task.trim();

  let updatedTodo;
  try {
    updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, userId: req.user._id },
      { task },
      { new: true }
    );

    if (!updateTodo) {
      throw new ApiError(404, "Todo not found or not authorized to update");
    }
  } catch (error) {
    throw new ApiError(500, "Failed to update Todo");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Todo updated successfully", { updatedTodo }));
});

export const toggleTodoDone = asyncHandler(async (req, res) => {
  const { id: todoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(todoId)) {
    throw new ApiError(400, "Invalid Todo ID");
  }

  if (!todoId) {
    throw new ApiError(400, "Todo ID is required");
  }

  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new ApiError(400, "Invalid Todo ID");
  }

  let doneTodo;
  try {
    doneTodo = await Todo.findOneAndUpdate(
      {
        _id: todoId,
        userId: req.user._id,
      },
      { isDone: !todo.isDone },
      { new: true }
    );

    if (!doneTodo) {
      throw new ApiError(404, "Todo not found or not authorized");
    }
  } catch (error) {
    throw new ApiError(500, "Failed to set todo as done");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Todo marked as done", { doneTodo }));
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const { id: todoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(todoId)) {
    throw new ApiError(400, "Invalid Todo ID");
  }

  if (!todoId) {
    throw new ApiError(400, "Todo ID is required");
  }

  let deletedTodo;
  try {
    deletedTodo = await Todo.findOneAndDelete({
      _id: todoId,
      userId: req.user._id,
    });

    if (!deletedTodo) {
      throw new ApiError(404, "Todo not found or not authorized");
    }
  } catch (error) {
    throw new ApiError(500, "Failed to delete Todo");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Deleted Todo Successfully", { deletedTodo }));
});
