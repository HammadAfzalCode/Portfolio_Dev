import express from "express";
import {
  deleteMessage,
  getAllMessages,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();
router.post("/message", sendMessage);
router.get("/message", getAllMessages);
router.delete("/message", deleteMessage);

export default router;
