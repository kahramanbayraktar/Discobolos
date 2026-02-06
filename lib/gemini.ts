import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  console.warn("Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable.");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");

// Helper to get the model - centralizing this allows easy switching if model names change
export const getGeminiModel = (modelName: string = process.env.LLM_MODEL_NAME || "gemini-2.5-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};
