import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getChatBotReply = async (userInput) => {
    const model = genAI.getGenerativeModel({model : "gemini-2.5-flash"});

    const result = await model.generateContent(userInput);
    const response = await result.response;
    return response.text();
};