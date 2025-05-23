import express from "express";
import {
  createNewProject,
  deleteProject,
  getAllProjects,
  getOneProject,
  updateProject,
} from "../controllers/projectController.js";
import IsExisted from "../middlewares/isExisted.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getOneProject);
router.post("/create", IsExisted, createNewProject);
router.put("/update/:id", IsExisted, updateProject);
router.delete("/delete/:id", IsExisted, deleteProject);

export default router;
