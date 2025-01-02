import express from "express";
import {
  deleteMessage,
  getAllMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
router.post("/message", sendMessage);
router.get("/message", getAllMessages);
router.delete("/message/:id", isAuthenticated, deleteMessage);

export default router;
