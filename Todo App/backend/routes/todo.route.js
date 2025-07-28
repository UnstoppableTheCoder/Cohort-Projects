import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodoDone,
  updateTodo,
} from "../controllers/todo.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(isLoggedIn, getTodos).post(isLoggedIn, createTodo);

router.route("/:id").put(isLoggedIn, updateTodo).delete(isLoggedIn, deleteTodo);

router.route("/set-done/:id").put(isLoggedIn, toggleTodoDone);

export default router;
