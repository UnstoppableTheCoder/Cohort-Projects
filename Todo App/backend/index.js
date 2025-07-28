import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import Routes
import healthCheckRouter from "./routes/healthCheck.route.js";
import userRouter from "./routes/user.route.js";
import todoRouter from "./routes/todo.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // Required if using cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200, // Fixes legacy browser issues
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/health-check", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/todos", todoRouter);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      if (process.env.NODE_ENV === "development") {
        console.log(`Server is running on http://localhost:${PORT}`);
      } else {
        console.log(
          "Server is running on" +
            "https://backend-for-todo-app-luna.onrender.com"
        );
      }
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });
