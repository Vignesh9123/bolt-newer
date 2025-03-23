import { systemPrompt} from './systemPrompt'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
export const config = {
    PORT: Number(process.env.PORT || 9091),
    GEMINI_API_KEY: String(process.env.GEMINI_API_KEY),
    MONGO_URI: String(process.env.MONGO_URI || 'mongodb://localhost:27017/bolt')
}

export const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
export const promptModel = genAI.getGenerativeModel({
    model:"gemini-2.0-flash",
    systemInstruction:systemPrompt,
    generationConfig
})
