import { connectDB } from "@repo/db";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.route";
import { config } from "./config";
const app = express();

app.use(cors({
    credentials: true,
    origin: config.CLIENT_URL
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1', indexRouter);


import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Adjust based on your user object
}

app.listen(config.PORT, async () => {
    try {
        await connectDB();
        console.log('Server is running on port 3000');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
});



