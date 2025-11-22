import express from "express";
import {
  getAllProjects,
  getOneProject,
  createNewProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import authCheck from "../middlewares/authCheck.js";
import { upload } from "../middlewares/Uploader.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getOneProject);

router.post("/", authCheck, upload.array("images", 10), createNewProject);
router.put("/:id", authCheck, upload.array("images", 10), updateProject);
router.delete("/:id", authCheck, deleteProject);

export default router;
