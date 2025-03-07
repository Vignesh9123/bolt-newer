import dotenv from "dotenv";

dotenv.config();
export const config = {
    PORT: Number(process.env.PORT || 9090),
    FIREBASE_PROJECT_ID:String(process.env.FIREBASE_PROJECT_ID),
    JWT_SECRET: String(process.env.JWT_SECRET),
    CLIENT_URL: String(process.env.CLIENT_URL),
}