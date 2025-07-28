import Joi from "joi";

const task = Joi.string().trim().required().messages({
  "string.empty": "Task cannot be empty",
});

export const createTodoSchema = Joi.object({ task });

export const updateTodoSchema = Joi.object({ task });
