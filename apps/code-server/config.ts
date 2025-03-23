// import {genAI} from '@repo/config'
import { systemPrompt} from './systemPrompt'
import dotenv from 'dotenv'

dotenv.config();
export const config = {
    PORT: Number(process.env.PORT || 9091),
    GEMINI_API_KEY: String(process.env.GEMINI_API_KEY)
}
import { GoogleGenerativeAI } from "@google/generative-ai";

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
