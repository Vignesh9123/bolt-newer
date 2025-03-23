import mongoose from "mongoose";
import { config } from "../config";

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
      await mongoose.connect(config.MONGO_URI);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  };
  