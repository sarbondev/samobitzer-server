import express from "express";
import {
  getAllServices,
  getOneService,
  createNewService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import authCheck from "../middlewares/authCheck.js";
import { upload } from "../middlewares/Uploader.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/:id", getOneService);

router.post("/", authCheck, upload.single("image"), createNewService);
router.put("/:id", authCheck, upload.single("image"), updateService);
router.delete("/:id", authCheck, deleteService);

export default router;
