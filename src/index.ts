import express, { Request, Response, NextFunction, Router } from "express";
import { messaging } from "./config/firebase";
import { sendNotification } from "./kibo/EventMap";
import { pushToDB } from "./utils/PushToDB";
import dotenv from "dotenv";
import { initializeScheduler } from "./Jobs";
import logger from "./logger";
// Load environment variables
dotenv.config({ path: "/Users/tanishqsharma/Desktop/Work/Skillnet/Kibo-Commerce/Push-Notifications/.env.uat" });

const app = express();
const PORT = process.env.PORT || 3000;

// Create routers
const apiRouter = Router();
const healthRouter = Router();
const eventRouter = Router();

// Define custom error interface
interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
healthRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Event endpoint
eventRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = req.body;
      

      const data = await sendNotification(event);

      // Combined check for null or undefined data
      if (!data) {
        return res.status(500).json({
          message: "Device Id or token is null or undefined",
        });
      }

      // Process notification only if we have data
      const message = {
        notification: {
          title: data.title,
          body: data.body,
        },
        token: data.token,
      };

      try {
        const response = await messaging.send(
          message
        );
        
          

        // Store in database
         await pushToDB(data);

        return res.status(200).json({
          message: "Event received and processed successfully",
          eventId: response,
          data: data,
        });
      } catch (error) {
        logger.error("Error sending notification:", error);

        // Still try to push to DB with error flag
        await pushToDB(data, "errored");

        // Forward to error handler
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
  }
);
// Set up router hierarchy
apiRouter.use("/health", healthRouter);
apiRouter.use("/event", eventRouter);

// Mount the main router to the app
app.use("/", apiRouter);

// Add backward compatibility routes

// Global error handler middleware
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  logger.error("Error occurred:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message: "Failed to process request",
    error: message,
  });
});

// 404 handler for unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Start the server
app.listen(PORT, () => {
  
  
  logger.info(`API base URL: http://localhost:${PORT}`);
  
  if(process.env.SCHEDULER_RUNNING === "true"){
    logger.info("Initializing scheduler", process.env.SCHEDULER_RUNNING);
    initializeScheduler();
  }
});

// Handle uncaught exceptions and unhandled promise rejections
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  // In a production environment, you might want to gracefully shut down
  // process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Promise Rejection:", reason);
});
