import {genAI} from '@repo/config'
import { systemPrompt} from './systemPrompt'
export const config = {
    PORT: Number(process.env.PORT || 9091),
}

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
