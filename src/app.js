import express from "express";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

// Load Swagger document
const swaggerDocument = YAML.load("./swagger.yaml");

// Security & middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// 🔥 Root Route (Professional Health Check)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Regrip Task Management Backend is running 🚀",
    documentation: "/docs"
  });
});

// Swagger documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Global error handler
app.use(errorHandler);

export default app;
