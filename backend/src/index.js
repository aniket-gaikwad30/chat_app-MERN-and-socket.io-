import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { app, server } from "./lib/socket.js";
import { connectDb } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

/* -------------------- MIDDLEWARE -------------------- */

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? true
        : "http://localhost:5173",
    credentials: true,
  })
);

/* -------------------- API ROUTES -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

/* -------------------- FRONTEND (PRODUCTION) -------------------- */

if (process.env.NODE_ENV === "production") {
  // Serve static React files
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // SPA fallback (Express 5 safe)
  app.use((req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/dist/index.html")
    );
  });
}

/* -------------------- SERVER -------------------- */

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  connectDb();
});
