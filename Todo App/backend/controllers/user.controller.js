import removeSensitiveData from "../helpers/sanitize-user.helper.js";
import User from "../models/user.model.js";
import setAuthCookies from "../services/set-cookies.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { loginSchema, signupSchema } from "../validators/user.validator.js";

export const signupUser = asyncHandler(async (req, res) => {
  // Check if req.body is present
  if (!req.body) {
    throw new ApiError(400, "Request body is missing");
  }

  // validate req.body
  const { error, value } = signupSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  // Get data from value
  let { email, password, confirmPassword } = value;

  // Match the passwords
  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  // Check if user already exits
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // create user
  const user = await User.create({
    email,
    password,
  });

  // Get createdUser data
  const createdUser = removeSensitiveData(user.toObject());

  // Generate Token
  const token = user.generateToken();

  // send tokens to cookies
  setAuthCookies(res, token);

  // return response
  return res.status(201).json(
    new ApiResponse(201, "User registered successfully", {
      user: createdUser,
    })
  );
  kwk;
});

export const loginUser = asyncHandler(async (req, res) => {
  // Check if req.body is present
  if (!req.body) {
    throw new ApiError(400, "Request body is missing");
  }

  // validate req.body
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  // Get data from value
  let { email, password } = value;

  // Check if user exits
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(400, "Incorrect email or password");
  }

  // Get loggedInUser info
  const loggedInUser = removeSensitiveData(user.toObject());

  // Generate Token
  const token = user.generateToken();

  // Send tokens to cookies
  setAuthCookies(res, token);

  // return response
  return res.status(200).json(
    new ApiResponse(200, "User logged in successfully", {
      user: loggedInUser,
    })
  );
});

export const logoutUser = asyncHandler(async (req, res) => {
  // Clear the cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // Send JSON response
  return res
    .status(200)
    .json(
      new ApiResponse(200, "User logged out successfully", "User logged out!")
    );
});
