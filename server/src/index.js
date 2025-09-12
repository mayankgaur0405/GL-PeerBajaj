import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import trendingRoutes from "./routes/trending.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error.js";
import { setupSocketHandlers } from "./lib/socket.js";

dotenv.config();

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_ORIGIN || "http://localhost:5173",
      "https://gl-peer-bajaj.vercel.app",
      "https://gl-peer-bajaj.vercel.app/",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    credentials: true
  }
});

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.CLIENT_ORIGIN || "http://localhost:5173",
        "https://gl-peer-bajaj.vercel.app",
        "https://gl-peer-bajaj.vercel.app/",
        "http://localhost:5173",
        "http://localhost:3000"
      ];
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" })); // Increased for image uploads
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.send("connected to server");
});
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/trending", trendingRoutes);
app.use("/api/upload", uploadRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    // Setup socket handlers
    setupSocketHandlers(io);
    
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      console.log(`Socket.IO server ready`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
