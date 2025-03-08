import dotenv from "dotenv";
import { genAI } from "@repo/config";
dotenv.config();
export const config = {
    PORT: Number(process.env.PORT || 9090),
    FIREBASE_PROJECT_ID:String(process.env.FIREBASE_PROJECT_ID),
    JWT_SECRET: String(process.env.JWT_SECRET),
    CLIENT_URL: String(process.env.CLIENT_URL),
}



export const templateModel = genAI.getGenerativeModel({
    model:"gemini-2.0-flash",
    systemInstruction:"Given a prompt, give me the template required to build a project specific to the prompt.\nThe template should be a JSON object with the following properties:\n- type: \"web\" | \"app\",\n- description: string,\nThe description should be a very short description of the project."
})
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

export const AITemplateSession = templateModel.startChat({
    generationConfig
})