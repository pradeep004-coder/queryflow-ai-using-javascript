import dotenv from "dotenv";
import { Groq } from "groq-sdk/client.js";
dotenv.config();

const groq = new Groq({
    apiKey: process.env.AI_API_KEY
});
async function getGroqChatCompletion(content) {
    console.log("Getting AI response...");
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content
            },
        ],
        model: "llama-3.3-70b-versatile",
    });
}

export const generateAIResponse = async (prompt) => {
    const response = await getGroqChatCompletion(prompt);

    return response.choices[0]?.message?.content || "";
};

