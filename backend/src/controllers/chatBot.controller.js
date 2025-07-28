import { getChatbotReply } from "../utils/geminiClient.js";

export const handleChatbotPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const reply = await getChatbotReply(prompt);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
