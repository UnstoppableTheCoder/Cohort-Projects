import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const isLoggedIn = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    if (!decoded) {
      throw new ApiError(401, "Invalid Token");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    req.user = user;

    return next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new ApiError(401, "Invalid or expired token"));
    }

    return next(error);
  }
});

export { isLoggedIn };
