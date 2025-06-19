import { GoogleGenAI } from "@google/genai";

// Get the API key from environment variables
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables.");
}

// Initialize the GoogleGenAI instance
const genAI = new GoogleGenAI({apiKey});

export default genAI;
