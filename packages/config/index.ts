import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {config} from './config'

export const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);