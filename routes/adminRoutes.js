import express from "express";
import {
  CreateAccount,
  DeleteAccount,
  GetAllAccounts,
  getUser,
  LoginToAccount,
  UpdateAccount,
} from "../controllers/adminController.js";
import authCheck from "../middlewares/authCheck.js";

const router = express.Router();

router.post("/login", LoginToAccount);

router.get("/", authCheck, GetAllAccounts);
router.get("/profile", authCheck, getUser);
router.post("/", authCheck, CreateAccount);
router.put("/:id", authCheck, UpdateAccount);
router.delete("/:id", authCheck, DeleteAccount);

export default router;
