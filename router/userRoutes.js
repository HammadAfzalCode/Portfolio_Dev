import express from "express";
import {
  logout,
  register,
  login,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/logout", isAuthenticated, logout);
router.get("/user", isAuthenticated, getUser);
router.put("/user", isAuthenticated, updateUser);

export default router;
