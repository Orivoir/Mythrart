import OpenAI from "openai"
import { loadEnv } from "./env.js"

loadEnv()

export const openai = new OpenAI({
  apiKey: process.env.AI_GPT_API_KEY,
})