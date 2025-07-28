import express from "express";
import { handleChatbotPrompt } from "../controllers/chatBot.controller.js";

const router = express.Router();

router.post("/chatbot", handleChatbotPrompt);

export default router;
