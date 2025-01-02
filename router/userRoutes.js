import express from "express";
import { register } from "../controllers/userController.js";
import { login } from "../utils/jwtToken.js";

const router = express.Router();
router.post("/user/register", register);
router.post("/user/login", login);

export default router;
