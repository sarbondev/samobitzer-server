import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import serviceRoutes from "./routes/serviceRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (_, res) => res.send("API is running..."));
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admins", adminRoutes);

app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));
