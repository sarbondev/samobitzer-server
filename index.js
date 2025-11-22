import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

// Route Imports
import serviceRoutes from "./routes/serviceRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "uploads");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files safely (images)
app.use("/uploads", express.static(UPLOADS_DIR));

// Route Middleware
app.get("/", (_, res) => res.send("API is running..."));
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admins", adminRoutes);

// Global Error Handler (Catch-all for internal errors)
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// Database & Server Connection
async function startServer() {
  try {
    // Create Uploads folder if it doesn't exist
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🟢 Connected to MongoDB");

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Ishga tushirishda xato:", err);
    process.exit(1);
  }
}

startServer();
