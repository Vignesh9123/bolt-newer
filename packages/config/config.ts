import dotenv from "dotenv";
import path from "path";
dotenv.config(
    {
        path: path.resolve(__dirname,'..', '.env')

    }
);

export const config = {
    JWT_SECRET: String(process.env.JWT_SECRET),
    GEMINI_API_KEY: String(process.env.GEMINI_API_KEY),
}