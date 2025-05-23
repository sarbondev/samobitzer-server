import express from "express";
import {
  getAllServices,
  getOneService,
  createNewService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import IsExisted from "../middlewares/isExisted.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/:id", getOneService);
router.post("/create", IsExisted, createNewService);
router.put("/update/:id", IsExisted, updateService);
router.delete("/delete/:id", IsExisted, deleteService);

export default router;
