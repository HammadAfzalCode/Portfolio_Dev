import express from "express";
import { logout, register, login } from "../controllers/userController.js";

const router = express.Router();
router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/logout", logout);

export default router;
