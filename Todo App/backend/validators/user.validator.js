import Joi from "joi";

// 🔁 Reusable common email validator
const email = Joi.string()
  .email({ tlds: { allow: false } }) // disable TLD check to support emails like "test@localhost"
  .lowercase()
  .trim()
  .required()
  .messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  });

// 🔁 Reusable password validator
const password = Joi.string().min(6).required().messages({
  "string.min": "Password must be at least 6 characters",
  "string.empty": "Password is required",
});

const confirmPassword = Joi.string()
  .valid(Joi.ref("password"))
  .required()
  .messages({
    "any.only": "Password do not match",
    "string.empty": "Confirm password is required",
    "any.required": "Confirm password is required",
  });

const signupSchema = Joi.object({
  email,
  password,
  confirmPassword,
});

const loginSchema = Joi.object({
  email,
  password,
});

export { signupSchema, loginSchema };
