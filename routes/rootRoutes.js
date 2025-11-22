import express from "express";

// imported routes
import serviceRoutes from "../routes/serviceRoutes.js";
import projectRoutes from "../routes/projectRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";

const router = express.Router();

router.use("/services", serviceRoutes);
router.use("/projects", projectRoutes);
router.use("/admins", adminRoutes);

export default router;
