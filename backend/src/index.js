import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDb } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// --- Middleware --- //
app.use(express.json());
app.use(cookieParser());

// Log every request (useful for Render logs)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS for dev and deployed frontend
app.use(cors({
  origin: ["http://localhost:5173", "https://soniket.onrender.com"],
  credentials: true
}));

// --- API Routes --- //
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// --- Serve Frontend in Production --- //
if (process.env.NODE_ENV === "production") {
  // Adjust the path if your build folder is different
  const frontendPath = path.join(__dirname, "public");
  app.use(express.static(frontendPath));

  // SPA fallback route
  app.get("/:path(*)", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// --- Global Error Handler --- //
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

// --- Start Server & Connect DB --- //
server.listen(PORT, async () => {
  console.log(`Server running on PORT: ${PORT}`);
  try {
    await connectDb();
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
});
